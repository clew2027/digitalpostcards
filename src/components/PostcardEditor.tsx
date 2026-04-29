import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Postcard } from '../types'
import type { Group } from '../types'
import PostcardCanvas from './PostcardCanvas'
import Toolbar from './Toolbar'
import SendModal from './SendModal'
import styles from './PostcardEditor.module.css'

interface Props {
  groups: Group[]
  onSend: (groupId: string, card: Omit<Postcard, 'id' | 'ts' | 'groupId'>) => Promise<Postcard>
  onToast: (msg: string) => void
}

const DEFAULT_CARD: Omit<Postcard, 'id' | 'ts' | 'groupId'> = {
  message: '',
  from: '',
  location: '',
  template: 'minimal',
  stickers: [],
  font: "'DM Sans', system-ui, sans-serif",
  anim: 'none',
}

export default function PostcardEditor({ groups, onSend, onToast }: Props) {
  const navigate = useNavigate()
  const [card, setCard] = useState<Omit<Postcard, 'id' | 'ts' | 'groupId'>>(DEFAULT_CARD)
  const [showSend, setShowSend] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(groups[0]?.id ?? null)

  const update = (updates: Partial<Postcard>) => setCard((c) => ({ ...c, ...updates }))

  const handleConfirmSend = async () => {
    if (!selectedGroup) return
    const sent = await onSend(selectedGroup, card)
    setShowSend(false)
    const groupName = groups.find((g) => g.id === selectedGroup)?.name ?? 'your group'
    onToast(`Postcard sent to "${groupName}"!`)
    navigate(`/preview/${sent.id}/${selectedGroup}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          ← Back
        </button>
        <h1 className={styles.pageTitle}>Create a Postcard</h1>
        <button
          className={styles.sendBtn}
          onClick={() => setShowSend(true)}
          disabled={!card.message.trim()}
          title={!card.message.trim() ? 'Add a message first' : ''}
        >
          Send →
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.canvasWrap}>
          <PostcardCanvas card={card} size="lg" />
          <p className={styles.hint}>Your postcard preview — edits appear live</p>
        </div>
        <div className={styles.toolbarWrap}>
          <Toolbar card={card} onChange={update} />
        </div>
      </div>

      {showSend && (
        <SendModal
          groups={groups}
          selectedGroupId={selectedGroup}
          onSelectGroup={setSelectedGroup}
          onConfirm={handleConfirmSend}
          onClose={() => setShowSend(false)}
        />
      )}
    </div>
  )
}

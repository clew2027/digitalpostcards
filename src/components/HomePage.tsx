import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Group } from '../types'
import { getTemplate } from '../data/constants'
import styles from './HomePage.module.css'

interface Props {
  groups: Group[]
  onCreateGroup: (name: string) => Promise<Group>
  onJoinGroup: (code: string) => Promise<Group | null>
  onToast: (msg: string) => void
}

export default function HomePage({ groups, onCreateGroup, onJoinGroup, onToast }: Props) {
  const navigate = useNavigate()
  const [panel, setPanel] = useState<'none' | 'create' | 'join'>('none')
  const [newName, setNewName] = useState('')
  const [joinCode, setJoinCode] = useState('')

  const handleCreate = async () => {
    if (!newName.trim()) return
    try {
      const g = await onCreateGroup(newName.trim())
      setNewName('')
      setPanel('none')
      onToast(`Group "${g.name}" created! Invite code: ${g.code}`)
    } catch (error) {
      console.error('Failed to create group:', error)
      onToast('Could not create group. Check your Supabase row-level security policies.')
    }
  }

  const handleJoin = async () => {
    if (!joinCode.trim()) return
    try {
      const g = await onJoinGroup(joinCode.trim())
      if (g) {
        onToast(`Joined "${g.name}"!`)
      } else {
        onToast('No group found with that code.')
      }
      setJoinCode('')
      setPanel('none')
    } catch (error) {
      console.error('Failed to join group:', error)
      onToast('Could not join group. Check your Supabase row-level security policies.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Your Postcards</h1>
        <p className={styles.heroSub}>Send handcrafted digital postcards to the people you love.</p>
        <button className={styles.newBtn} onClick={() => navigate('/editor')}>
          + New Postcard
        </button>
      </div>

      <div className={styles.groupsHeader}>
        <h2 className={styles.groupsTitle}>Groups</h2>
        <div className={styles.groupActions}>
          <button
            className={`${styles.actionBtn} ${panel === 'join' ? styles.actionActive : ''}`}
            onClick={() => setPanel(panel === 'join' ? 'none' : 'join')}
          >
            Join
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionPrimary} ${panel === 'create' ? styles.actionActive : ''}`}
            onClick={() => setPanel(panel === 'create' ? 'none' : 'create')}
          >
            + Create
          </button>
        </div>
      </div>

      {panel === 'create' && (
        <div className={styles.panel}>
          <div className={styles.panelTitle}>New group</div>
          <input
            className={styles.panelInput}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Group name (e.g. Summer Trip 2025)"
            autoFocus
          />
          <div className={styles.panelFooter}>
            <button className={styles.panelCancel} onClick={() => setPanel('none')}>Cancel</button>
            <button className={styles.panelConfirm} onClick={handleCreate} disabled={!newName.trim()}>
              Create group
            </button>
          </div>
        </div>
      )}

      {panel === 'join' && (
        <div className={styles.panel}>
          <div className={styles.panelTitle}>Join a group</div>
          <input
            className={styles.panelInput}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Enter invite code (e.g. SUM25)"
            style={{ letterSpacing: '0.12em', fontWeight: 500 }}
            autoFocus
          />
          <div className={styles.panelFooter}>
            <button className={styles.panelCancel} onClick={() => setPanel('none')}>Cancel</button>
            <button className={styles.panelConfirm} onClick={handleJoin} disabled={!joinCode.trim()}>
              Join group
            </button>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📭</div>
          <p>No groups yet.</p>
          <p className={styles.emptyHint}>Create one and invite your friends to start sharing postcards.</p>
        </div>
      ) : (
        <div className={styles.groupGrid}>
          {groups.map((g, i) => (
            <button
              key={g.id}
              className={styles.groupCard}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => navigate(`/group/${g.id}`)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>📬</span>
                <span className={styles.cardCode}>{g.code}</span>
              </div>
              <div className={styles.cardName}>{g.name}</div>
              <div className={styles.cardMeta}>
                {g.members} member{g.members !== 1 ? 's' : ''} · {g.postcards.length} postcard{g.postcards.length !== 1 ? 's' : ''}
              </div>
              {g.postcards.length > 0 && (
                <div className={styles.cardPreviewRow}>
                  {g.postcards.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className={styles.cardPreviewDot}
                      style={{ background: getTemplate(p.template).accent }}
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

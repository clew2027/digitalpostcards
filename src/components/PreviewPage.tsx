import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Group } from '../types'
import PostcardCanvas from './PostcardCanvas'
import styles from './PreviewPage.module.css'

interface Props {
  groups: Group[]
  onToast: (msg: string) => void
}

export default function PreviewPage({ groups, onToast }: Props) {
  const { postcardId, groupId } = useParams<{ postcardId: string; groupId: string }>()
  const navigate = useNavigate()
  const [flipped, setFlipped] = useState(false)

  const group = groups.find((g) => g.id === groupId)
  const postcard = group?.postcards.find((p) => p.id === postcardId)

  if (!postcard) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>✉</div>
        <p>Postcard not found.</p>
        <button className={styles.homeBtn} onClick={() => navigate('/')}>← Home</button>
      </div>
    )
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    onToast('Link copied to clipboard!')
  }

  return (
    <div className={styles.page}>
      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={() => navigate(groupId ? `/group/${groupId}` : '/')}>
          ← Back
        </button>
        <button className={styles.shareBtn} onClick={copyLink}>
          Copy link
        </button>
      </div>

      <div className={styles.center}>
        <div className={styles.envelope}>
          <div className={styles.envFlap} />
          <div className={styles.cardContainer}>
            <PostcardCanvas card={postcard} size="lg" />
          </div>
        </div>

        <div className={styles.metaRow}>
          {postcard.from && (
            <div className={styles.fromBadge}>
              From {postcard.from}
            </div>
          )}
          {postcard.location && (
            <div className={styles.locationBadge}>
              {postcard.location}
            </div>
          )}
          <div className={styles.dateBadge}>
            {new Date(postcard.ts).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className={styles.cta}>
          <button className={styles.ctaBtn} onClick={() => navigate('/editor')}>
            Send your own postcard →
          </button>
        </div>
      </div>
    </div>
  )
}

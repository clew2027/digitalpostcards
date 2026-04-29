import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Group } from '../types'
import PostcardCanvas from './PostcardCanvas'
import styles from './GroupPage.module.css'

interface Props {
  groups: Group[]
  onToast: (msg: string) => void
}

export default function GroupPage({ groups, onToast }: Props) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const group = groups.find((g) => g.id === id)

  if (!group) {
    return (
      <div className={styles.notFound}>
        <p>Group not found.</p>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← Home</button>
      </div>
    )
  }

  const copyCode = () => {
    navigator.clipboard.writeText(group.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onToast('Invite code copied!')
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
        <div className={styles.groupInfo}>
          <h1 className={styles.groupName}>{group.name}</h1>
          <div className={styles.meta}>
            {group.members} member{group.members !== 1 ? 's' : ''}
            <span className={styles.dot}>·</span>
            <button className={styles.codeBtn} onClick={copyCode}>
              {copied ? '✓ Copied' : `Code: ${group.code}`}
            </button>
          </div>
        </div>
        <button className={styles.newBtn} onClick={() => navigate('/editor')}>
          + New Postcard
        </button>
      </div>

      {group.postcards.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✉</div>
          <p>No postcards yet.</p>
          <p className={styles.emptyHint}>Be the first to send one!</p>
          <button className={styles.newBtnEmpty} onClick={() => navigate('/editor')}>
            + Create a Postcard
          </button>
        </div>
      ) : (
        <div className={styles.feed}>
          {group.postcards.map((p, i) => (
            <div
              key={p.id}
              className={`${styles.feedItem} ${expanded === p.id ? styles.feedItemExpanded : ''}`}
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => setExpanded(expanded === p.id ? null : p.id)}
            >
              <div className={styles.cardWrap}>
                <PostcardCanvas card={p} size={expanded === p.id ? 'lg' : 'sm'} />
              </div>
              {expanded === p.id && (
                <div className={styles.expandedMeta}>
                  <span className={styles.fromLabel}>From {p.from || 'Anonymous'}</span>
                  {p.location && <span className={styles.locationLabel}>📍 {p.location}</span>}
                  <span className={styles.dateLabel}>{new Date(p.ts).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <button
                    className={styles.shareBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(`${window.location.origin}/preview/${p.id}/${group.id}`).catch(() => {})
                      onToast('Share link copied!')
                    }}
                  >
                    Copy link
                  </button>
                </div>
              )}
              {expanded !== p.id && (
                <div className={styles.miniMeta}>
                  <span>{p.from || 'Anonymous'}</span>
                  <span>{new Date(p.ts).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

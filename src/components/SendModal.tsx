import React from 'react'
import type { Group } from '../types'
import styles from './SendModal.module.css'

interface Props {
  groups: Group[]
  selectedGroupId: string | null
  onSelectGroup: (id: string) => void
  onConfirm: () => void
  onClose: () => void
}

export default function SendModal({ groups, selectedGroupId, onSelectGroup, onConfirm, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>Send to a group</div>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        {groups.length === 0 ? (
          <div className={styles.empty}>
            <p>You haven't joined any groups yet.</p>
            <p style={{ marginTop: 6, fontSize: 13 }}>Create or join a group from the home screen first.</p>
          </div>
        ) : (
          <div className={styles.groupList}>
            {groups.map((g) => (
              <button
                key={g.id}
                className={`${styles.groupItem} ${selectedGroupId === g.id ? styles.groupActive : ''}`}
                onClick={() => onSelectGroup(g.id)}
              >
                <div className={styles.groupIcon}>📬</div>
                <div>
                  <div className={styles.groupName}>{g.name}</div>
                  <div className={styles.groupMeta}>{g.members} members · {g.postcards.length} postcards</div>
                </div>
                {selectedGroupId === g.id && <div className={styles.check}>✓</div>}
              </button>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
          {groups.length > 0 && (
            <button
              className={styles.btnSend}
              onClick={onConfirm}
              disabled={!selectedGroupId}
            >
              Send →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

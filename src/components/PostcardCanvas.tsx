import React from 'react'
import type { AnimationType, Postcard } from '../types'
import { getTemplate } from '../data/constants'
import styles from './PostcardCanvas.module.css'

interface Props {
  card: Partial<Postcard>
  size?: 'sm' | 'md' | 'lg'
  showBack?: boolean
}

export default function PostcardCanvas({ card, size = 'md', showBack = false }: Props) {
  const tpl = getTemplate(card.template ?? 'minimal')


  const hasImage = !!card.image

  return (
    <div
      className={`${styles.canvas} ${styles[size]}`}
      style={{
        background: hasImage ? undefined : tpl.bg,
        border: `1.5px solid ${tpl.border}`,
        fontFamily: card.font ?? "'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Background image */}
      {hasImage && (
        <>
          <div
            className={styles.imageBg}
            style={{ backgroundImage: `url(${card.image})` }}
          />
          {/* Scrim for text legibility */}
          <div className={styles.imageScrim} />
        </>
      )}

      {/* Lined paper texture — only when no image */}
      {!hasImage && <div className={styles.linesOverlay} />}

      {/* Location line */}
      {card.location && (
        <div
          className={styles.location}
          style={{ color: hasImage ? 'rgba(255,255,255,0.85)' : tpl.accent }}
        >
          {card.location}
        </div>
      )}

      {/* Main message */}
      <div className={styles.messageArea}>
        {card.message ? (
          <p
            className={styles.message}
            style={{ color: hasImage ? 'rgba(255,255,255,0.97)' : tpl.textColor }}
          >
            {card.message}
          </p>
        ) : (
          <p
            className={styles.placeholder}
            style={{ color: hasImage ? 'rgba(255,255,255,0.5)' : tpl.accent }}
          >
            Your message here...
          </p>
        )}
      </div>

      {/* Stickers row */}
      {card.stickers && card.stickers.length > 0 && (
        <div className={styles.stickers}>
          {card.stickers.map((s, i) => (
            <span
              key={i}
              className={styles.sticker}
              style={{ color: hasImage ? 'rgba(255,255,255,0.9)' : tpl.accent }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* From line */}
      {card.from && (
        <div
          className={styles.from}
          style={{ color: hasImage ? 'rgba(255,255,255,0.75)' : tpl.accent }}
        >
          — {card.from}
        </div>
      )}

      {/* Decorative divider line */}
      {showBack && (
        <div className={styles.dividerLine} style={{ borderColor: tpl.border }} />
      )}
    </div>
  )
}

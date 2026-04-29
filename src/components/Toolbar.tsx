import React, { useState, useRef, useCallback } from 'react'
import type { Postcard, AnimationType } from '../types'
import { TEMPLATES, STICKERS, FONTS, ANIMATIONS } from '../data/constants'
import styles from './Toolbar.module.css'

interface Props {
  card: Partial<Postcard>
  onChange: (updates: Partial<Postcard>) => void
}

export default function Toolbar({ card, onChange }: Props) {
  const [section, setSection] = useState<'template' | 'text' | 'style' | 'image'>('text')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleSticker = (s: string) => {
    const current = card.stickers ?? []
    const next = current.includes(s) ? current.filter((x) => x !== s) : [...current, s]
    onChange({ stickers: next })
  }

  const currentTemplate = TEMPLATES.find((t) => t.id === card.template) ?? TEMPLATES[0]

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onChange({ image: result })
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const removeImage = () => onChange({ image: undefined })

  return (
    <div className={styles.toolbar}>
      {/* Section tabs */}
      <div className={styles.tabs}>
        {(['template', 'text', 'style', 'image'] as const).map((s) => (
          <button
            key={s}
            className={`${styles.tab} ${section === s ? styles.tabActive : ''}`}
            onClick={() => setSection(s)}
          >
            {s === 'image' ? 'Image' : s.charAt(0).toUpperCase() + s.slice(1)}
            {s === 'image' && card.image ? <span className={styles.imageDot} /> : null}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        {/* TEMPLATE */}
        {section === 'template' && (
          <div className={styles.section}>
            <div className={styles.label}>Choose template</div>
            <div className={styles.templateGrid}>
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  className={`${styles.templateBtn} ${card.template === t.id ? styles.templateActive : ''}`}
                  style={{
                    background: t.bg,
                    borderColor: card.template === t.id ? t.accent : '#d8d4cc',
                    color: t.accent,
                  }}
                  onClick={() => onChange({ template: t.id })}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TEXT */}
        {section === 'text' && (
          <div className={styles.section}>
            <div className={styles.label}>Message</div>
            <textarea
              className={styles.textarea}
              value={card.message ?? ''}
              onChange={(e) => onChange({ message: e.target.value })}
              placeholder="Write your message..."
              rows={4}
            />

            <div className={styles.label} style={{ marginTop: 14 }}>From</div>
            <input
              className={styles.input}
              value={card.from ?? ''}
              onChange={(e) => onChange({ from: e.target.value })}
              placeholder="Your name"
            />

            <div className={styles.label} style={{ marginTop: 10 }}>Location</div>
            <input
              className={styles.input}
              value={card.location ?? ''}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="e.g. Lisbon, Portugal"
            />
          </div>
        )}

        {/* STYLE */}
        {section === 'style' && (
          <div className={styles.section}>
            <div className={styles.label}>Stickers</div>
            <div className={styles.stickerGrid}>
              {STICKERS.map((s) => (
                <button
                  key={s}
                  className={`${styles.stickerBtn} ${(card.stickers ?? []).includes(s) ? styles.stickerActive : ''}`}
                  style={{
                    borderColor: (card.stickers ?? []).includes(s) ? currentTemplate.accent : '#d8d4cc',
                    background: (card.stickers ?? []).includes(s) ? currentTemplate.bg : 'white',
                    color: currentTemplate.accent,
                  }}
                  onClick={() => toggleSticker(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className={styles.label} style={{ marginTop: 14 }}>Font</div>
            <div className={styles.fontList}>
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  className={`${styles.fontBtn} ${card.font === f.value ? styles.fontActive : ''}`}
                  style={{
                    fontFamily: f.value,
                    borderColor: card.font === f.value ? currentTemplate.accent : '#d8d4cc',
                    background: card.font === f.value ? currentTemplate.bg : 'white',
                    color: card.font === f.value ? currentTemplate.accent : '#444',
                  }}
                  onClick={() => onChange({ font: f.value })}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* IMAGE */}
        {section === 'image' && (
          <div className={styles.section}>
            {card.image ? (
              /* Preview + controls */
              <div className={styles.imagePreviewWrap}>
                <div className={styles.imagePreview}>
                  <img src={card.image} alt="Postcard background" className={styles.previewImg} />
                  <div className={styles.imageOverlayBadge}>Background photo</div>
                </div>
                <div className={styles.imageActions}>
                  <button
                    className={styles.imageReplaceBtn}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Replace photo
                  </button>
                  <button className={styles.imageRemoveBtn} onClick={removeImage}>
                    Remove
                  </button>
                </div>
                <p className={styles.imageHint}>
                  Your message text will appear over the photo.
                </p>
              </div>
            ) : (
              /* Drop zone */
              <div
                className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.dropTitle}>Add a photo</div>
                <div className={styles.dropSub}>
                  Drag & drop or <span className={styles.dropLink}>browse</span>
                </div>
                <div className={styles.dropFormats}>JPG, PNG, WEBP · up to 10 MB</div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { useGroups } from './hooks/useGroups'
import AuthPage from './components/AuthPage'
import HomePage from './components/HomePage'
import PostcardEditor from './components/PostcardEditor'
import GroupPage from './components/GroupPage'
import PreviewPage from './components/PreviewPage'
import Toast from './components/Toast'
import styles from './App.module.css'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Still loading session
  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand)', color: 'var(--muted)', fontStyle: 'italic' }}>
        Loading...
      </div>
    )
  }

  if (!session) return <AuthPage />

  return <Main session={session} />
}

function Main({ session }: { session: Session }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { groups, loading, createGroup, joinGroup, sendPostcard } = useGroups()
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([])

  const addToast = useCallback((msg: string) => {
    const id = Date.now()
    setToasts((t) => [...t, { id, msg }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const isEditor = location.pathname.startsWith('/editor')

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <button className={styles.logo} onClick={() => navigate('/')}>
          <span className={styles.logoIcon}>✉</span>
          <span className={styles.logoText}>postcards</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--text-light)' }}>{session.user.email}</span>
          {!isEditor && (
            <button className={styles.headerNew} onClick={() => navigate('/editor')}>
              + New Postcard
            </button>
          )}
          <button
            onClick={handleSignOut}
            style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'white', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-light)' }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontStyle: 'italic' }}>
            Loading...
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  groups={groups}
                  onCreateGroup={createGroup}
                  onJoinGroup={joinGroup}
                  onToast={addToast}
                />
              }
            />
            <Route
              path="/editor"
              element={
                <PostcardEditor
                  groups={groups}
                  onSend={sendPostcard}
                  onToast={addToast}
                />
              }
            />
            <Route path="/group/:id" element={<GroupPage groups={groups} onToast={addToast} />} />
            <Route path="/preview/:postcardId/:groupId" element={<PreviewPage groups={groups} onToast={addToast} />} />
          </Routes>
        )}
      </main>

      <div className={styles.toasts}>
        {toasts.map((t) => (
          <Toast key={t.id} message={t.msg} onDone={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  )
}

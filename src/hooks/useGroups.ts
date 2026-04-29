import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { AnimationType, Group, Postcard } from '../types'

function rowToPostcard(row: Record<string, unknown>): Postcard {
  return {
    id: row.id as string,
    groupId: row.group_id as string,
    from: (row.from_name as string) ?? '',
    location: (row.location as string) ?? '',
    message: (row.message as string) ?? '',
    template: (row.template as string) ?? 'minimal',
    stickers: (row.stickers as string[]) ?? [],
    font: (row.font as string) ?? "'DM Sans', system-ui, sans-serif",
    anim: (row.anim as AnimationType) ?? 'none',
    image: (row.image as string) ?? undefined,
    ts: new Date(row.created_at as string).getTime(),
  }
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadGroups() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: memberships } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)

      if (!memberships?.length) {
        if (!cancelled) { setGroups([]); setLoading(false) }
        return
      }

      const groupIds = memberships.map((m) => m.group_id as string)

      const { data: groupRows } = await supabase
        .from('groups')
        .select('*')
        .in('id', groupIds)
        .order('created_at', { ascending: false })

      const { data: allMembers } = await supabase
        .from('group_members')
        .select('group_id')
        .in('group_id', groupIds)

      const memberCounts: Record<string, number> = {}
      for (const m of allMembers ?? []) {
        memberCounts[m.group_id] = (memberCounts[m.group_id] ?? 0) + 1
      }

      const { data: postcardRows } = await supabase
        .from('postcards')
        .select('*')
        .in('group_id', groupIds)
        .order('created_at', { ascending: false })

      const postcardsByGroup: Record<string, Postcard[]> = {}
      for (const row of postcardRows ?? []) {
        const gid = row.group_id as string
        if (!postcardsByGroup[gid]) postcardsByGroup[gid] = []
        postcardsByGroup[gid].push(rowToPostcard(row))
      }

      const built: Group[] = (groupRows ?? []).map((g) => ({
        id: g.id as string,
        name: g.name as string,
        code: g.code as string,
        members: memberCounts[g.id as string] ?? 1,
        postcards: postcardsByGroup[g.id as string] ?? [],
        createdAt: new Date(g.created_at as string).getTime(),
      }))

      if (!cancelled) { setGroups(built); setLoading(false) }
    }

    loadGroups()
    return () => { cancelled = true }
  }, [])

  const createGroup = useCallback(async (name: string): Promise<Group> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not logged in')

    const code = name.slice(0, 3).toUpperCase() + Math.floor(10 + Math.random() * 90)

    const { data: groupRow, error } = await supabase
      .from('groups')
      .insert({ name, code })
      .select()
      .single()

    if (error) throw error

    const { error: memberError } = await supabase
      .from('group_members')
      .insert({ group_id: groupRow.id, user_id: user.id })

    if (memberError) throw memberError

    const group: Group = {
      id: groupRow.id,
      name: groupRow.name,
      code: groupRow.code,
      members: 1,
      postcards: [],
      createdAt: new Date(groupRow.created_at).getTime(),
    }

    setGroups((gs) => [group, ...gs])
    return group
  }, [])

  const joinGroup = useCallback(async (code: string): Promise<Group | null> => {
    const { data: groupRow, error } = await supabase
      .from('groups')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (error || !groupRow) return null

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { error: memberError } = await supabase
      .from('group_members')
      .upsert({ group_id: groupRow.id, user_id: user.id })

    if (memberError) throw memberError

    const { data: postcardRows } = await supabase
      .from('postcards')
      .select('*')
      .eq('group_id', groupRow.id)
      .order('created_at', { ascending: false })

    const { data: memberRows } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('group_id', groupRow.id)

    const group: Group = {
      id: groupRow.id,
      name: groupRow.name,
      code: groupRow.code,
      members: memberRows?.length ?? 1,
      postcards: (postcardRows ?? []).map(rowToPostcard),
      createdAt: new Date(groupRow.created_at).getTime(),
    }

    setGroups((gs) => {
      const exists = gs.find((g) => g.id === group.id)
      return exists ? gs.map((g) => (g.id === group.id ? group : g)) : [group, ...gs]
    })

    return group
  }, [])

  const sendPostcard = useCallback(async (
    groupId: string,
    card: Omit<Postcard, 'id' | 'ts' | 'groupId'>
  ): Promise<Postcard> => {
    const { data: row, error } = await supabase
      .from('postcards')
      .insert({
        group_id: groupId,
        from_name: card.from,
        location: card.location,
        message: card.message,
        template: card.template,
        stickers: card.stickers,
        font: card.font,
        anim: card.anim,
        image: card.image ?? null,
      })
      .select()
      .single()

    if (error) throw error

    const postcard = rowToPostcard(row)
    setGroups((gs) =>
      gs.map((g) =>
        g.id === groupId ? { ...g, postcards: [postcard, ...g.postcards] } : g
      )
    )
    return postcard
  }, [])

  return { groups, loading, createGroup, joinGroup, sendPostcard }
}

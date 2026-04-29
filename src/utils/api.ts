const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'

export async function suggestMessage(location?: string): Promise<string> {
  const locationHint = location ? ` The sender is writing from ${location}.` : ''
  const prompt = `Write a short, warm, poetic postcard message — 2 to 3 sentences, maximum 40 words.${locationHint} Make it feel personal, wistful, and genuine. Return only the message text with no quotes or extra text.`

  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 120,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
  return text.trim()
}

export async function suggestLocation(hint: string): Promise<string> {
  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 30,
      messages: [
        {
          role: 'user',
          content: `Complete this location name into a nice "City, Country" format: "${hint}". Return only the formatted location, nothing else.`,
        },
      ],
    }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
  return text.trim()
}

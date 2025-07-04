import { useState } from 'react'

const baseUrl = import.meta.env.VITE_API_BASE_URL || ''

function HappyChatBox() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setMessages(msgs => [...msgs, { from: 'user', text: input }])
    try {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      if (data.aiMessage) {
        setMessages(msgs => [...msgs, { from: 'ai', text: data.aiMessage }])
      } else {
        setError('No response from AI')
      }
    } catch (err) {
      setError('Failed to reach AI')
    }
    setInput('')
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      width: 320,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      padding: 16,
      zIndex: 9999,
      fontFamily: 'Arial',
    }}>
      <div style={{ fontWeight: 'bold', color: '#764ba2', marginBottom: 8 }}>💬 Happy AI Assistant</div>
      <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 8 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.from === 'user' ? 'right' : 'left',
            color: msg.from === 'user' ? '#333' : '#764ba2',
            margin: '4px 0'
          }}>
            <span style={{ fontWeight: msg.from === 'ai' ? 'bold' : 'normal' }}>
              {msg.from === 'ai' ? 'AI: ' : 'You: '}
            </span>
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: '#aaa' }}>AI is thinking...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 4 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Say hi or ask anything!"
          style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: 6 }}
          disabled={loading}
        />
        <button
          type="submit"
          style={{ background: '#764ba2', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer' }}
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default HappyChatBox 
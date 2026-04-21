import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fsakwzzcbnqkmchrvzzq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYWt3enpjYm5xa21jaHJ2enpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDUxOTQsImV4cCI6MjA5MjI4MTE5NH0.zxt49Ow0QExcMozFUWayhCrqczxy-HpSBzbon60dAhA'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AdminToggle() {
  const [isActive, setIsActive] = useState(false)
  const [message, setMessage] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()
      if (!error && data) {
        setIsActive(data.is_sale_active)
        setMessage(data.sale_message || '')
        setImageUrl(data.sale_image_url || '')
      }
    }
    fetchSettings()
  }, [])

  const handleToggle = async () => {
    setLoading(true)
    const newState = !isActive
    const { error } = await supabase
      .from('site_settings')
      .update({ is_sale_active: newState })
      .eq('id', 1)
    
    if (error) {
      setStatus('Error updating')
    } else {
      setIsActive(newState)
      setStatus(`Sale is now ${newState ? 'ACTIVE' : 'INACTIVE'}`)
      setTimeout(() => setStatus(''), 2000)
    }
    setLoading(false)
  }

  const handleMessageChange = async (e) => {
    const newMessage = e.target.value
    setMessage(newMessage)
    const { error } = await supabase
      .from('site_settings')
      .update({ sale_message: newMessage })
      .eq('id', 1)
    if (!error) {
      setStatus('Message updated')
      setTimeout(() => setStatus(''), 1500)
    }
  }

  const handleImageUrlChange = async (e) => {
    const newImageUrl = e.target.value
    setImageUrl(newImageUrl)
    const { error } = await supabase
      .from('site_settings')
      .update({ sale_image_url: newImageUrl })
      .eq('id', 1)
    if (!error) {
      setStatus('Image URL updated')
      setTimeout(() => setStatus(''), 1500)
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Marketing Toggle</h1>
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>Sale Notification</span>
          <button
            onClick={handleToggle}
            disabled={loading}
            style={{
              ...styles.toggle,
              backgroundColor: isActive ? '#000' : '#fff',
              color: isActive ? '#fff' : '#000',
            }}
          >
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </button>
        </div>
        <div style={styles.messageRow}>
          <label style={styles.label}>Message</label>
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            style={styles.input}
            placeholder="Sale message..."
          />
        </div>
        <div style={styles.messageRow}>
          <label style={styles.label}>Image URL (optional)</label>
          <input
            type="text"
            value={imageUrl}
            onChange={handleImageUrlChange}
            style={styles.input}
            placeholder="https://... (Canva link, GIF, etc.)"
          />
          {imageUrl && (
            <div style={{ marginTop: '12px' }}>
              <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '120px', border: '1px solid #ddd' }} />
            </div>
          )}
        </div>
        {status && <p style={styles.status}>{status}</p>}
        <p style={styles.hint}>
          Changes are reflected instantly to all visitors.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '60px auto',
    padding: '0 24px',
    fontFamily: "'Inter', sans-serif",
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '3rem',
    fontWeight: 400,
    letterSpacing: '-0.02em',
    marginBottom: '32px',
    borderBottom: '1px solid #000',
    paddingBottom: '16px',
  },
  card: {
    border: '1px solid #000',
    padding: '32px',
    background: '#fff',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  label: {
    fontSize: '1rem',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#000',
  },
  toggle: {
    border: '1px solid #000',
    padding: '10px 24px',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: '#fff',
    minWidth: '120px',
  },
  messageRow: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #000',
    fontSize: '0.9rem',
    fontFamily: "'Inter', sans-serif",
    marginTop: '8px',
    background: '#fff',
  },
  status: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  hint: {
    fontSize: '0.7rem',
    color: '#888',
    marginTop: '24px',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    borderTop: '1px solid #ddd',
    paddingTop: '20px',
  },
}
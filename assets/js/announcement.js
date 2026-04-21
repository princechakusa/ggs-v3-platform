// announcement.js – Hero‑Style Modal with Large Top Image, Sparkle, and Contact CTA
(async function() {
  const SUPABASE_URL = 'https://fsakwzzcbnqkmchrvzzq.supabase.co'
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzYWt3enpjYm5xa21jaHJ2enpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDUxOTQsImV4cCI6MjA5MjI4MTE5NH0.zxt49Ow0QExcMozFUWayhCrqczxy-HpSBzbon60dAhA'

  const { createClient } = window.supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Inject animations
  const style = document.createElement('style')
  style.textContent = `
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(10deg); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .ggs-modal-sparkle {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #FFD700;
      box-shadow: 0 0 12px #FFD700;
      pointer-events: none;
      z-index: 10;
    }
    .ggs-shimmer-border {
      position: relative;
      overflow: hidden;
    }
    .ggs-shimmer-border::after {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      background: linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.6) 50%, transparent 70%);
      background-size: 200% 200%;
      animation: shimmer 3s infinite;
      border-radius: inherit;
      z-index: -1;
    }
  `
  document.head.appendChild(style)

  function createModal(message, imageUrl) {
    // Remove any existing modal
    const existing = document.getElementById('ggs-sale-overlay')
    if (existing) existing.remove()

    // Overlay
    const overlay = document.createElement('div')
    overlay.id = 'ggs-sale-overlay'
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(6px);
      z-index: 9998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove()
    }

    // Modal container – hero layout
    const modal = document.createElement('div')
    modal.id = 'ggs-sale-modal'
    modal.className = 'ggs-shimmer-border'
    modal.style.cssText = `
      position: relative;
      max-width: 800px;
      width: 100%;
      background: #1a1f24;
      border-radius: 32px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(182,139,64,0.3);
      animation: float 3s ease-in-out infinite;
      border: 2px solid #b68b40;
      z-index: 9999;
      color: white;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
    `

    // Close button
    const closeBtn = document.createElement('button')
    closeBtn.innerHTML = '✕'
    closeBtn.setAttribute('aria-label', 'Close')
    closeBtn.style.cssText = `
      position: absolute;
      top: 16px;
      right: 16px;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      font-size: 1.4rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      z-index: 20;
    `
    closeBtn.onmouseover = () => {
      closeBtn.style.background = '#b68b40'
      closeBtn.style.borderColor = '#b68b40'
    }
    closeBtn.onmouseout = () => {
      closeBtn.style.background = 'rgba(0,0,0,0.5)'
      closeBtn.style.borderColor = 'rgba(255,255,255,0.3)'
    }
    closeBtn.onclick = () => overlay.remove()

    // Hero Image Section (full width at top)
    if (imageUrl) {
      const heroImg = document.createElement('div')
      heroImg.style.cssText = `
        width: 100%;
        max-height: 450px;
        overflow: hidden;
        border-bottom: 2px solid #b68b40;
      `
      const img = document.createElement('img')
      img.src = imageUrl
      img.alt = 'Special Offer'
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      `
      heroImg.appendChild(img)
      modal.appendChild(heroImg)
    }

    // Content section (padding)
    const content = document.createElement('div')
    content.style.cssText = `
      padding: 32px 32px 36px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    `

    // Badge
    const badge = document.createElement('div')
    badge.style.cssText = `
      background: #b68b40;
      color: white;
      padding: 6px 20px;
      border-radius: 60px;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 600;
      border: 1px solid rgba(255,255,255,0.3);
      box-shadow: 0 0 15px rgba(182,139,64,0.5);
    `
    badge.textContent = '⚡ Limited Offer ⚡'
    content.appendChild(badge)

    // Message headline
    const msg = document.createElement('h2')
    msg.textContent = message
    msg.style.cssText = `
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 5vw, 2.8rem);
      font-weight: 400;
      letter-spacing: -0.01em;
      text-align: center;
      color: white;
      line-height: 1.2;
      margin: 0;
    `
    content.appendChild(msg)

    // CTA Button
    const cta = document.createElement('a')
    cta.href = '#contact'
    cta.textContent = 'Claim Offer →'
    cta.style.cssText = `
      display: inline-block;
      background: #b68b40;
      color: white;
      padding: 14px 36px;
      border-radius: 60px;
      text-decoration: none;
      font-weight: 500;
      font-size: 1.1rem;
      transition: all 0.2s;
      border: 1px solid rgba(255,255,255,0.2);
      margin-top: 8px;
      cursor: pointer;
    `
    cta.onmouseover = () => { cta.style.background = '#a07630' }
    cta.onmouseout = () => { cta.style.background = '#b68b40' }
    
    cta.addEventListener('click', () => {
      overlay.remove()
    })
    content.appendChild(cta)

    modal.appendChild(closeBtn)
    modal.appendChild(content)

    // Sparkles
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div')
      sparkle.className = 'ggs-modal-sparkle'
      sparkle.style.left = Math.random() * 100 + '%'
      sparkle.style.top = Math.random() * 100 + '%'
      sparkle.style.animation = `sparkle ${1.5 + Math.random() * 2}s ease-in-out infinite`
      sparkle.style.animationDelay = Math.random() * 2 + 's'
      modal.appendChild(sparkle)
    }

    overlay.appendChild(modal)
    document.body.appendChild(overlay)
  }

  // Fetch initial state
  const { data, error } = await supabase
    .from('site_settings')
    .select('is_sale_active, sale_message, sale_image_url')
    .eq('id', 1)
    .single()

  if (!error && data && data.is_sale_active) {
    createModal(data.sale_message, data.sale_image_url)
  }

  // Real‑time subscription
  supabase
    .channel('site_settings')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'site_settings' },
      (payload) => {
        const existing = document.getElementById('ggs-sale-overlay')
        if (existing) existing.remove()
        if (payload.new.is_sale_active) {
          createModal(payload.new.sale_message, payload.new.sale_image_url)
        }
      }
    )
    .subscribe()
})();
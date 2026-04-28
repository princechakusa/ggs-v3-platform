/* ── PRINCE AI CHATBOT – Self-contained IIFE ── */
interface Product { label: string; price: number; coverage?: number; desc: string; colors: string[] }
const DB: Record<string, Product> = {
  "gamazine classic": { label: "Gamazine Classic", price: 250, coverage: 100, desc: "Textured wall coating", colors: ["White","Cream","Beige","Grey","Stone","Terracotta","Green","Blue"] },
  "glamour coat": { label: "Glamour Coat", price: 350, coverage: 100, desc: "Smooth premium coating", colors: ["White","Ivory","Silver Grey","Charcoal","Navy Blue","Forest Green","Burgundy"] },
  "epoxy flooring": { label: "Epoxy Flooring", price: 180, desc: "High‑strength resin floor", colors: ["Clear","Grey","Light Grey","Tile Red","Green","Blue"] }
};
const biz = { phone: "+27 62 150 3704", email: "deliannyathi@gmail.com", address: "12 Granite Rd, Kya Sands, Randburg", hours: "Mon‑Fri 07‑17 · Sat 08‑13" };
let session = { stage: "idle", product: null as string|null, rooms: null as number|null, name: null as string|null, phone: null as string|null, estimateShown: false };
function extractRooms(t: string) { const m = t.match(/(\d+)/); return m ? parseInt(m[1]) : null }
function extractProduct(t: string) { if(/epoxy|floor/i.test(t)) return "epoxy flooring"; if(/glamour/i.test(t)) return "glamour coat"; if(/gamazine|classic|wall|paint/i.test(t)) return "gamazine classic"; return null }
function isGreeting(m: string) { return /^(hi|hello|hey|good (morning|afternoon|evening))/i.test(m) }
function isHowAreYou(m: string) { return /how are you/i.test(m) }
function isPricing(m: string) { return /price|cost|how much|rate/i.test(m) }
function isConfirm(m: string) { return /^(yes|yeah|sure|ok|yep)$/i.test(m.trim()) }
function isBusiness(m: string) { return /gamazine|glamour|epoxy|floor|wall|coat|paint|price|cost|quote|colour|color|process|location|address|contact|phone|email|hours|inspection|deposit|book|install/i.test(m) }

function getPrinceResponse(userMsg: string): string {
  const msg = userMsg.trim().toLowerCase();
  if (!msg) return "How can I assist you?";
  if (!isBusiness(msg)) return "I'm Prince, your GGS assistant. I answer questions about Gamazine, Glamour, and Epoxy.";
  if (isGreeting(msg)) { session.stage = "collecting"; return "Hello! I'm Prince. I can give you a quick quote or arrange a free inspection. What would you like?"; }
  if (isHowAreYou(msg)) return "I am doing well my worship, thank you! How can I assist you today?";
  if (isPricing(msg)) { session.stage = "collecting"; return `Current prices (materials only):
  • Gamazine Classic – R250/20L
  • Glamour Coat – R350/20L
  • Epoxy Flooring – from R180/m²

Tell me how many rooms and which product.`; }

  const product = extractProduct(msg);
  const rooms = extractRooms(msg);
  if (product) session.product = product;
  if (rooms) session.rooms = rooms;

  if (session.rooms && session.product && session.stage === "collecting" && !session.estimateShown) {
    session.estimateShown = true;
    let reply = "";
    if (session.product === "epoxy flooring") {
      const area = session.rooms * 30;
      const cost = area * DB["epoxy flooring"].price;
      reply = `For ${session.rooms} rooms (Epoxy Flooring):
  • Est. floor area: ~${area} m²
  • Cost: R${cost}

Would you like a free, no‑obligation site inspection?`;
    } else {
      const p = DB[session.product];
      const area = session.rooms * 30;
      const buckets = Math.ceil(area / (p.coverage ?? 100));
      const cost = buckets * p.price;
      reply = `For ${session.rooms} rooms of ${session.product}:
  • Est. wall area: ~${area} m²
  • Buckets needed: ${buckets}
  • Material cost: R${cost}

Would you like a free site inspection for an exact quote?`;
    }
    session.stage = "quoted";
    return reply;
  }

  if (session.stage === "quoted") {
    if (isConfirm(msg)) { session.stage = "booking_name"; return "Great 👍 Let's arrange your free inspection.\n\nWhat is your name?"; }
    return "Would you like me to book a free inspection? Just say **Yes**.";
  }
  if (session.stage === "booking_name") { session.name = userMsg.trim(); session.stage = "booking_phone"; return `Thanks, ${session.name}! What phone number can we reach you on?`; }
  if (session.stage === "booking_phone") { session.phone = userMsg.trim(); session.stage = "done"; return `Perfect ✅ We'll call you at ${session.phone} to arrange your free inspection.\n\nIs there anything else?`; }
  if (session.stage === "done") return "Your booking is submitted. Anything else?";
  if (/what is (gamazine|glamour|epoxy)/i.test(msg)) {
    if (msg.includes("gamazine")) return DB["gamazine classic"].desc;
    if (msg.includes("glamour")) return DB["glamour coat"].desc;
    if (msg.includes("epoxy")) return DB["epoxy flooring"].desc;
  }
  if (/color|colour/i.test(msg)) {
    const prod = extractProduct(msg);
    if (prod === "epoxy flooring") return `Epoxy colours: ${DB["epoxy flooring"].colors.join(", ")}.`;
    if (prod) return `${prod} colours: ${DB[prod].colors.join(", ")}. Custom tint available.`;
    return "Gamazine: White, Cream, Beige, Grey, Stone, Terracotta, Green, Blue.\nGlamour: White, Ivory, Silver Grey, Charcoal, Navy, Forest Green, Burgundy.\nEpoxy: Clear, Grey, Light Grey, Tile Red, Green, Blue.";
  }
  if (/process|how (does|do) (it|you) work|step/i.test(msg)) return "1. Free site inspection.\n2. Fixed quotation within 24h.\n3. Expert installation.\n4. Final inspection & handover.";
  if (/location|where|address/i.test(msg)) return `We're at ${biz.address}. We serve all Gauteng.`;
  if (/contact|phone|call|email/i.test(msg)) return `📞 ${biz.phone}\n📧 ${biz.email}`;
  if (/hours|open|time/i.test(msg)) return `Business hours: ${biz.hours}`;
  return "I can help with pricing, estimates, or booking a free inspection. Just tell me what you need.";
}

// ── DOM Setup ──
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("prince-chat-root");
  if (!root) return;
  root.innerHTML = `
    <button id="prince-chat-bubble" class="pulse"><i class="fas fa-comment-dots"></i></button>
    <div id="prince-chat-window">
      <div class="prince-chat-header">
        <div class="avatar"><i class="fas fa-crown"></i></div>
        <div class="info"><div class="name">Prince – GGS Assistant</div><div class="status">Online · replies instantly</div></div>
        <button id="prince-close-btn"><i class="fas fa-times"></i></button>
      </div>
      <div class="prince-chat-messages" id="prince-messages"></div>
      <div class="prince-quick" id="prince-quick"></div>
      <div class="prince-input-area">
        <input type="text" id="prince-input" placeholder="Ask about products, pricing, or book an inspection…" autocomplete="off" />
        <button class="prince-send-btn" id="prince-send-btn" disabled><i class="fas fa-paper-plane"></i></button>
      </div>
      <div class="prince-footer">Prince AI · Premium Coatings Expert</div>
    </div>
  `;
  const bubble = document.getElementById("prince-chat-bubble")!;
  const win = document.getElementById("prince-chat-window")!;
  const closeBtn = document.getElementById("prince-close-btn")!;
  const msgs = document.getElementById("prince-messages")!;
  const quickWrap = document.getElementById("prince-quick")!;
  const input = document.getElementById("prince-input") as HTMLInputElement;
  const sendBtn = document.getElementById("prince-send-btn")!;

  function addMessage(text: string, sender: string) {
    const div = document.createElement("div"); div.className = "prince-msg " + sender;
    const b = document.createElement("div"); b.className = "prince-bubble";
    b.innerHTML = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
    div.appendChild(b); msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function send(text: string) {
    if (!text.trim()) return;
    addMessage(text, "user"); input.value = ""; sendBtn.disabled = true;
    setTimeout(() => {
      const reply = getPrinceResponse(text);
      addMessage(reply, "bot");
      sendBtn.disabled = false;
    }, 400);
  }
  sendBtn.addEventListener("click", () => send(input.value));
  input.addEventListener("keypress", e => { if (e.key === "Enter") send(input.value); });
  input.addEventListener("input", () => { sendBtn.disabled = !input.value.trim(); });
  bubble.addEventListener("click", () => { win.classList.toggle("open"); if (win.classList.contains("open")) { input.focus(); } });
  closeBtn.addEventListener("click", () => { win.classList.remove("open"); });
  // Auto-open after 4s
  setTimeout(() => { win.classList.add("open"); input.focus(); }, 4000);
});

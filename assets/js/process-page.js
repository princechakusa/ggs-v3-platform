/* SCROLL PROGRESS */
var _prog = document.getElementById('scroll-progress');
window.addEventListener('scroll', function() {
  var s = document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  if (_prog) _prog.style.width = s + '%';
}, { passive: true });

/* HEADER + BACK-TOP + STICKY NAV */
var _hdr = document.getElementById('siteHeader');
var _bt = document.getElementById('back-top');
var _snav = document.getElementById('stickyNav');
window.addEventListener('scroll', function() {
  var y = window.scrollY;
  if (_hdr) _hdr.classList.toggle('scrolled', y > 30);
  if (_bt) _bt.classList.toggle('visible', y > 500);
  if (_snav) _snav.classList.toggle('visible', y > 440);
}, { passive: true });

/* MOBILE NAV */
var _hmbg = document.getElementById('hamburger');
var _mnav = document.getElementById('mobileNav');
if (_hmbg && _mnav) {
  _hmbg.addEventListener('click', function() {
    _hmbg.classList.toggle('open');
    _mnav.classList.toggle('open');
    document.body.style.overflow = _mnav.classList.contains('open') ? 'hidden' : '';
  });
}

/* SCROLL TO SECTION */
function scrollToSec(id) {
  var el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ANIMATED COUNTERS */
function animateCounter(el) {
  var target = parseInt(el.getAttribute('data-target'), 10);
  var suffix = el.getAttribute('data-suffix') || '';
  var t0 = null;
  function tick(ts) {
    if (!t0) t0 = ts;
    var p = Math.min((ts - t0) / 1800, 1);
    var e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}
var _ctrObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      _ctrObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
var _sb = document.querySelector('.stat-counters');
if (_sb) _ctrObs.observe(_sb);

/* INTERACTIVE CHECKLIST */
var _checked = new Set();
function toggleCheck(el) {
  var k = el.getAttribute('data-item');
  var box = el.querySelector('.ck-box');
  if (_checked.has(k)) {
    _checked.delete(k);
    el.classList.remove('checked');
    box.innerHTML = k;
  } else {
    _checked.add(k);
    el.classList.add('checked');
    box.innerHTML = '<i class="fas fa-check" style="font-size:0.72rem;"></i>';
  }
  var total = document.querySelectorAll('.check-item').length;
  var done = _checked.size;
  var pct = Math.round(done / total * 100);
  document.getElementById('checkFill').style.width = pct + '%';
  document.getElementById('checkPct').textContent = pct + '%';
  document.getElementById('checklistReadout').textContent = done + ' of ' + total + ' completed';
}
function resetChecklist() {
  _checked.clear();
  document.querySelectorAll('.check-item').forEach(function(el) {
    el.classList.remove('checked');
    el.querySelector('.ck-box').innerHTML = el.getAttribute('data-item');
  });
  document.getElementById('checkFill').style.width = '0%';
  document.getElementById('checkPct').textContent = '0%';
  document.getElementById('checklistReadout').textContent = '0 of 7 completed';
}

/* FAQ */
function toggleFaq(item) {
  var open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(el) { el.classList.remove('open'); });
  if (!open) item.classList.add('open');
}

/* CALCULATOR */
function runCalc() {
  var area = parseFloat(document.getElementById('calcArea').value) || 0;
  var type = document.getElementById('calcType').value;
  var cond = document.getElementById('calcCond').value;
  if (area <= 0) {
    document.getElementById('calcResult').textContent = '-';
    document.getElementById('calcSub').textContent = 'Enter area above to calculate';
    document.getElementById('calcLow').textContent = '-';
    document.getElementById('calcHigh').textContent = '-';
    return;
  }
  var lo = 150;
  var hi = 350;
  if (type === 'commercial') { lo = 180; hi = 400; }
  if (type === 'cluster') { lo = 160; hi = 320; }
  if (cond === 'fair') { lo += 20; hi += 30; }
  if (cond === 'poor') { lo += 40; hi += 60; }
  var tLo = Math.round(area * lo);
  var tHi = Math.round(area * hi);
  document.getElementById('calcResult').textContent = 'R' + tLo.toLocaleString() + ' - R' + tHi.toLocaleString();
  document.getElementById('calcSub').textContent = area + 'm^2 at R' + lo + '-R' + hi + '/m^2';
  document.getElementById('calcLow').textContent = 'R' + tLo.toLocaleString();
  document.getElementById('calcHigh').textContent = 'R' + tHi.toLocaleString();
}

/* NEWSLETTER */
function handleNewsletter() {
  var i = document.getElementById('newsletterEmail');
  var email = i ? i.value.trim() : '';
  if (email && email.indexOf('@') > 0) {
    i.value = '';
    i.placeholder = 'Subscribed! (ok)';
    alert('Thank you! We will contact you via official channels.');
  } else {
    alert('Please enter a valid email address.');
  }
}

/* COOKIE */
var COOKIE_NOTICE_KEY = 'ggs-cookie-consent';
function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}
function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function hideCookieNotice() {
  var cn = document.getElementById('cookie-notice');
  if (cn) cn.classList.add('hidden');
}
function dismissCookie(type) {
  safeStorageSet(COOKIE_NOTICE_KEY, type || 'essential');
  hideCookieNotice();
}
(function initCookieNotice() {
  if (safeStorageGet(COOKIE_NOTICE_KEY)) hideCookieNotice();
}());

/* DOWNLOAD CHECKLIST PDF */
function downloadChecklistPDF() {
  var today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  var items = [
    ['Clear the perimeter', 'Move furniture, plants, and decorations at least 1m away from all exterior walls.'],
    ['Trim vegetation', 'Cut back bushes, branches, and climbing plants touching the walls.'],
    ['Secure pets', 'Keep dogs and cats indoors or away from the work area during inspection.'],
    ['Locate water source', 'Identify your outdoor tap or hose connection - we will need water access.'],
    ['Note problem areas', 'Make a mental note of cracks, damp patches, or peeling paint you have observed.'],
    ['Clear parking access', 'Ensure space for our vehicle close to the property.'],
    ['Inform neighbours (optional)', 'A courteous heads-up prevents surprises.']
  ];
  var rows = items.map(function(it, idx) {
    return '<div class="ci"><div class="cn">' + (idx + 1) + '</div><div><strong>' + it[0] + '</strong><br><span class="cd">' + it[1] + '</span></div></div>';
  }).join('');

  var parts = [
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">',
    '<title>GGS Pre-Inspection Checklist</title>',
    '<style>',
    'body{font-family:Arial,sans-serif;max-width:760px;margin:40px auto;padding:24px;color:#1a1f24;line-height:1.6;}',
    '.hdr{display:flex;align-items:center;gap:18px;border-bottom:2px solid #b68b40;padding-bottom:18px;margin-bottom:24px;}',
    '.hdr img{width:68px;height:68px;border-radius:14px;}',
    '.hdr h1{font-size:1.65rem;margin:0 0 4px;}',
    '.hdr p{margin:0;color:#5a6c7a;font-size:0.84rem;}',
    'h2{font-size:1.2rem;border-bottom:1px solid #e2e8f0;padding-bottom:8px;margin:26px 0 14px;}',
    '.ci{display:flex;gap:14px;margin-bottom:15px;}',
    '.cn{background:#b68b40;color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;flex-shrink:0;}',
    '.cd{font-size:0.8rem;color:#5a6c7a;}',
    'ul{line-height:2;padding-left:20px;}',
    '.foot{margin-top:42px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:0.8rem;color:#5a6c7a;}',
    '@media print{body{margin:16px;}}',
    '</style></head><body>',
    '<div class="hdr">',
    '<img src="https://i.ibb.co/cc0QLQFJ/Whats-App-Image-2026-04-20-at-7-21-27-PM.jpg" alt="GGS">',
    '<div><h1>Pre-Inspection Checklist</h1>',
    '<p>Global Gamazine Suppliers &middot; Official Document &middot; ' + today + '</p></div>',
    '</div>',
    '<p>Prepare your property before our team arrives &mdash; it only takes a few minutes.</p>',
    '<h2>Before We Arrive</h2>',
    rows,
    '<h2>What We Will Do</h2><ul>',
    '<li><strong>Surface assessment</strong> &mdash; examine all exterior walls</li>',
    '<li><strong>Moisture testing</strong> &mdash; check for hidden damp</li>',
    '<li><strong>Precise measurements</strong> &mdash; calculate exact material needs</li>',
    '<li><strong>Colour consultation</strong> &mdash; choose from our signature range</li>',
    '<li><strong>Timeline confirmation</strong> &mdash; set expectations clearly</li>',
    '<li><strong>Quote delivery</strong> &mdash; detailed quote within 24 hours</li>',
    '</ul>',
    '<h2>Timeline After Inspection</h2><ul>',
    '<li><strong>Quote delivered:</strong> Within 24 hours</li>',
    '<li><strong>Materials on site:</strong> 2&ndash;4 business days after confirmation</li>',
    '<li><strong>Application:</strong> 1&ndash;3 days</li>',
    '<li><strong>Final sign-off:</strong> Same day as completion</li>',
    '</ul>',
    '<div class="foot">',
    '<strong>Global Gamazine Suppliers</strong><br>',
    '12 Granite Road, Kya Sands, Randburg, Gauteng<br>',
    '+27 62 150 3704 &middot; deliannyathi@gmail.com<br>',
    '&copy; 2026 GGS &middot; South Africa\'s Gamazine Specialists',
    '</div></body></html>'
  ];

  var blob = new Blob([parts.join('\n')], { type: 'text/html' });
  var url = URL.createObjectURL(blob);
  var win = window.open(url, '_blank');

  function revokeUrl() {
    if (url) {
      URL.revokeObjectURL(url);
      url = null;
    }
  }

  if (!win) {
    revokeUrl();
    alert('Please allow pop-ups for this site to download the PDF checklist.');
    return;
  }

  win.addEventListener('load', function() {
    setTimeout(function() { win.print(); }, 400);
  }, { once: true });

  var revokeOnClose = setInterval(function() {
    if (win.closed) {
      clearInterval(revokeOnClose);
      revokeUrl();
    }
  }, 1000);

  setTimeout(function() {
    clearInterval(revokeOnClose);
    revokeUrl();
  }, 60000);
}

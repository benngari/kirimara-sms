/* =========================================
   KIRIMARA HIGH SCHOOL — AUTH & PERMISSIONS
   Handles session, role-based nav, logout
   ========================================= */

/* ---- Role definitions ---- */
export const ROLES = {
  admin:              { label:'Administrator',      icon:'ti-settings',    colour:'navy'   },
  principal:          { label:'Principal',           icon:'ti-crown',       colour:'navy'   },
  deputy_academic:    { label:'DHT Academics',       icon:'ti-award',       colour:'maroon' },
  deputy_discipline:  { label:'DHT Discipline',      icon:'ti-shield',      colour:'maroon' },
  hod:                { label:'HOD / Teacher',       icon:'ti-chalkboard',  colour:'navy'   },
  class_teacher:      { label:'Class Teacher',       icon:'ti-chalkboard',  colour:'navy'   },
  teacher:            { label:'Teacher',             icon:'ti-chalkboard',  colour:'navy'   },
  bursar:             { label:'Bursar',              icon:'ti-receipt',     colour:'gold'   },
  accountant:         { label:'Accountant',          icon:'ti-calculator',  colour:'gold'   },
  labtech:            { label:'Lab Technician',      icon:'ti-flask',       colour:'gold'   },
  librarian:          { label:'Librarian',           icon:'ti-book',        colour:'navy'   },
  nurse:              { label:'School Nurse',        icon:'ti-stethoscope', colour:'maroon' },
  ict:                { label:'ICT Technician',      icon:'ti-device-desktop', colour:'navy'},
}

/* ---- Which nav items each role can see ----
   'all' means every page.  Otherwise list exact data-page values. */
export const ROLE_PAGES = {
  admin:             'all',
  principal:         'all',
  deputy_academic:   ['dashboard.html','students.html','teachers.html','attendance.html','exams.html','timetable.html','notices.html','reports.html'],
  deputy_discipline: ['dashboard.html','students.html','attendance.html','notices.html','reports.html'],
  hod:               ['dashboard.html','students.html','attendance.html','exams.html','timetable.html','notices.html'],
  class_teacher:     ['dashboard.html','students.html','attendance.html','exams.html','timetable.html'],
  teacher:           ['dashboard.html','students.html','attendance.html','exams.html','timetable.html'],
  bursar:            ['dashboard.html','students.html','fees.html','reports.html','notices.html'],
  accountant:        ['dashboard.html','fees.html','reports.html'],
  labtech:           ['dashboard.html','labtech.html'],
  librarian:         ['dashboard.html','library.html'],
  nurse:             ['dashboard.html','students.html','notices.html'],
  ict:               ['dashboard.html','support.html'],
}

/* ---- Get current user from sessionStorage ---- */
export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem('khs_user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

/* ---- Auth guard — redirect to login if not authenticated ---- */
export function requireAuth() {
  const user = getCurrentUser()
  if (!user) {
    window.location.href = 'login.html'
    return null
  }
  return user
}

/* ---- Get allowed pages for a role ---- */
export function allowedPages(role) {
  const pages = ROLE_PAGES[role]
  if (!pages || pages === 'all') return 'all'
  return pages
}

/* ---- Check if a role can access a specific page ---- */
export function canAccess(role, page) {
  const pages = allowedPages(role)
  if (pages === 'all') return true
  return pages.includes(page)
}

/* ---- Logout ---- */
export async function logout() {
  const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
  if (IS_LOCAL) {
    try {
      await fetch('/kirimara-sms/api/auth.php?action=logout', { method: 'POST' })
    } catch(e) { /* ignore */ }
  }
  sessionStorage.removeItem('khs_user')
  window.location.href = 'login.html'
}

/* ---- Apply role-based nav hiding ---- */
export function applyNavPermissions(user) {
  const allowed = allowedPages(user.role)
  if (allowed === 'all') return   // show everything

  document.querySelectorAll('.nav-link[data-page]').forEach(el => {
    const page = el.dataset.page
    if (!allowed.includes(page)) {
      el.style.display = 'none'
    }
  })
}

/* ---- Update topbar with user info + logout button ---- */
export function renderTopbarUser(user) {
  const role      = ROLES[user.role] || { label: user.role, icon: 'ti-user', colour: 'navy' }
  const colourMap = { navy:'var(--navy-p)', maroon:'var(--maroon-p)', gold:'var(--gold-p)' }
  const textMap   = { navy:'var(--navy-d)', maroon:'var(--maroon-d)', gold:'var(--gold-d)' }
  const bg        = colourMap[role.colour] || 'var(--navy-p)'
  const tc        = textMap[role.colour]   || 'var(--navy-d)'

  const topR = document.getElementById('topbar-right')
  if (!topR) return

  topR.innerHTML = `
    <span class="tbadge tbadge-maroon" style="white-space:nowrap">Term 2 · 2026</span>
    <div style="display:flex;align-items:center;gap:6px;background:${bg};padding:4px 10px 4px 8px;border-radius:20px;cursor:pointer" onclick="window.__showUserMenu()">
      <div style="width:26px;height:26px;border-radius:50%;background:var(--navy);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--gold);flex-shrink:0">${user.initials}</div>
      <div style="display:flex;flex-direction:column;line-height:1.2">
        <span style="font-size:11px;font-weight:600;color:${tc}">${user.full_name}</span>
        <span style="font-size:10px;color:${tc};opacity:0.7"><i class="ti ${role.icon}" style="font-size:10px"></i> ${role.label}</span>
      </div>
      <i class="ti ti-chevron-down" style="font-size:14px;color:${tc};opacity:0.6"></i>
    </div>
  `

  // User dropdown menu
  window.__showUserMenu = () => {
    const existing = document.getElementById('user-menu-dropdown')
    if (existing) { existing.remove(); return }

    const menu = document.createElement('div')
    menu.id = 'user-menu-dropdown'
    menu.style.cssText = `
      position:fixed; top:var(--topbar-h,54px); right:16px; z-index:300;
      background:var(--white); border:1px solid var(--border);
      border-radius:var(--radius-l); box-shadow:var(--shadow-l);
      min-width:220px; overflow:hidden;
      animation: fadeIn 0.12s ease;
    `

    // Inject fadeIn keyframe once
    if (!document.getElementById('fadeIn-style')) {
      const s = document.createElement('style')
      s.id = 'fadeIn-style'
      s.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}'
      document.head.appendChild(s)
    }

    menu.innerHTML = `
      <div style="padding:12px 14px;border-bottom:1px solid var(--border);background:var(--bg)">
        <div style="font-size:13px;font-weight:600;color:var(--navy-d)">${user.full_name}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:1px"><i class="ti ${role.icon}" style="font-size:11px"></i> ${role.label} · ${user.username}</div>
      </div>
      <div style="padding:6px 0">
        <button onclick="window.__changePw()" style="width:100%;text-align:left;padding:9px 14px;background:none;border:none;font-size:12.5px;color:var(--text);cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background='none'">
          <i class="ti ti-lock" style="font-size:15px;color:var(--navy)"></i> Change password
        </button>
        <button onclick="window.__showProfile()" style="width:100%;text-align:left;padding:9px 14px;background:none;border:none;font-size:12.5px;color:var(--text);cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background='none'">
          <i class="ti ti-user" style="font-size:15px;color:var(--navy)"></i> My profile
        </button>
      </div>
      <div style="padding:6px 0;border-top:1px solid var(--border)">
        <button onclick="window.__logout()" style="width:100%;text-align:left;padding:9px 14px;background:none;border:none;font-size:12.5px;color:var(--maroon-d);cursor:pointer;display:flex;align-items:center;gap:8px;font-family:inherit;font-weight:500" onmouseover="this.style.background='var(--maroon-p)'" onmouseout="this.style.background='none'">
          <i class="ti ti-logout" style="font-size:15px;color:var(--maroon)"></i> Sign out
        </button>
      </div>
    `

    document.body.appendChild(menu)

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function close(e) {
        if (!menu.contains(e.target)) {
          menu.remove()
          document.removeEventListener('click', close)
        }
      })
    }, 50)
  }

  // Change password modal
  window.__changePw = () => {
    document.getElementById('user-menu-dropdown')?.remove()
    openModal('Change Password', `
      <div class="form-group mb-12"><label>Current password</label><input type="password" id="cpw-old" placeholder="Current password"/></div>
      <div class="form-group mb-12"><label>New password</label><input type="password" id="cpw-new" placeholder="Min. 6 characters"/></div>
      <div class="form-group mb-16"><label>Confirm new password</label><input type="password" id="cpw-con" placeholder="Repeat new password"/></div>
      <div class="btn-row" style="margin-top:0">
        <button class="btn btn-navy" onclick="window.__submitPw()"><i class="ti ti-check"></i> Update password</button>
        <button class="btn" onclick="closeModal()">Cancel</button>
      </div>
    `)
  }

  window.__submitPw = async () => {
    const old = document.getElementById('cpw-old')?.value
    const nw  = document.getElementById('cpw-new')?.value
    const con = document.getElementById('cpw-con')?.value
    if (!old || !nw) { toast('Fill all fields', 'maroon'); return }
    if (nw !== con)  { toast('New passwords do not match', 'maroon'); return }
    if (nw.length < 6) { toast('Password must be at least 6 characters', 'maroon'); return }
    const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    if (IS_LOCAL) {
      const res = await fetch('/kirimara-sms/api/auth.php?action=change_password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: old, new_password: nw })
      })
      const d = await res.json()
      if (!res.ok) { toast(d.error || 'Failed', 'maroon'); return }
    }
    toast('Password updated successfully!', 'navy')
    closeModal()
  }

  // Profile modal
  window.__showProfile = () => {
    document.getElementById('user-menu-dropdown')?.remove()
    openModal('My Profile', `
      <div class="profile-block mb-14">
        <div class="av av-xl av-n" style="border:3px solid var(--gold)">${user.initials}</div>
        <div>
          <div class="profile-name">${user.full_name}</div>
          <span class="rtag rt-ht">${role.label}</span>
          <div class="profile-meta mt-8">Username: ${user.username}</div>
          <div class="profile-meta">Kirimara High School — Boys Only</div>
        </div>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Field</th><th>Detail</th></tr></thead>
          <tbody>
            <tr><td>Full name</td><td>${user.full_name}</td></tr>
            <tr><td>Username</td><td>${user.username}</td></tr>
            <tr><td>Role</td><td><span class="rtag rt-ht">${role.label}</span></td></tr>
            <tr><td>School</td><td>Kirimara High School</td></tr>
          </tbody>
        </table>
      </div>
      <div class="btn-row mt-14">
        <button class="btn btn-navy btn-sm" onclick="window.__changePw()"><i class="ti ti-lock"></i> Change password</button>
        <button class="btn btn-sm" onclick="closeModal()"><i class="ti ti-x"></i> Close</button>
      </div>
    `)
  }

  // Logout
  window.__logout = () => {
    document.getElementById('user-menu-dropdown')?.remove()
    if (confirm('Sign out of Kirimara SMS?')) logout()
  }
}

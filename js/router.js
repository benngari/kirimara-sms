/* =========================================
   KIRIMARA HIGH SCHOOL — ROUTER & PAGES
   ========================================= */

import DB from './data.js'
import API from './api.js'
import {
  calcGrade, avClass, feesBadge, statusBadge,
  invBadge, libBadge, noticeClass, ttCell, progBar,
  openModal, closeModal, toast, roleTag
} from './helpers.js'

/* ---- loading spinner helper ---- */
function loadingHTML(msg = 'Loading...') {
  return `<div style="display:flex;align-items:center;gap:10px;padding:40px 20px;color:var(--text-3)">
    <span class="ti ti-loader-2" style="font-size:22px;animation:spin 1s linear infinite"></span>
    <span>${msg}</span>
  </div>`
}

/* inject spin keyframe once */
if (!document.getElementById('spin-style')) {
  const s = document.createElement('style')
  s.id = 'spin-style'
  s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}'
  document.head.appendChild(s)
}

const PAGE_TITLES = {
  "dashboard.html":   "Dashboard",
  "students.html":    "Students",
  "headteacher.html": "Head Teacher",
  "teachers.html":    "Teachers",
  "labtech.html":     "Lab Technicians",
  "support.html":     "Support Staff",
  "attendance.html":  "Attendance",
  "exams.html":       "Exams & Grades",
  "timetable.html":   "Timetable",
  "library.html":     "Library",
  "fees.html":        "Fees & Finance",
  "notices.html":     "Notices",
  "reports.html":     "Reports",
  "settings.html":    "Settings",
};

/* ---- NAVIGATION ---- */
async function navTo(page) {
  document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
  const el = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (el) el.classList.add("active");
  document.getElementById("pageTitle").textContent = PAGE_TITLES[page] || page;

  const contentEl = document.getElementById("content");
  contentEl.innerHTML = loadingHTML('Loading ' + (PAGE_TITLES[page] || page) + '...');
  contentEl.scrollTop = 0;

  const render = PAGES[page];
  if (render) {
    const html = await render();
    contentEl.innerHTML = html;
  } else {
    contentEl.innerHTML = `<div class="card"><p class="c-muted">Coming soon.</p></div>`;
  }
  bindTabs();
}

function bindTabs() {
  document.querySelectorAll(".tabs").forEach(g => {
    g.querySelectorAll(".tab").forEach(t => {
      t.addEventListener("click", () => {
        g.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
        t.classList.add("active");
      });
    });
  });
}

/* ---- SIDEBAR MOBILE ---- */
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
}
function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

/* ---- BIND NAV LINKS ---- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-link[data-page]").forEach(el => {
    el.addEventListener("click", () => {
      navTo(el.dataset.page);
      closeSidebar();
    });
  });
  navTo("dashboard.html");
});

/* ====================================================
   ALL PAGES
   ==================================================== */
const PAGES = {

  /* ======== DASHBOARD ======== */
  async "dashboard.html"() {
    const d = await API.dashboard() || null
    const enrolment   = d?.enrolment    || DB.enrolment
    const staff       = d?.staff        || { teachers: DB.teachers.length, support: DB.support.length, labtech: DB.labtech.length }
    const fees        = d?.fees         || { collected: 2020000, expected: 2526000, pct: 78 }
    const feesPerForm = d?.fees_per_form|| DB.feesCollection.map(r=>({form:r.form.replace('Form ',''), paid:r.paid, expected:r.expected}))
    const att         = d?.attendance   || { pct: 96.4, absent: 30 }
    const weekly      = d?.weekly_att   || DB.weeklyAtt.map(w=>({day:w.day,pct:w.pct}))
    const houses      = d?.houses       || DB.houses
    const notices     = d?.notices      || DB.notices

    const total = enrolment.reduce((s,r)=>s+(r.total||0),0)
    const totalBoarders = enrolment.reduce((s,r)=>s+(parseInt(r.boarders)||0),0)
    const totalDay = enrolment.reduce((s,r)=>s+(parseInt(r.day_scholars)||0),0)

    const weekBars = weekly.map((w,i) => `
      <div class="bar-col">
        <div class="bar-val">${w.pct}%</div>
        <div class="bar ${i===weekly.length-1?'maroon':'navy'}" style="height:${Math.round(w.pct*.9)}px"></div>
        <div class="bar-lbl">${w.day||w.day_name}</div>
      </div>`).join("")

    const enrollRows = enrolment.map(r => `
      <tr>
        <td>Form ${r.form}</td>
        <td>${r.total}</td>
        <td>${r.boarders||0}</td>
        <td>${r.day_scholars||r.dayScholars||0}</td>
        <td>${r.streams||4}</td>
      </tr>`).join("")

    const feesRows = feesPerForm.map(r => {
      const form = typeof r.form === 'number' ? `Form ${r.form}` : r.form
      const expected = parseFloat(r.expected)||0
      const paid = parseFloat(r.paid)||0
      const bal  = expected - paid
      const pct  = expected > 0 ? Math.round(paid/expected*100) : 0
      return `<tr>
        <td>${form}</td>
        <td>KSh ${Math.round(expected).toLocaleString()}</td>
        <td>KSh ${Math.round(paid).toLocaleString()}</td>
        <td class="c-maroon fw-6">KSh ${Math.round(bal).toLocaleString()}</td>
        <td>${progBar(pct)} <span style="font-size:10px;color:var(--text-3)">${pct}%</span></td>
      </tr>`
    }).join("")

    const noticeHTML = notices.slice(0,4).map(n => `
      <div class="notice ${noticeClass(n.type)}">
        <i class="ti ${n.icon}"></i>
        <div><strong>${n.title}</strong> — ${n.body}</div>
      </div>`).join("")

    const houseCards = (houses.length ? houses : DB.houses).map((h,i) => `
      <div class="card mb-0">
        <div class="card-top ${['navy','maroon','gold','navy'][i]}"></div>
        <div style="font-weight:700;font-size:13px;color:var(--navy-d)">${h.name} House</div>
        <div class="c-muted mt-4" style="font-size:11px">Master: ${h.master}</div>
        <div class="c-muted mt-4" style="font-size:11px">Captain: ${h.captain||'—'}</div>
        <div class="flex-between mt-12">
          <span class="badge b-navy" style="font-size:12px">${h.points} pts</span>
          <span style="width:6px;height:6px;border-radius:50%;background:${['var(--navy)','var(--maroon)','var(--gold)','#28A048'][i]};display:inline-block"></span>
        </div>
      </div>`).join("")

    const collectedFmt = fees.collected >= 1e6
      ? `KSh ${(fees.collected/1e6).toFixed(2)}M`
      : `KSh ${Math.round(fees.collected).toLocaleString()}`

    return `
    <div class="stats-row">
      <div class="stat">
        <i class="ti ti-users stat-ico"></i>
        <div class="stat-lbl">Total students (Boys)</div>
        <div class="stat-val">${total}</div>
        <div class="stat-sub">${totalBoarders} boarders · ${totalDay} day scholars</div>
      </div>
      <div class="stat s-maroon">
        <i class="ti ti-chalkboard stat-ico"></i>
        <div class="stat-lbl">Teaching staff</div>
        <div class="stat-val">${staff.teachers}</div>
        <div class="stat-sub">+ ${staff.labtech} lab techs · ${staff.support} support</div>
      </div>
      <div class="stat s-gold">
        <i class="ti ti-receipt stat-ico"></i>
        <div class="stat-lbl">Fees collected</div>
        <div class="stat-val">${collectedFmt}</div>
        <div class="stat-sub">${fees.pct}% of term target</div>
      </div>
      <div class="stat s-green">
        <i class="ti ti-calendar-check stat-ico"></i>
        <div class="stat-lbl">Today's attendance</div>
        <div class="stat-val">${att.pct}%</div>
        <div class="stat-sub">${att.absent} absent today</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-top maroon"></div>
        <div class="card-hd">
          <div class="card-title"><i class="ti ti-bell"></i> Quick notices</div>
          <button class="btn btn-sm" onclick="navTo('notices.html')">View all</button>
        </div>
        ${noticeHTML}
      </div>
      <div class="card">
        <div class="card-top navy"></div>
        <div class="card-title"><i class="ti ti-chart-bar"></i> Attendance this week</div>
        <div class="bar-chart">${weekBars}</div>
      </div>
    </div>

    <div class="g2">
      <div class="card">
        <div class="card-title"><i class="ti ti-users"></i> Enrolment by form</div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Form</th><th>Total</th><th>Boarders</th><th>Day scholars</th><th>Streams</th></tr></thead>
            <tbody>
              ${enrollRows}
              <tr style="font-weight:700;background:var(--navy-p)">
                <td>Total</td><td>${total}</td><td>${totalBoarders}</td><td>${totalDay}</td><td>16</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-title"><i class="ti ti-receipt"></i> Term 2 fees collection</div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Form</th><th>Expected</th><th>Paid</th><th>Balance</th><th>Progress</th></tr></thead>
            <tbody>${feesRows}</tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="g4 mb-0">${houseCards}</div>`
  },

  /* ======== STUDENTS ======== */
  async "students.html"() {
    const data = await API.students.list() || DB.students.map((s,i)=>({
      ...s, full_name: s.name, house: s.house, fees_status: s.fees,
    }))
    const rows = data.map((s,i) => `
      <tr>
        <td>${s.adm_no||s.id}</td>
        <td><div class="av-cell"><div class="av ${avClass(i)}">${(s.full_name||s.name).split(' ').map(n=>n[0]).join('').slice(0,2)}</div>${s.full_name||s.name}</div></td>
        <td>Form ${s.form}</td>
        <td>${s.stream}</td>
        <td>${s.house||s.house_name||'—'}</td>
        <td>${s.balance !== undefined ? feesBadge(s.fees_status, parseFloat(s.balance)) : feesBadge(s.fees, s.balance)}</td>
        <td>
          <button class="btn btn-sm" onclick='showStudent(${JSON.stringify(s).replace(/'/g,"&#39;")})'>View</button>
          <button class="btn btn-sm" onclick="toast('Edit coming soon','maroon')">Edit</button>
        </td>
      </tr>`).join("")
    return `
    <div class="toolbar">
      <div class="toolbar-l">
        <div class="tabs mb-0" style="border:none">
          <div class="tab active">All</div>
          <div class="tab">Form 1</div>
          <div class="tab">Form 2</div>
          <div class="tab">Form 3</div>
          <div class="tab">Form 4</div>
        </div>
      </div>
      <div class="toolbar-r">
        <button class="btn btn-sm"><i class="ti ti-search"></i> Search</button>
        <button class="btn btn-sm"><i class="ti ti-download"></i> Export</button>
        <button class="btn btn-maroon btn-sm" onclick="showAdmit()"><i class="ti ti-plus"></i> Admit student</button>
      </div>
    </div>
    <div class="card mb-0">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Adm No.</th><th>Name</th><th>Form</th><th>Stream</th><th>House</th><th>Fees status</th><th>Actions</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="7" class="c-muted" style="text-align:center;padding:30px">No students found</td></tr>'}</tbody>
        </table>
      </div>
    </div>`
  },

  /* ======== HEAD TEACHER ======== */
  async "headteacher.html"() {
    const h = await API.staff.headteacher() || DB.headteacher
    const deputies = h.deputies || DB.headteacher.deputies
    const yrs = new Date().getFullYear() - (h.year_joined||h.joined||2014)
    const depRows = deputies.map(d=>`
      <tr><td>${d.full_name||d.name}</td><td><span class="rtag rt-ht">${d.role}</span></td><td>${d.tsc_no||d.tsc||'—'}</td><td>${d.phone}</td></tr>`).join("")
    return `
    <div class="g2">
      <div class="card">
        <div class="card-top navy"></div>
        <div class="profile-block">
          <div class="av av-xl av-n" style="border:3px solid var(--gold)">${h.initials}</div>
          <div>
            <div class="profile-name">${h.full_name||h.name}</div>
            <span class="rtag rt-ht">Head Teacher</span>
            <div class="profile-meta mt-8">TSC No. ${h.tsc_no||h.tsc}</div>
            <div class="profile-meta">${h.qualification}</div>
            <div class="profile-meta"><i class="ti ti-phone" style="font-size:11px"></i> ${h.phone} &nbsp;&nbsp;<i class="ti ti-mail" style="font-size:11px"></i> ${h.email}</div>
          </div>
        </div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Field</th><th>Detail</th></tr></thead>
            <tbody>
              <tr><td>Years at Kirimara</td><td>${yrs} years (since ${h.year_joined||h.joined})</td></tr>
              <tr><td>Employment</td><td>${h.employment}</td></tr>
              <tr><td>Responsibility allowance</td><td>KSh ${parseFloat(h.allowance||9800).toLocaleString()}/month</td></tr>
              <tr><td>Office</td><td>${h.office}</td></tr>
              <tr><td>School type</td><td>Boys Only Secondary School</td></tr>
            </tbody>
          </table>
        </div>
        <div class="card-title mt-16 mb-8"><i class="ti ti-users"></i> Deputy head teachers</div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>TSC No.</th><th>Phone</th></tr></thead>
            <tbody>${depRows}</tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-top maroon"></div>
        <div class="card-title"><i class="ti ti-bolt"></i> Admin quick actions</div>
        <div class="action-list">
          <button class="action-btn" onclick="toast('Generating end-of-term report...','navy')"><i class="ti ti-file-text" style="color:var(--navy)"></i> Generate end-of-term report</button>
          <button class="action-btn" onclick="toast('Opening parent circular template...','maroon')"><i class="ti ti-mail" style="color:var(--maroon)"></i> Draft parent circular</button>
          <button class="action-btn" onclick="toast('Loading improvement plan...','navy')"><i class="ti ti-target" style="color:var(--navy)"></i> School improvement plan</button>
          <button class="action-btn" onclick="toast('Opening staff appraisal form...','maroon')"><i class="ti ti-clipboard" style="color:var(--maroon)"></i> Staff appraisal forms</button>
          <button class="action-btn" onclick="toast('Loading prize giving speech...','gold')"><i class="ti ti-microphone" style="color:var(--gold)"></i> Prize giving ceremony speech</button>
          <button class="action-btn" onclick="navTo('reports.html')"><i class="ti ti-chart-bar" style="color:var(--navy)"></i> View all reports →</button>
        </div>
        <div class="notice n-navy mt-16"><i class="ti ti-school"></i><div><strong>Kirimara High School</strong> — Boys Only Secondary School. School motto: <em>God Reigns</em>.</div></div>
      </div>
    </div>`
  },

  /* ======== TEACHERS ======== */
  async "teachers.html"() {
    const data = await API.staff.teachers() || DB.teachers
    const rows = data.map((t,i) => `
      <tr>
        <td><div class="av-cell"><div class="av ${avClass(i)}">${t.initials||t.init}</div>${t.full_name||t.name}</div></td>
        <td><span class="rtag rt-t">${t.role}</span></td>
        <td>${t.subjects}</td>
        <td>${t.class_teacher||t.classteacher}</td>
        <td>${t.tsc_no||t.tsc}</td>
        <td>${t.phone}</td>
        <td>${statusBadge(t.status)}</td>
        <td><button class="btn btn-sm" onclick="toast('Edit teacher...','navy')">Edit</button></td>
      </tr>`).join("")
    return `
    <div class="toolbar">
      <div class="toolbar-info">${data.length} teaching staff registered</div>
      <div class="toolbar-r">
        <button class="btn btn-sm"><i class="ti ti-download"></i> Export list</button>
        <button class="btn btn-maroon btn-sm" onclick="toast('Add teacher form...','navy')"><i class="ti ti-plus"></i> Add teacher</button>
      </div>
    </div>
    <div class="card mb-0">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Name</th><th>Role</th><th>Subject(s)</th><th>Class teacher</th><th>TSC No.</th><th>Phone</th><th>Status</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`
  },

  /* ======== LAB TECH ======== */
  async "labtech.html"() {
    const techs = await API.staff.labtech()   || DB.labtech
    const inv   = await API.staff.inventory() || DB.inventory
    const stripes = ["navy","maroon","gold","navy"]
    const cards = techs.map((l,i) => {
      const pct = parseInt(l.stock_pct||l.stock||0)
      const pctCls = pct < 40 ? "pf-danger" : pct < 60 ? "pf-warn" : "pf-green"
      return `
      <div class="card">
        <div class="card-top ${stripes[i]}"></div>
        <div class="profile-block mb-8">
          <div class="av av-lg ${avClass(i)}">${l.initials||l.init}</div>
          <div>
            <div style="font-weight:700;font-size:13px;color:var(--navy-d)">${l.full_name||l.name}</div>
            <span class="rtag rt-lt">${l.lab} Lab Tech</span>
            <div class="profile-meta mt-4"><i class="ti ti-flask" style="font-size:11px"></i> ${l.rooms}</div>
            <div class="profile-meta"><i class="ti ti-phone" style="font-size:11px"></i> ${l.phone}</div>
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text-3);margin-bottom:4px">
            Stock / equipment — ${pct}%
            ${(l.stock_note||l.stockNote) ? `<span class="c-maroon"> · ${l.stock_note||l.stockNote}</span>` : ""}
          </div>
          ${progBar(pct, pctCls)}
        </div>
      </div>`}).join("")

    const invRows = inv.map(v => `
      <tr>
        <td>${v.item}</td><td>${v.lab}</td><td>${v.quantity||v.qty}</td><td>${v.unit||'pcs'}</td>
        <td>${invBadge(v.status)}</td>
        <td>${v.last_checked||v.checked}</td>
        <td>${v.status==="Good"
          ? `<button class="btn btn-sm" onclick="toast('Updated: ${v.item}','navy')">Update</button>`
          : `<button class="btn btn-maroon btn-sm" onclick="toast('Order placed: ${v.item}','maroon')">Order</button>`}</td>
      </tr>`).join("")

    return `
    <div class="g4 mb-16">${cards}</div>
    <div class="card mb-0">
      <div class="card-hd">
        <div class="card-title"><i class="ti ti-list-check"></i> Lab inventory log</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-navy btn-sm" onclick="toast('Add inventory item...','navy')"><i class="ti ti-plus"></i> Add item</button>
          <button class="btn btn-sm"><i class="ti ti-download"></i> Export</button>
        </div>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Item</th><th>Lab</th><th>Qty</th><th>Unit</th><th>Status</th><th>Last checked</th><th></th></tr></thead>
          <tbody>${invRows}</tbody>
        </table>
      </div>
    </div>`
  },

  /* ======== SUPPORT STAFF ======== */
  async "support.html"() {
    const data = await API.staff.support() || DB.support
    const rows = data.map((s,i) => `
      <tr>
        <td><div class="av-cell"><div class="av ${avClass(i)}">${s.initials||s.init}</div>${s.full_name||s.name}</div></td>
        <td>${roleTag(s.role)}</td>
        <td>${s.department||s.dept}</td>
        <td>${(s.employment_type||s.type)==='Permanent'?'<span class="badge b-navy">Permanent</span>':'<span class="badge b-warn">Contract</span>'}</td>
        <td>${s.phone}</td>
        <td>${s.email ? `<a href="mailto:${s.email}" style="color:var(--navy-m)">${s.email}</a>` : '<span class="c-muted">—</span>'}</td>
        <td><button class="btn btn-sm" onclick="toast('View staff profile...','navy')">View</button></td>
      </tr>`).join("")
    return `
    <div class="toolbar">
      <div class="toolbar-info">${data.length} non-teaching staff registered</div>
      <div class="toolbar-r">
        <button class="btn btn-maroon btn-sm" onclick="toast('Add staff form...','maroon')"><i class="ti ti-plus"></i> Add staff</button>
        <button class="btn btn-sm"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>
    <div class="card mb-0">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Name</th><th>Role</th><th>Dept</th><th>Employment</th><th>Phone</th><th>Email</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`
  },

  /* ======== ATTENDANCE ======== */
  async "attendance.html"() {
    const today = new Date().toISOString().slice(0,10)
    const [reg, sum] = await Promise.all([
      API.attendance.register(4, '4A', today),
      API.attendance.summary(),
    ])
    const regData = reg || DB.attendanceReg
    const sumData = sum || DB.attendanceSummary

    const regRows = regData.map((a,idx) => {
      const sid = a.id || a.student_id || idx
      return `<tr>
        <td>${a.adm_no||a.id||'—'}</td>
        <td>${a.full_name||a.name}</td>
        <td>
          <div class="att-set">
            <button class="att-btn att-p${(a.status==='P')?' selected':''}" onclick="setAtt(this,'P')" data-sid="${sid}">P</button>
            <button class="att-btn att-a${(a.status==='A')?' selected':''}" onclick="setAtt(this,'A')" data-sid="${sid}">A</button>
            <button class="att-btn att-l${(a.status==='L')?' selected':''}" onclick="setAtt(this,'L')" data-sid="${sid}">L</button>
          </div>
        </td>
        <td id="att-status-${sid}" style="font-size:11px;font-weight:600;color:${a.status==='P'?'var(--navy-m)':a.status==='A'?'var(--maroon-m)':'var(--gold-d)'}">${a.status==='P'?'Present':a.status==='A'?'Absent':'Late'}</td>
      </tr>`}).join("")

    const sumRows = (Array.isArray(sumData) ? sumData : DB.attendanceSummary).map(a => {
      const form = a.form ? (isNaN(a.form) ? a.form : `Form ${a.form}`) : '—'
      const pct  = parseFloat(a.pct||0)
      return `<tr>
        <td>${form}</td><td>${a.present||0}</td><td>${a.absent||0}</td><td>${a.late||0}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            ${progBar(pct)} <span style="font-size:11px;font-weight:600">${pct}%</span>
          </div>
        </td>
      </tr>`}).join("")

    const saveAtt = async () => {
      const rows = [...document.querySelectorAll('#att-register tbody tr')].map(tr => ({
        student_id: tr.querySelector('.att-btn').dataset.sid,
        status: tr.querySelector('.att-btn.selected')?.textContent?.trim() || 'P'
      }))
      const res = await API.attendance.save({ date: today, marked_by: 'Teacher', records: rows })
      toast(res ? 'Attendance saved!' : 'Saved locally (offline)', res ? 'navy' : 'maroon')
    }

    return `
    <div class="g2">
      <div class="card">
        <div class="card-top navy"></div>
        <div class="card-hd">
          <div class="card-title"><i class="ti ti-calendar-check"></i> Daily register — Form 4A · ${today}</div>
          <select style="border:1px solid var(--border-d);border-radius:var(--radius);padding:5px 9px;font-size:12px;color:var(--text)">
            <option>Form 4A</option><option>Form 4B</option><option>Form 3A</option>
          </select>
        </div>
        <div class="tbl-wrap">
          <table id="att-register">
            <thead><tr><th>Adm No.</th><th>Name</th><th>Mark</th><th>Status</th></tr></thead>
            <tbody>${regRows}</tbody>
          </table>
        </div>
        <div class="btn-row">
          <button class="btn btn-navy btn-sm" onclick="saveAttendance()"><i class="ti ti-check"></i> Save register</button>
          <button class="btn btn-sm"><i class="ti ti-download"></i> Export</button>
          <button class="btn btn-sm"><i class="ti ti-printer"></i> Print register</button>
        </div>
      </div>
      <div class="card">
        <div class="card-top maroon"></div>
        <div class="card-title"><i class="ti ti-chart-bar"></i> Term 2 summary — all forms</div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Form</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th></tr></thead>
            <tbody>${sumRows}</tbody>
          </table>
        </div>
        <div class="notice n-maroon mt-12"><i class="ti ti-alert-triangle"></i><div>Boys with persistent absence — form teachers to issue letters to parents/guardians.</div></div>
        <div class="btn-row">
          <button class="btn btn-sm" onclick="toast('Generating absence letters...','maroon')"><i class="ti ti-mail"></i> Generate letters</button>
          <button class="btn btn-sm"><i class="ti ti-download"></i> Full report</button>
        </div>
      </div>
    </div>`
  },

  /* ======== EXAMS ======== */
  async "exams.html"() {
    const data = await API.exams.results(4,'4A',1) || null
    const rows = (data || DB.examResults).map(r => {
      const scores = data
        ? [r.maths,r.english,r.kisw,r.biology,r.chemistry,r.physics,r.history].filter(x=>x!=null)
        : [r.maths,r.eng,r.kisw,r.bio,r.chem,r.phys,r.hist]
      const mean = scores.length ? (scores.reduce((a,b)=>a+(parseFloat(b)||0),0)/scores.length) : 0
      const {g,c} = calcGrade(mean)
      const fmt = v => v != null ? v : '—'
      return `<tr>
        <td>${r.name||r.student_name||'—'}</td>
        <td>${fmt(r.maths)}</td><td>${fmt(r.english||r.eng)}</td><td>${fmt(r.kisw)}</td>
        <td>${fmt(r.biology||r.bio)}</td><td>${fmt(r.chemistry||r.chem)}</td>
        <td>${fmt(r.physics||r.phys)}</td><td>${fmt(r.history||r.hist)}</td>
        <td class="fw-6">${mean.toFixed(1)}</td>
        <td><span class="badge ${c}">${g}</span></td>
      </tr>`}).join("")
    return `
    <div class="tabs">
      <div class="tab active">Results entry</div>
      <div class="tab">Exam schedule</div>
      <div class="tab">Report cards</div>
      <div class="tab">KCSE analysis</div>
    </div>
    <div class="card mb-0">
      <div class="card-hd">
        <div class="card-title"><i class="ti ti-clipboard-list"></i> Mid-term grades — Form 4A</div>
        <div style="display:flex;gap:8px">
          <select style="border:1px solid var(--border-d);border-radius:var(--radius);padding:5px 9px;font-size:12px;color:var(--text)">
            <option>Form 4A</option><option>Form 4B</option><option>Form 4C</option>
          </select>
          <select style="border:1px solid var(--border-d);border-radius:var(--radius);padding:5px 9px;font-size:12px;color:var(--text)">
            <option>Mid-term</option><option>End-term</option><option>KCSE Mock</option>
          </select>
        </div>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Student</th><th>Maths</th><th>English</th><th>Kisw.</th><th>Bio</th><th>Chem</th><th>Physics</th><th>History</th><th>Mean</th><th>Grade</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="btn-row">
        <button class="btn btn-navy btn-sm" onclick="toast('Generating report cards...','navy')"><i class="ti ti-file-text"></i> Generate report cards</button>
        <button class="btn btn-sm"><i class="ti ti-download"></i> Export CSV</button>
        <button class="btn btn-sm"><i class="ti ti-chart-bar"></i> Class analysis</button>
        <button class="btn btn-sm"><i class="ti ti-printer"></i> Print</button>
      </div>
    </div>`
  },

  /* ======== TIMETABLE ======== */
  "timetable.html"() {
    const tt = DB.timetable;
    const thead = `<tr><th style="min-width:80px">Period</th>${tt.days.map(d=>`<th>${d}</th>`).join("")}</tr>`;
    const tbody = tt.periods.map((p,pi) => {
      const isBreakRow = tt.slots[pi].every(s=>s==="BREAK"||s==="LUNCH");
      return `<tr${isBreakRow?' style="background:var(--bg)"':''}>
        <td style="color:var(--text-3);font-size:11px;white-space:nowrap;font-weight:500">${p}</td>
        ${tt.slots[pi].map(s=>ttCell(s)).join("")}
      </tr>`;
    }).join("");
    return `
    <div class="toolbar">
      <div class="toolbar-l">
        <select style="border:1px solid var(--border-d);border-radius:var(--radius);padding:6px 10px;font-size:12px;color:var(--text)">
          <option>Form 4A</option><option>Form 3A</option><option>Form 2A</option><option>Form 1A</option>
        </select>
        <select style="border:1px solid var(--border-d);border-radius:var(--radius);padding:6px 10px;font-size:12px;color:var(--text)">
          <option>Week of 2 Jun 2026</option><option>Week of 9 Jun 2026</option>
        </select>
      </div>
      <div class="toolbar-r">
        <button class="btn btn-sm"><i class="ti ti-printer"></i> Print</button>
        <button class="btn btn-navy btn-sm"><i class="ti ti-edit"></i> Edit timetable</button>
      </div>
    </div>
    <div class="card mb-0">
      <div class="tbl-wrap">
        <table>
          <thead>${thead}</thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>
    </div>`;
  },

  /* ======== LIBRARY ======== */
  async "library.html"() {
    const [stats, borrowings] = await Promise.all([
      API.library.stats(),
      API.library.borrowings(),
    ])
    const s   = stats || { total: DB.library.total, on_loan: DB.library.onLoan, overdue: DB.library.overdue, available: DB.library.available }
    const bor = borrowings || DB.library.borrowings

    const rows = bor.map(b => {
      const st = b.status || (b.return_date ? 'Returned' : b.due_date < new Date().toISOString().slice(0,10) ? 'Overdue' : 'On loan')
      return `<tr>
        <td>${b.student_name||b.student}</td>
        <td>${b.adm_no||b.adm||'—'}</td>
        <td>${b.title}</td>
        <td>${b.subject}</td>
        <td>${b.issue_date||b.issued}</td>
        <td>${b.due_date||b.due}</td>
        <td>${libBadge(st)}</td>
        <td><button class="btn btn-sm" onclick="toast('Book returned','navy')">Return</button></td>
      </tr>`}).join("")

    return `
    <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat"><i class="ti ti-books stat-ico"></i><div class="stat-lbl">Total books</div><div class="stat-val">${parseInt(s.total||0).toLocaleString()}</div><div class="stat-sub">All subjects</div></div>
      <div class="stat s-maroon"><i class="ti ti-book-off stat-ico"></i><div class="stat-lbl">On loan</div><div class="stat-val">${s.on_loan||s.onLoan||0}</div><div class="stat-sub">${s.overdue||0} overdue</div></div>
      <div class="stat s-green"><i class="ti ti-book stat-ico"></i><div class="stat-lbl">Available</div><div class="stat-val">${parseInt(s.available||0).toLocaleString()}</div><div class="stat-sub">Ready to borrow</div></div>
    </div>
    <div class="card mb-0">
      <div class="card-hd">
        <div class="card-title"><i class="ti ti-book"></i> Borrowing records</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-navy btn-sm" onclick="toast('Issue book form...','navy')"><i class="ti ti-plus"></i> Issue book</button>
          <button class="btn btn-sm"><i class="ti ti-download"></i> Export</button>
        </div>
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Student</th><th>Adm No.</th><th>Book title</th><th>Subject</th><th>Issued</th><th>Due</th><th>Status</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="notice n-maroon mt-12"><i class="ti ti-alert-triangle"></i><div>${s.overdue||0} books are overdue. Librarian to follow up with form teachers.</div></div>
    </div>`
  },

  /* ======== FEES ======== */
  async "fees.html"() {
    const [payments, structure, summary] = await Promise.all([
      API.fees.payments(), API.fees.structure(), API.fees.summary()
    ])
    const payData = payments || DB.recentPayments
    const feeData = structure || DB.feesStructure
    const sumData = summary  || null

    const payRows = payData.map(p => `
      <tr>
        <td>${p.student_name||p.student}</td>
        <td>${p.adm_no||p.adm||'—'}</td>
        <td class="fw-6">KSh ${parseFloat(p.amount).toLocaleString()}</td>
        <td>${p.payment_mode||p.mode}</td>
        <td>${p.payment_date||p.date}</td>
        <td><span class="badge b-navy">${p.receipt_no||p.receipt}</span></td>
        <td><button class="btn btn-sm" onclick="toast('Printing receipt...','navy')"><i class="ti ti-printer"></i></button></td>
      </tr>`).join("")

    const totals = feeData.reduce((a,r)=>{
      a.f1  += parseFloat(r.form1||r.f1||0)
      a.f23 += parseFloat(r.form23||r.f23||0)
      a.f4  += parseFloat(r.form4||r.f4||0)
      return a
    },{f1:0,f23:0,f4:0})

    const feeRows = feeData.map(r => {
      const f1  = parseFloat(r.form1||r.f1||0)
      const f23 = parseFloat(r.form23||r.f23||0)
      const f4  = parseFloat(r.form4||r.f4||0)
      const isTot = r.item==='TOTAL'
      const s = isTot ? 'font-weight:700;background:var(--navy-p)' : ''
      return `<tr style="${s}"><td>${r.item}</td><td>KSh ${f1.toLocaleString()}</td><td>KSh ${f23.toLocaleString()}</td><td>KSh ${f4.toLocaleString()}</td></tr>`
    }).join("")

    const recordPayment = async () => {
      const adm   = document.getElementById('pay-adm').value.trim()
      const amt   = document.getElementById('pay-amt').value
      const mode  = document.getElementById('pay-mode').value
      const ref   = document.getElementById('pay-ref').value.trim()
      if (!adm || !amt) { toast('Fill in admission number and amount','maroon'); return }
      const res = await API.fees.record({ adm_no:adm, amount:amt, payment_mode:mode, transaction_ref:ref })
      toast(res?.success ? 'Payment recorded! Receipt: ' + (res.receipt||'') : 'Saved (offline mode)', res?.success ? 'navy' : 'maroon')
    }

    return `
    <div class="g2">
      <div class="card">
        <div class="card-top navy"></div>
        <div class="card-title"><i class="ti ti-receipt"></i> Record fee payment</div>
        <div class="form-row">
          <div class="form-group"><label>Admission No.</label><input id="pay-adm" type="text" placeholder="e.g. K/2026/001"/></div>
          <div class="form-group"><label>Amount (KSh)</label><input id="pay-amt" type="number" placeholder="e.g. 15000"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Payment mode</label>
            <select id="pay-mode"><option>M-Pesa</option><option>Cash</option><option>Bank deposit</option><option>Cheque</option></select>
          </div>
          <div class="form-group"><label>Term</label>
            <select><option>Term 2 2026</option><option>Term 1 2026</option></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Transaction / receipt ref</label><input id="pay-ref" type="text" placeholder="e.g. QGF3K8P2"/></div>
          <div class="form-group"><label>Date</label><input type="date" value="${new Date().toISOString().slice(0,10)}"/></div>
        </div>
        <div class="form-group mb-14"><label>Notes (optional)</label><input type="text" placeholder="Any additional info"/></div>
        <div class="btn-row" style="margin-top:0">
          <button class="btn btn-navy" onclick="recordPayment()"><i class="ti ti-check"></i> Record payment</button>
          <button class="btn" onclick="toast('Printing receipt...','maroon')"><i class="ti ti-printer"></i> Print receipt</button>
        </div>
      </div>
      <div class="card">
        <div class="card-top maroon"></div>
        <div class="card-title"><i class="ti ti-list"></i> Recent payments</div>
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Student</th><th>Adm No.</th><th>Amount</th><th>Mode</th><th>Date</th><th>Receipt</th><th></th></tr></thead>
            <tbody>${payRows}</tbody>
          </table>
        </div>
        <div class="btn-row">
          <button class="btn btn-sm"><i class="ti ti-download"></i> Export payments</button>
          <button class="btn btn-sm" onclick="toast('Search student feature...','navy')"><i class="ti ti-search"></i> Find student</button>
        </div>
      </div>
    </div>
    <div class="card mb-0">
      <div class="card-title"><i class="ti ti-table"></i> Term 2 fee structure — Boys</div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Item</th><th>Form 1</th><th>Form 2 &amp; 3</th><th>Form 4</th></tr></thead>
          <tbody>
            ${feeRows}
            <tr style="font-weight:700;background:var(--navy-p)">
              <td>TOTAL</td>
              <td>KSh ${totals.f1.toLocaleString()}</td>
              <td>KSh ${totals.f23.toLocaleString()}</td>
              <td>KSh ${totals.f4.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`
  },

  /* ======== NOTICES ======== */
  async "notices.html"() {
    const data = await API.notices.list() || DB.notices
    const items = data.map(n => `
      <div class="notice ${noticeClass(n.type)}">
        <i class="ti ${n.icon}"></i>
        <div>
          <div style="font-size:10px;opacity:0.55;margin-bottom:2px">${n.notice_date||n.date} ${n.posted_by ? '· Posted by '+n.posted_by : ''}</div>
          <strong>${n.title}</strong> — ${n.body}
        </div>
        <button class="btn btn-sm" style="margin-left:auto;flex-shrink:0" onclick="deleteNotice(${n.id||0})"><i class="ti ti-trash"></i></button>
      </div>`).join("")

    const postNotice = async () => {
      const title = document.getElementById('ntc-title').value.trim()
      const body  = document.getElementById('ntc-body').value.trim()
      const type  = document.getElementById('ntc-type').value
      if (!title || !body) { toast('Fill in title and body','maroon'); return }
      const res = await API.notices.post({ title, body, type, icon:'ti-bell', posted_by: 'Admin' })
      toast(res?.success ? 'Notice posted!' : 'Saved','navy')
      navTo('notices.html')
    }


    return `
    <div class="toolbar">
      <div class="toolbar-info">School notices &amp; circulars · Term 2, 2026</div>
      <div class="toolbar-r">
        <button class="btn btn-sm"><i class="ti ti-download"></i> Export</button>
      </div>
    </div>
    <div class="g2">
      <div class="card" style="grid-column:span 1">
        <div class="card-top maroon"></div>
        <div class="card-title"><i class="ti ti-bell"></i> Post new notice</div>
        <div class="form-group mb-8"><label>Title</label><input id="ntc-title" type="text" placeholder="Notice title"/></div>
        <div class="form-group mb-8"><label>Body</label><textarea id="ntc-body" placeholder="Notice details..."></textarea></div>
        <div class="form-group mb-12"><label>Type / colour</label>
          <select id="ntc-type">
            <option value="navy">Navy (info)</option>
            <option value="maroon">Maroon (urgent)</option>
            <option value="success">Green (success)</option>
            <option value="gold">Gold (warning)</option>
          </select>
        </div>
        <button class="btn btn-maroon" onclick="postNotice()"><i class="ti ti-send"></i> Post notice</button>
      </div>
      <div class="card" style="grid-column:span 1">
        <div class="card-top navy"></div>
        <div class="card-title"><i class="ti ti-list"></i> Current notices (${data.length})</div>
        ${items || '<p class="c-muted">No notices posted.</p>'}
      </div>
    </div>`
  },

  /* ======== REPORTS ======== */
  "reports.html"() {
    const cards = [
      { t:"Academic report",      i:"ti-chart-bar",    s:"navy",   d:"Per-class and per-subject performance analysis for all forms" },
      { t:"Staff payroll",        i:"ti-users",        s:"maroon", d:"TSC payroll, responsibility allowances and attendance" },
      { t:"Finance report",       i:"ti-receipt",      s:"gold",   d:"Fees collected, balances, and school expenditure" },
      { t:"Discipline report",    i:"ti-shield-check", s:"navy",   d:"Conduct incidents, welfare cases, counselling log" },
      { t:"Lab inventory",        i:"ti-flask",        s:"maroon", d:"Equipment status, reagent stock, and requisitions" },
      { t:"KCSE readiness",       i:"ti-certificate",  s:"gold",   d:"Projected Form 4 performance &amp; preparation checklist" },
    ].map(r => `
      <div class="card" style="cursor:pointer"
        onmouseover="this.style.boxShadow='var(--shadow-l)'" onmouseout="this.style.boxShadow=''"
        onclick="toast('Generating: ${r.t}...','${r.s}')">
        <div class="card-top ${r.s}"></div>
        <i class="ti ${r.i}" style="font-size:28px;color:var(--${r.s==='gold'?'gold-d':r.s==='maroon'?'maroon':'navy'});margin-bottom:10px;display:block"></i>
        <div class="fw-7" style="font-size:13px;color:var(--navy-d)">${r.t}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:4px;line-height:1.5">${r.d}</div>
        <div class="mt-8"><span class="badge b-navy" style="font-size:9px">Generate PDF →</span></div>
      </div>`).join("");
    return `
    <div class="notice n-navy mb-14">
      <i class="ti ti-info-circle"></i>
      <div>Click any report to generate. All reports reflect current data. To export raw records, use the Download buttons on individual pages.</div>
    </div>
    <div class="g3">${cards}</div>`;
  },

  /* ======== SETTINGS ======== */
  async "settings.html"() {
    const s    = DB.school
    const user = window.currentUser || { full_name:'—', initials:'—', role:'admin', username:'—' }
    const isAdmin = ['admin','principal'].includes(user.role)

    const changePw = async () => {
      const old = document.getElementById('set-cpw-old')?.value
      const nw  = document.getElementById('set-cpw-new')?.value
      const con = document.getElementById('set-cpw-con')?.value
      if (!old || !nw) { toast('Fill all password fields','maroon'); return }
      if (nw !== con)  { toast('New passwords do not match','maroon'); return }
      if (nw.length < 6){ toast('Password must be at least 6 characters','maroon'); return }
      const IS_LOCAL = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      if (IS_LOCAL) {
        const res = await fetch('/kirimara-sms/api/auth.php?action=change_password', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ current_password: old, new_password: nw })
        })
        const d = await res.json()
        if (!res.ok) { toast(d.error || 'Failed to update password','maroon'); return }
      }
      toast('Password updated successfully!','navy')
      document.getElementById('set-cpw-old').value = ''
      document.getElementById('set-cpw-new').value = ''
      document.getElementById('set-cpw-con').value = ''
    }
    window.settingsChangePw = changePw
    window._settingsChangePw = changePw

    const schoolForm = isAdmin ? `
      <div class="card">
        <div class="card-top navy"></div>
        <div class="card-title"><i class="ti ti-school"></i> School information</div>
        <div class="form-row">
          <div class="form-group"><label>School name</label><input type="text" value="${s.name}"/></div>
          <div class="form-group"><label>School type</label><input type="text" value="${s.type}" readonly/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Phone</label><input type="text" value="${s.phone}"/></div>
          <div class="form-group"><label>Email</label><input type="email" value="${s.email}"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>KNEC centre no.</label><input type="text" value="${s.knceCentre}"/></div>
          <div class="form-group"><label>County</label><input type="text" value="${s.county}"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Postal address</label><input type="text" value="${s.box}"/></div>
          <div class="form-group"><label>Town</label><input type="text" value="${s.town}"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>School motto</label><input type="text" value="${s.motto}"/></div>
          <div class="form-group"><label>Current term</label>
            <select><option>Term 2 2026</option><option>Term 1 2026</option><option>Term 3 2025</option></select>
          </div>
        </div>
        <div class="btn-row" style="margin-top:0">
          <button class="btn btn-navy" onclick="toast('School info saved!','navy')"><i class="ti ti-check"></i> Save changes</button>
        </div>
        <div class="card-title mt-16 mb-8"><i class="ti ti-database"></i> Data management</div>
        <div class="btn-row" style="margin-top:0">
          <button class="btn btn-sm" onclick="toast('Backup created','navy')"><i class="ti ti-download"></i> Backup data</button>
          <button class="btn btn-sm" onclick="toast('Import ready','maroon')"><i class="ti ti-upload"></i> Import data</button>
          <button class="btn btn-sm" style="color:var(--danger-t)" onclick="toast('Action requires confirmation','maroon')"><i class="ti ti-trash"></i> Clear term data</button>
        </div>
      </div>` : `
      <div class="card">
        <div class="card-top navy"></div>
        <div class="card-title"><i class="ti ti-school"></i> School information</div>
        <div class="tbl-wrap"><table>
          <tbody>
            <tr><td>School name</td><td>${s.name}</td></tr>
            <tr><td>Type</td><td>${s.type}</td></tr>
            <tr><td>Phone</td><td>${s.phone}</td></tr>
            <tr><td>Email</td><td>${s.email}</td></tr>
            <tr><td>Address</td><td>${s.box}, ${s.town}</td></tr>
            <tr><td>County</td><td>${s.county}</td></tr>
            <tr><td>KNEC centre</td><td>${s.knceCentre}</td></tr>
            <tr><td>Motto</td><td>${s.motto}</td></tr>
          </tbody>
        </table></div>
        <div class="notice n-navy mt-12"><i class="ti ti-info-circle"></i><div>Contact the system administrator to update school information.</div></div>
      </div>`

    return `
    <div class="g2">
      ${schoolForm}
      <div class="card">
        <div class="card-top maroon"></div>
        <div class="card-title"><i class="ti ti-user-shield"></i> My account</div>
        <div class="profile-block mb-14">
          <div class="av av-xl av-n" style="border:3px solid var(--gold)">${user.initials}</div>
          <div>
            <div class="profile-name">${user.full_name}</div>
            <span class="rtag rt-ht">${user.role}</span>
            <div class="profile-meta mt-8">Username: <strong>${user.username}</strong></div>
            <div class="profile-meta">Kirimara High School — Boys Only</div>
          </div>
        </div>

        <div class="card-title mb-8" style="font-size:12px"><i class="ti ti-lock"></i> Change password</div>
        <div class="form-group mb-10">
          <label>Current password</label>
          <input type="password" id="set-cpw-old" placeholder="Current password"/>
        </div>
        <div class="form-row">
          <div class="form-group"><label>New password</label><input type="password" id="set-cpw-new" placeholder="Min. 6 characters"/></div>
          <div class="form-group"><label>Confirm new</label><input type="password" id="set-cpw-con" placeholder="Repeat new password"/></div>
        </div>
        <div class="btn-row" style="margin-top:0">
          <button class="btn btn-maroon" onclick="settingsChangePw()"><i class="ti ti-lock"></i> Update password</button>
        </div>

        <div class="card-title mt-16 mb-8" style="font-size:12px"><i class="ti ti-logout"></i> Session</div>
        <button class="btn" style="color:var(--maroon-d);border-color:var(--maroon-l)" onclick="if(confirm('Sign out?')) logout()">
          <i class="ti ti-logout" style="color:var(--maroon)"></i> Sign out of Kirimara SMS
        </button>
      </div>
    </div>`
  },
};

/* ====================================================
   GLOBAL INTERACTIVE FUNCTIONS
   ==================================================== */

/* Attendance toggle */
/* =====================================================
   GLOBAL INTERACTIVE FUNCTIONS
   All exposed on window so inline onclick= handlers work
   ===================================================== */

/* ---- Attendance toggle ---- */
function setAtt(btn, val) {
  const row = btn.closest('tr')
  row.querySelectorAll('.att-btn').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  const statusEl = row.querySelector('td:last-child')
  const map = { P:'Present', A:'Absent', L:'Late' }
  const col = { P:'var(--navy-m)', A:'var(--maroon-m)', L:'var(--gold-d)' }
  statusEl.textContent      = map[val]
  statusEl.style.color      = col[val]
  statusEl.style.fontWeight = '600'
  statusEl.style.fontSize   = '11px'
}

/* ---- Save attendance register ---- */
async function saveAttendance() {
  const today = new Date().toISOString().slice(0,10)
  const rows  = [...document.querySelectorAll('#att-register tbody tr')].map(tr => ({
    student_id: tr.querySelector('.att-btn')?.dataset.sid,
    status:     tr.querySelector('.att-btn.selected')?.textContent?.trim() || 'P'
  }))
  const res = await API.attendance.save({ date: today, marked_by: 'Teacher', records: rows })
  toast(res?.success ? 'Attendance saved!' : 'Saved locally (offline)', res?.success ? 'navy' : 'maroon')
}

/* ---- Record fee payment ---- */
async function recordPayment() {
  const adm  = document.getElementById('pay-adm')?.value.trim()
  const amt  = document.getElementById('pay-amt')?.value
  const mode = document.getElementById('pay-mode')?.value
  const ref  = document.getElementById('pay-ref')?.value.trim()
  if (!adm || !amt) { toast('Fill admission number and amount', 'maroon'); return }
  const res = await API.fees.record({ adm_no:adm, amount:amt, payment_mode:mode, transaction_ref:ref })
  if (res?.success) {
    toast('Payment recorded! Receipt: ' + (res.receipt || 'KH-' + Date.now()), 'navy')
    document.getElementById('pay-adm').value = ''
    document.getElementById('pay-amt').value = ''
    document.getElementById('pay-ref').value = ''
  } else {
    toast('Saved (offline — check DB connection)', 'maroon')
  }
}

/* ---- Post notice ---- */
async function postNotice() {
  const title = document.getElementById('ntc-title')?.value.trim()
  const body  = document.getElementById('ntc-body')?.value.trim()
  const type  = document.getElementById('ntc-type')?.value
  if (!title || !body) { toast('Fill in title and body', 'maroon'); return }
  const res = await API.notices.post({ title, body, type, icon: 'ti-bell', posted_by: 'Admin' })
  toast(res?.success ? 'Notice posted!' : 'Saved', 'navy')
  navTo('notices.html')
}

/* ---- Delete notice ---- */
async function deleteNotice(id) {
  if (!id) return
  if (!confirm('Remove this notice?')) return
  await API.notices.delete(id)
  toast('Notice removed', 'maroon')
  navTo('notices.html')
}

/* ---- Admit student modal ---- */
function showAdmit() {
  openModal('Admit New Student', `
    <div class="form-row">
      <div class="form-group"><label>First name</label><input id="admit-fname" type="text" placeholder="e.g. Brian"/></div>
      <div class="form-group"><label>Other names</label><input id="admit-oname" type="text" placeholder="e.g. Kamau Njoroge"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Form</label>
        <select id="admit-form"><option value="1">Form 1</option><option value="2">Form 2</option><option value="3">Form 3</option><option value="4">Form 4</option></select>
      </div>
      <div class="form-group"><label>Stream</label>
        <select id="admit-stream"><option>A</option><option>B</option><option>C</option><option>D</option></select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>House</label>
        <select id="admit-house"><option value="1">Kenyatta</option><option value="2">Moi</option><option value="3">Uhuru</option><option value="4">Kibaki</option></select>
      </div>
      <div class="form-group"><label>KCPE Index No.</label><input id="admit-kcpe" type="text" placeholder="e.g. 12345678"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Parent / guardian name</label><input id="admit-parent" type="text" placeholder="Full name"/></div>
      <div class="form-group"><label>Parent phone</label><input id="admit-phone" type="tel" placeholder="07XX XXX XXX"/></div>
    </div>
    <div class="form-group mb-14"><label>Home location</label><input id="admit-loc" type="text" placeholder="Town / village, County"/></div>
    <div style="font-size:11px;color:var(--text-3);margin-bottom:12px">
      <i class="ti ti-info-circle"></i> Kirimara High School admits <strong>boys only</strong>.
    </div>
    <div class="btn-row" style="margin-top:0">
      <button class="btn btn-navy" onclick="submitAdmit()"><i class="ti ti-check"></i> Admit student</button>
      <button class="btn" onclick="closeModal()">Cancel</button>
    </div>
  `)
}

/* ---- Submit admit form ---- */
async function submitAdmit() {
  const fname  = document.getElementById('admit-fname')?.value.trim()
  const oname  = document.getElementById('admit-oname')?.value.trim()
  const form   = document.getElementById('admit-form')?.value
  const stream = `${form}${document.getElementById('admit-stream')?.value}`
  const house  = document.getElementById('admit-house')?.value
  const kcpe   = document.getElementById('admit-kcpe')?.value.trim()
  const parent = document.getElementById('admit-parent')?.value.trim()
  const phone  = document.getElementById('admit-phone')?.value.trim()
  const loc    = document.getElementById('admit-loc')?.value.trim()
  if (!fname || !oname) { toast('Enter first name and other names', 'maroon'); return }
  // Generate adm no
  const adm = `K/${new Date().getFullYear()}/${String(Math.floor(Math.random()*900)+100).padStart(3,'0')}`
  const res = await API.students.create({
    adm_no: adm, first_name: fname, other_names: oname,
    form, stream, house_id: house, kcpe_index: kcpe,
    parent_name: parent, parent_phone: phone, home_location: loc
  })
  if (res?.success) {
    toast(`Student admitted! Adm No: ${adm}`, 'navy')
    closeModal()
    navTo('students.html')
  } else {
    toast('Saved locally — connect DB to persist', 'maroon')
    closeModal()
  }
}

/* ---- View student modal ---- */
function showStudent(s) {
  const name    = s.full_name || s.name || [s.first_name, s.other_names].filter(Boolean).join(' ')
  const admNo   = s.adm_no || s.id || '—'
  const initials= name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
  const house   = s.house || s.house_name || '—'
  const bal     = parseFloat(s.balance || 0)
  const fees    = feesBadge(bal <= 0 ? 'Cleared' : 'Balance', bal)

  openModal('Student Profile', `
    <div class="profile-block mb-14">
      <div class="av av-xl av-n" style="border:3px solid var(--gold)">${initials}</div>
      <div>
        <div class="profile-name">${name}</div>
        <span class="rtag rt-ht">Adm: ${admNo}</span>
        <div class="profile-meta mt-8">Form ${s.form} · Stream ${s.stream} · ${house} House</div>
        <div class="profile-meta">Kirimara High School — Boys Only</div>
      </div>
    </div>
    <div class="tbl-wrap">
      <table>
        <thead><tr><th>Field</th><th>Detail</th></tr></thead>
        <tbody>
          <tr><td>Admission no.</td><td>${admNo}</td></tr>
          <tr><td>Form</td><td>Form ${s.form}</td></tr>
          <tr><td>Stream</td><td>${s.stream}</td></tr>
          <tr><td>House</td><td>${house}</td></tr>
          <tr><td>Boarding</td><td>${s.is_boarder ? 'Boarder' : 'Day scholar'}</td></tr>
          <tr><td>Parent / guardian</td><td>${s.parent_name || '—'}</td></tr>
          <tr><td>Parent phone</td><td>${s.parent_phone || '—'}</td></tr>
          <tr><td>Home location</td><td>${s.home_location || '—'}</td></tr>
          <tr><td>Fees status</td><td>${fees}</td></tr>
          ${bal > 0 ? `<tr><td>Balance</td><td class="c-maroon fw-6">KSh ${bal.toLocaleString()}</td></tr>` : ''}
        </tbody>
      </table>
    </div>
    <div class="btn-row mt-14">
      <button class="btn btn-navy btn-sm" onclick="toast('Edit student record...','navy')"><i class="ti ti-edit"></i> Edit record</button>
      <button class="btn btn-sm" onclick="window.print()"><i class="ti ti-printer"></i> Print</button>
      <button class="btn btn-sm" onclick="closeModal()"><i class="ti ti-x"></i> Close</button>
    </div>
  `)
}

/* =====================================================
   EXPOSE ALL FUNCTIONS TO window
   Required because ES modules are scoped — onclick=
   attributes in HTML strings can only call window.*
   ===================================================== */
window.navTo          = navTo
window.toggleSidebar  = toggleSidebar
window.closeSidebar   = closeSidebar
window.closeModal     = closeModal
window.toast          = toast
window.setAtt         = setAtt
window.saveAttendance = saveAttendance
window.recordPayment  = recordPayment
window.postNotice     = postNotice
window.deleteNotice   = deleteNotice
window.showAdmit      = showAdmit
window.submitAdmit    = submitAdmit
window.showStudent    = showStudent
window.settingsChangePw = (...a) => window._settingsChangePw?.(...a)

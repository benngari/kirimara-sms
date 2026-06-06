/* =========================================
   KIRIMARA HIGH SCHOOL — API CLIENT
   Talks to PHP/MySQL backend on XAMPP
   Base URL auto-detects local vs Vercel
   ========================================= */

// When running on XAMPP: http://localhost/kirimara-sms/api
// When running via Vite dev: http://localhost/kirimara-sms/api  (proxy set in vite.config.js)
// On Vercel static build: uses /api path (PHP won't be available — falls back to static data)

const IS_LOCAL = window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1'

// Point to XAMPP htdocs copy
export const API_BASE = IS_LOCAL
  ? 'http://localhost/kirimara-sms/api'
  : '/api'  // won't work on Vercel static — see fallback below

// ---- Generic fetch wrapper ----
async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    return await res.json()
  } catch (e) {
    console.warn('[API]', path, e.message)
    return null   // caller checks for null and falls back to static DB
  }
}

// ---- API calls per module ----
export const API = {

  /* --- DASHBOARD --- */
  dashboard: () => apiFetch('/dashboard.php'),

  /* --- STUDENTS --- */
  students: {
    list:   (params = {}) => apiFetch('/students.php?' + new URLSearchParams(params)),
    get:    (id)          => apiFetch(`/students.php?id=${id}`),
    create: (data)        => apiFetch('/students.php', { method:'POST', body: JSON.stringify(data) }),
    update: (id, data)    => apiFetch(`/students.php?id=${id}`, { method:'PUT',  body: JSON.stringify(data) }),
    remove: (id)          => apiFetch(`/students.php?id=${id}`, { method:'DELETE' }),
  },

  /* --- FEES --- */
  fees: {
    payments:  ()     => apiFetch('/fees.php?action=payments'),
    structure: ()     => apiFetch('/fees.php?action=structure'),
    summary:   ()     => apiFetch('/fees.php?action=summary'),
    balance:   (adm)  => apiFetch(`/fees.php?action=balance&adm=${adm}`),
    record:    (data) => apiFetch('/fees.php', { method:'POST', body: JSON.stringify(data) }),
  },

  /* --- ATTENDANCE --- */
  attendance: {
    register: (form, stream, date) =>
      apiFetch(`/attendance.php?action=register&form=${form}&stream=${stream}&date=${date}`),
    summary:  () => apiFetch('/attendance.php?action=summary'),
    weekly:   () => apiFetch('/attendance.php?action=weekly'),
    save:     (data) => apiFetch('/attendance.php', { method:'POST', body: JSON.stringify(data) }),
  },

  /* --- STAFF --- */
  staff: {
    teachers:  ()         => apiFetch('/staff.php?type=teachers'),
    addTeacher:(data)     => apiFetch('/staff.php?type=teachers', { method:'POST', body: JSON.stringify(data) }),
    editTeacher:(id,data) => apiFetch(`/staff.php?type=teachers&id=${id}`, { method:'PUT', body: JSON.stringify(data) }),
    labtech:   ()         => apiFetch('/staff.php?type=labtech'),
    inventory: ()         => apiFetch('/staff.php?type=inventory'),
    addInv:    (data)     => apiFetch('/staff.php?type=inventory', { method:'POST', body: JSON.stringify(data) }),
    editInv:   (id, data) => apiFetch(`/staff.php?type=inventory&id=${id}`, { method:'PUT',  body: JSON.stringify(data) }),
    support:   ()         => apiFetch('/staff.php?type=support'),
    addSupport:(data)     => apiFetch('/staff.php?type=support', { method:'POST', body: JSON.stringify(data) }),
    headteacher:()        => apiFetch('/staff.php?type=headteacher'),
  },

  /* --- EXAMS --- */
  exams: {
    results: (form, stream, examId) =>
      apiFetch(`/exams.php?action=results&form=${form}&stream=${stream}&exam_id=${examId}`),
    types:  () => apiFetch('/exams.php?action=types'),
    save:   (data) => apiFetch('/exams.php?action=save', { method:'POST', body: JSON.stringify(data) }),
  },

  /* --- TIMETABLE --- */
  timetable: (form) => apiFetch(`/timetable.php?form=${form}`),

  /* --- LIBRARY --- */
  library: {
    borrowings: ()        => apiFetch('/library.php?action=borrowings'),
    stats:      ()        => apiFetch('/library.php?action=stats'),
    books:      ()        => apiFetch('/library.php?action=books'),
    issue:      (data)    => apiFetch('/library.php?action=borrowings', { method:'POST', body: JSON.stringify(data) }),
    returnBook: (id)      => apiFetch(`/library.php?action=return&id=${id}`, { method:'POST' }),
  },

  /* --- NOTICES --- */
  notices: {
    list:   ()     => apiFetch('/notices.php'),
    post:   (data) => apiFetch('/notices.php', { method:'POST',   body: JSON.stringify(data) }),
    delete: (id)   => apiFetch(`/notices.php?id=${id}`, { method:'DELETE' }),
  },
}

export default API

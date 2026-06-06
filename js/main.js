/* =========================================
   KIRIMARA HIGH SCHOOL — ENTRY POINT
   ========================================= */

import DB from './data.js'
import API from './api.js'
import { requireAuth, applyNavPermissions, renderTopbarUser, logout } from './auth.js'
import {
  calcGrade, avClass, feesBadge, statusBadge,
  invBadge, libBadge, noticeClass, ttCell, progBar,
  openModal, closeModal, toast, roleTag, subjColour
} from './helpers.js'

/* ---- Auth guard — redirects to login.html if no session ---- */
const currentUser = requireAuth()
if (!currentUser) {
  // requireAuth already redirected — stop here
  throw new Error('Not authenticated')
}

/* ---- Expose globals for onclick= handlers ---- */
window.DB          = DB
window.API         = API
window.currentUser = currentUser
window.calcGrade   = calcGrade
window.avClass     = avClass
window.feesBadge   = feesBadge
window.statusBadge = statusBadge
window.invBadge    = invBadge
window.libBadge    = libBadge
window.noticeClass = noticeClass
window.ttCell      = ttCell
window.progBar     = progBar
window.openModal   = openModal
window.closeModal  = closeModal
window.toast       = toast
window.roleTag     = roleTag
window.subjColour  = subjColour
window.logout      = logout

/* ---- Boot after DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Render user info + logout in topbar
  renderTopbarUser(currentUser)
  // Hide nav items the user's role can't access
  applyNavPermissions(currentUser)
})

/* ---- Load router last ---- */
import './router.js'

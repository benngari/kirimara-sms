/* =========================================
   KIRIMARA HIGH SCHOOL — HELPERS
   ========================================= */

/* ---- GRADE CALCULATION ---- */
function calcGrade(mean) {
  if (mean >= 80) return { g:"A",  c:"b-success" };
  if (mean >= 75) return { g:"A-", c:"b-navy" };
  if (mean >= 70) return { g:"B+", c:"b-navy" };
  if (mean >= 65) return { g:"B",  c:"b-navy" };
  if (mean >= 60) return { g:"B-", c:"b-info" };
  if (mean >= 55) return { g:"C+", c:"b-warn" };
  if (mean >= 50) return { g:"C",  c:"b-warn" };
  if (mean >= 45) return { g:"C-", c:"b-warn" };
  if (mean >= 40) return { g:"D+", c:"b-danger" };
  if (mean >= 35) return { g:"D",  c:"b-danger" };
  return { g:"D-", c:"b-danger" };
}

/* ---- AVATAR CLASS CYCLE ---- */
function avClass(i) {
  return ["av-n","av-m","av-g"][i % 3];
}

/* ---- FEES BADGE ---- */
function feesBadge(fees, balance) {
  if (fees === "Cleared") return `<span class="badge b-success">Cleared</span>`;
  if (balance > 8000)     return `<span class="badge b-danger">Bal KSh ${Number(balance).toLocaleString()}</span>`;
  return `<span class="badge b-warn">Bal KSh ${Number(balance).toLocaleString()}</span>`;
}

/* ---- STATUS BADGE ---- */
function statusBadge(s) {
  if (s === "Active")   return `<span class="badge b-success">Active</span>`;
  if (s === "On leave") return `<span class="badge b-warn">On leave</span>`;
  return `<span class="badge b-danger">${s}</span>`;
}

/* ---- INVENTORY BADGE ---- */
function invBadge(s) {
  if (s === "Good")      return `<span class="badge b-success">Good</span>`;
  if (s === "Low stock") return `<span class="badge b-warn">Low stock</span>`;
  if (s === "Critical")  return `<span class="badge b-danger">Critical</span>`;
  return `<span class="badge b-info">${s}</span>`;
}

/* ---- LIBRARY STATUS BADGE ---- */
function libBadge(s) {
  if (s === "On loan")  return `<span class="badge b-navy">On loan</span>`;
  if (s === "Overdue")  return `<span class="badge b-danger">Overdue</span>`;
  if (s === "Due soon") return `<span class="badge b-warn">Due soon</span>`;
  return `<span class="badge b-info">${s}</span>`;
}

/* ---- NOTICE CSS CLASS ---- */
function noticeClass(type) {
  return { success:"n-success", maroon:"n-maroon", navy:"n-navy", gold:"n-gold", warn:"n-warn", danger:"n-danger" }[type] || "n-navy";
}

/* ---- TIMETABLE SUBJECT PILL ---- */
const subjColour = {
  "Maths":"sp-navy","Mathematics":"sp-navy","Physics":"sp-navy",
  "Chemistry":"sp-mar","Chem Lab":"sp-mar","Biology":"sp-mar",
  "English":"sp-gold","Kiswahili":"sp-grn","CRE":"sp-grn","History":"sp-grn",
  "Agriculture":"sp-grn","Geography":"sp-pur","Business Studies":"sp-pur",
  "Games/PE":"sp-gold","Guidance":"sp-gray","Library":"sp-gray",
  "Computer Studies":"sp-navy",
};
function ttCell(subj) {
  if (subj === "BREAK") return `<td class="tt-break">— Break —</td>`;
  if (subj === "LUNCH") return `<td class="tt-break">— Lunch —</td>`;
  return `<td><span class="subj-pill ${subjColour[subj]||'sp-gray'}">${subj}</span></td>`;
}

/* ---- PROGRESS BAR ---- */
function progBar(pct, cls="") {
  return `<div class="prog"><div class="prog-fill ${cls}" style="width:${pct}%"></div></div>`;
}

/* ---- MODAL ---- */
function openModal(title, body) {
  // remove existing
  const old = document.getElementById("sms-modal");
  if (old) old.remove();
  const el = document.createElement("div");
  el.className = "modal-bg open";
  el.id = "sms-modal";
  el.innerHTML = `
    <div class="modal">
      <div class="modal-hd">
        <div class="modal-title">${title}</div>
        <button class="modal-close" onclick="closeModal()"><i class="ti ti-x"></i></button>
      </div>
      ${body}
    </div>`;
  el.addEventListener("click", e => { if (e.target === el) closeModal(); });
  document.body.appendChild(el);
}

function closeModal() {
  const m = document.getElementById("sms-modal");
  if (m) m.remove();
}

/* ---- SHOW TOAST ---- */
function toast(msg, type="navy") {
  const t = document.createElement("div");
  t.style.cssText = `position:fixed;bottom:20px;right:20px;z-index:999;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:500;box-shadow:0 4px 16px rgba(0,0,0,0.2);background:var(--${type});color:#fff;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ---- ROLE TAG MAP ---- */
const roleTagMap = {
  "Accountant":"rt-ac","Librarian":"rt-sc","Security Guard":"rt-sg",
  "School Nurse":"rt-sc","Caretaker":"rt-ct","ICT Technician":"rt-ac",
  "Driver":"rt-sg","Secretary":"rt-ac","Lab Attendant":"rt-ct",
};
function roleTag(role) {
  return `<span class="rtag ${roleTagMap[role]||'rt-ct'}">${role}</span>`;
}

export { calcGrade, avClass, feesBadge, statusBadge, invBadge, libBadge, noticeClass, ttCell, progBar, openModal, closeModal, toast, roleTag, subjColour };

# Kirimara High School — Management System

> **"God Reigns"** · Boys Only Secondary School  
> P.O Box 51-10101, Karatina · Tel: 0757 279 705

A complete school management system built with pure HTML, CSS and JavaScript.  
**No frameworks. No build step. No npm required to run.**  
Open `index.html` and it works immediately.

---

## 🚀 Quick start (3 ways)

### Option 1 — Just open the file (easiest)
Double-click `index.html` in File Explorer. Done.

### Option 2 — VS Code Live Server (recommended for editing)
1. Open VS Code
2. Install the **Live Server** extension by Ritwick Dey
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500`
5. Every time you save a file, the browser auto-refreshes ✓

### Option 3 — npm start
```bash
npm install
npm start
# Opens at http://localhost:3000
```

---

## 📁 Project structure

```
kirimara-sms/
├── index.html          ← App shell (sidebar + topbar)
├── vercel.json         ← Vercel deploy config
├── package.json        ← npm scripts (live-server)
├── .gitignore
├── README.md
│
├── css/
│   └── main.css        ← All styles: theme, layout, components
│
└── js/
    ├── data.js         ← ★ All school data lives here (edit this!)
    ├── helpers.js      ← Badge, grade, modal helper functions
    └── router.js       ← Navigation + all 13 page builders
```

---

## 📋 Modules

| Page | What it does |
|---|---|
| Dashboard | Stats, attendance chart, enrolment, fees summary, house points |
| Students | Full register (boys only), admit student modal, profile view |
| Head Teacher | HT profile, deputy HTs, admin quick actions |
| Teachers | Staff register with TSC numbers, subjects, class assignments |
| Lab Technicians | Bio/Chem/Physics/ICT lab techs, stock levels, inventory log |
| Support Staff | Accountant, nurse, librarian, security, driver, secretary etc. |
| Attendance | Interactive daily register (P/A/L), term summary by form |
| Exams & Grades | Results entry, automatic mean grade, report card generation |
| Timetable | Weekly period-by-period view with colour-coded subjects |
| Library | Book stock, borrowing records, overdue tracking |
| Fees & Finance | Payment entry (M-Pesa/Cash/Bank), receipts, fee structure |
| Notices | School circulars board — post and view announcements |
| Reports | Generate PDF reports: academic, finance, KCSE, discipline |
| Settings | School info editor, admin password, data backup |

---

## ✏️ How to edit school data

Everything editable is in **`js/data.js`**.

### Add a student
```js
// In js/data.js → DB.students array:
{ id:"K/2026/016", name:"Wanjiru Tom Mwangi", form:1, stream:"1A",
  house:"Kenyatta", fees:"Balance", balance:6000 },
```

### Add a teacher
```js
// In js/data.js → DB.teachers array:
{ name:"Mr. New Teacher", init:"NT", role:"Teacher",
  subjects:"Art & Design", classteacher:"2D",
  tsc:"0093000", phone:"0700 100 100", status:"Active" },
```

### Change fees
```js
// In js/data.js → DB.feesStructure array:
{ item:"Tuition fee", f1:10000, f23:10000, f4:10000 },
```

### Add a notice
```js
// In js/data.js → DB.notices array:
{ date:"10 Jun 2026", type:"navy", icon:"ti-bell",
  title:"Sports Day", body:"Inter-house games on Saturday 20 June." },
```
Notice types: `"navy"` `"maroon"` `"gold"` `"success"` `"warn"` `"danger"`

---

## 🎨 Change the colour theme

All colours are CSS variables in `css/main.css` under `:root { }`:

```css
:root {
  --navy:    #0C2D6B;   /* Primary blue */
  --maroon:  #6B0C2D;   /* School maroon */
  --gold:    #C49A2A;   /* Accent gold */
}
```
Change those three values and the entire system re-themes.

---

## 🌐 Deploy to Vercel (free, 2 minutes)

### Method A — Vercel CLI
```bash
# Install Vercel CLI once
npm install -g vercel

# In your project folder:
vercel

# Follow prompts:
# - Set up project? Y
# - Project name: kirimara-sms
# - In which directory? ./
# - Override settings? N

# Deploy to production:
vercel --prod
```
Your site will be live at: `https://kirimara-sms.vercel.app`

### Method B — GitHub + Vercel dashboard (easiest)
1. Push to GitHub:
```bash
git init
git add .
git commit -m "Kirimara High School SMS v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kirimara-sms.git
git push -u origin main
```
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — done in 30 seconds ✓

Every time you `git push`, Vercel auto-redeploys.

---

## 📤 Deploy to GitHub Pages (alternative free hosting)

```bash
# Push to GitHub (as above), then:
# Repo Settings → Pages → Source: main branch / root
# Live at: https://YOUR_USERNAME.github.io/kirimara-sms/
```

---

## 🔧 Add a new page

**Step 1** — Add nav link in `index.html`:
```html
<a class="nav-link" data-page="mypage.html">
  <i class="ti ti-star"></i><span>My Page</span>
</a>
```

**Step 2** — Add page title in `js/router.js` `PAGE_TITLES` object:
```js
"mypage.html": "My Page",
```

**Step 3** — Add page builder in `js/router.js` `PAGES` object:
```js
"mypage.html"() {
  return `
    <div class="card">
      <div class="card-title"><i class="ti ti-star"></i> My Page</div>
      <p>Content here</p>
    </div>`;
},
```

---

## 🔌 Connect to a real database (future)

Currently all data is in `js/data.js` (static). To connect to a backend:

**Firebase Firestore** (free tier):
```js
// Replace DB.students with:
const snap = await getDocs(collection(db, "students"));
const students = snap.docs.map(d => d.data());
```

**Any REST API**:
```js
const res = await fetch("https://your-api.com/students");
const students = await res.json();
```

---

## 📱 Responsive

| Screen | Layout |
|---|---|
| Desktop ≥1100px | Full sidebar + 4-col stats |
| Tablet 768–1100px | 2-col grids, condensed bar |
| Mobile <768px | Hamburger menu, sidebar overlay, 1-col |

---

## 🖨️ Print support

Press `Ctrl+P` (or `Cmd+P`) — sidebar and buttons are hidden, tables and cards print cleanly.

---

**Kirimara High School · Boys Only · Karatina, Nyeri County · God Reigns**

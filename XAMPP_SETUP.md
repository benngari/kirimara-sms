# Running Kirimara SMS on XAMPP (Local Database)

## What you need
- XAMPP installed (includes Apache + MySQL + PHP)
- Node.js (for `npm run dev`)

---

## Step 1 — Start XAMPP

Open XAMPP Control Panel and click **Start** for:
- ✅ **Apache**
- ✅ **MySQL**

---

## Step 2 — Import the database

### Option A — phpMyAdmin (easiest)
1. Open your browser → go to `http://localhost/phpmyadmin`
2. Click **New** on the left sidebar
3. Database name: `kirimara_sms` → click **Create**
4. Click the new `kirimara_sms` database
5. Click the **Import** tab at the top
6. Click **Choose File** → select `database/kirimara_sms.sql`
7. Click **Go** at the bottom

### Option B — MySQL terminal
```bash
mysql -u root -p < database/kirimara_sms.sql
# (press Enter when asked for password — XAMPP default is empty)
```

---

## Step 3 — Copy project to htdocs

Copy the entire `kirimara-sms` folder into your XAMPP htdocs:

| OS      | htdocs path                              |
|---------|------------------------------------------|
| Windows | `C:\xampp\htdocs\kirimara-sms\`         |
| Mac     | `/Applications/XAMPP/htdocs/kirimara-sms/` |
| Linux   | `/opt/lampp/htdocs/kirimara-sms/`       |

Your API will then be at:
```
http://localhost/kirimara-sms/api/dashboard.php
```

---

## Step 4 — Run the frontend

In the `kirimara-sms` folder, open a terminal:
```bash
npm install      # first time only
npm run dev      # starts at http://localhost:3000
```

The app auto-detects `localhost` and calls `http://localhost/kirimara-sms/api/...`

---

## Step 5 — Verify it's working

Open `http://localhost:3000` in your browser.

- ✅ Dashboard shows **live student counts** from the database
- ✅ Students page shows **all 15 boys** from MySQL
- ✅ Attendance saves to the database on **Save register**
- ✅ Fee payment form records to MySQL

If you see data — it's working! If it falls back to demo data, check:
1. Apache and MySQL are running in XAMPP
2. The folder is in htdocs as `kirimara-sms`
3. `api/config.php` has the right DB password (default: empty)

---

## Database password

If your MySQL has a password, edit `api/config.php` line 8:
```php
define('DB_PASS', 'your_password_here');
```

---

## API endpoints (for testing / Postman)

| Endpoint | Method | Description |
|---|---|---|
| `/api/dashboard.php` | GET | All dashboard stats |
| `/api/students.php` | GET | All students |
| `/api/students.php?form=4` | GET | Filter by form |
| `/api/students.php` | POST | Admit new student |
| `/api/students.php?id=1` | PUT | Update student |
| `/api/fees.php?action=payments` | GET | Recent payments |
| `/api/fees.php?action=summary` | GET | Fees by form |
| `/api/fees.php` | POST | Record payment |
| `/api/attendance.php?action=register&form=4&stream=4A&date=2026-06-03` | GET | Daily register |
| `/api/attendance.php` | POST | Save register |
| `/api/staff.php?type=teachers` | GET | All teachers |
| `/api/staff.php?type=labtech` | GET | Lab technicians |
| `/api/staff.php?type=inventory` | GET | Lab inventory |
| `/api/staff.php?type=support` | GET | Support staff |
| `/api/staff.php?type=headteacher` | GET | Head teacher profile |
| `/api/exams.php?action=results&form=4&stream=4A&exam_id=1` | GET | Exam results |
| `/api/library.php?action=stats` | GET | Library stats |
| `/api/library.php?action=borrowings` | GET | Active borrowings |
| `/api/notices.php` | GET | All notices |
| `/api/notices.php` | POST | Post new notice |
| `/api/timetable.php?form=4A` | GET | Timetable grid |

---

## Deploying to Vercel (after XAMPP testing)

The frontend (HTML/CSS/JS) deploys to Vercel fine.
The PHP API needs a PHP host — options:

| Option | Free? | Notes |
|---|---|---|
| **InfinityFree** | ✅ Free | PHP + MySQL hosting, connect API there |
| **Railway** | ✅ Free tier | Deploy PHP backend separately |
| **Hostinger** | Paid | Full PHP + MySQL hosting |

For full production: deploy PHP API to a PHP host, then update `API_BASE` in `js/api.js` to point to that URL.

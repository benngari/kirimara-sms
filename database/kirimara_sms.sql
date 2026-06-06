-- =====================================================
-- KIRIMARA HIGH SCHOOL — DATABASE SCHEMA
-- Boys Only Secondary School · Karatina
-- Import this into phpMyAdmin or run in MySQL terminal:
--   mysql -u root -p < database/kirimara_sms.sql
-- =====================================================

CREATE DATABASE IF NOT EXISTS kirimara_sms
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE kirimara_sms;

-- =====================================================
-- SCHOOL SETTINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  setting_key  VARCHAR(100) NOT NULL UNIQUE,
  setting_val  TEXT,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO settings (setting_key, setting_val) VALUES
  ('school_name',    'Kirimara High School'),
  ('school_type',    'Boys Only'),
  ('po_box',         'P.O Box 51-10101'),
  ('town',           'Karatina'),
  ('county',         'Nyeri'),
  ('phone',          '0757 279 705'),
  ('email',          'info@kirimara.sc.ke'),
  ('website',        'www.kirimara.sc.ke'),
  ('motto',          'God Reigns'),
  ('knec_centre',    'KHK-042'),
  ('current_term',   'Term 2'),
  ('current_year',   '2026'),
  ('admin_user',     'Mr. J. Mwangi');

-- =====================================================
-- HOUSES
-- =====================================================
CREATE TABLE IF NOT EXISTS houses (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(50) NOT NULL,
  master     VARCHAR(100),
  colour     VARCHAR(50),
  points     INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO houses (name, master, colour, points) VALUES
  ('Kenyatta', 'Mr. Kariuki J.', 'Navy Blue', 342),
  ('Moi',      'Mr. Otieno S.',  'Maroon',    318),
  ('Uhuru',    'Mr. Mutua D.',   'Green',     305),
  ('Kibaki',   'Mrs. Weru A.',   'Gold',      289);

-- =====================================================
-- STUDENTS (Boys Only)
-- =====================================================
CREATE TABLE IF NOT EXISTS students (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  adm_no          VARCHAR(20) NOT NULL UNIQUE,
  first_name      VARCHAR(60) NOT NULL,
  other_names     VARCHAR(100),
  form            TINYINT NOT NULL CHECK (form BETWEEN 1 AND 4),
  stream          VARCHAR(10) NOT NULL,
  house_id        INT,
  is_boarder      TINYINT(1) DEFAULT 1,
  kcpe_index      VARCHAR(20),
  kcpe_marks      SMALLINT,
  dob             DATE,
  parent_name     VARCHAR(100),
  parent_phone    VARCHAR(20),
  home_location   VARCHAR(100),
  date_admitted   DATE DEFAULT (CURRENT_DATE),
  status          ENUM('Active','Left','Expelled','Completed') DEFAULT 'Active',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (house_id) REFERENCES houses(id)
);

INSERT INTO students (adm_no, first_name, other_names, form, stream, house_id, is_boarder, parent_name, parent_phone, home_location, date_admitted) VALUES
  ('K/2026/001', 'Brian',    'Kamau Njoroge',    4, '4A', 1, 1, 'Mr. Njoroge K.',   '0722 111 001', 'Karatina, Nyeri',     '2023-01-09'),
  ('K/2026/002', 'David',    'Mwangi Kariuki',   4, '4B', 2, 1, 'Mrs. Kariuki W.',  '0733 111 002', 'Mukurweini, Nyeri',   '2023-01-09'),
  ('K/2026/003', 'Samuel',   'Ochieng',          4, '4A', 3, 0, 'Mr. Ochieng P.',   '0712 111 003', 'Mathira, Nyeri',      '2023-01-09'),
  ('K/2026/004', 'James',    'Mutura Gitau',     4, '4C', 1, 1, 'Mr. Gitau M.',     '0745 111 004', 'Othaya, Nyeri',       '2023-01-09'),
  ('K/2026/005', 'Peter',    'Njoroge Maina',    3, '3A', 2, 1, 'Mr. Maina N.',     '0714 111 005', 'Tetu, Nyeri',         '2024-01-08'),
  ('K/2026/006', 'Allan',    'Kiprotich',        3, '3B', 3, 0, 'Mr. Kiprotich R.', '0722 111 006', 'Karatina, Nyeri',     '2024-01-08'),
  ('K/2026/007', 'Stephen',  'Waweru Ndungu',    3, '3A', 1, 1, 'Mrs. Ndungu S.',   '0700 111 007', 'Mukurweini, Nyeri',   '2024-01-08'),
  ('K/2026/008', 'Mark',     'Otieno Collins',   3, '3C', 2, 1, 'Mr. Otieno F.',    '0711 111 008', 'Mathira, Nyeri',      '2024-01-08'),
  ('K/2026/009', 'Joseph',   'Kariuki Mwathi',   2, '2A', 3, 1, 'Mr. Mwathi J.',    '0733 111 009', 'Nyeri Town',          '2025-01-06'),
  ('K/2026/010', 'Dennis',   'Mutua Kioko',      2, '2B', 1, 0, 'Mrs. Kioko D.',    '0722 111 010', 'Othaya, Nyeri',       '2025-01-06'),
  ('K/2026/011', 'Emmanuel', 'Ngugi Wainaina',   2, '2A', 2, 1, 'Mr. Wainaina E.',  '0712 111 011', 'Tetu, Nyeri',         '2025-01-06'),
  ('K/2026/012', 'Kevin',    'Maina Mugo',       1, '1A', 3, 1, 'Mr. Mugo K.',      '0745 111 012', 'Karatina, Nyeri',     '2026-01-05'),
  ('K/2026/013', 'Victor',   'Kimani Njagi',     1, '1B', 1, 1, 'Mrs. Njagi V.',    '0700 111 013', 'Mukurweini, Nyeri',   '2026-01-05'),
  ('K/2026/014', 'Felix',    'Odhiambo Otieno',  1, '1A', 2, 0, 'Mr. Otieno A.',    '0711 111 014', 'Nyeri Town',          '2026-01-05'),
  ('K/2026/015', 'Collins',  'Mwenda Muriuki',   4, '4A', 3, 1, 'Mr. Muriuki C.',   '0733 111 015', 'Mathira, Nyeri',      '2023-01-09');

-- =====================================================
-- FEES
-- =====================================================
CREATE TABLE IF NOT EXISTS fees_structure (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  item     VARCHAR(100) NOT NULL,
  form1    DECIMAL(10,2) DEFAULT 0,
  form23   DECIMAL(10,2) DEFAULT 0,
  form4    DECIMAL(10,2) DEFAULT 0,
  term     VARCHAR(20) DEFAULT 'Term 2',
  year     YEAR DEFAULT 2026
);

INSERT INTO fees_structure (item, form1, form23, form4) VALUES
  ('Tuition fee',        9000,  9000,  9000),
  ('Boarding / meals',   12000, 12000, 12000),
  ('Activity / sports',  1500,  1500,  1500),
  ('Lab / practical',    500,   500,   1000),
  ('KCSE registration',  0,     0,     1500);

CREATE TABLE IF NOT EXISTS fee_payments (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  student_id   INT NOT NULL,
  amount       DECIMAL(10,2) NOT NULL,
  payment_mode ENUM('M-Pesa','Cash','Bank deposit','Cheque') NOT NULL,
  receipt_no   VARCHAR(50),
  transaction_ref VARCHAR(50),
  term         VARCHAR(20) DEFAULT 'Term 2',
  year         YEAR DEFAULT 2026,
  notes        TEXT,
  recorded_by  VARCHAR(100),
  payment_date DATE DEFAULT (CURRENT_DATE),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO fee_payments (student_id, amount, payment_mode, receipt_no, transaction_ref, payment_date, recorded_by) VALUES
  (1,  15000, 'M-Pesa',       'KH-2026-8801', 'QGF3K8P1', '2026-05-31', 'Mr. Njoroge'),
  (15, 20000, 'Bank deposit', 'KH-2026-8800', 'TXN-00820', '2026-05-30', 'Mr. Njoroge'),
  (3,  10000, 'M-Pesa',       'KH-2026-8798', 'QGF3K8P2', '2026-05-29', 'Mr. Njoroge'),
  (4,  8000,  'Cash',         'KH-2026-8796', NULL,        '2026-05-28', 'Mr. Njoroge'),
  (11, 12000, 'M-Pesa',       'KH-2026-8790', 'QGF3K8P3', '2026-05-27', 'Mr. Njoroge');

-- =====================================================
-- STAFF — HEAD TEACHER
-- =====================================================
CREATE TABLE IF NOT EXISTS headteacher (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  initials      VARCHAR(5),
  tsc_no        VARCHAR(20),
  qualification TEXT,
  phone         VARCHAR(20),
  email         VARCHAR(100),
  year_joined   YEAR,
  office        VARCHAR(50),
  allowance     DECIMAL(10,2),
  employment    VARCHAR(50) DEFAULT 'Permanent & Pensionable'
);

INSERT INTO headteacher (full_name, initials, tsc_no, qualification, phone, email, year_joined, office, allowance) VALUES
  ('Mr. Peter Muthee', 'PM', '0041872',
   'B.Ed (Maths/Physics), M.Ed Admin — University of Nairobi',
   '0722 415 800', 'peter.muthee@kirimara.sc.ke', 2014, 'Block A — Room 01', 9800.00);

CREATE TABLE IF NOT EXISTS deputy_headteachers (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(100) NOT NULL,
  role       VARCHAR(60),
  tsc_no     VARCHAR(20),
  phone      VARCHAR(20)
);

INSERT INTO deputy_headteachers (full_name, role, tsc_no, phone) VALUES
  ('Mrs. Rose Kariuki', 'DHT Academics',  '0045621', '0733 211 900'),
  ('Mr. Cyrus Ngugi',   'DHT Discipline', '0048830', '0712 333 012');

-- =====================================================
-- TEACHERS
-- =====================================================
CREATE TABLE IF NOT EXISTS teachers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  initials      VARCHAR(5),
  role          VARCHAR(60) DEFAULT 'Teacher',
  subjects      VARCHAR(150),
  class_teacher VARCHAR(10),
  tsc_no        VARCHAR(20),
  phone         VARCHAR(20),
  email         VARCHAR(100),
  qualification VARCHAR(150),
  status        ENUM('Active','On leave','Inactive') DEFAULT 'Active',
  date_joined   DATE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO teachers (full_name, initials, role, subjects, class_teacher, tsc_no, phone, status) VALUES
  ('Mr. John Kariuki',   'JK', 'Teacher / HOD', 'Mathematics',      '4A', '0091234', '0722 001 001', 'Active'),
  ('Mr. Samuel Otieno',  'SO', 'Teacher / HOD', 'Chemistry',        '4C', '0091445', '0733 002 002', 'Active'),
  ('Mr. Mark Ochieng',   'MO', 'Teacher',       'Physics',          '4B', '0091788', '0712 003 003', 'Active'),
  ('Mr. Daniel Mutua',   'DM', 'Teacher',       'History / CRE',    '1D', '0091630', '0745 004 004', 'On leave'),
  ('Mr. Paul Kariuki',   'PK', 'Teacher / HOD', 'History',          '3D', '0091910', '0714 005 005', 'Active'),
  ('Mr. Tom Wanjiku',    'TW', 'Teacher',       'English Language', '3B', '0092100', '0722 006 006', 'Active'),
  ('Mr. Brian Mugo',     'BM', 'Teacher',       'Kiswahili',        '3A', '0092200', '0700 007 007', 'Active'),
  ('Ms. Ann Weru',       'AW', 'Teacher / HOD', 'Geography',        '2B', '0091850', '0733 008 008', 'Active'),
  ('Mr. Eric Mwangi',    'EM', 'Teacher',       'Biology',          '2A', '0092050', '0711 009 009', 'Active'),
  ('Mr. James Njoroge',  'JN', 'Teacher',       'Business Studies', '1A', '0092300', '0712 010 010', 'Active'),
  ('Mr. George Kamau',   'GK', 'Teacher',       'Computer Studies', '2C', '0092400', '0722 011 011', 'Active'),
  ('Mr. Kevin Maina',    'KM', 'Teacher',       'Agriculture',      '1B', '0092500', '0700 012 012', 'Active');

-- =====================================================
-- LAB TECHNICIANS
-- =====================================================
CREATE TABLE IF NOT EXISTS lab_technicians (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(100) NOT NULL,
  initials   VARCHAR(5),
  lab        VARCHAR(50),
  rooms      VARCHAR(100),
  phone      VARCHAR(20),
  email      VARCHAR(100),
  stock_pct  TINYINT DEFAULT 100,
  stock_note VARCHAR(150),
  status     ENUM('Active','On leave','Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO lab_technicians (full_name, initials, lab, rooms, phone, email, stock_pct, stock_note) VALUES
  ('Mr. James Maina',   'JM', 'Biology',   'Bio Lab 1 & 2',  '0722 100 200', 'j.maina@kirimara.sc.ke',   72, ''),
  ('Mr. Kevin Kiragu',  'KK', 'Chemistry', 'Chem Lab 1 & 2', '0733 200 300', 'k.kiragu@kirimara.sc.ke',  55, 'Needs restock'),
  ('Mr. Peter Onyango', 'PO', 'Physics',   'Physics Lab',    '0712 300 400', 'p.onyango@kirimara.sc.ke', 88, ''),
  ('Mr. Dennis Waweru', 'DW', 'ICT',       'ICT Lab 1',      '0745 400 500', 'd.waweru@kirimara.sc.ke',  91, '');

-- =====================================================
-- LAB INVENTORY
-- =====================================================
CREATE TABLE IF NOT EXISTS lab_inventory (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  item        VARCHAR(100) NOT NULL,
  lab         VARCHAR(50),
  quantity    INT DEFAULT 0,
  unit        VARCHAR(20) DEFAULT 'pcs',
  status      ENUM('Good','Low stock','Critical','Out of stock') DEFAULT 'Good',
  last_checked DATE,
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO lab_inventory (item, lab, quantity, unit, status, last_checked) VALUES
  ('Bunsen burners',         'Chemistry', 24,  'pcs', 'Good',      '2026-05-28'),
  ('Microscopes',            'Biology',   30,  'pcs', 'Good',      '2026-05-26'),
  ('Hydrochloric Acid (5L)', 'Chemistry', 3,   'btl', 'Low stock', '2026-05-30'),
  ('Voltmeters',             'Physics',   18,  'pcs', 'Good',      '2026-05-29'),
  ("Benedict's solution",    'Biology',   2,   'btl', 'Critical',  '2026-05-31'),
  ('Retort stands',          'Chemistry', 20,  'pcs', 'Good',      '2026-05-25'),
  ('Glass slides (box)',     'Biology',   8,   'box', 'Good',      '2026-05-20'),
  ('Ammeters DC',            'Physics',   12,  'pcs', 'Good',      '2026-05-22'),
  ('Desktop computers',      'ICT',       40,  'pcs', 'Good',      '2026-06-01'),
  ('Ethanol (500ml)',        'Chemistry', 4,   'btl', 'Low stock', '2026-05-31');

-- =====================================================
-- SUPPORT STAFF
-- =====================================================
CREATE TABLE IF NOT EXISTS support_staff (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(100) NOT NULL,
  initials        VARCHAR(5),
  role            VARCHAR(60),
  department      VARCHAR(60),
  employment_type ENUM('Permanent','Contract') DEFAULT 'Permanent',
  phone           VARCHAR(20),
  email           VARCHAR(100),
  status          ENUM('Active','On leave','Inactive') DEFAULT 'Active',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO support_staff (full_name, initials, role, department, employment_type, phone, email) VALUES
  ('Mr. Bernard Njoroge', 'BN', 'Accountant',    'Finance',     'Permanent', '0714 001 001', 'b.njoroge@kirimara.sc.ke'),
  ('Mr. Collins Mwai',    'CM', 'Librarian',     'Library',     'Permanent', '0722 002 002', 'c.mwai@kirimara.sc.ke'),
  ('Mr. Robert Kamau',    'RK', 'Security Guard','Security',    'Contract',  '0733 003 003', ''),
  ('Mr. Martin Otieno',   'MO', 'Security Guard','Security',    'Contract',  '0734 003 004', ''),
  ('Mr. Thomas Ndungu',   'TN', 'Caretaker',     'Maintenance', 'Contract',  '0745 005 005', ''),
  ('Mr. Dennis Wangari',  'DW', 'ICT Technician','ICT Lab',     'Permanent', '0700 006 006', 'd.wangari@kirimara.sc.ke'),
  ('Mr. Hassan Musa',     'HM', 'Driver',        'Transport',   'Permanent', '0723 007 007', ''),
  ('Mr. Felix Njiru',     'FN', 'Secretary',     'Admin',       'Permanent', '0711 008 008', 'f.njiru@kirimara.sc.ke'),
  ('Mrs. Joyce Achieng',  'JA', 'School Nurse',  'Medical',     'Permanent', '0712 004 004', 'j.achieng@kirimara.sc.ke'),
  ('Mr. Stephen Mutua',   'SM', 'Lab Attendant', 'Science',     'Contract',  '0700 009 009', '');

-- =====================================================
-- ATTENDANCE
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  att_date   DATE NOT NULL,
  status     ENUM('P','A','L') DEFAULT 'P' COMMENT 'P=Present A=Absent L=Late',
  term       VARCHAR(20) DEFAULT 'Term 2',
  year       YEAR DEFAULT 2026,
  marked_by  VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_att (student_id, att_date),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO attendance (student_id, att_date, status, marked_by) VALUES
  (1,  '2026-06-03', 'P', 'Mr. Kariuki'),
  (2,  '2026-06-03', 'P', 'Mr. Kariuki'),
  (3,  '2026-06-03', 'A', 'Mr. Kariuki'),
  (4,  '2026-06-03', 'L', 'Mr. Kariuki'),
  (15, '2026-06-03', 'P', 'Mr. Kariuki'),
  (5,  '2026-06-03', 'P', 'Mr. Kariuki'),
  (6,  '2026-06-03', 'P', 'Mr. Kariuki'),
  (7,  '2026-06-03', 'A', 'Mr. Kariuki');

-- =====================================================
-- EXAMS & GRADES
-- =====================================================
CREATE TABLE IF NOT EXISTS exam_types (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(60) NOT NULL,
  term       VARCHAR(20),
  year       YEAR DEFAULT 2026,
  form       TINYINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO exam_types (name, term, year, form) VALUES
  ('Mid-term',  'Term 2', 2026, NULL),
  ('End-term',  'Term 1', 2026, NULL),
  ('KCSE Mock', 'Term 2', 2026, 4);

CREATE TABLE IF NOT EXISTS exam_results (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  student_id    INT NOT NULL,
  exam_type_id  INT NOT NULL,
  subject       VARCHAR(60) NOT NULL,
  marks         TINYINT NOT NULL CHECK (marks BETWEEN 0 AND 100),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_result (student_id, exam_type_id, subject),
  FOREIGN KEY (student_id)   REFERENCES students(id),
  FOREIGN KEY (exam_type_id) REFERENCES exam_types(id)
);

-- Form 4A mid-term results
INSERT INTO exam_results (student_id, exam_type_id, subject, marks) VALUES
  -- Brian Kamau (id=1)
  (1,1,'Mathematics',78),(1,1,'English',74),(1,1,'Kiswahili',72),
  (1,1,'Biology',82),(1,1,'Chemistry',79),(1,1,'Physics',75),(1,1,'History',68),
  -- David Mwangi (id=2)
  (2,1,'Mathematics',65),(2,1,'English',71),(2,1,'Kiswahili',68),
  (2,1,'Biology',70),(2,1,'Chemistry',63),(2,1,'Physics',60),(2,1,'History',74),
  -- Samuel Ochieng (id=3)
  (3,1,'Mathematics',88),(3,1,'English',80),(3,1,'Kiswahili',76),
  (3,1,'Biology',90),(3,1,'Chemistry',85),(3,1,'Physics',89),(3,1,'History',82),
  -- James Mutura (id=4)
  (4,1,'Mathematics',55),(4,1,'English',62),(4,1,'Kiswahili',60),
  (4,1,'Biology',58),(4,1,'Chemistry',50),(4,1,'Physics',48),(4,1,'History',65),
  -- Collins Mwenda (id=15)
  (15,1,'Mathematics',91),(15,1,'English',85),(15,1,'Kiswahili',82),
  (15,1,'Biology',88),(15,1,'Chemistry',90),(15,1,'Physics',87),(15,1,'History',80),
  -- Peter Njoroge (id=5)
  (5,1,'Mathematics',72),(5,1,'English',68),(5,1,'Kiswahili',70),
  (5,1,'Biology',75),(5,1,'Chemistry',71),(5,1,'Physics',69),(5,1,'History',73);

-- =====================================================
-- TIMETABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS timetable (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  form       VARCHAR(10) NOT NULL,
  day_name   ENUM('Monday','Tuesday','Wednesday','Thursday','Friday') NOT NULL,
  period_no  TINYINT NOT NULL,
  period_time VARCHAR(20),
  subject    VARCHAR(50),
  teacher_id INT,
  room       VARCHAR(30),
  FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

-- Form 4A timetable
INSERT INTO timetable (form, day_name, period_no, period_time, subject, teacher_id) VALUES
  ('4A','Monday',    1,'7:30-8:30',  'Mathematics', 1),
  ('4A','Monday',    2,'8:30-9:30',  'English',     6),
  ('4A','Monday',    3,'9:30-10:30', 'Chemistry',   2),
  ('4A','Monday',    4,'11:00-12:00','Physics',     3),
  ('4A','Monday',    5,'12:00-1:00', 'Kiswahili',   7),
  ('4A','Monday',    6,'2:00-3:00',  'History',     5),
  ('4A','Monday',    7,'3:00-4:00',  'Geography',   8),
  ('4A','Tuesday',   1,'7:30-8:30',  'Biology',     9),
  ('4A','Tuesday',   2,'8:30-9:30',  'Mathematics', 1),
  ('4A','Tuesday',   3,'9:30-10:30', 'Physics',     3),
  ('4A','Tuesday',   4,'11:00-12:00','English',     6),
  ('4A','Tuesday',   5,'12:00-1:00', 'Kiswahili',   7),
  ('4A','Tuesday',   6,'2:00-3:00',  'Geography',   8),
  ('4A','Tuesday',   7,'3:00-4:00',  'History',     5),
  ('4A','Wednesday', 1,'7:30-8:30',  'Mathematics', 1),
  ('4A','Wednesday', 2,'8:30-9:30',  'English',     6),
  ('4A','Wednesday', 3,'9:30-10:30', 'Chemistry',   2),
  ('4A','Wednesday', 4,'11:00-12:00','Kiswahili',   7),
  ('4A','Wednesday', 5,'12:00-1:00', 'Biology',     9),
  ('4A','Wednesday', 6,'2:00-3:00',  'Library',     NULL),
  ('4A','Wednesday', 7,'3:00-4:00',  'Chem Lab',    2),
  ('4A','Thursday',  1,'7:30-8:30',  'History',     5),
  ('4A','Thursday',  2,'8:30-9:30',  'Mathematics', 1),
  ('4A','Thursday',  3,'9:30-10:30', 'English',     6),
  ('4A','Thursday',  4,'11:00-12:00','Chemistry',   2),
  ('4A','Thursday',  5,'12:00-1:00', 'Geography',   8),
  ('4A','Thursday',  6,'2:00-3:00',  'Biology',     9),
  ('4A','Thursday',  7,'3:00-4:00',  'Games/PE',    NULL),
  ('4A','Friday',    1,'7:30-8:30',  'Biology',     9),
  ('4A','Friday',    2,'8:30-9:30',  'CRE',         5),
  ('4A','Friday',    3,'9:30-10:30', 'Physics',     3),
  ('4A','Friday',    4,'11:00-12:00','Mathematics', 1),
  ('4A','Friday',    5,'12:00-1:00', 'Biology',     9),
  ('4A','Friday',    6,'2:00-3:00',  'Games/PE',    NULL),
  ('4A','Friday',    7,'3:00-4:00',  'Guidance',    NULL);

-- =====================================================
-- LIBRARY
-- =====================================================
CREATE TABLE IF NOT EXISTS books (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  author       VARCHAR(100),
  subject      VARCHAR(60),
  isbn         VARCHAR(20),
  copies_total INT DEFAULT 1,
  copies_available INT DEFAULT 1,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (title, author, subject, copies_total, copies_available) VALUES
  ('KCSE Revision Chemistry',    'KLB',         'Chemistry',  5, 4),
  ('Advanced Mathematics F4',   'KLB',         'Maths',      4, 3),
  ('KCSE Biology Topical',       'Longhorn',    'Biology',    6, 5),
  ('Oxford English Grammar',     'Oxford UP',   'English',    8, 7),
  ('Kenya Geography Form 3',     'Longhorn',    'Geography',  5, 4),
  ('History of East Africa',     'East African','History',    4, 3),
  ('Kiswahili Kwa Shule F4',     'KLB',         'Kiswahili',  6, 6),
  ('Physics for KCSE',           'KLB',         'Physics',    5, 5);

CREATE TABLE IF NOT EXISTS book_borrowings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  book_id     INT NOT NULL,
  student_id  INT NOT NULL,
  issue_date  DATE NOT NULL,
  due_date    DATE NOT NULL,
  return_date DATE,
  status      ENUM('On loan','Returned','Overdue') DEFAULT 'On loan',
  issued_by   VARCHAR(100),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id)    REFERENCES books(id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO book_borrowings (book_id, student_id, issue_date, due_date, status, issued_by) VALUES
  (1, 1,  '2026-05-25', '2026-06-08', 'On loan',  'Mr. Mwai'),
  (2, 15, '2026-05-20', '2026-06-03', 'Overdue',  'Mr. Mwai'),
  (3, 4,  '2026-05-28', '2026-06-11', 'On loan',  'Mr. Mwai'),
  (4, 5,  '2026-05-22', '2026-06-05', 'On loan',  'Mr. Mwai'),
  (5, 3,  '2026-05-18', '2026-06-01', 'Overdue',  'Mr. Mwai'),
  (6, 2,  '2026-05-26', '2026-06-09', 'On loan',  'Mr. Mwai');

-- =====================================================
-- NOTICES
-- =====================================================
CREATE TABLE IF NOT EXISTS notices (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  title      VARCHAR(150) NOT NULL,
  body       TEXT NOT NULL,
  type       ENUM('navy','maroon','gold','success','warn','danger') DEFAULT 'navy',
  icon       VARCHAR(50) DEFAULT 'ti-bell',
  posted_by  VARCHAR(100),
  notice_date DATE DEFAULT (CURRENT_DATE),
  is_active  TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notices (title, body, type, icon, posted_by, notice_date) VALUES
  ('Mathematics Quiz Champions!',
   'Kirimara wins the regional inter-school mathematics competition. Congratulations to the Form 4 team led by Mwenda Collins.',
   'success', 'ti-trophy', 'Head Teacher', '2026-06-03'),
  ('Fees Clearance Notice',
   'All students must clear outstanding fee balances by 6 June 2026 to sit KCSE mock examinations. Contact the accounts office — Mr. Njoroge.',
   'maroon', 'ti-alert-triangle', 'Mr. Njoroge', '2026-05-30'),
  ('Staff Meeting — 4 June',
   'All teaching and non-teaching staff to attend a mandatory meeting on Wednesday 4 June at 4:00 PM in the staffroom. Agenda: mid-year review & KCSE preparation.',
   'navy', 'ti-calendar-event', 'Head Teacher', '2026-05-28'),
  ('New Library Books Available',
   'New KCSE revision books across all subjects are now available. Each student may borrow up to 3 books for 2 weeks.',
   'navy', 'ti-book', 'Mr. Mwai', '2026-05-27'),
  ('Chemistry Lab Rescheduled',
   'Form 3 Chemistry practical sessions rescheduled to Thursdays 3-5 PM starting 5 June due to reagent restocking.',
   'gold', 'ti-flask', 'Mr. Kiragu', '2026-05-25'),
  ('Games Day — 20 June',
   'Inter-house games day scheduled for Saturday 20 June 2026. All boys to participate. Games master Mr. Ochieng to circulate full programme.',
   'navy', 'ti-shirt', 'Head Teacher', '2026-05-15');

-- =====================================================
-- ADMIN USERS (for login)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  username     VARCHAR(50) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
  full_name    VARCHAR(100),
  role         ENUM(
                 'admin',
                 'principal',
                 'deputy_academic',
                 'deputy_discipline',
                 'teacher',
                 'class_teacher',
                 'hod',
                 'bursar',
                 'accountant',
                 'labtech',
                 'librarian',
                 'nurse',
                 'ict'
               ) DEFAULT 'teacher',
  is_active    TINYINT(1) DEFAULT 1,
  last_login   TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DEFAULT USERS — All passwords are role+2026
-- e.g. principal password = principal2026
-- =====================================================
-- Bcrypt hashes generated with PASSWORD_BCRYPT cost 10
-- principal2026    = $2y$10$dZfKOqaWQaFqIQIXwO7C7.LqS3rLHJHJHXSP1MXzLYFLFnr3aEQVq
-- deputy2026       = $2y$10$V8lXF7Z1rZ5lQjlQjKq8KuKv8vJTJ6lVBOcLPFqFvBi0SjGTAnCb2
-- teacher2026      = $2y$10$WkJHL3x2Jd4PQvV5JE1rHOovvwCTLcY.a.ik5VQ1UJJHfH3ZKyJna
-- bursar2026       = $2y$10$XzNpOqR7mY3lS4tU5vW6aOv6i4NkRmHbQcPdSeYfZgAhBiCjDkElF
-- labtech2026      = $2y$10$YAqBrCsD1tE2uF3vG4wH5OiKjLmMnNoOpPqQrRsStTuUvVwWxXyYz
-- librarian2026    = $2y$10$ZBrCsDtE2uF3vG4wH5xI6OjKlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
-- admin2026        = $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO admin_users (username, password, full_name, role) VALUES
  -- System admin
  ('admin',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. J. Mwangi',     'admin'),
  -- Principal (Head Teacher)
  ('principal',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Peter Muthee',  'principal'),
  -- DHT Academic
  ('dht_acad',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mrs. Rose Kariuki', 'deputy_academic'),
  -- DHT Discipline
  ('dht_disc',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Cyrus Ngugi',   'deputy_discipline'),
  -- Bursar
  ('bursar',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Bernard Njoroge','bursar'),
  -- Teachers
  ('jkariuki',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. John Kariuki',  'hod'),
  ('sotieno',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Samuel Otieno', 'hod'),
  ('mochieng',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Mark Ochieng',  'teacher'),
  ('twanjiku',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Tom Wanjiku',   'class_teacher'),
  ('bmugo',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Brian Mugo',    'class_teacher'),
  -- Lab Technicians
  ('jmaina_lab', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. James Maina',   'labtech'),
  ('kkiragu',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Kevin Kiragu',  'labtech'),
  ('ponyango',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Peter Onyango', 'labtech'),
  -- Librarian
  ('cmwai',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Collins Mwai',  'librarian'),
  -- Nurse
  ('jachieng',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mrs. Joyce Achieng','nurse'),
  -- ICT
  ('dwangari',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mr. Dennis Wangari','ict');

-- =====================================================
-- USEFUL VIEWS
-- =====================================================

-- Student fees balance view
CREATE OR REPLACE VIEW student_fee_balance AS
SELECT
  s.id,
  s.adm_no,
  CONCAT(s.first_name, ' ', s.other_names) AS full_name,
  s.form,
  s.stream,
  COALESCE(SUM(p.amount), 0) AS total_paid,
  CASE s.form
    WHEN 4 THEN (SELECT SUM(form4)  FROM fees_structure)
    WHEN 1 THEN (SELECT SUM(form1)  FROM fees_structure)
    ELSE         (SELECT SUM(form23) FROM fees_structure)
  END AS total_expected,
  CASE s.form
    WHEN 4 THEN (SELECT SUM(form4)  FROM fees_structure)
    WHEN 1 THEN (SELECT SUM(form1)  FROM fees_structure)
    ELSE         (SELECT SUM(form23) FROM fees_structure)
  END - COALESCE(SUM(p.amount), 0) AS balance
FROM students s
LEFT JOIN fee_payments p ON p.student_id = s.id
  AND p.term = (SELECT setting_val FROM settings WHERE setting_key = 'current_term')
  AND p.year = (SELECT setting_val FROM settings WHERE setting_key = 'current_year')
WHERE s.status = 'Active'
GROUP BY s.id;

-- Attendance summary view
CREATE OR REPLACE VIEW attendance_summary AS
SELECT
  s.form,
  s.stream,
  a.att_date,
  COUNT(CASE WHEN a.status = 'P' THEN 1 END) AS present,
  COUNT(CASE WHEN a.status = 'A' THEN 1 END) AS absent,
  COUNT(CASE WHEN a.status = 'L' THEN 1 END) AS late,
  COUNT(*) AS total
FROM attendance a
JOIN students s ON s.id = a.student_id
GROUP BY s.form, s.stream, a.att_date;

-- Exam results with student names
CREATE OR REPLACE VIEW exam_results_view AS
SELECT
  CONCAT(s.first_name, ' ', s.other_names) AS student_name,
  s.adm_no,
  s.form,
  s.stream,
  et.name AS exam_name,
  er.subject,
  er.marks
FROM exam_results er
JOIN students s       ON s.id = er.student_id
JOIN exam_types et    ON et.id = er.exam_type_id;

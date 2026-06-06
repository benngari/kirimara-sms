/* =========================================
   KIRIMARA HIGH SCHOOL — DATA STORE
   Boys Only Secondary School · Karatina
   Edit this file to update school records
   ========================================= */

const DB = {

  school: {
    name:        "Kirimara High School",
    type:        "Boys Only",
    box:         "P.O Box 51-10101",
    town:        "Karatina",
    county:      "Nyeri",
    phone:       "0757 279 705",
    email:       "info@kirimara.sc.ke",
    website:     "www.kirimara.sc.ke",
    motto:       "God Reigns",
    knceCentre:  "KHK-042",
    term:        "Term 2",
    year:        2026,
    adminUser:   "Mr. J. Mwangi",
  },

  /* ---- STUDENTS (Boys only) ---- */
  students: [
    { id:"K/2026/001", name:"Kamau Brian Njoroge",    form:4, stream:"4A", house:"Kenyatta", fees:"Cleared",  balance:0 },
    { id:"K/2026/002", name:"Mwangi David Kariuki",   form:4, stream:"4B", house:"Moi",      fees:"Balance",  balance:4500 },
    { id:"K/2026/003", name:"Ochieng Samuel",         form:4, stream:"4A", house:"Uhuru",    fees:"Cleared",  balance:0 },
    { id:"K/2026/004", name:"Mutura James Gitau",     form:4, stream:"4C", house:"Kenyatta", fees:"Balance",  balance:12000 },
    { id:"K/2026/005", name:"Njoroge Peter Maina",    form:3, stream:"3A", house:"Moi",      fees:"Cleared",  balance:0 },
    { id:"K/2026/006", name:"Kiprotich Allan",        form:3, stream:"3B", house:"Uhuru",    fees:"Balance",  balance:3200 },
    { id:"K/2026/007", name:"Waweru Stephen Ndung'u", form:3, stream:"3A", house:"Kenyatta", fees:"Cleared",  balance:0 },
    { id:"K/2026/008", name:"Otieno Mark Collins",    form:3, stream:"3C", house:"Moi",      fees:"Balance",  balance:5500 },
    { id:"K/2026/009", name:"Kariuki Joseph Mwathi",  form:2, stream:"2A", house:"Uhuru",    fees:"Cleared",  balance:0 },
    { id:"K/2026/010", name:"Mutua Dennis Kioko",     form:2, stream:"2B", house:"Kenyatta", fees:"Balance",  balance:7000 },
    { id:"K/2026/011", name:"Ngugi Emmanuel Wainaina",form:2, stream:"2A", house:"Moi",      fees:"Cleared",  balance:0 },
    { id:"K/2026/012", name:"Maina Kevin Mugo",       form:1, stream:"1A", house:"Uhuru",    fees:"Balance",  balance:6000 },
    { id:"K/2026/013", name:"Kimani Victor Njagi",    form:1, stream:"1B", house:"Kenyatta", fees:"Cleared",  balance:0 },
    { id:"K/2026/014", name:"Odhiambo Felix Otieno",  form:1, stream:"1A", house:"Moi",      fees:"Balance",  balance:2500 },
    { id:"K/2026/015", name:"Mwenda Collins Muriuki", form:4, stream:"4A", house:"Uhuru",    fees:"Cleared",  balance:0 },
  ],

  enrolment: [
    { form:1, total:214, streams:4, prefects:2, boarders:140, dayScholars:74 },
    { form:2, total:206, streams:4, prefects:2, boarders:135, dayScholars:71 },
    { form:3, total:209, streams:4, prefects:2, boarders:138, dayScholars:71 },
    { form:4, total:213, streams:4, prefects:2, boarders:142, dayScholars:71 },
  ],

  houses: [
    { name:"Kenyatta", master:"Mr. Kariuki J.", captain:"Kamau Brian (F4)", colour:"Navy Blue",  points:342 },
    { name:"Moi",      master:"Mr. Otieno S.", captain:"Njoroge Peter (F3)", colour:"Maroon",   points:318 },
    { name:"Uhuru",    master:"Mr. Mutua D.", captain:"Waweru Stephen (F3)", colour:"Green",    points:305 },
    { name:"Kibaki",   master:"Mrs. Weru A.", captain:"Mwenda Collins (F4)", colour:"Gold",     points:289 },
  ],

  /* ---- HEAD TEACHER ---- */
  headteacher: {
    name:         "Mr. Peter Muthee",
    initials:     "PM",
    tsc:          "0041872",
    qualification:"B.Ed (Maths/Physics), M.Ed Admin — University of Nairobi",
    phone:        "0722 415 800",
    email:        "peter.muthee@kirimara.sc.ke",
    joined:       2014,
    office:       "Block A — Room 01",
    allowance:    "KSh 9,800/month",
    employment:   "Permanent & Pensionable",
    deputies: [
      { name:"Mrs. Rose Kariuki", role:"DHT Academics",  phone:"0733 211 900", tsc:"0045621" },
      { name:"Mr. Cyrus Ngugi",   role:"DHT Discipline", phone:"0712 333 012", tsc:"0048830" },
    ]
  },

  /* ---- TEACHERS ---- */
  teachers: [
    { name:"Mr. John Kariuki",    init:"JK", role:"Teacher / HOD", subjects:"Mathematics",     classteacher:"4A", tsc:"0091234", phone:"0722 001 001", status:"Active" },
    { name:"Mr. Samuel Otieno",   init:"SO", role:"Teacher / HOD", subjects:"Chemistry",       classteacher:"4C", tsc:"0091445", phone:"0733 002 002", status:"Active" },
    { name:"Mr. Mark Ochieng",    init:"MO", role:"Teacher",       subjects:"Physics",         classteacher:"4B", tsc:"0091788", phone:"0712 003 003", status:"Active" },
    { name:"Mr. Daniel Mutua",    init:"DM", role:"Teacher",       subjects:"History / CRE",   classteacher:"1D", tsc:"0091630", phone:"0745 004 004", status:"On leave" },
    { name:"Mr. Paul Kariuki",    init:"PK", role:"Teacher / HOD", subjects:"History",         classteacher:"3D", tsc:"0091910", phone:"0714 005 005", status:"Active" },
    { name:"Mr. Tom Wanjiku",     init:"TW", role:"Teacher",       subjects:"English Language", classteacher:"3B", tsc:"0092100", phone:"0722 006 006", status:"Active" },
    { name:"Mr. Brian Mugo",      init:"BM", role:"Teacher",       subjects:"Kiswahili",       classteacher:"3A", tsc:"0092200", phone:"0700 007 007", status:"Active" },
    { name:"Ms. Ann Weru",        init:"AW", role:"Teacher / HOD", subjects:"Geography",       classteacher:"2B", tsc:"0091850", phone:"0733 008 008", status:"Active" },
    { name:"Mr. Eric Mwangi",     init:"EM", role:"Teacher",       subjects:"Biology",         classteacher:"2A", tsc:"0092050", phone:"0711 009 009", status:"Active" },
    { name:"Mr. James Njoroge",   init:"JN", role:"Teacher",       subjects:"Business Studies",classteacher:"1A", tsc:"0092300", phone:"0712 010 010", status:"Active" },
    { name:"Mr. George Kamau",    init:"GK", role:"Teacher",       subjects:"Computer Studies",classteacher:"2C", tsc:"0092400", phone:"0722 011 011", status:"Active" },
    { name:"Mr. Kevin Maina",     init:"KM", role:"Teacher",       subjects:"Agriculture",     classteacher:"1B", tsc:"0092500", phone:"0700 012 012", status:"Active" },
  ],

  /* ---- LAB TECHNICIANS ---- */
  labtech: [
    { name:"Mr. James Maina",    init:"JM", lab:"Biology",   rooms:"Bio Lab 1 & 2",    phone:"0722 100 200", email:"j.maina@kirimara.sc.ke",    stock:72, stockNote:"" },
    { name:"Mr. Kevin Kiragu",   init:"KK", lab:"Chemistry", rooms:"Chem Lab 1 & 2",   phone:"0733 200 300", email:"k.kiragu@kirimara.sc.ke",   stock:55, stockNote:"Needs restock" },
    { name:"Mr. Peter Onyango",  init:"PO", lab:"Physics",   rooms:"Physics Lab",      phone:"0712 300 400", email:"p.onyango@kirimara.sc.ke",  stock:88, stockNote:"" },
    { name:"Mr. Dennis Waweru",  init:"DW", lab:"ICT",       rooms:"ICT Lab 1",        phone:"0745 400 500", email:"d.waweru@kirimara.sc.ke",   stock:91, stockNote:"" },
  ],

  inventory: [
    { item:"Bunsen burners",         lab:"Chemistry", qty:24, status:"Good",      checked:"28 May 2026" },
    { item:"Microscopes",            lab:"Biology",   qty:30, status:"Good",      checked:"26 May 2026" },
    { item:"Hydrochloric Acid (5L)", lab:"Chemistry", qty:3,  status:"Low stock", checked:"30 May 2026" },
    { item:"Voltmeters",             lab:"Physics",   qty:18, status:"Good",      checked:"29 May 2026" },
    { item:"Benedict's solution",    lab:"Biology",   qty:2,  status:"Critical",  checked:"31 May 2026" },
    { item:"Retort stands",          lab:"Chemistry", qty:20, status:"Good",      checked:"25 May 2026" },
    { item:"Glass slides (box)",     lab:"Biology",   qty:8,  status:"Good",      checked:"20 May 2026" },
    { item:"Ammeters DC",            lab:"Physics",   qty:12, status:"Good",      checked:"22 May 2026" },
    { item:"Desktop computers",      lab:"ICT",       qty:40, status:"Good",      checked:"1 Jun 2026" },
    { item:"Ethanol (500ml)",        lab:"Chemistry", qty:4,  status:"Low stock", checked:"31 May 2026" },
  ],

  /* ---- SUPPORT STAFF ---- */
  support: [
    { name:"Mr. Bernard Njoroge",  init:"BN", role:"Accountant",    dept:"Finance",     type:"Permanent", phone:"0714 001 001", email:"b.njoroge@kirimara.sc.ke" },
    { name:"Mr. Collins Mwai",     init:"CM", role:"Librarian",     dept:"Library",     type:"Permanent", phone:"0722 002 002", email:"c.mwai@kirimara.sc.ke" },
    { name:"Mr. Robert Kamau",     init:"RK", role:"Security Guard",dept:"Security",    type:"Contract",  phone:"0733 003 003", email:"" },
    { name:"Mr. Martin Otieno",    init:"MO", role:"Security Guard",dept:"Security",    type:"Contract",  phone:"0734 003 004", email:"" },
    { name:"Mr. Thomas Ndung'u",   init:"TN", role:"Caretaker",     dept:"Maintenance", type:"Contract",  phone:"0745 005 005", email:"" },
    { name:"Mr. Dennis Wangari",   init:"DW", role:"ICT Technician",dept:"ICT Lab",     type:"Permanent", phone:"0700 006 006", email:"d.wangari@kirimara.sc.ke" },
    { name:"Mr. Hassan Musa",      init:"HM", role:"Driver",        dept:"Transport",   type:"Permanent", phone:"0723 007 007", email:"" },
    { name:"Mr. Felix Njiru",      init:"FN", role:"Secretary",     dept:"Admin",       type:"Permanent", phone:"0711 008 008", email:"f.njiru@kirimara.sc.ke" },
    { name:"Mrs. Joyce Achieng",   init:"JA", role:"School Nurse",  dept:"Medical",     type:"Permanent", phone:"0712 004 004", email:"j.achieng@kirimara.sc.ke" },
    { name:"Mr. Stephen Mutua",    init:"SM", role:"Lab Attendant", dept:"Science",     type:"Contract",  phone:"0700 009 009", email:"" },
  ],

  /* ---- ATTENDANCE ---- */
  attendanceReg: [
    { name:"Kamau Brian Njoroge",    id:"K/2026/001", status:"P" },
    { name:"Mwangi David Kariuki",   id:"K/2026/002", status:"P" },
    { name:"Ochieng Samuel",         id:"K/2026/003", status:"A" },
    { name:"Mutura James Gitau",     id:"K/2026/004", status:"L" },
    { name:"Mwenda Collins Muriuki", id:"K/2026/015", status:"P" },
    { name:"Njoroge Peter Maina",    id:"K/2026/005", status:"P" },
    { name:"Kiprotich Allan",        id:"K/2026/006", status:"P" },
    { name:"Waweru Stephen Ndung'u", id:"K/2026/007", status:"A" },
  ],

  attendanceSummary: [
    { form:"Form 1", present:204, absent:10, late:3, pct:95 },
    { form:"Form 2", present:198, absent:8,  late:2, pct:96 },
    { form:"Form 3", present:202, absent:7,  late:4, pct:97 },
    { form:"Form 4", present:206, absent:7,  late:1, pct:97 },
  ],

  weeklyAtt: [
    { day:"Mon", pct:97 }, { day:"Tue", pct:95 },
    { day:"Wed", pct:96 }, { day:"Thu", pct:97 }, { day:"Fri", pct:96 },
  ],

  /* ---- EXAM RESULTS Form 4A ---- */
  examResults: [
    { name:"Kamau Brian",    maths:78, eng:74, kisw:72, bio:82, chem:79, phys:75, hist:68 },
    { name:"Mwangi David",   maths:65, eng:71, kisw:68, bio:70, chem:63, phys:60, hist:74 },
    { name:"Ochieng Samuel", maths:88, eng:80, kisw:76, bio:90, chem:85, phys:89, hist:82 },
    { name:"Mutura James",   maths:55, eng:62, kisw:60, bio:58, chem:50, phys:48, hist:65 },
    { name:"Mwenda Collins", maths:91, eng:85, kisw:82, bio:88, chem:90, phys:87, hist:80 },
    { name:"Njoroge Peter",  maths:72, eng:68, kisw:70, bio:75, chem:71, phys:69, hist:73 },
  ],

  /* ---- TIMETABLE Form 4A ---- */
  timetable: {
    periods: ["7:30–8:30","8:30–9:30","9:30–10:30","10:30–11:00","11:00–12:00","12:00–1:00","1:00–2:00","2:00–3:00","3:00–4:00"],
    days:    ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    slots: [
      ["Maths",    "Biology",   "Maths",      "History",  "Biology"  ],
      ["English",  "Maths",     "English",    "Maths",    "CRE"      ],
      ["Chemistry","Physics",   "Chemistry",  "English",  "Physics"  ],
      ["BREAK",    "BREAK",     "BREAK",      "BREAK",    "BREAK"    ],
      ["Physics",  "English",   "Kiswahili",  "Chemistry","Maths"    ],
      ["Kiswahili","Kiswahili", "Biology",    "Geography","Biology"  ],
      ["LUNCH",    "LUNCH",     "LUNCH",      "LUNCH",    "LUNCH"    ],
      ["History",  "Geography", "Library",    "Biology",  "Games/PE" ],
      ["Geography","History",   "Chem Lab",   "Games/PE", "Guidance" ],
    ]
  },

  /* ---- LIBRARY ---- */
  library: {
    total:4820, onLoan:312, overdue:38, available:4508,
    borrowings: [
      { student:"Kamau Brian",    adm:"K/2026/001", title:"KCSE Revision Chemistry",   subj:"Chemistry", issued:"25 May", due:"8 Jun",  status:"On loan" },
      { student:"Mwenda Collins", adm:"K/2026/015", title:"Advanced Mathematics F4",   subj:"Maths",     issued:"20 May", due:"3 Jun",  status:"Overdue" },
      { student:"Mutura James",   adm:"K/2026/004", title:"KCSE Biology Topical",      subj:"Biology",   issued:"28 May", due:"11 Jun", status:"On loan" },
      { student:"Njoroge Peter",  adm:"K/2026/005", title:"Oxford English Grammar",    subj:"English",   issued:"22 May", due:"5 Jun",  status:"Due soon" },
      { student:"Ochieng Samuel", adm:"K/2026/003", title:"Kenya Geography Form 3",    subj:"Geography", issued:"18 May", due:"1 Jun",  status:"Overdue" },
      { student:"Mwangi David",   adm:"K/2026/002", title:"History of East Africa",    subj:"History",   issued:"26 May", due:"9 Jun",  status:"On loan" },
    ]
  },

  /* ---- FEES ---- */
  feesStructure: [
    { item:"Tuition fee",        f1:9000,  f23:9000,  f4:9000  },
    { item:"Boarding / meals",   f1:12000, f23:12000, f4:12000 },
    { item:"Activity / sports",  f1:1500,  f23:1500,  f4:1500  },
    { item:"Lab / practical",    f1:500,   f23:500,   f4:1000  },
    { item:"KCSE registration",  f1:0,     f23:0,     f4:1500  },
  ],

  feesCollection: [
    { form:"Form 1", expected:642000, paid:510000 },
    { form:"Form 2", expected:618000, paid:490000 },
    { form:"Form 3", expected:627000, paid:500000 },
    { form:"Form 4", expected:639000, paid:520000 },
  ],

  recentPayments: [
    { student:"Kamau B.",  adm:"K/2026/001", amount:15000, mode:"M-Pesa",       date:"31 May 2026", receipt:"KH-2026-8801" },
    { student:"Mwenda C.", adm:"K/2026/015", amount:20000, mode:"Bank deposit", date:"30 May 2026", receipt:"KH-2026-8800" },
    { student:"Ochieng S.",adm:"K/2026/003", amount:10000, mode:"M-Pesa",       date:"29 May 2026", receipt:"KH-2026-8798" },
    { student:"Mutura J.", adm:"K/2026/004", amount:8000,  mode:"Cash",         date:"28 May 2026", receipt:"KH-2026-8796" },
    { student:"Ngugi E.",  adm:"K/2026/011", amount:12000, mode:"M-Pesa",       date:"27 May 2026", receipt:"KH-2026-8790" },
  ],

  /* ---- NOTICES ---- */
  notices: [
    { date:"3 Jun 2026",  type:"success", icon:"ti-trophy",          title:"Mathematics Quiz Champions!", body:"Kirimara wins the regional inter-school mathematics competition. Congratulations to the Form 4 team led by Mwenda Collins." },
    { date:"30 May 2026", type:"maroon",  icon:"ti-alert-triangle",   title:"Fees Clearance Notice", body:"All students must clear outstanding fee balances by 6 June 2026 to sit KCSE mock examinations. Contact the accounts office — Mr. Njoroge." },
    { date:"28 May 2026", type:"navy",    icon:"ti-calendar-event",   title:"Staff Meeting — 4 June", body:"All teaching and non-teaching staff to attend a mandatory meeting on Wednesday 4 June at 4:00 PM in the staffroom. Agenda: mid-year review & KCSE preparation." },
    { date:"27 May 2026", type:"navy",    icon:"ti-book",             title:"New Library Books Available", body:"New KCSE revision books across all subjects are now available. Each student may borrow up to 3 books for 2 weeks." },
    { date:"25 May 2026", type:"gold",    icon:"ti-flask",            title:"Chemistry Lab Rescheduled", body:"Form 3 Chemistry practical sessions rescheduled to Thursdays 3–5 PM starting 5 June due to reagent restocking." },
    { date:"20 May 2026", type:"success", icon:"ti-check",            title:"Mid-term Results Out", body:"Mid-term examination results for all forms are now processed. Class teachers should collect printed result slips from the office." },
    { date:"15 May 2026", type:"navy",    icon:"ti-shirt",            title:"Games Day — 20 June", body:"Inter-house games day scheduled for Saturday 20 June 2026. All boys to participate. Games master Mr. Ochieng to circulate full programme." },
  ],
};

export default DB;

<?php
require_once 'config.php';
$db = getDB();

// Total students by form
$enrolment = $db->query("
    SELECT form,
           COUNT(*) AS total,
           SUM(is_boarder)       AS boarders,
           SUM(1-is_boarder)     AS day_scholars,
           COUNT(DISTINCT stream)AS streams
    FROM students WHERE status='Active'
    GROUP BY form ORDER BY form")->fetchAll();

// Total staff counts
$teacherCount = $db->query("SELECT COUNT(*) AS c FROM teachers WHERE status='Active'")->fetch()['c'];
$supportCount = $db->query("SELECT COUNT(*) AS c FROM support_staff WHERE status='Active'")->fetch()['c'];
$labtechCount = $db->query("SELECT COUNT(*) AS c FROM lab_technicians WHERE status='Active'")->fetch()['c'];

// Fees collection summary
$feesSummary = $db->query("
    SELECT
      SUM(CASE form WHEN 4 THEN (SELECT SUM(form4) FROM fees_structure)
                    WHEN 1 THEN (SELECT SUM(form1) FROM fees_structure)
                    ELSE (SELECT SUM(form23) FROM fees_structure) END) AS total_expected,
      COALESCE(SUM(p.amount),0) AS total_collected
    FROM students s
    LEFT JOIN fee_payments p ON p.student_id = s.id
    WHERE s.status = 'Active'")->fetch();

$pct = $feesSummary['total_expected'] > 0
     ? round($feesSummary['total_collected'] / $feesSummary['total_expected'] * 100, 1)
     : 0;

// Today's attendance
$today = $db->query("
    SELECT
      COUNT(CASE WHEN a.status='P' THEN 1 END) AS present,
      COUNT(CASE WHEN a.status='A' THEN 1 END) AS absent,
      COUNT(*) AS total
    FROM attendance a WHERE a.att_date = CURDATE()")->fetch();

$attPct = ($today['total'] > 0)
        ? round($today['present'] / $today['total'] * 100, 1)
        : 0;

// Weekly attendance
$weekly = $db->query("
    SELECT DATE_FORMAT(att_date,'%a') AS day,
           ROUND(COUNT(CASE WHEN status='P' THEN 1 END)*100.0/NULLIF(COUNT(*),0),1) AS pct
    FROM attendance
    WHERE att_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY att_date
    ORDER BY att_date LIMIT 5")->fetchAll();

// Fees per form
$feesPerForm = $db->query("
    SELECT s.form,
           COALESCE(SUM(p.amount),0) AS paid,
           SUM(CASE s.form WHEN 4 THEN (SELECT SUM(form4) FROM fees_structure)
                           WHEN 1 THEN (SELECT SUM(form1) FROM fees_structure)
                           ELSE (SELECT SUM(form23) FROM fees_structure) END) AS expected
    FROM students s
    LEFT JOIN fee_payments p ON p.student_id = s.id
    WHERE s.status='Active'
    GROUP BY s.form ORDER BY s.form")->fetchAll();

// House points
$houses = $db->query("
    SELECT h.name, h.master, h.colour, h.points,
      (SELECT CONCAT(s.first_name,' ',s.other_names,'  (F',s.form,')')
       FROM students s WHERE s.house_id=h.id ORDER BY s.form DESC LIMIT 1) AS captain
    FROM houses h ORDER BY h.points DESC")->fetchAll();

// Notices (top 4)
$notices = $db->query("
    SELECT * FROM notices WHERE is_active=1
    ORDER BY notice_date DESC LIMIT 4")->fetchAll();

jsonResponse([
    'enrolment'      => $enrolment,
    'staff'          => ['teachers' => $teacherCount, 'support' => $supportCount, 'labtech' => $labtechCount],
    'fees'           => ['collected' => $feesSummary['total_collected'], 'expected' => $feesSummary['total_expected'], 'pct' => $pct],
    'fees_per_form'  => $feesPerForm,
    'attendance'     => ['present' => $today['present'] ?? 0, 'absent' => $today['absent'] ?? 0, 'pct' => $attPct],
    'weekly_att'     => $weekly,
    'houses'         => $houses,
    'notices'        => $notices,
]);

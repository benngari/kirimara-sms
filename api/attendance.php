<?php
require_once 'config.php';
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'register';

switch ($action) {

    // ---- GET daily register for a form/stream ----
    case 'register':
        $form   = $_GET['form']   ?? '4';
        $stream = $_GET['stream'] ?? '4A';
        $date   = $_GET['date']   ?? date('Y-m-d');
        $stmt   = $db->prepare("
            SELECT s.id, s.adm_no,
                   CONCAT(s.first_name,' ',s.other_names) AS full_name,
                   COALESCE(a.status, 'P') AS status
            FROM students s
            LEFT JOIN attendance a
              ON a.student_id = s.id AND a.att_date = ?
            WHERE s.form = ? AND s.stream = ? AND s.status = 'Active'
            ORDER BY s.first_name");
        $stmt->execute([$date, $form, $stream]);
        jsonResponse($stmt->fetchAll());

    // ---- GET summary by form (for term overview) ----
    case 'summary':
        $stmt = $db->query("
            SELECT s.form,
                   COUNT(CASE WHEN a.status='P' THEN 1 END) AS present,
                   COUNT(CASE WHEN a.status='A' THEN 1 END) AS absent,
                   COUNT(CASE WHEN a.status='L' THEN 1 END) AS late,
                   ROUND(
                     COUNT(CASE WHEN a.status='P' THEN 1 END) * 100.0 / NULLIF(COUNT(*),0)
                   ,1) AS pct
            FROM attendance a
            JOIN students s ON s.id = a.student_id
            WHERE a.att_date = CURDATE()
            GROUP BY s.form
            ORDER BY s.form");
        jsonResponse($stmt->fetchAll());

    // ---- GET weekly stats ----
    case 'weekly':
        $stmt = $db->query("
            SELECT DATE_FORMAT(a.att_date,'%a') AS day_name,
                   a.att_date,
                   ROUND(
                     COUNT(CASE WHEN a.status='P' THEN 1 END)*100.0/NULLIF(COUNT(*),0)
                   ,1) AS pct
            FROM attendance a
            WHERE a.att_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY a.att_date
            ORDER BY a.att_date
            LIMIT 5");
        jsonResponse($stmt->fetchAll());

    default:
        // ---- POST — save register (array of {student_id, status}) ----
        if ($method === 'POST') {
            $d    = getBody();
            $date = $d['date'] ?? date('Y-m-d');
            $by   = $d['marked_by'] ?? 'Teacher';
            $rows = $d['records']   ?? [];

            if (empty($rows)) jsonResponse(['error' => 'No records'], 400);

            $stmt = $db->prepare("
                INSERT INTO attendance (student_id, att_date, status, marked_by)
                VALUES (?,?,?,?)
                ON DUPLICATE KEY UPDATE status=VALUES(status), marked_by=VALUES(marked_by)");

            $db->beginTransaction();
            foreach ($rows as $r) {
                $stmt->execute([$r['student_id'], $date, $r['status'], $by]);
            }
            $db->commit();
            jsonResponse(['success' => true, 'saved' => count($rows)]);
        }
        jsonResponse(['error' => 'Unknown action'], 400);
}

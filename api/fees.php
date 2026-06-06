<?php
require_once 'config.php';
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'payments';

switch ($action) {

    // ---- GET recent payments ----
    case 'payments':
        $stmt = $db->query("
            SELECT p.id, p.receipt_no, p.amount, p.payment_mode,
                   p.transaction_ref, p.payment_date, p.term, p.year,
                   CONCAT(s.first_name,' ',s.other_names) AS student_name,
                   s.adm_no, s.form
            FROM fee_payments p
            JOIN students s ON s.id = p.student_id
            ORDER BY p.created_at DESC
            LIMIT 50");
        jsonResponse($stmt->fetchAll());

    // ---- GET fee structure ----
    case 'structure':
        $stmt = $db->query("SELECT * FROM fees_structure ORDER BY id");
        jsonResponse($stmt->fetchAll());

    // ---- GET student balance ----
    case 'balance':
        $adm = $_GET['adm'] ?? '';
        $stmt = $db->prepare("
            SELECT * FROM student_fee_balance WHERE adm_no = ?");
        $stmt->execute([$adm]);
        $row = $stmt->fetch();
        if (!$row) jsonResponse(['error' => 'Student not found'], 404);
        jsonResponse($row);

    // ---- GET collection summary by form ----
    case 'summary':
        $stmt = $db->query("
            SELECT s.form,
                   COUNT(DISTINCT s.id) AS students,
                   SUM(CASE s.form WHEN 4 THEN (SELECT SUM(form4) FROM fees_structure)
                                   WHEN 1 THEN (SELECT SUM(form1) FROM fees_structure)
                                   ELSE (SELECT SUM(form23) FROM fees_structure) END) AS expected,
                   COALESCE(SUM(p.amount),0) AS collected
            FROM students s
            LEFT JOIN fee_payments p ON p.student_id = s.id
              AND p.term = (SELECT setting_val FROM settings WHERE setting_key='current_term')
              AND p.year = (SELECT setting_val FROM settings WHERE setting_key='current_year')
            WHERE s.status = 'Active'
            GROUP BY s.form
            ORDER BY s.form");
        jsonResponse($stmt->fetchAll());

    default:
        // ---- POST — record payment ----
        if ($method === 'POST') {
            $d = getBody();
            // look up student by adm_no
            $s = $db->prepare("SELECT id FROM students WHERE adm_no = ?");
            $s->execute([$d['adm_no'] ?? '']);
            $stu = $s->fetch();
            if (!$stu) jsonResponse(['error' => 'Student not found'], 404);

            $stmt = $db->prepare("
                INSERT INTO fee_payments
                  (student_id, amount, payment_mode, receipt_no,
                   transaction_ref, term, year, notes, recorded_by, payment_date)
                VALUES (?,?,?,?,?,?,?,?,?,?)");
            $stmt->execute([
                $stu['id'],
                $d['amount']          ?? 0,
                $d['payment_mode']    ?? 'Cash',
                $d['receipt_no']      ?? 'KH-' . date('Y') . '-' . rand(1000,9999),
                $d['transaction_ref'] ?? null,
                $d['term']            ?? 'Term 2',
                $d['year']            ?? 2026,
                $d['notes']           ?? null,
                $d['recorded_by']     ?? 'Admin',
                $d['payment_date']    ?? date('Y-m-d'),
            ]);
            jsonResponse(['success' => true, 'receipt' => 'KH-' . date('Y') . '-' . $db->lastInsertId()], 201);
        }
        jsonResponse(['error' => 'Unknown action'], 400);
}

<?php
require_once 'config.php';
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {

    // ---- GET all students or one by id ----
    case 'GET':
        if ($id) {
            $stmt = $db->prepare("
                SELECT s.*, h.name AS house_name,
                       CONCAT(s.first_name,' ',s.other_names) AS full_name
                FROM students s
                LEFT JOIN houses h ON h.id = s.house_id
                WHERE s.id = ?");
            $stmt->execute([$id]);
            $row = $stmt->fetch();
            if (!$row) jsonResponse(['error' => 'Student not found'], 404);
            jsonResponse($row);
        }

        $form   = isset($_GET['form'])   ? (int)$_GET['form']   : null;
        $stream = isset($_GET['stream']) ? $_GET['stream']       : null;
        $search = isset($_GET['q'])      ? '%'.$_GET['q'].'%'   : null;

        $sql    = "SELECT s.id, s.adm_no,
                          CONCAT(s.first_name,' ',s.other_names) AS full_name,
                          s.form, s.stream, s.is_boarder,
                          s.parent_phone, s.home_location, s.status,
                          h.name AS house,
                          COALESCE(b.balance,0) AS balance,
                          CASE WHEN COALESCE(b.balance,0)<=0 THEN 'Cleared' ELSE 'Balance' END AS fees_status
                   FROM students s
                   LEFT JOIN houses h ON h.id = s.house_id
                   LEFT JOIN student_fee_balance b ON b.id = s.id
                   WHERE s.status = 'Active'";
        $params = [];

        if ($form)   { $sql .= " AND s.form = ?";   $params[] = $form; }
        if ($stream) { $sql .= " AND s.stream = ?";  $params[] = $stream; }
        if ($search) { $sql .= " AND (s.first_name LIKE ? OR s.other_names LIKE ? OR s.adm_no LIKE ?)";
                        $params[] = $search; $params[] = $search; $params[] = $search; }

        $sql .= " ORDER BY s.form, s.stream, s.first_name";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        jsonResponse($stmt->fetchAll());

    // ---- POST — admit new student ----
    case 'POST':
        $d = getBody();
        $stmt = $db->prepare("
            INSERT INTO students
              (adm_no, first_name, other_names, form, stream, house_id,
               is_boarder, kcpe_index, kcpe_marks, parent_name, parent_phone,
               home_location, date_admitted)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
        $stmt->execute([
            $d['adm_no']      ?? '',
            $d['first_name']  ?? '',
            $d['other_names'] ?? '',
            $d['form']        ?? 1,
            $d['stream']      ?? '1A',
            $d['house_id']    ?? 1,
            $d['is_boarder']  ?? 1,
            $d['kcpe_index']  ?? null,
            $d['kcpe_marks']  ?? null,
            $d['parent_name'] ?? '',
            $d['parent_phone']?? '',
            $d['home_location']??'',
            $d['date_admitted']?? date('Y-m-d'),
        ]);
        jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);

    // ---- PUT — update student ----
    case 'PUT':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $d = getBody();
        $stmt = $db->prepare("
            UPDATE students SET
              first_name=?, other_names=?, form=?, stream=?, house_id=?,
              is_boarder=?, parent_name=?, parent_phone=?, home_location=?, status=?
            WHERE id=?");
        $stmt->execute([
            $d['first_name']  ?? '',
            $d['other_names'] ?? '',
            $d['form']        ?? 1,
            $d['stream']      ?? '1A',
            $d['house_id']    ?? 1,
            $d['is_boarder']  ?? 1,
            $d['parent_name'] ?? '',
            $d['parent_phone']?? '',
            $d['home_location']??'',
            $d['status']      ?? 'Active',
            $id,
        ]);
        jsonResponse(['success' => true]);

    // ---- DELETE — mark student as left ----
    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $db->prepare("UPDATE students SET status='Left' WHERE id=?")->execute([$id]);
        jsonResponse(['success' => true]);

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

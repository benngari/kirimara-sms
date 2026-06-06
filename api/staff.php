<?php
require_once 'config.php';
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$type   = $_GET['type'] ?? 'teachers';
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($type) {

    case 'teachers':
        if ($method === 'GET') {
            if ($id) {
                $stmt = $db->prepare("SELECT * FROM teachers WHERE id=?");
                $stmt->execute([$id]);
                jsonResponse($stmt->fetch());
            }
            $stmt = $db->query("SELECT * FROM teachers ORDER BY full_name");
            jsonResponse($stmt->fetchAll());
        }
        if ($method === 'POST') {
            $d = getBody();
            $stmt = $db->prepare("
                INSERT INTO teachers
                  (full_name,initials,role,subjects,class_teacher,tsc_no,phone,email,status)
                VALUES (?,?,?,?,?,?,?,?,?)");
            $stmt->execute([
                $d['full_name']     ?? '',
                $d['initials']      ?? '',
                $d['role']          ?? 'Teacher',
                $d['subjects']      ?? '',
                $d['class_teacher'] ?? '',
                $d['tsc_no']        ?? '',
                $d['phone']         ?? '',
                $d['email']         ?? '',
                $d['status']        ?? 'Active',
            ]);
            jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);
        }
        if ($method === 'PUT' && $id) {
            $d = getBody();
            $stmt = $db->prepare("
                UPDATE teachers SET
                  full_name=?,initials=?,role=?,subjects=?,class_teacher=?,
                  tsc_no=?,phone=?,email=?,status=?
                WHERE id=?");
            $stmt->execute([
                $d['full_name'],$d['initials'],$d['role'],
                $d['subjects'],$d['class_teacher'],$d['tsc_no'],
                $d['phone'],$d['email'],$d['status'],$id
            ]);
            jsonResponse(['success' => true]);
        }
        break;

    case 'labtech':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM lab_technicians ORDER BY lab");
            jsonResponse($stmt->fetchAll());
        }
        if ($method === 'PUT' && $id) {
            $d = getBody();
            $stmt = $db->prepare("
                UPDATE lab_technicians SET stock_pct=?, stock_note=? WHERE id=?");
            $stmt->execute([$d['stock_pct'] ?? 0, $d['stock_note'] ?? '', $id]);
            jsonResponse(['success' => true]);
        }
        break;

    case 'inventory':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM lab_inventory ORDER BY lab, item");
            jsonResponse($stmt->fetchAll());
        }
        if ($method === 'POST') {
            $d = getBody();
            $stmt = $db->prepare("
                INSERT INTO lab_inventory (item,lab,quantity,unit,status,last_checked,notes)
                VALUES (?,?,?,?,?,?,?)");
            $stmt->execute([
                $d['item'],$d['lab'],$d['quantity']??0,
                $d['unit']??'pcs',$d['status']??'Good',
                $d['last_checked']??date('Y-m-d'),$d['notes']??''
            ]);
            jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);
        }
        if ($method === 'PUT' && $id) {
            $d = getBody();
            $stmt = $db->prepare("
                UPDATE lab_inventory SET quantity=?,status=?,last_checked=?,notes=? WHERE id=?");
            $stmt->execute([
                $d['quantity']??0,$d['status']??'Good',
                $d['last_checked']??date('Y-m-d'),$d['notes']??'',$id
            ]);
            jsonResponse(['success' => true]);
        }
        break;

    case 'support':
        if ($method === 'GET') {
            $stmt = $db->query("SELECT * FROM support_staff ORDER BY department, full_name");
            jsonResponse($stmt->fetchAll());
        }
        if ($method === 'POST') {
            $d = getBody();
            $stmt = $db->prepare("
                INSERT INTO support_staff
                  (full_name,initials,role,department,employment_type,phone,email)
                VALUES (?,?,?,?,?,?,?)");
            $stmt->execute([
                $d['full_name'],$d['initials']??'',$d['role'],
                $d['department'],$d['employment_type']??'Permanent',
                $d['phone']??'',$d['email']??''
            ]);
            jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);
        }
        break;

    case 'headteacher':
        $stmt = $db->query("
            SELECT h.*,
              (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                'id',d.id,'full_name',d.full_name,'role',d.role,'phone',d.phone
              )) FROM deputy_headteachers d) AS deputies_json
            FROM headteacher h LIMIT 1");
        $row = $stmt->fetch();
        if ($row) $row['deputies'] = json_decode($row['deputies_json'] ?? '[]', true);
        unset($row['deputies_json']);
        jsonResponse($row);

    default:
        jsonResponse(['error' => 'Unknown type'], 400);
}

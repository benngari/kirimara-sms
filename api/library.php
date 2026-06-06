<?php
require_once 'config.php';
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'borrowings';
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($action) {

    case 'borrowings':
        if ($method === 'GET') {
            $stmt = $db->query("
                SELECT bb.id, bb.issue_date, bb.due_date, bb.return_date,
                       CASE
                         WHEN bb.return_date IS NOT NULL THEN 'Returned'
                         WHEN bb.due_date < CURDATE()    THEN 'Overdue'
                         WHEN bb.due_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY) THEN 'Due soon'
                         ELSE 'On loan'
                       END AS status,
                       bb.issued_by,
                       b.title, b.subject,
                       s.adm_no,
                       CONCAT(s.first_name,' ',s.other_names) AS student_name
                FROM book_borrowings bb
                JOIN books b    ON b.id  = bb.book_id
                JOIN students s ON s.id  = bb.student_id
                WHERE bb.return_date IS NULL
                ORDER BY bb.due_date ASC");
            jsonResponse($stmt->fetchAll());
        }
        if ($method === 'POST') {
            $d    = getBody();
            $sStmt = $db->prepare("SELECT id FROM students WHERE adm_no=?");
            $sStmt->execute([$d['adm_no'] ?? '']);
            $stu  = $sStmt->fetch();
            if (!$stu) jsonResponse(['error' => 'Student not found'], 404);

            $stmt = $db->prepare("
                INSERT INTO book_borrowings
                  (book_id, student_id, issue_date, due_date, issued_by)
                VALUES (?,?,?,?,?)");
            $stmt->execute([
                $d['book_id']   ?? 1,
                $stu['id'],
                $d['issue_date'] ?? date('Y-m-d'),
                $d['due_date']   ?? date('Y-m-d', strtotime('+14 days')),
                $d['issued_by']  ?? 'Librarian',
            ]);
            jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);
        }
        break;

    case 'return':
        if ($method === 'POST' && $id) {
            $db->prepare("
                UPDATE book_borrowings SET return_date=CURDATE(), status='Returned'
                WHERE id=?")->execute([$id]);
            // update available count
            $db->prepare("
                UPDATE books b
                JOIN book_borrowings bb ON bb.book_id = b.id
                SET b.copies_available = b.copies_available + 1
                WHERE bb.id=?")->execute([$id]);
            jsonResponse(['success' => true]);
        }
        break;

    case 'books':
        $stmt = $db->query("SELECT * FROM books ORDER BY subject, title");
        jsonResponse($stmt->fetchAll());
        break;

    case 'stats':
        $row = $db->query("
            SELECT
              (SELECT SUM(copies_total) FROM books) AS total,
              (SELECT COUNT(*) FROM book_borrowings WHERE return_date IS NULL) AS on_loan,
              (SELECT COUNT(*) FROM book_borrowings
               WHERE return_date IS NULL AND due_date < CURDATE()) AS overdue,
              (SELECT SUM(copies_available) FROM books) AS available
        ")->fetch();
        jsonResponse($row);
        break;

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}

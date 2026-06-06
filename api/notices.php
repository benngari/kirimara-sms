<?php
require_once 'config.php';
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {
    case 'GET':
        $stmt = $db->query("
            SELECT * FROM notices
            WHERE is_active = 1
            ORDER BY notice_date DESC, created_at DESC");
        jsonResponse($stmt->fetchAll());

    case 'POST':
        $d = getBody();
        $stmt = $db->prepare("
            INSERT INTO notices (title, body, type, icon, posted_by, notice_date)
            VALUES (?,?,?,?,?,?)");
        $stmt->execute([
            $d['title']       ?? '',
            $d['body']        ?? '',
            $d['type']        ?? 'navy',
            $d['icon']        ?? 'ti-bell',
            $d['posted_by']   ?? 'Admin',
            $d['notice_date'] ?? date('Y-m-d'),
        ]);
        jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);

    case 'DELETE':
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $db->prepare("UPDATE notices SET is_active=0 WHERE id=?")->execute([$id]);
        jsonResponse(['success' => true]);

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

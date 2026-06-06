<?php
require_once 'config.php';
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'results';

switch ($action) {

    // ---- GET results for a class ----
    case 'results':
        $form      = $_GET['form']     ?? '4';
        $stream    = $_GET['stream']   ?? '4A';
        $exam_id   = $_GET['exam_id']  ?? '1';

        $stmt = $db->prepare("
            SELECT s.id AS student_id,
                   CONCAT(s.first_name,' ',LEFT(s.other_names,1),'.') AS name,
                   s.adm_no,
                   MAX(CASE WHEN er.subject='Mathematics'     THEN er.marks END) AS maths,
                   MAX(CASE WHEN er.subject='English'         THEN er.marks END) AS english,
                   MAX(CASE WHEN er.subject='Kiswahili'       THEN er.marks END) AS kisw,
                   MAX(CASE WHEN er.subject='Biology'         THEN er.marks END) AS biology,
                   MAX(CASE WHEN er.subject='Chemistry'       THEN er.marks END) AS chemistry,
                   MAX(CASE WHEN er.subject='Physics'         THEN er.marks END) AS physics,
                   MAX(CASE WHEN er.subject='History'         THEN er.marks END) AS history,
                   ROUND(AVG(er.marks),1) AS mean_score
            FROM students s
            JOIN exam_results er ON er.student_id = s.id
                                 AND er.exam_type_id = ?
            WHERE s.form = ? AND s.stream = ? AND s.status='Active'
            GROUP BY s.id
            ORDER BY mean_score DESC");
        $stmt->execute([$exam_id, $form, $stream]);
        jsonResponse($stmt->fetchAll());

    // ---- GET exam types ----
    case 'types':
        $stmt = $db->query("SELECT * FROM exam_types ORDER BY year DESC, id DESC");
        jsonResponse($stmt->fetchAll());

    // ---- POST — save / update marks ----
    case 'save':
        if ($method !== 'POST') jsonResponse(['error' => 'POST required'], 405);
        $d       = getBody();
        $exam_id = $d['exam_type_id'] ?? 1;
        $records = $d['records']      ?? [];

        $stmt = $db->prepare("
            INSERT INTO exam_results (student_id, exam_type_id, subject, marks)
            VALUES (?,?,?,?)
            ON DUPLICATE KEY UPDATE marks = VALUES(marks)");

        $db->beginTransaction();
        $saved = 0;
        foreach ($records as $r) {
            foreach ($r['subjects'] as $subj => $marks) {
                if ($marks !== null && $marks !== '') {
                    $stmt->execute([$r['student_id'], $exam_id, $subj, (int)$marks]);
                    $saved++;
                }
            }
        }
        $db->commit();
        jsonResponse(['success' => true, 'saved' => $saved]);

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}

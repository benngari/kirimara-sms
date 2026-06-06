<?php
require_once 'config.php';
$db   = getDB();
$form = $_GET['form'] ?? '4A';

$stmt = $db->prepare("
    SELECT tt.day_name, tt.period_no, tt.period_time,
           tt.subject, tt.room,
           t.full_name AS teacher_name
    FROM timetable tt
    LEFT JOIN teachers t ON t.id = tt.teacher_id
    WHERE tt.form = ?
    ORDER BY FIELD(tt.day_name,'Monday','Tuesday','Wednesday','Thursday','Friday'),
             tt.period_no");
$stmt->execute([$form]);
$rows = $stmt->fetchAll();

// Build a structured grid
$grid   = [];
$breaks = [
    4 => ['time' => '10:30-11:00', 'label' => 'BREAK'],
    8 => ['time' => '1:00-2:00',   'label' => 'LUNCH'],
];
$days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

foreach ($rows as $r) {
    $grid[$r['period_no']][$r['day_name']] = [
        'subject' => $r['subject'],
        'teacher' => $r['teacher_name'],
        'time'    => $r['period_time'],
        'room'    => $r['room'],
    ];
}

jsonResponse([
    'form'   => $form,
    'days'   => $days,
    'breaks' => $breaks,
    'grid'   => $grid,
    'raw'    => $rows,
]);

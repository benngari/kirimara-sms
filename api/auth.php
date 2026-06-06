<?php
// =====================================================
// KIRIMARA HIGH SCHOOL — AUTH API
// Handles login / logout / session for all roles
// =====================================================
session_start();
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'check';

switch ($action) {

    // ---- CHECK session (called on every page load) ----
    case 'check':
        if (isset($_SESSION['user_id'])) {
            jsonResponse([
                'authenticated' => true,
                'user' => [
                    'id'        => $_SESSION['user_id'],
                    'username'  => $_SESSION['username'],
                    'full_name' => $_SESSION['full_name'],
                    'role'      => $_SESSION['role'],
                    'initials'  => $_SESSION['initials'],
                ]
            ]);
        } else {
            jsonResponse(['authenticated' => false], 401);
        }

    // ---- LOGIN ----
    case 'login':
        if ($method !== 'POST') jsonResponse(['error' => 'POST required'], 405);
        $d        = getBody();
        $username = trim($d['username'] ?? '');
        $password = $d['password'] ?? '';

        if (!$username || !$password) {
            jsonResponse(['error' => 'Username and password required'], 400);
        }

        $db   = getDB();
        $stmt = $db->prepare("
            SELECT id, username, password, full_name, role, is_active
            FROM admin_users
            WHERE username = ? LIMIT 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !$user['is_active']) {
            jsonResponse(['error' => 'Invalid username or password'], 401);
        }

        // Verify password (bcrypt)
        if (!password_verify($password, $user['password'])) {
            jsonResponse(['error' => 'Invalid username or password'], 401);
        }

        // Update last login
        $db->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?")
           ->execute([$user['id']]);

        // Build initials
        $parts    = explode(' ', $user['full_name']);
        $initials = strtoupper(substr($parts[0],0,1) . (isset($parts[1]) ? substr($parts[1],0,1) : ''));

        // Set session
        $_SESSION['user_id']   = $user['id'];
        $_SESSION['username']  = $user['username'];
        $_SESSION['full_name'] = $user['full_name'];
        $_SESSION['role']      = $user['role'];
        $_SESSION['initials']  = $initials;

        jsonResponse([
            'success' => true,
            'user' => [
                'id'        => $user['id'],
                'username'  => $user['username'],
                'full_name' => $user['full_name'],
                'role'      => $user['role'],
                'initials'  => $initials,
            ]
        ]);

    // ---- LOGOUT ----
    case 'logout':
        session_destroy();
        jsonResponse(['success' => true, 'message' => 'Logged out']);

    // ---- CHANGE PASSWORD ----
    case 'change_password':
        if ($method !== 'POST') jsonResponse(['error' => 'POST required'], 405);
        if (!isset($_SESSION['user_id'])) jsonResponse(['error' => 'Not authenticated'], 401);

        $d        = getBody();
        $current  = $d['current_password'] ?? '';
        $newPass  = $d['new_password']      ?? '';

        if (strlen($newPass) < 6) jsonResponse(['error' => 'Password must be at least 6 characters'], 400);

        $db   = getDB();
        $stmt = $db->prepare("SELECT password FROM admin_users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $row  = $stmt->fetch();

        if (!password_verify($current, $row['password'])) {
            jsonResponse(['error' => 'Current password is incorrect'], 401);
        }

        $hash = password_hash($newPass, PASSWORD_BCRYPT);
        $db->prepare("UPDATE admin_users SET password = ? WHERE id = ?")
           ->execute([$hash, $_SESSION['user_id']]);

        jsonResponse(['success' => true]);

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}

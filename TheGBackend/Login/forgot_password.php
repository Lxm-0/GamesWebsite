<?php
session_start();
require_once 'config.php';

if (isset($_POST['send_code'])) {
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    
    $check = $conn->query("SELECT email FROM users WHERE email = '$email'");
    if ($check->num_rows > 0) {
        $code = rand(100000, 999999); // Generate 6-digit number
        $conn->query("UPDATE users SET reset_code = '$code' WHERE email = '$email'");
        
        // In a real server: mail($email, "Your Reset Code", "Your code is: $code");
        $_SESSION['reset_email'] = $email;
        $_SESSION['success'] = "Code sent to $email (For testing: $code)";
    } else {
        $_SESSION['error'] = "Email not found!";
    }
    header("Location: forgot_password.php");
    exit();
}

if (isset($_POST['verify_reset'])) {
    $entered_code = $_POST['code'];
    $new_pass = password_hash($_POST['new_password'], PASSWORD_DEFAULT);
    $email = $_SESSION['reset_email'];

    $result = $conn->query("SELECT reset_code FROM users WHERE email = '$email'");
    $user = $result->fetch_assoc();

    if ($user['reset_code'] == $entered_code) {
        $conn->query("UPDATE users SET password = '$new_pass', reset_code = NULL WHERE email = '$email'");
        $_SESSION['login_error'] = "Password updated! Please login.";
        header("Location: login.php");
    } else {
        $_SESSION['error'] = "Invalid code!";
        header("Location: forgot_password.php");
    }
    exit();
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="styles/login44.css">
    <title>Forgot Password</title>
</head>
<body style="display:flex; justify-content:center; align-items:center; font-size: 65.2%;">
    <div id="containe" style="min-height:350px; padding: 4em; background:#fafafa; width: 40em; min-width: auto; border-radius: 2em;">
        <div class="content" style="width:100%;">
            <h1 style="white-space: nowrap;">Reset Password</h1>
            <?php if(isset($_SESSION['error'])) echo "<p style='color:red; font-size:1.4em;'>".$_SESSION['error']."</p>"; unset($_SESSION['error']); ?>
            <?php if(isset($_SESSION['success'])) echo "<p style='color:green; font-size:1.4em;'>".$_SESSION['success']."</p>"; unset($_SESSION['success']); ?>

            <?php if (!isset($_SESSION['reset_email'])): ?>
                <form method="POST" action="forgot_password.php">
                    <input type="email" name="email" placeholder="Enter Registered Email" required>
                    <button name="send_code" style="font-size: 1.5em; white-space: nowrap;">Send Check Number</button>
                </form>
            <?php else: ?>
                <form method="POST" action="forgot_password.php">
                    <input type="text" name="code" placeholder="6-Digit Code" required>
                    <input type="password" name="new_password" placeholder="New Password" required>
                    <button name="verify_reset" style="font-size: 1.5em; white-space: nowrap;">Update Password</button>
                </form>
            <?php endif; ?>
            <a href="login.php" style="font-size:2em; margin-top:1em;">Back to Login</a>
        </div>
    </div>
</body>
</html>
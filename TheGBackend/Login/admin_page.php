<?php
  session_start();
  if(!isset($_SESSION['email'])){
    header('Location: login.php');
    exit();
  } 
  ?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin page</title>
  <link rel="stylesheet" href="styles/page.css">
</head>
<body>
  <div class="box">
    <h1>Welcome <span   class ="text"><?= $_SESSION['name'] ?></span ></h1>
    <p>This is the <span class ="text"> admin</span > page</p>
    <button onclick="location.href = '../../TheGFrontend/MGames/index.html'">Start playing games</button>
    <button onclick="location.href = '../../TheGFrontend/MGames/public/AdminDashBoard/AdminDashBoard.html'">Add game</button>
    
  </div>

</body>
</html>
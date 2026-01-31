<?php
session_start();
require_once 'config.php';

if(isset($_POST['submit'])){
   $name = filter_input(INPUT_POST,'name', FILTER_SANITIZE_SPECIAL_CHARS);
   $password = filter_input(INPUT_POST,'password', FILTER_SANITIZE_SPECIAL_CHARS);
   $email = filter_input(INPUT_POST,'email', FILTER_VALIDATE_EMAIL);
   $role = $_POST['role'];
    
   if(!empty($email)){
    
    $checkEmail = $conn->query("select email from users where email = '$email' ");
    if($checkEmail->num_rows > 0 ){
      $_SESSION['register_error'] = 'This email is already registered!';
      $_SESSION['active_form'] = 'register';
    }
    else{
    $hashed_password = password_hash($password,PASSWORD_DEFAULT);
    $conn->query("insert into users(name,email,password,role) 
                  values('$name','$email','$hashed_password', '$role') ");
    //$_COOKIE('user',time() * 60 * 60*24 , );              
    }

   }else{
      $_SESSION['register_error'] =  "This email is not valid!";
      $_SESSION['active_form'] = 'registered';
   }
   header('Location: login.php'); 
   exit();
}

if(isset($_POST['login'])){
   $email = filter_input(INPUT_POST,'email', FILTER_VALIDATE_EMAIL);
   $password = filter_input(INPUT_POST,'password', FILTER_SANITIZE_SPECIAL_CHARS);
   
   if(!empty($email)){
     $result = $conn->query("select * from users where email = '$email' ");
     if($result->num_rows > 0){
       $user = $result->fetch_assoc();
       if(password_verify($password, $user['password'])){
        $_SESSION['email'] = $user['email'];
        $_SESSION['name'] = $user['name'];

        if($user['role'] === 'admin'){
        header('Location: admin_page.php');
        exit();
       }else{
        header('Location: user_page.php');
        exit();
       }
       }
      
    }
   }
   else{
      $_SESSION['login_error'] =  "This email is not valid!";
      $_SESSION['active_form'] = 'login';
      header("Location: login.php");
      exit();
    }
      $_SESSION['login_error'] =  "Incorrect email or password!";
      $_SESSION['active_form'] = 'login';
      header("Location: login.php");
      exit();
     }

?>



<?php
/*
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['login'])) {
        // Handle login

        $con = new mysqli("localhost", "root", "", "gameswebsite");
        if ($con->connect_error) {
            die("Connection failed: " . $con->connect_error);
        }
        $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
        $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_SPECIAL_CHARS);
        $stmt = $con->prepare("SELECT password FROM user WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $stmt->bind_result($hashed_password);
            $stmt->fetch();
            if (password_verify($password, $hashed_password)) {
                header("Location: index.php");
                exit;
            } else {
                echo "Invalid password.";
            }
        } else {
            $sql = "INSERT INTO user (email, password) VALUES ('$email', '$password')";
            $con->query($sql);
            echo "No user found with that email.";
        }
        $stmt->close();
        $con->close();
    } elseif (isset($_POST['submit'])) {
        // Handle registration  
        echo "registration attempt";
        $con = new mysqli("localhost", "root", "", "gameswebsite");
        if ($con->connect_error) {
            die("Connection failed: " . $con->connect_error);
        }
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $stmt = $con->prepare("INSERT INTO user (name, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $email, $password);
        if ($stmt->execute()) {
            echo "Registration successful!";
            header("Location: login.php");
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
        $con->close();
    }
}*/

?>
<?php



    //session_start();
    // Connexion a la BDD
    $bdd = 'leaflet-map';
    $hostname = 'localhost:3306';
    $username = 'php_leaflet-map';
    $password = 'BjbAh6sgFKpDx6Q';
    $db = mysqli_connect ($hostname, $username, $password, $bdd);

$username = $_POST['username'];
//$code = $_POST["code"];

echo("La connexion est réussie $username !");

if(isset($_POST["mail"]))
{
    $mail = $_POST["mail"];
    $txt = "L'inscription est réussie !";
}

//header("Location: /carte.html", TRUE, 301);
?>
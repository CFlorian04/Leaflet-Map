<?php


/*
    session_start();
    // Connexion a la BDD
    $bdd = 'nom_bdd';
    $hostname = 'serveur';
    $username = 'login';
    $password = 'mot_de_passe';
    $db = mysqli_connect ($hostname, $username, $password, $bdd);
*/
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
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
$username = $_GET["username"];
$code = $_GET["code"];

$txt = "La connexion est réussie !";

if(isset($_GET["mail"]))
{
    $mail = $_GET["mail"];
    $txt = "L'inscription est réussie !";
}


echo ($txt);

?>
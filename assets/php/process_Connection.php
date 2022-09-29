<?php

    $username = $_POST['username'];
    $email = $_POST['email'];
    $code = $_POST['code'];

    $bdd = 'leaflet-map';
    $hostname = '127.0.0.1:3306';
    $user = 'php_leaflet-map';
    $password = 'BjbAh6sgFKpDx6Q';
    
    try {
        $pdo = new PDO("mysql:host=$hostname;dbname=$bdd", 
            "$user", 
            "$password", 
            array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION )
        );
    } catch (PDOException $th) {
        echo $th;
    }
    

    //requête SQL, inscription du nouvel utilisateur
    $stmt = $pdo->query("INSERT INTO `utilisateurs` (`Username`, `Code`, `Mail`) VALUES ('$username', '$code', '$email');");

    echo("Inscription réussi");

    //header("Location: /carte.html", TRUE, 301);
?>
<?php



    //session_start();
    /**Connexion a la BDD
     * /!\ Si paramètre serveur par défaut, la page doit être sur le même serveur que la BDD
     *  -> Risque de refus de connexion
     */  

    $username = $_POST['username_insc'];
    $email = $_POST['email'];
    $code = $_POST['code'];

    $bdd = 'leaflet-map';
    $hostname = '127.0.0.1:3306';
    $user = 'php_leaflet-map';
    $password = 'BjbAh6sgFKpDx6Q';
    //$db = mysqli_connect($hostname, $user, $password, $bdd);
    

    //connexion actuel avec root, création d'un utilisateur dédié à faire
    $pdo = new PDO("mysql:host=$hostname;dbname=$bdd", 
        'root', 
        '', 
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION )
    );

    $stmt = $pdo->query("INSERT INTO `utilisateurs` (`nom`, `prenom`, `mail`) VALUES ('micucci', 'gabriel', 'gabriel@micucci.fr');");

    echo("true");

    //header("Location: /carte.html", TRUE, 301);
?>
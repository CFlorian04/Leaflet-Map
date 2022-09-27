<?php


    

    //session_start();
    /**Connexion a la BDD
     * /!\ Si paramètre serveur par défaut, la page doit être sur le même serveur que la BDD
     *  -> Risque de refus de connexion
     */

    /*$bdd = 'leaflet-map';
    $hostname = '127.0.0.1:3306';
    $user = 'php_leaflet-map';
    $password = 'BjbAh6sgFKpDx6Q';
    $db = mysqli_connect($hostname, $user, $password, $bdd);
    echo($db->query('SELECT `utilisateurs`.* FROM `utilisateurs`'));
    */

    try {
        $pdo = new PDO('mysql:host=127.0.0.1:3306;dbname=leaflet-map',
        'php_leaflet-map',
        'BjbAh6sgFKpDx6Q',
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ));
        $stmt = $pdo->query('SELECT id, auteur, contenu');
        $messages = $stmt->fetchAll(PDO::FETCH_OBJ);
    }catch(Exception $e) {
        die('<b>Catched exception at line '. $e->getLine() .
        ' : </b> '. $e->getMessage());
    }
    $username = $_POST['username'];
    //$code = $_POST["code"];

    //echo("La connexion est réussie $username !");

    if(isset($_POST["mail"]))
    {
        $mail = $_POST["mail"];
        $txt = "L'inscription est réussie !";
    }

    //header("Location: /carte.html", TRUE, 301);
?>
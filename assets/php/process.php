<?php

    //session_start();
    /**Connexion a la BDD
     * /!\ Si paramètre serveur par défaut, la page doit être sur le même serveur que la BDD
     *  -> Risque de refus de connexion
     */  

    $userName = $_POST['username'];
    $code = $_POST['code'];

    $bdd = 'leaflet-map';
    $hostname = '127.0.0.1:3306';
    $userBDD = 'php_leaflet-map';
    $password = 'BjbAh6sgFKpDx6Q';
    
    try {
        $pdo = new PDO("mysql:host=$hostname;dbname=$bdd", 
            "$userBDD", 
            "$password", 
            array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION )
        );
    } catch (PDOException $th) {
        echo $th;
    }
    

    if(isset($_POST['newUser']) && $_POST['newUser'] != "false"){
        $email = $_POST['email'];
        //requête SQL, inscription du nouvel utilisateur
        
       try {
        $sql = $pdo->query("INSERT INTO `utilisateurs` (`Username`, `Code`, `Mail`) VALUES ('$userName', '$code', '$email');");
        foreach  ($sql as $row) {
            echo ($row['Username'] . "\t" . $row['Code'] . "\t" . $row['Mail'] . "\n");
        }
       }catch( PDOException $e){
        exit($e->getCode());
       }
        
    }else {
        $stmt = $pdo->query("SELECT `id` FROM `utilisateurs` WHERE `code` = $code AND `Username` = '$userName'");
        if(count($stmt->fetchAll()) > 0){//si au moins une occurence est trouvé
            header("Status: 301 Moved Permanently", false, 301);
            header('Location: ../../mapbox.html');
            exit();
        }else{
            echo "Connexion échoué !";
            exit();
        } 
    }
    

    

    header("Location: /carte.html", TRUE, 301);
?>
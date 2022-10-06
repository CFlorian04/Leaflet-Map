<?php

    session_start();
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
    

    if(isset($_POST['inscription']) ){
        $email = $_POST['email'];
        //requête SQL, inscription du nouvel utilisateur
        
       try {
        $sql = $pdo->query("INSERT INTO `utilisateurs` (`Username`, `Code`, `Mail`) VALUES ('$userName', '$code', '$email');");
        header("Status: 301 Moved Permanently", false, 301);
        header('Location: ../../mapbox.html');
       }catch( PDOException $e){
        if ($e->getCode() == 23000) {// Erreur 23000 = Identifiant ou mail déjà dans la base
            $_SESSION["erreur"] = "Identifiant ou mail déjà utilisé";
            header("Status: 301 Moved Permanently", false, 301);
            header('Location: ../../index.html');
        }
        exit($e->getCode());
       }
        
    }else if (isset($_POST['connection'])) {
        $stmt = $pdo->query("SELECT `id` FROM `utilisateurs` WHERE `code` = $code AND `Username` = '$userName'");
        if(count($stmt->fetchAll()) > 0){//si au moins une occurence est trouvé
            header("Status: 301 Moved Permanently", false, 301);
            header('Location: ../../mapbox.html');
            exit();
        }else{
            $_SESSION["erreur"] = "Mots de passe ou identifiant incorecte";
            header("Status: 301 Moved Permanently", false, 301);
            header('Location: ../../index.html');
            exit();
        } 
    }
?>
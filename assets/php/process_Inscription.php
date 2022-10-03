<?php



    //session_start();
    /**Connexion a la BDD
     * /!\ Si paramètre serveur par défaut, la page doit être sur le même serveur que la BDD
     *  -> Risque de refus de connexion
     */  

    $username = $_POST['username'];
    $email = $_POST['email'];
    $code = $_POST['code'];
    $newUser = $_POST['newUser'];

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
    

    if($newUser){
        //requête SQL, inscription du nouvel utilisateur
        $sql = $pdo->query("SELECT * FROM `utilisateurs`");

        $stmt = $pdo->query("INSERT INTO `utilisateurs` (`Username`, `Code`, `Mail`) VALUES ('$username', '$code', '$email');");
        
        foreach  ($sql as $row) {
            echo ($row['Username'] . "\t" . $row['Code'] . "\t" . $row['Mail'] . "\n");
        }
    }else {
        $stmt = $pdo->query("");
    }
    

    

    //header("Location: /carte.html", TRUE, 301);
?>
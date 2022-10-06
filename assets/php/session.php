<?php
session_start();
if(isset($_SESSION['erreur'])) {
    echo $_SESSION['erreur'];
    session_destroy();
}
?>
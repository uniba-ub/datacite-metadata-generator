<?php 

$url = $_POST['url'];
echo file_get_contents($url);

?>
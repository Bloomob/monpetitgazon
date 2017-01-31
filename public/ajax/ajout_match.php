<?php
	if (isset($_POST['ligue']) && isset($_POST['journee']) && isset($_POST['json'])) {
		$ligue = $_POST['ligue'];
		$journee = $_POST['journee'];
		$json = $_POST['json'];

		$dir = '../data/'.$ligue;
		$scan = scandir($dir);
		$i = 1;

		foreach ($scan as $key => $value) {
			if(strpos($value, 'match_' . $journee) === 0) {
				$i++;
			}	
		}

		if(strlen($i) == 1) {
			echo $i = '0' . $i;
		}

		$fp = fopen('../data/' . $ligue . '/match_' . $journee . '_' . $i . '.json', "w+");
		fwrite($fp, $json);
		fclose($fp);

		echo 'Ajout effectué';
	}	
?>
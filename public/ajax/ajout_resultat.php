<?php
	if (isset($_POST['ligue']) && isset($_POST['journee']) && isset($_POST['json'])) {
		extract($_POST);

		$dir = '../data/resultats/';
		$scan = scandir($dir);
		$i = 1;

		foreach ($scan as $key => $value) {
			if(strpos($value, 'match_' . $journee) === 0) {
				$i++;
			}	
		}

		if(strlen($i) == 1) {
			$i = '0' . $i;
		}
        
		$fp = fopen('../data/resultats/match_' . $journee . '_' . $i . '.json', "w+");
		fwrite($fp, $json);
		fclose($fp);

		echo 'Ajout effectué';
	}	
?>
<?php

// Fonction de tri croissant
	function cmp($a, $b) {
		// var_dump($a, $b);
		if($a["prix"] == $b["prix"])
			return 0;
		return ($a["prix"] > $b["prix"]) ? -1 : 1;
	}

	$dir = '../data';
	$scan = scandir($dir);
	foreach ($scan as $key => $value) {
		$pathDir = $dir.'/'.$value;
		if(strpos($value, '.json')) {
			$file = file_get_contents($dir.'/'.$value);
			$json = json_decode($file, true);
			$arr[$value] = $json;
		} elseif (is_dir($pathDir) && $value != '.' && $value != '..') {
			$scanDir = scandir($pathDir);
			$ligue = $value;
			foreach ($scanDir as $k => $val) {
				if(strpos($val, '.json')) {
					$file = file_get_contents($pathDir.'/'.$val);
					$json = json_decode($file, true);
					$arr[$ligue][$val] = $json;
				}
			}
		}
	}

	if(isset($_POST['page'])) {
		$page = $_POST['page'];
		if($page == 'classement') {
			echo json_encode($arr['classement.json']);
		}
		elseif($page == 'effectif') {
			echo json_encode($arr['effectifs.json']);
		}
		elseif($page == 'statistiques') {
			$tab = $arr['effectifs.json']['teams'];
			$stats = array('max_price' => array());
			foreach ($tab as $i => $equipe) {
				foreach ($equipe['players'] as $j => $joueur) {
					
					// On récupère les 3 plus gros transferts
					usort($stats['max_price'], 'cmp');
					if(count($stats['max_price']) < 3)
						array_push($stats['max_price'], array('nom'=>$joueur['lastname'], 'prix'=>$joueur['price_paid']));
					else {
						if(end($stats['max_price'])['prix'] < $joueur['price_paid']) {
							array_pop($stats['max_price']);
							array_push($stats['max_price'], array('nom'=>$joueur['lastname'], 'prix'=>$joueur['price_paid']));
						}
					}
				}
			}
			echo json_encode($stats);
		}
		elseif($page == 'ligue1' || $page == 'premierleague') {
			echo json_encode($arr);
		}
        elseif($page == 'resultats') {
            echo json_encode($arr);
        }
	}
?>
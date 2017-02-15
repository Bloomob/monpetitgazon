"use strict";

var $page = $('.page');

function getStatistiques() {

    var allRating = [];

    $.ajax({
        url: "ajax/liste.php",
        method: "POST",
        dataType : 'json',
        data: { page: 'statistiques' }
    }).done(function (data) {
        // console.log(data);

        $('.page').append(
            $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-sm-4').append(
                    $('<h3/>').text('Les plus gros transferts'),
                    $('<div/>').addClass('plus-gros-transferts')
                ),
                $('<div/>').addClass('col-sm-4'),
                $('<div/>').addClass('col-sm-4')
            )
        );

        var stat_max_price = data.max_price,
            $tableau = $('.plus-gros-transferts'),
            i,
            $ligne;

        for (i in stat_max_price) {
            if (stat_max_price.hasOwnProperty(i)) {
                $ligne = $('<div/>').addClass('row').append(
                    $('<div/>').addClass('col-sm-6 text-right').text(stat_max_price[i].nom),
                    $('<div/>').addClass('col-sm-6').text(stat_max_price[i].prix)
                );
                $tableau.append($ligne);
            }
        }
    });

    /*
    $.getJSON('data/ligue1/match_20_01.json', function( data ) {
        console.log(data);

        var joueurs = data.Home.players;
        for(i in joueurs) {
            var joueur = { 'id': joueurs[i].info.idplayer, 'name': joueurs[i].info.lastname, 'rating': [joueurs[i].info.note_final_2015] };

            allRating.push(joueur);
        }
    });

    $.getJSON('data/match_2_1_4.json', function( data ) {
        console.log(data.data);
        var joueurs = data.data.players;


        for(lieu in joueurs) {
            var liste = joueurs[lieu];

            for(i in liste){
                console.log(liste[i]);
                var joueur = { 'id': liste[i].id, 'name': liste[i].name, 'rating': [liste[i].rating] };
                allRating.push(joueur);
                $('.statistiques').append(
                    $('<div/>').addClass('row').append(
                        $('<div/>').addClass('col-sm-6').text(liste[i].name),
                        $('<div/>').addClass('col-sm-6').text(liste[i].rating)
                    )
                )
            }
        }
        console.log(allRating);
    }); */
}

module.exports = {
    getStatistiques: getStatistiques
}
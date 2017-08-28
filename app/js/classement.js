"use strict";

var $page = $('.page');

function getClassement() {
    $.get({
        url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/ranking",
        headers: { "Authorization": Cookies.get('token') }
    }).done(function(data) {
        var classement = (data) ? data.ranking : null,
            clubs = (data) ? data.teams : null,
            $tableau,
            i,
            j,
            s,
            donnees,
            $ligne,
            serie,
            equipe;

        $tableau = $('<table/>').addClass('table classement').append(
            $('<thead/>').append(
                $('<tr/>').append(
                    $('<th/>'),
                    $('<th/>').text('Equipe'),
                    $('<th/>').text('Série'),
                    $('<th/>').text('J'),
                    $('<th/>').text('G'),
                    $('<th/>').text('N'),
                    $('<th/>').text('P'),
                    $('<th/>').text('Bp'),
                    $('<th/>').text('Bc'),
                    $('<th/>').text('Diff'),
                    $('<th/>').text('Pts')
                )
            ),
            $('<tbody/>')
        );

        if(classement != null) {
            for (i = 0; i < classement.length; i += 1) {
                donnees = classement[i];
                $ligne = $('<tr/>');

                for (equipe in donnees) {
                    if (donnees.hasOwnProperty(equipe)) {
                        if (equipe === 'teamid') {
                            $ligne.append($('<td/>').text(clubs[donnees[equipe]].name));
                        } else if (equipe === 'rank') {
                            $ligne.prepend($('<td/>').text(donnees[equipe]));
                        }  else if (equipe === 'series') {
                            $ligne.append($('<td/>').addClass('serie'));
                            serie = donnees[equipe].split("");
                            
                            for(s in serie) {
                                $ligne.find('.serie').append($('<span/>').addClass(serie[s]));
                            }
                            
                        } else {
                            $ligne.append($('<td/>').text(donnees[equipe]));
                        }
                    }
                }
                $tableau.append($ligne);
            }
        }
        $page.html($tableau);
        $tableau.bootstrapTable();
    });
}

module.exports = {
    getClassement: getClassement
}
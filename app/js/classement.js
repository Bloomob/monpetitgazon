"use strict";

var api = require('js/api'),
    utils = require('js/utils');

var $page = $('.page'),
    classementTotal = {},
    user = 0,
    l,
    nomLeagues = [],
    tabPromessesLeagues = [],
    listePromessesLeague,
    i,
    j,
    p,
    s,
    classement,
    clubs,
    $tableau,
    i,
    donnees,
    $ligne,
    serie,
    equipe;

function getClassements() {
    for(l of utils.getStorage('ligues').value) {
        tabPromessesLeagues.push(l.id);
        nomLeagues.push(l.name);
    }
    listePromessesLeague = tabPromessesLeagues.map(api.getApiClassement);

    $.when.apply($, listePromessesLeague).then(function(){
        for(p = 0; p < listePromessesLeague.length; ++p) {
            $tableau = $('<div/>').addClass('classement').append(
                $('<h3/>').addClass('').text(nomLeagues[p]),
                $('<table/>').addClass('table').append(
                    $('<thead/>').append(
                        $('<tr/>').append(
                            $('<th/>'),
                            $('<th/>').addClass('equipe').text('Equipe'),
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
                )
            );
            classement = (arguments[p]) ? arguments[p][0].ranking : null,
                clubs = (arguments[p]) ? arguments[p][0].teams : null;

            if(classement != null) {
                for (i = 0; i < classement.length; i += 1) {
                    donnees = classement[i];
                    $ligne = $('<tr/>');

                    $ligne.append($('<td/>').text(donnees['rank']));
                    $ligne.append($('<td/>').addClass('equipe').text(clubs[donnees['teamid']].name));
                    $ligne.append($('<td/>').addClass('serie'));
                    serie = donnees['series'].split("");
                    for(s in serie) {
                        $ligne.find('.serie').append($('<span/>').addClass(serie[s]));
                    }
                    $ligne.append($('<td/>').text(donnees['played']));
                    $ligne.append($('<td/>').text(donnees['victory']));
                    $ligne.append($('<td/>').text(donnees['draw']));
                    $ligne.append($('<td/>').text(donnees['defeat']));
                    $ligne.append($('<td/>').text(donnees['goal']));
                    $ligne.append($('<td/>').text(donnees['goalconceded']));
                    $ligne.append($('<td/>').text(donnees['difference']));
                    $ligne.append($('<td/>').text(donnees['points']));

                    user = donnees.teamid.split('_')[4];
                    classementTotal[user] = {
                        user: user,
                        played: (classementTotal[user]) ? donnees.played + classementTotal[user].played : donnees.played,
                        victory: (classementTotal[user]) ? donnees.victory + classementTotal[user].victory : donnees.victory,
                        draw: (classementTotal[user]) ? donnees.draw + classementTotal[user].draw : donnees.draw,
                        defeat: (classementTotal[user]) ? donnees.defeat + classementTotal[user].defeat : donnees.defeat,
                        goal: (classementTotal[user]) ? donnees.goal + classementTotal[user].goal : donnees.goal,
                        goalconceded: (classementTotal[user]) ? donnees.goalconceded + classementTotal[user].goalconceded : donnees.goalconceded,
                        difference: (classementTotal[user]) ? donnees.difference + classementTotal[user].difference : donnees.difference,
                        points: (classementTotal[user]) ? donnees.points + classementTotal[user].points : donnees.points
                    }
                    $tableau.find('tbody').append($ligne);
                }
            }
            if(p == 0)
                $page.html($tableau);
            else
                $page.append($tableau);
        }
        $('.table').bootstrapTable();
        classement = Object.values(classementTotal);
        classement.sort(function (a, b) {
            return b.points - a.points;
        });

        $tableau = $('<div/>').addClass('classement').append(
            $('<h3/>').addClass('').text('Classement général'),
            $('<table/>').addClass('table').append(
                $('<thead/>').append(
                    $('<tr/>').append(
                        $('<th/>'),
                        $('<th/>').addClass('equipe').text('Equipe'),
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
            )
        );
        j = 1;
        for (i in classement) {
            donnees = classement[i];
            $ligne = $('<tr/>');

            for (equipe in donnees) {                            
                if (donnees.hasOwnProperty(equipe)) {
                    if(equipe === 'user') {
                        user = donnees.user;
                        $ligne.prepend($('<td/>').text(j));
                        $ligne.append($('<td/>').addClass('equipe user_' + user));
                        $.when(api.getApiBadge(user)).then(function(args){
                            $('.user_' + this.url.split('/')[5]).text(args.firstname);
                        });
                    } else
                        $ligne.append($('<td/>').text(donnees[equipe]));
                }
            }
            j++;
            $tableau.find('tbody').append($ligne);
        }

        $page.prepend($tableau);
    }).error(function(error) {
        console.error(error);
    });
}

module.exports = {
    getClassements: getClassements
}
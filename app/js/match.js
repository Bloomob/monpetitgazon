"use strict";

var utils = require('js/utils'),
    $page = $('.page'),
    bonus,
    players,
    teamHome,
    teamAway,
    buts,
    $tabHome,
    $tabAway,
    $icons,
    i,
    j,
    k;

function getMatch(id) {

    function getMatchParId (id) {
        return $.get({
            url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/results/" + id,
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    function erreurPromesse() {
        return function(data) {
            $page.append(
                $('<div/>').addClass('alert alert-danger text-center').attr('role', 'alert').append(
                    utils.fontAwesomeIcon('exclamation-triangle'),
                    $('<span/>').text('Le match que vous cherchez n\'existe pas')
                )
            )
        // console.log(data)
        };
    }

    $.when(getMatchParId(id).fail(erreurPromesse())).then(function(args){
        // console.log(args.data);
        bonus = args.data.bonus;
        players = args.data.players;
        teamHome = args.data.teamHome;
        teamAway = args.data.teamAway;

        $page.append(
            $('<div/>').addClass('header-match').append(
                $('<div/>').addClass('row').append(
                    $('<div/>').addClass('col-sm-5 text-right').append(
                        $('<span/>').addClass('equipe').text(teamHome.name)
                    ),
                    $('<div/>').addClass('col-sm-2 text-center').append(
                        $('<span/>').addClass('score').text(teamHome.score + ' - ' + teamAway.score)
                    ),
                    $('<div/>').addClass('col-sm-5').append(
                        $('<span/>').addClass('equipe').text(teamAway.name)
                    )
                ),
                $('<div/>').addClass('row').append(
                    $('<div/>').addClass('col-sm-5 buteursHome'),
                    $('<div/>').addClass('col-sm-5 col-sm-offset-2 buteursAway')
                )
            ),
            $('<div/>').addClass('content-match')
        );
        
        console.log(args.data);
        
        $tabHome = $('<table/>').addClass('table').append(
            $('<tr/>').append(
                $('<th/>').addClass('numero').text('Num'),
                $('<th/>').addClass('nom').text('Nom'),
                $('<th/>').addClass('note').text('Note'),
                $('<th/>').addClass('bonus').text('Bonus'),
                $('<th/>').addClass('total-note').text('Total')
            )
        );
        
        $tabAway = $tabHome.clone();
        
        $page.find('.content-match').append(
            $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-sm-5').append(
                    $tabHome
                ),
                $('<div/>').addClass('col-sm-5 col-sm-offset-2').append(
                    $tabAway
                )
            )
        );
        
        for(i in players.home) {
            buts = players.home[i].goals;
            
            for(j in buts) {
                if(buts[j] > 0) {
                    $icons = $('<span/>').addClass('icons');
                    for(k = 1; k <= buts[j]; k++) {
                        $icons.append(utils.fontAwesomeIcon('futbol-o ' + j));
                    }
                    $page.find('.buteursHome').append(
                        $('<div/>').addClass('buteur text-right').append( $icons, players.home[i].name )
                    );
                }
            }
            $tabHome.addClass('tabHome').append(
                $('<tr/>').append(
                    $('<td/>').addClass('numero').html( players.home[i].rating ? players.home[i].number : utils.fontAwesomeIcon('chevron-left out') ),
                    $('<td/>').addClass('nom').text( players.home[i].name ),
                    $('<td/>').addClass('note ' + utils.classNote(players.home[i].rating) ).text( players.home[i].rating ),
                    $('<td/>').addClass('bonus').text( players.home[i].rating ? players.home[i].bonus : '' ),
                    $('<td/>').addClass('total-note').text( players.home[i].rating ? players.home[i].rating + players.home[i].bonus : '' )
                )
            )
        }
                
        for(i in players.away) {
            buts = players.away[i].goals;
            
            for(j in buts) {
                if(buts[j] > 0) {
                    $icons = $('<span/>').addClass('icons');
                    for(k = 1; k <= buts[j]; k++) {
                        $icons.append(utils.fontAwesomeIcon('futbol-o ' + j));
                    }
                    $page.find('.buteursAway').append(
                        $('<div/>').addClass('buteur').append( players.away[i].name, $icons )
                    );
                }
            }
            $tabAway.addClass('tabAway').append(
                $('<tr/>').append(
                    $('<td/>').addClass('numero').html( players.away[i].rating ? players.away[i].number : utils.fontAwesomeIcon('chevron-left out') ),
                    $('<td/>').addClass('nom').text( players.away[i].name ),
                    $('<td/>').addClass('note ' + utils.classNote(players.away[i].rating) ).text( players.away[i].rating ),
                    $('<td/>').addClass('bonus').text( players.away[i].rating ? players.away[i].bonus : '' ),
                    $('<td/>').addClass('total-note').text( players.away[i].rating ? players.away[i].rating + players.away[i].bonus : '' )
                )
            )
        }
    });
}

module.exports = {
    getMatch: getMatch
}
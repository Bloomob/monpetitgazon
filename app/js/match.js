"use strict";

var utils = require('js/utils'),
    $page = $('.page'),
    bonus,
    players,
    teamHome,
    teamAway,
    buts,
    remplacant,
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

    function loadMatchPage(args) {
        // console.log(args.data);
        bonus = args.data.bonus;
        players = args.data.players;
        teamHome = args.data.teamHome;
        teamAway = args.data.teamAway;

        $page.append(
            $('<div/>').addClass('header-match').append(
                $('<div/>').addClass('row').append(
                    $('<div/>').addClass('col-sm-4 col-md-5 text-right').append(
                        $('<div/>').addClass('row').append(
                            $('<div/>').addClass('col-xs-9 col-sm-12').append(
                                $('<div/>').addClass('equipe').append(
                                    $('<span/>').text(teamHome.name)
                                )
                            ),
                            $('<div/>').addClass('visible-xs col-xs-3').append(
                                $('<div/>').addClass('score').text(teamHome.score)
                            )
                        )
                    ),
                    $('<div/>').addClass('hidden-xs col-sm-4 col-md-2 text-center').append(
                        $('<div/>').addClass('score').text(teamHome.score + ' - ' + teamAway.score)
                    ),
                    $('<div/>').addClass('col-sm-4 col-md-5').append(
                        $('<div/>').addClass('row').append(
                            $('<div/>').addClass('col-xs-9 col-sm-12').append(
                                $('<div/>').addClass('equipe').append(
                                    $('<span/>').text(teamAway.name)
                                )
                            ),
                            $('<div/>').addClass('visible-xs col-xs-3').append(
                                $('<div/>').addClass('score').text(teamAway.score)
                            )
                        )
                    )
                ),
                $('<div/>').addClass('row').append(
                    $('<div/>').addClass('col-sm-5 buteursHome'),
                    $('<div/>').addClass('col-sm-5 col-sm-offset-2 buteursAway')
                )
            ),
            $('<div/>').addClass('content-match')
        );
        
        $tabHome = $('<table/>').addClass('table').append(
            $('<tr/>').append(
                $('<th/>').addClass('numero').text('Num'),
                $('<th/>').addClass('remplacement').text(''),
                $('<th/>').addClass('nom').text('Nom'),
                $('<th/>').addClass('note').text('Note'),
                $('<th/>').addClass('bonus').text('Bonus'),
                $('<th/>').addClass('total-note').text('Total')
            )
        );
        
        $tabAway = $tabHome.clone();
        
        $page.find('.content-match').append(
            $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-sm-6').append(
                    $tabHome
                ),
                $('<div/>').addClass('col-sm-6').append(
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
                    if(j == 'own_goal') {
                        $page.find('.buteursAway').append(
                            $('<div/>').addClass('buteur').append( players.home[i].name, $icons )
                        );
                    } else {
                        $page.find('.buteursHome').append(
                            $('<div/>').addClass('buteur text-right').append( $icons, players.home[i].name )
                        );
                    }
                }
            }
            $tabHome.addClass('tabHome').append(
                $('<tr/>').append(
                    $('<td/>').addClass('numero').text( players.home[i].number ),
                    $('<td/>').addClass('remplacement').html( players.home[i].substitute ? utils.fontAwesomeIcon('chevron-left out') : '' ),
                    $('<td/>').addClass('nom').text( players.home[i].name ),
                    $('<td/>').addClass('note ' + utils.classNote(players.home[i].rating) ).text( players.home[i].rating ),
                    $('<td/>').addClass('bonus').text( players.home[i].rating ? players.home[i].bonus : '' ),
                    $('<td/>').addClass('total-note').text( players.home[i].rating ? players.home[i].rating + players.home[i].bonus : '' )
                )
            )
            if(players.home[i].substitute) {
                remplacant = players.home[i].substitute;
                buts = remplacant.goals;

                for(j in buts) {
                    if(buts[j] > 0) {
                        $icons = $('<span/>').addClass('icons');
                        for(k = 1; k <= buts[j]; k++) {
                            $icons.append(utils.fontAwesomeIcon('futbol-o ' + j));
                        }
                        if(j == 'own_goal') {
                            $page.find('.buteursAway').append(
                                $('<div/>').addClass('buteur').append( remplacant.name, $icons )
                            );
                        } else {
                            $page.find('.buteursHome').append(
                                $('<div/>').addClass('buteur text-right').append( $icons, remplacant.name )
                            );
                        }
                    }
                }
                $tabHome.append(
                    $('<tr/>').append(
                        $('<td/>').addClass('numero').text( '' ),
                        $('<td/>').addClass('remplacement').html( utils.fontAwesomeIcon('chevron-right in') ),
                        $('<td/>').addClass('nom').text( remplacant.name ),
                        $('<td/>').addClass('note ' + utils.classNote(remplacant.rating) ).text( remplacant.rating ),
                        $('<td/>').addClass('bonus').text( remplacant.rating ? remplacant.bonus : '' ),
                        $('<td/>').addClass('total-note').text( remplacant.rating ? remplacant.rating + remplacant.bonus : '' )
                    )
                )
            }
        }
                
        for(i in players.away) {
            buts = players.away[i].goals;
            
            for(j in buts) {
                if(buts[j] > 0) {
                    $icons = $('<span/>').addClass('icons');
                    for(k = 1; k <= buts[j]; k++) {
                        $icons.append(utils.fontAwesomeIcon('futbol-o ' + j));
                    }
                    if(j != 'own_goal') {
                        $page.find('.buteursAway').append(
                            $('<div/>').addClass('buteur').append( players.home[i].name, $icons )
                        );
                    } else {
                        $page.find('.buteursHome').append(
                            $('<div/>').addClass('buteur text-right').append( $icons, players.home[i].name )
                        );
                    }
                }
            }
            $tabAway.addClass('tabAway').append(
                $('<tr/>').append(
                    $('<td/>').addClass('numero').text( players.away[i].number ),
                    $('<td/>').addClass('remplacement').html( players.away[i].substitute ? utils.fontAwesomeIcon('chevron-left out') : '' ),
                    $('<td/>').addClass('nom').text( players.away[i].name ),
                    $('<td/>').addClass('note ' + utils.classNote(players.away[i].rating) ).text( players.away[i].rating ),
                    $('<td/>').addClass('bonus').text( players.away[i].rating ? players.away[i].bonus : '' ),
                    $('<td/>').addClass('total-note').text( players.away[i].rating ? players.away[i].rating + players.away[i].bonus : '' )
                )
            )
            if(players.away[i].substitute) {
                remplacant = players.away[i].substitute;
                buts = remplacant.goals;
                
                for(j in buts) {
                    if(buts[j] > 0) {
                        $icons = $('<span/>').addClass('icons');
                        for(k = 1; k <= buts[j]; k++) {
                            $icons.append(utils.fontAwesomeIcon('futbol-o ' + j));
                        }
                        if(j != 'own_goal') {
                            $page.find('.buteursAway').append(
                                $('<div/>').addClass('buteur').append( remplacant.name, $icons )
                            );
                        } else {
                            $page.find('.buteursHome').append(
                                $('<div/>').addClass('buteur text-right').append( $icons, remplacant.name )
                            );
                        }
                    }
                }
                $tabAway.append(
                    $('<tr/>').append(
                        $('<td/>').addClass('numero').text( '' ),
                        $('<td/>').addClass('remplacement').html( utils.fontAwesomeIcon('chevron-right in') ),
                        $('<td/>').addClass('nom').text( remplacant.name ),
                        $('<td/>').addClass('note ' + utils.classNote(remplacant.rating) ).text( remplacant.rating ),
                        $('<td/>').addClass('bonus').text( remplacant.rating ? remplacant.bonus : '' ),
                        $('<td/>').addClass('total-note').text( remplacant.rating ? remplacant.rating + remplacant.bonus : '' )
                    )
                )
            }
        }
    }

    if(utils.getStorage('matchParId_' + id) != null) {
        loadMatchPage(utils.getStorage('matchParId_' + id).value);
    } else {
        $.when(getMatchParId(id).fail(erreurPromesse())).then(function(args){
            utils.setStorage('matchParId_' + id, args);
            loadMatchPage(args);
        });
    }
}

module.exports = {
    getMatch: getMatch
}
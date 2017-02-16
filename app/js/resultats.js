"use strict";

var $page = $('.page'),
    journee = 0,
    derniereJournee = 0,
    tab = [],
    tabPromesses = [],
    listeJournees = [],
    listeNotes = [],
    listePromesses,
    matchs,
    eq_home,
    eq_away,
    s_home = '',
    s_away = '',
    listeJoueurs,
    listeNotes,
    equipe,
    result,
    titu,
    sub,
    joueur,
    index,
    i,
    j,
    k;


function getResultats () {

    function getListeMatchParJournee (i) {
        return $.get({
            url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/calendar/" + i,
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getDerniereJournee () {
        return $.get({
            url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/calendar/",
            headers: { "Authorization": Cookies.get('token') }
        });
    }

    function compare(e) {
        return e.id === j;
    }

    $.when(getDerniereJournee()).then(function(args){
        derniereJournee = args.data.results.currentMatchDay;
    
        for(i = 1; i <= derniereJournee; i += 1) {
            tabPromesses.push(i);
        }
        listePromesses = tabPromesses.map(getListeMatchParJournee);

        $.when.apply($, listePromesses).then(function(){
            $page.append(
                $('<div/>').addClass('listeJournees').append(
                    $('<ul/>')
                ),
                $('<div/>').addClass('listeResultats')
            );

            for(i = 0; i < listePromesses.length; ++i) {
                journee = arguments[i][0].data.results.currentMatchDay;
                matchs = arguments[i][0].data.results.matches;
                listeJournees.push(journee);

                $page.find('.listeJournees ul').append(
                    $('<li/>').append(
                        $('<a/>').attr('href', '#' + journee).text(journee)
                    )
                );

                $page.find('.listeResultats').append(
                    $('<div/>').addClass('row').append(
                        $('<div/>').addClass('col-sm-12').append(
                            $('<h3/>').text('Journée ' + journee)
                        )
                    )
                );

                for(j in matchs) {
                    if (matchs.hasOwnProperty(j)) {
                        eq_home = matchs[j].teamHome.name;
                        eq_away = matchs[j].teamAway.name;
                        if(matchs[j].teamHome.score != undefined && matchs[j].teamAway.score != undefined) {
                            s_home = matchs[j].teamHome.score;
                            s_away = matchs[j].teamAway.score;
                        } else {
                            s_home = -1, s_away = -1;
                        }

                        $page.find('.listeResultats').append(
                            $('<div/>').addClass('row').append(
                                $('<div/>').addClass('col-sm-5 text-right').append(
                                    $('<span/>').text(eq_home)
                                ),
                                $('<div/>').addClass('col-sm-2 text-center').append(
                                    (s_home >= 0 && s_away >= 0) ?
                                        $('<a/>').attr('href', matchs[j].id).append(
                                            $('<span/>').text(s_home + ' - ' + s_away)
                                        ).click(function(e){
                                            e.preventDefault();
                                            window.location = '?match&' + $(this).attr('href');
                                        }) : $('<span/>').text('-')
                                ),
                                $('<div/>').addClass('col-sm-5').append(
                                    $('<span/>').text(eq_away)
                                )
                            )
                        );
                    }
                }
            }
        });
    });
}

module.exports = {
    getResultats: getResultats
}
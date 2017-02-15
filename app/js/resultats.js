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
    j_home,
    j_away,
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
            url: "https://api.monpetitgazon.com/championship/1/calendar/" + i,
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getDerniereJournee () {
        return $.get({
            url: "https://api.monpetitgazon.com/championship/1/calendar/",
            headers: { "Authorization": Cookies.get('token') }
        });
    }

    function compare(e) {
        return e.id === j;
    }

    $.when(getDerniereJournee()).then(function(args){
        derniereJournee = args.day;

        for(i = 18; i <= derniereJournee; i += 1) {
            tabPromesses.push(i);
        }
        listePromesses = tabPromesses.map(getListeMatchParJournee);

        $.when.apply($, listePromesses).then(function(){
            for(i = 0; i < listePromesses.length; ++i) {
                journee = arguments[i][0].day;
                matchs = arguments[i][0].matches;
                listeJournees.push(journee);

                console.log(matchs);

                for(j in matchs) {
                    if (matchs.hasOwnProperty(j)) {
                        eq_home = matchs[j].home.club;
                        eq_away = matchs[j].away.club;
                        j_home = matchs[j].home.players;
                        j_away = matchs[j].away.players;
                        listeJoueurs = Object.assign(j_home, j_away);


                        // console.log(listeJoueurs);

                        /*
                        for (k in listeJoueurs) {
                            if (listeJoueurs.hasOwnProperty(k)) {
                                
                            }
                        }*/
                    }
                }
            }
            console.log(listeNotes);
        });
    });
}

module.exports = {
    getResultats: getResultats
}
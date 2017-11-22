"use strict";

var utils = require('js/utils'),
    api = require('js/api'),
    $page = $('.page');

function getLiga() {
    var journee = 0,
        derniereJournee = 0,
        effectifs,
        joueurs,
        tab = [],
        tabPromessesMatchParJournee = [],
        tabPromessesDetailsParId = [],
        tabJournee = [],
        listeJournees = [],
        listeNotes = [],
        listePromessesMatchParJournee,
        listePromessesDetailsParId,
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
        notes,
        moyenne,
        noteClass,
        i,
        j,
        k,
        $ligneHead,
        $ligne;

    function compare(e) {
        return e.id === j;
    }

    function trouverEquipe (myArray, value) {
        for (var i in myArray) {
            for (var j in myArray[i].players) {
                if (myArray[i].players[j].id === 'player_' + value) {
                    return { nom: myArray[i].name, poste: myArray[i].players[j].position };
                }
            }
        }
    }

    function getInfosJoueurs (myArray, value) {
        for (var i in myArray) {
            if (myArray[i].id === 'player_' + value) {
                return { 
                    prenom: (myArray[i].firstname !== null) ? myArray[i].firstname : '',
                    nom: myArray[i].lastname,
                    poste: myArray[i].position
                };
            }
        }
    }

    function failPromessesMatchParJournee () {
        console.log('Une erreur est survenue');
    }

    /*
    if(utils.getStorage('derniereJournee') != null && utils.getStorage('effectifs') != null) {
        loadMatchsParJournee(utils.getStorage('derniereJournee').value, utils.getStorage('effectifs').value);
    } else {
        $.when(getDerniereJournee(), getEffectif()).then(function(args1, args2){
            derniereJournee = args1[0].day;
            effectifs = args2[0];
            utils.setStorage('derniereJournee', derniereJournee);
            utils.setStorage('effectifs', effectifs);

            loadMatchsParJournee(derniereJournee, effectifs);

            // loadLiguePage(listeNotes, effectifs);
        });
    }
    */
    var championnat = 3,
        league = "qsgSTTDmhPD";

    $.when(
        api.getApiDerniereJournee(championnat),
        api.getApiEffectif(league),
        api.getApiListeCotes(championnat)
    ).then(
        (args1, args2, args3) => {
            derniereJournee = (args1[0].matches[0].home.players.length > 0) ? args1[0].day : args1[0].day - 1;
            effectifs = args2[0];
            joueurs = args3[0];

            for(i = 1; i <= derniereJournee; i += 1) {
                tabPromessesMatchParJournee.push({ championnat: championnat, day: i });
            }
            listePromessesMatchParJournee = tabPromessesMatchParJournee.map(api.getApiListeMatchParJournee);

            $.when.apply($, listePromessesMatchParJournee).then(function(){
                for(i = 0; i < tabPromessesMatchParJournee.length; ++i) {
                    if(arguments[i].day != undefined) {
                        journee = arguments[i].day;
                        matchs = arguments[i].matches;
                    } else {
                        journee = arguments[i][0].day;
                        matchs = arguments[i][0].matches;
                    }
                    listeJournees.push(journee);

                    for(j in matchs) {
                        if (matchs.hasOwnProperty(j)) {

                            if(matchs[j].home.score !== undefined && matchs[j].home.score !== '') {
                                tabPromessesDetailsParId.push(matchs[j].id);
                                tabJournee.push(journee);
                            }
                        }
                    }
                }

                listePromessesDetailsParId = tabPromessesDetailsParId.map(api.getApiDetailsMatchParId);

                $.when.apply($, listePromessesDetailsParId).then(function(){
                    for(i = 0; i < tabPromessesDetailsParId.length; ++i) {
                        journee = tabJournee[i];

                        if(arguments[i].length > 0) {
                            eq_home = arguments[i][0].Home.club;
                            eq_away = arguments[i][0].Away.club;
                            j_home = arguments[i][0].Home.players;
                            j_away = arguments[i][0].Away.players;
                        } else {
                            eq_home = arguments[i].Home.club;
                            eq_away = arguments[i].Away.club;
                            j_home = arguments[i].Home.players;
                            j_away = arguments[i].Away.players;
                        }
                        listeJoueurs = Object.assign(j_home, j_away);

                        for (j in listeJoueurs) {
                            if (listeJoueurs.hasOwnProperty(j)) {
                                result = $.grep(listeNotes, compare);

                                if (j_away.hasOwnProperty(j)) {
                                    equipe = eq_away;
                                } else {
                                    equipe = eq_home;
                                }

                                if (listeJoueurs[j].info.sub) {
                                    titu = 0;
                                    sub = 1;
                                } else {
                                    titu = 1;
                                    sub = 0;
                                }

                                // console.log(listeJoueurs[j].info);

                                if (result.length === 0) {
                                    joueur = {
                                        id: j,
                                        nom: listeJoueurs[j].info.lastname,
                                        equipe: equipe,
                                        somme: listeJoueurs[j].info.note_final_2015,
                                        buts: listeJoueurs[j].info.goals,
                                        passe_dec: (listeJoueurs[j].stat.goal_assist !== undefined) ? listeJoueurs[j].stat.goal_assist : 0,
                                        titulaires: titu,
                                        remplacants: sub,
                                        notes: [
                                            {
                                                note: listeJoueurs[j].info.note_final_2015,
                                                journee: journee,
                                                sub: sub
                                            }
                                        ],
                                        tabNotes: [
                                            listeJoueurs[j].info.note_final_2015
                                        ]
                                    };
                                    listeNotes.push(joueur);
                                } else {
                                    index = listeNotes.indexOf(result[0]);
                                    listeNotes[index].buts += listeJoueurs[j].info.goals;
                                    listeNotes[index].passe_dec += (listeJoueurs[j].stat.goal_assist !== undefined) ? listeJoueurs[j].stat.goal_assist : 0;
                                    listeNotes[index].somme += listeJoueurs[j].info.note_final_2015;
                                    listeNotes[index].titulaires += titu;
                                    listeNotes[index].remplacants += sub;
                                    listeNotes[index].notes.push(
                                        {
                                            note: listeJoueurs[j].info.note_final_2015,
                                            journee: journee,
                                            sub: sub
                                        }
                                    );
                                    listeNotes[index].tabNotes.push(
                                        listeJoueurs[j].info.note_final_2015
                                    );
                                    // console.log(result);
                                }
                            }
                        }
                    }

                    $('.page').html(
                        $('<table/>').addClass('table liga').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').attr('data-filter-control', 'true').attr('data-filter-show-clear', 'true').attr('data-page-size', '50').append(
                            $('<thead/>'),
                            $('<tbody/>')
                        )
                    );

                    $ligneHead = $('<tr/>').append(
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'joueur').text('Joueur'),
                        $('<th/>').attr('data-sortable', true).attr('data-filter-control', 'select').attr('data-field', 'position').text('Position'),
                        $('<th/>').attr('data-sortable', true).attr('data-filter-control', 'select').attr('data-field', 'proprietaire').text('Propriétaire'),
                        $('<th/>').attr('data-sortable', true).attr('data-filter-control', 'select').attr('data-field', 'equipe').text('Equipe'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'buts').append(
                            $('<i/>').addClass('fa fa-futbol-o').attr('aria-hidden', true)
                        ),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'passe-dec').append(
                            $('<i/>').addClass('fa fa-futbol-o assist').attr('aria-hidden', true)
                        ),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'titulaires').append(
                            $('<i/>').addClass('fa fa-circle').attr('aria-hidden', true)
                        ),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'remplacants').append(
                            $('<i/>').addClass('fa fa-circle-thin').attr('aria-hidden', true)
                        ),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'moyenne').attr('title', 'Moyenne').text('Moy.'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'moyenne-reduite').attr('title', 'Moyenne réduite').text('M.Red'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'moyenne-5-derniers-matchs').attr('title', 'Moyenne des 5 derniers matchs').text('M.5DM')
                    );

                    for (i = 0; i < listeJournees.length; i += 1) {
                        $ligneHead.append($('<th/>').attr('data-sortable', true).attr('data-field', 'J' + listeJournees[i]).text('J' + listeJournees[i]));
                    }
                    $('.page table thead').append($ligneHead);

                    // console.log(effectifs.teams, liste_notes);

                    for (i in listeNotes) {
                        if (listeNotes.hasOwnProperty(i)) {
                            var infosJoueur = getInfosJoueurs(joueurs, listeNotes[i].id);

                            if(infosJoueur !== undefined) {
                                $ligne = $('<tr/>').append(
                                    $('<td/>').html('<strong>' + infosJoueur.prenom + ' ' + infosJoueur.nom + '</strong>'),
                                    $('<td/>').text(utils.postes[infosJoueur.poste]),
                                    $('<td/>').text(trouverEquipe(effectifs.teams, listeNotes[i].id) !== undefined ? (trouverEquipe(effectifs.teams, listeNotes[i].id))['nom'] : 'Libre'),
                                    $('<td/>').text(listeNotes[i].equipe),
                                    $('<td/>').text(listeNotes[i].buts),
                                    $('<td/>').text(listeNotes[i].passe_dec),
                                    $('<td/>').text(listeNotes[i].titulaires),
                                    $('<td/>').text(listeNotes[i].remplacants)
                                );
                                notes = listeNotes[i].notes;

                                moyenne = Math.round(listeNotes[i].somme / notes.length * 100) / 100;
                                var noteClass = utils.classNote(moyenne);
                                $ligne.append($('<td/>').addClass(noteClass).text(moyenne));

                                // Pour la moyenne réduite :
                                listeNotes[i].tabNotes.sort(function compareNombres(a, b) {
                                    return a - b;
                                });
                                var coeff = listeNotes[i].tabNotes.length * 0.3;
                                var nbrARetirer = Math.floor(coeff / 2) * 2;
                                listeNotes[i].tabNotes.splice(0, nbrARetirer/2);
                                listeNotes[i].tabNotes.splice(-nbrARetirer/2, nbrARetirer/2);
                                var somme = listeNotes[i].tabNotes.reduce(function(a, b) {
                                    return a + b;
                                }, 0);
                                var moyenneRed = Math.round(somme / listeNotes[i].tabNotes.length * 100) / 100;
                                var noteClass = utils.classNote(moyenneRed);
                                var diff = moyenneRed - moyenne;
                                $ligne.append($('<td/>').addClass(noteClass).text(moyenneRed + ' (' + diff.toFixed(2) + ')'));

                                k = notes.length - 1;
                                var tabNotes = [];
                                for (j = listeJournees.length - 1; j >= 0; j--) {
                                    if (notes[k] !== undefined) {
                                        if (listeJournees[j] === notes[k].journee) {
                                            tabNotes.push(notes[k].note);
                                            if(tabNotes.length > 4) {
                                                break;
                                            }
                                            k--;
                                        }
                                    }
                                }
                                var somme = tabNotes.reduce(function(a, b) {
                                    return a + b;
                                }, 0);
                                moyenne = Math.round(somme / tabNotes.length * 100) / 100;
                                var noteClass = utils.classNote(moyenne);
                                $ligne.append($('<td/>').addClass(noteClass).text(moyenne));

                                k = 0;
                                for (j = 0; j < listeJournees.length; j += 1) {
                                    if (notes[k] !== undefined) {
                                        if (listeJournees[j] === notes[k].journee) {
                                            var noteClass = utils.classNote(notes[k].note);

                                            if (notes[k].sub) {
                                                $ligne.append($('<td/>').addClass(noteClass).append(
                                                    $('<span/>').text(notes[k].note),
                                                    $('<i/>').addClass('fa fa-caret-right').attr('aria-hidden', true)
                                                ));
                                            } else {
                                                $ligne.append($('<td/>').addClass(noteClass).text(notes[k].note));
                                            }
                                            k += 1;
                                        } else {
                                            $ligne.append($('<td/>').text('X'));
                                        }
                                    } else {
                                        $ligne.append($('<td/>').text('X'));
                                        k += 1;
                                    }
                                }
                                $('.page table tbody').append($ligne);
                            }
                        }
                    }

                    $('.page .modal .selectpicker').selectpicker('refresh');
                    $('.page table').bootstrapTable({
                        pagination: true,
                        search: true,
                        showColumns: true
                    });
                });
            });
        }
    );
}

module.exports = {
    getLiga: getLiga
}
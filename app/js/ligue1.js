"use strict";

var utils = require('js/utils'),
    $page = $('.page');

function getLigue1() {
    var journee = 0,
        derniereJournee = 0,
        effectifs,
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
    
    function getListeMatchParJournee (i) {
        return $.get({
            url: "https://api.monpetitgazon.com/championship/1/calendar/" + i,
            headers: { "Authorization": Cookies.get('token') }
        });
    }

    function getDetailsMatchParId (id) {
        return $.get({
            url: "https://api.monpetitgazon.com/championship/match/" + id,
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getDerniereJournee () {
        return $.get({
            url: "https://api.monpetitgazon.com/championship/1/calendar/",
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getEffectif () {
        return $.get({
            url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/teams",
            headers: { "Authorization": Cookies.get('token') }
        });
    }

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

    function loadMatchsParJournee(derniereJournee, effectifs) {
        for(i = 18; i <= derniereJournee; i += 1) {
            tabPromessesMatchParJournee.push(i);
        }
        listePromessesMatchParJournee = tabPromessesMatchParJournee.map(getListeMatchParJournee);
    }

    function loadLiguePage(listeNotes, effectifs) {
        $('.page').append(
            $('<table/>').addClass('table ligue1').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').append(
                $('<thead/>'),
                $('<tbody/>')
            )
        );

        $ligneHead = $('<tr/>').append(
            $('<th/>').attr('data-sortable', true).attr('data-field', 'joueur').text('Joueur'),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'position').text('Position'),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'proprietaire').text('Propriétaire'),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'equipe').text('Equipe'),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'buts').append(
                $('<i/>').addClass('fa fa-futbol-o').attr('aria-hidden', true)
            ),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'titulaires').append(
                $('<i/>').addClass('fa fa-circle').attr('aria-hidden', true)
            ),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'remplacants').append(
                $('<i/>').addClass('fa fa-circle-thin').attr('aria-hidden', true)
            ),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'moyenne').text('Moy.')
        );

        for (i = 0; i < listeJournees.length; i += 1) {
            $ligneHead.append($('<th/>').attr('data-sortable', true).attr('data-field', 'J' + listeJournees[i]).text('J' + listeJournees[i]));
        }
        $('.page table thead').append($ligneHead);

        // console.log(effectifs.teams, liste_notes);

        for (i in listeNotes) {
            if (listeNotes.hasOwnProperty(i)) {
                $ligne = $('<tr/>').append(
                    $('<td/>').html('<strong>' + listeNotes[i].nom + '</strong>'),
                    $('<td/>').text(trouverEquipe(effectifs.teams, listeNotes[i].id) !== undefined ? utils.postes[(trouverEquipe(effectifs.teams, listeNotes[i].id))['poste']] : ''),
                    $('<td/>').text(trouverEquipe(effectifs.teams, listeNotes[i].id) !== undefined ? (trouverEquipe(effectifs.teams, listeNotes[i].id))['nom'] : 'Libre'),
                    $('<td/>').text(listeNotes[i].equipe),
                    $('<td/>').text(listeNotes[i].buts),
                    $('<td/>').text(listeNotes[i].titulaires),
                    $('<td/>').text(listeNotes[i].remplacants)
                );
                notes = listeNotes[i].notes;

                moyenne = Math.round(listeNotes[i].somme / notes.length * 100) / 100;

                if (moyenne >= 7) {
                    noteClass = 'perf-top';
                } else if (moyenne >= 6) {
                    noteClass = 'perf-good';
                } else if (moyenne >= 5) {
                    noteClass = 'perf-normal';
                } else if (moyenne >= 4) {
                    noteClass = 'perf-bad';
                } else if (moyenne < 4) {
                    noteClass = 'perf-awful';
                }

                $ligne.append($('<td/>').addClass(noteClass).text(moyenne));
                k = 0;
                for (j = 0; j < listeJournees.length; j += 1) {
                    if (notes[k] !== undefined) {
                        if (listeJournees[j] === notes[k].journee) {
                            if (notes[k].note >= 7) {
                                noteClass = 'perf-top';
                            } else if (notes[k].note >= 6) {
                                noteClass = 'perf-good';
                            } else if (notes[k].note >= 5) {
                                noteClass = 'perf-normal';
                            } else if (notes[k].note >= 4) {
                                noteClass = 'perf-bad';
                            } else if (notes[k].note < 4) {
                                noteClass = 'perf-awful';
                            }

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

        $('.page .modal .selectpicker').selectpicker('refresh');
        $('.page table').bootstrapTable({
            pagination: true,
            search: true,
            showColumns: true
        });
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

    $.when(getDerniereJournee(), getEffectif()).then(function(args1, args2){
        derniereJournee = args1[0].day;
        effectifs = args2[0];

        for(i = 18; i <= derniereJournee; i += 1) {
            tabPromessesMatchParJournee.push(i);
        }
        listePromessesMatchParJournee = tabPromessesMatchParJournee.map(getListeMatchParJournee);
        
        $.when.apply($, listePromessesMatchParJournee).then(function(){
            for(i = 0; i < tabPromessesMatchParJournee.length; ++i) {
                journee = arguments[i][0].day;
                matchs = arguments[i][0].matches;
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
            
            listePromessesDetailsParId = tabPromessesDetailsParId.map(getDetailsMatchParId);
            
            $.when.apply($, listePromessesDetailsParId).then(function(){
                for(i = 0; i < tabPromessesDetailsParId.length; ++i) {
                    journee = tabJournee[i];
                    eq_home = arguments[i][0].Home.club;
                    eq_away = arguments[i][0].Away.club;
                    j_home = arguments[i][0].Home.players;
                    j_away = arguments[i][0].Away.players;
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
                                    titulaires: titu,
                                    remplacants: sub,
                                    notes: [
                                        {
                                            note: listeJoueurs[j].info.note_final_2015,
                                            journee: journee,
                                            sub: sub
                                        }
                                    ]
                                };
                                listeNotes.push(joueur);
                            } else {
                                index = listeNotes.indexOf(result[0]);
                                listeNotes[index].buts += listeJoueurs[j].info.goals;
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
                                // console.log(result);
                            }
                        }
                    }
                }

                $('.page').append(
                    $('<table/>').addClass('table ligue1').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').attr('data-filter-control', 'true').attr('data-filter-show-clear', 'true').append(
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
                    $('<th/>').attr('data-sortable', true).attr('data-field', 'titulaires').append(
                        $('<i/>').addClass('fa fa-circle').attr('aria-hidden', true)
                    ),
                    $('<th/>').attr('data-sortable', true).attr('data-field', 'remplacants').append(
                        $('<i/>').addClass('fa fa-circle-thin').attr('aria-hidden', true)
                    ),
                    $('<th/>').attr('data-sortable', true).attr('data-field', 'moyenne').text('Moy.')
                );

                for (i = 0; i < listeJournees.length; i += 1) {
                    $ligneHead.append($('<th/>').attr('data-sortable', true).attr('data-field', 'J' + listeJournees[i]).text('J' + listeJournees[i]));
                }
                $('.page table thead').append($ligneHead);

                // console.log(effectifs.teams, liste_notes);

                for (i in listeNotes) {
                    if (listeNotes.hasOwnProperty(i)) {
                        $ligne = $('<tr/>').append(
                            $('<td/>').html('<strong>' + listeNotes[i].nom + '</strong>'),
                            $('<td/>').text(trouverEquipe(effectifs.teams, listeNotes[i].id) !== undefined ? utils.postes[(trouverEquipe(effectifs.teams, listeNotes[i].id))['poste']] : ''),
                            $('<td/>').text(trouverEquipe(effectifs.teams, listeNotes[i].id) !== undefined ? (trouverEquipe(effectifs.teams, listeNotes[i].id))['nom'] : 'Libre'),
                            $('<td/>').text(listeNotes[i].equipe),
                            $('<td/>').text(listeNotes[i].buts),
                            $('<td/>').text(listeNotes[i].titulaires),
                            $('<td/>').text(listeNotes[i].remplacants)
                        );
                        notes = listeNotes[i].notes;

                        moyenne = Math.round(listeNotes[i].somme / notes.length * 100) / 100;

                        if (moyenne >= 7) {
                            noteClass = 'perf-top';
                        } else if (moyenne >= 6) {
                            noteClass = 'perf-good';
                        } else if (moyenne >= 5) {
                            noteClass = 'perf-normal';
                        } else if (moyenne >= 4) {
                            noteClass = 'perf-bad';
                        } else if (moyenne < 4) {
                            noteClass = 'perf-awful';
                        }

                        $ligne.append($('<td/>').addClass(noteClass).text(moyenne));
                        k = 0;
                        for (j = 0; j < listeJournees.length; j += 1) {
                            if (notes[k] !== undefined) {
                                if (listeJournees[j] === notes[k].journee) {
                                    if (notes[k].note >= 7) {
                                        noteClass = 'perf-top';
                                    } else if (notes[k].note >= 6) {
                                        noteClass = 'perf-good';
                                    } else if (notes[k].note >= 5) {
                                        noteClass = 'perf-normal';
                                    } else if (notes[k].note >= 4) {
                                        noteClass = 'perf-bad';
                                    } else if (notes[k].note < 4) {
                                        noteClass = 'perf-awful';
                                    }

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

                $('.page .modal .selectpicker').selectpicker('refresh');
                $('.page table').bootstrapTable({
                    pagination: true,
                    search: true,
                    showColumns: true
                });
            });
        });
    });
}

module.exports = {
    getLigue1: getLigue1
}
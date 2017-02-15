"use strict";

var $page = $('.page');

function getLigue1() {
    var journee = 0,
        derniereJournee = 0,
        tab = [],
        tabPromessesMatchParJournee = [],
        tabPromessesDetailsParId = [],
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
        i,
        j,
        k;
    
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

    function compare(e) {
        return e.id === j;
    }

    $.when(getDerniereJournee()).then(function(args){
        derniereJournee = args.day;

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
                        tabPromessesDetailsParId.push(matchs[j].id);
                    }
                }
            }
            console.log(tabPromessesDetailsParId);

            listePromessesDetailsParId = tabPromessesDetailsParId.map(getDetailsMatchParId);

            $.when.apply($, listePromessesDetailsParId).then(function(){
                console.log(arguments);
            });
        });
    });
    
    /*$.ajax({
        url: "ajax/liste.php",
        method: "POST",
        dataType : 'json',
        data: { page: 'ligue1' }
    }).done(function (data) {
                    
        var matchs = data["ligue1"],
            effectifs = data["effectifs.json"],
            liste_notes = [],
            liste_journees = [],
            i,
            j,
            journee,
            j_home,
            j_away,
            eq_home,
            eq_away,
            equipe,
            joueurs,
            result,
            joueur,
            index,
            $ligne_head,
            $ligne,
            moyenne,
            noteClass,
            notes,
            k,
            position,
            titu,
            sub;

        function compare(e) {
            return e.id === j;
        }

        for (i in matchs) {
            if (matchs.hasOwnProperty(i)) {
                // console.log(matchs[i]);
                journee = i.split('_')[1];
                eq_home = matchs[i].Home.club;
                eq_away = matchs[i].Away.club;
                j_home = matchs[i].Home.players;
                j_away = matchs[i].Away.players;
                joueurs = Object.assign(j_home, j_away);

                if (liste_journees.indexOf(journee) === -1) {
                    liste_journees.push(journee);
                }

                for (j in joueurs) {
                    if (joueurs.hasOwnProperty(j)) {
                        result = $.grep(liste_notes, compare);
                        
                        if (j_away.hasOwnProperty(j)) {
                            equipe = eq_away;
                        } else {
                            equipe = eq_home;
                        }

                        if (joueurs[j].info.position === 'Goalkeeper') {
                            position = postes[1];
                        } else if (joueurs[j].info.position === 'Defender') {
                            position = postes[2];
                        } else if (joueurs[j].info.position === 'Midfielder') {
                            position = postes[3];
                        } else if (joueurs[j].info.position === 'Striker') {
                            position = postes[4];
                        }

                        if (joueurs[j].info.sub) {
                            titu = 0;
                            sub = 1;
                        } else {
                            titu = 1;
                            sub = 0;
                        }

                        if (result.length === 0) {
                            
                            joueur = {
                                id: j,
                                nom: joueurs[j].info.lastname,
                                position: position,
                                equipe: equipe,
                                somme: joueurs[j].info.note_final_2015,
                                buts: joueurs[j].info.goals,
                                titulaires: titu,
                                remplacants: sub,
                                notes: [
                                    {
                                        note: joueurs[j].info.note_final_2015,
                                        journee: journee,
                                        sub: sub
                                    }
                                ]
                            };
                            liste_notes.push(joueur);
                        } else {
                            index = liste_notes.indexOf(result[0]);
                            liste_notes[index].buts += joueurs[j].info.goals;
                            liste_notes[index].somme += joueurs[j].info.note_final_2015;
                            liste_notes[index].titulaires += titu;
                            liste_notes[index].remplacants += sub;
                            liste_notes[index].notes.push(
                                {
                                    note: joueurs[j].info.note_final_2015,
                                    journee: journee,
                                    sub: sub
                                }
                            );
                            // console.log(result);
                        }
                    }
                }
            }
        }

        $('.page').append(
            $('<div/>').addClass('actions').append(
                $('<button/>').addClass('btn btn-success').attr('type', 'button').attr('data-toggle', 'modal').attr('data-target', '#addMatch').text('Ajouter un match'),
                $('<div/>').addClass('modal fade').attr('id', 'addMatch').attr('role', 'dialog').attr('aria-labelledby', 'addMatch').append(
                    $('<div/>').addClass('modal-dialog').attr('role', 'document').append(
                        $('<div/>').addClass('modal-content').append(
                            $('<div/>').addClass('modal-header').append(
                                $('<button/>').attr('type', 'button').addClass('close').attr('data-dismiss', 'modal').attr('aria-label', 'Close').append(
                                    $('<span/>').attr('aria-hidden', 'true').html('&times;')
                                ),
                                $('<h4/>').addClass('modal-title').attr('id', 'addMatch').text('Ajouter un match - Format JSON')
                            ),
                            $('<div/>').addClass('modal-body').append(
                                $('<form/>').append(
                                    $('<div/>').addClass('row').append(
                                        $('<div/>').addClass('col-sm-6').append(
                                            $('<select/>').addClass('selectpicker').append(
                                                $('<option/>').val('ligue1').text('Ligue 1'),
                                                $('<option/>').val('premierleague').text('Premier League')
                                            )
                                        ),
                                        $('<div/>').addClass('col-sm-6').append(
                                            $('<input/>').attr('type', 'number').attr('placeholder', '0')
                                        ),
                                        $('<div/>').addClass('col-sm-12').append(
                                            $('<textarea/>').attr('placeholder', 'Ajouter le fichier json du match ici')
                                        )
                                    )
                                )
                            ),
                            $('<div/>').addClass('modal-footer').append(
                                $('<button/>').attr('type', 'button').addClass('btn btn-default').attr('data-dismiss', 'modal').text('Annuler'),
                                $('<button/>').attr('type', 'button').addClass('btn btn-primary btn-add-match').text('Enregistrer')
                            )
                        )
                    )
                )
            ),
            $('<table/>').addClass('table').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').append(
                $('<thead/>'),
                $('<tbody/>')
            )
        );
        
        function trouverEquipe (myArray, value) {
             // console.log(myArray, value);
             for (var i in myArray) {
                // console.log(myArray[i]);
                for (var j in myArray[i].players) {
                    // console.log(myArray[i].players[j].id, value);
                    if (myArray[i].players[j].id === 'player_' + value) {
                        return myArray[i].name;
                    }
                }
            }
         }

        $ligne_head = $('<tr/>').append(
            $('<th/>').attr('data-sortable', true).attr('data-field', 'joueur').text('Joueur'),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'position').text('Poste'),
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

        for (i = 0; i < liste_journees.length; i += 1) {
            $ligne_head.append($('<th/>').attr('data-sortable', true).attr('data-field', 'J' + liste_journees[i]).text('J' + liste_journees[i]));
        }
        $('.page table thead').append($ligne_head);
        
        // console.log(effectifs.teams, liste_notes);

        for (i in liste_notes) {
            if (liste_notes.hasOwnProperty(i)) {
                $ligne = $('<tr/>').append(
                    $('<td/>').html('<strong>' + liste_notes[i].nom + '</strong>'),
                    $('<td/>').text(liste_notes[i].position),
                    $('<td/>').text(trouverEquipe(effectifs.teams, liste_notes[i].id)),
                    $('<td/>').text(liste_notes[i].equipe),
                    $('<td/>').text(liste_notes[i].buts),
                    $('<td/>').text(liste_notes[i].titulaires),
                    $('<td/>').text(liste_notes[i].remplacants)
                );
                notes = liste_notes[i].notes;

                moyenne = Math.round(liste_notes[i].somme / notes.length * 100) / 100;

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
                for (j = 0; j < liste_journees.length; j += 1) {

                    if (notes[k] !== undefined) {
                        if (liste_journees[j] === notes[k].journee) {
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
        $('.page .modal .btn-add-match').on('click', function (e) {
            e.preventDefault();

            var ligue = $('.page form .selectpicker').val();
            var journee = $('.page form input').val();
            var json = $('.page form textarea').val();
            
            $.ajax({
                url: "ajax/ajout_match.php",
                method: "POST",
                data: {
                    ligue: ligue,
                    journee: journee,
                    json: json
                }
            }).done(function (data) {
                console.log(data);
                $('.page form input').val('');
                $('.page form textarea').val('');
                $('.page .modal').modal('hide');
                location.reload();
            });
        });
    });*/
}

module.exports = {
    getLigue1: getLigue1
}
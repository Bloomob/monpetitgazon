"use strict";

var $page = $('.page');

function getLive() {
    $.ajax({
        url: "ajax/liste.php",
        method: "POST",
        dataType : 'json',
        data: { page: 'resultats' }
    }).done(function (data) {
        var resultats = data.resultats,
            ligue1 = data.ligue1,
            journee,
            eq_home,
            eq_away,
            j_home,
            j_away,
            s_home,
            s_away,
            joueurs,
            i,
            j,
            liste_journees = [],
            liste_notes = [],
            result,
            joueur,
            equipe,
            position,
            titu,
            sub,
            index,
            $ligne;
         
        function compare(e) {
            return e.id === j;
        }
         
        for (i in ligue1) {
            if (ligue1.hasOwnProperty(i)) {
                // console.log(matchs[i]);
                journee = i.split('_')[1];
                eq_home = ligue1[i].Home.club;
                eq_away = ligue1[i].Away.club;
                j_home = ligue1[i].Home.players;
                j_away = ligue1[i].Away.players;
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
        
        $page.append(
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
                                            $('<input/>').attr('type', 'number').addClass('journee').attr('placeholder', '0')
                                        )
                                    ),
                                    $('<div/>').addClass('row').append(
                                        $('<div/>').addClass('col-sm-6').append(
                                            
                                            $('<select/>').addClass('selectpicker').addClass('equipe equipe1').attr('title', 'Choisisser l\'équipe à domicile'),
                                            $('<textarea/>').addClass('journee').addClass('equipe1').attr('placeholder', 'Ajouter le fichier json l\'équipe à domicile ici')
                                        ),
                                        $('<div/>').addClass('col-sm-6').append(
                                            $('<select/>').addClass('selectpicker').addClass('equipe equipe2').attr('title', 'Choisisser l\'équipe à l\'exterieur'),
                                            $('<textarea/>').addClass('journee').addClass('equipe2').attr('placeholder', 'Ajouter le fichier json l\'équipe à l\'exterieur ici')
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
            $('<div/>').addClass('panel-group').attr('id', 'accordion').attr('role', 'tablist').attr('aria-multiselectable', 'true')
        );
         
         function trouverNote (myArray, value) {
             // console.log(myArray, value);
             for (var i in myArray) {
                if ('player_' + myArray[i].id === value) {
                    if(myArray[i].notes[myArray[i].notes.length-1].journee == 23) {
                        return myArray[i].notes[myArray[i].notes.length-1].note;
                    }
                }
            }
         }
         console.log(resultats);
         var k = 1;
        for (i in resultats) {
            if (resultats.hasOwnProperty(i)) {
                $page.find('.panel-group').append(
                    $('<div/>').addClass('panel panel-default').attr('data-match', i).append(
                        $('<div/>').addClass('panel panel-heading').attr('id', 'heading_' + k).attr('role', 'tab').append(
                            $('<a/>').attr('role', 'button').attr('data-toggle', 'collapse').attr('data-parent', '#accordion').attr('href', '#collapse_' + k).attr('aria-expanded', 'false').attr('aria-controls', 'collapse_' + k).append(
                                $('<div/>').addClass('row').append(
                                    $('<div/>').addClass('col-sm-6').append(
                                        $('<h4/>').addClass('panel-title').text(resultats[i].Home.equipe)
                                    ),
                                    $('<div/>').addClass('col-sm-6').append(
                                        $('<h4/>').addClass('panel-title').text(resultats[i].Away.equipe)
                                    )
                                )
                            )
                        ),
                        $('<div/>').addClass('panel-collapse collapse').attr('id', 'collapse_' + k).attr('role', 'tabpanel').attr('aria-labelledby', '#heading_' + k).append(
                            $('<div/>').addClass('panel-body').append(
                                $('<div/>').addClass('row').append(
                                    $('<div/>').addClass('col-sm-6').append(
                                        $('<table/>').addClass('table home').attr('data-toggle', 'table').append(
                                            $('<thead/>').append(
                                                $('<tr/>').append(
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'numero'),
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'joueur').text('Joueur'),
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'note').text('Note'),
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'bonus').text('Bonus'),
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'final').text('Final')
                                                )
                                            ),
                                            $('<tbody/>')
                                        )
                                    ),
                                    $('<div/>').addClass('col-sm-6').append(
                                        $('<table/>').addClass('table away').attr('data-toggle', 'table').append(
                                            $('<thead/>').append(
                                                $('<tr/>').append(
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'numero'),
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'joueur').text('Joueur'),
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'note').text('Note'),
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'bonus').text('Bonus'),
                                                    $('<th/>').attr('data-sortable', true).attr('data-field', 'final').text('Final')
                                                )
                                            ),
                                            $('<tbody/>')
                                        )
                                    )
                                )
                            )
                        )
                    )
                );
                
                // j_home = Object.assign(resultats[i].Home.players, 
                s_home = resultats[i].Home.substitutes;
                for(j in s_home) {
                    resultats[i].Home.players.push(resultats[i].Home.substitutes[j]);
                }
                
                j_home = resultats[i].Home.players;
                for(j in j_home) {
                    $ligne = $('<tr/>').append(
                        $('<td/>').text(j_home[j].number),
                        $('<td/>').text(j_home[j].name || j_home[j].substituteName),
                        $('<td/>').text(trouverNote(liste_notes, j_home[j].playerid)),
                        $('<td/>').text(0),
                        $('<td/>').text(0)
                    );
                    $('[data-match="' + i +'"] table.home tbody').append($ligne);
                }
                
                s_away = resultats[i].Away.substitutes;
                for(j in s_away) {
                    resultats[i].Away.players.push(resultats[i].Away.substitutes[j]);
                }
                
                j_away = resultats[i].Away.players; // resultats[i].Away.substitutes
                for(j in j_away) {
                    $ligne = $('<tr/>').append(
                        $('<td/>').text(j_away[j].number),
                        $('<td/>').text(j_away[j].name || j_away[j].substituteName),
                        $('<td/>').text(trouverNote(liste_notes, j_away[j].playerid)),
                        $('<td/>').text(0),
                        $('<td/>').text(0)
                    );
                    $('[data-match="' + i +'"] table.away tbody').append($ligne);
                }
            }
            k++;
         }
         
        for (i = 0; i < teams.length; i += 1) {
            $('.page .modal .selectpicker.equipe').append($('<option/>').val(teams[i]).text(teams[i]));
        }

        $('.page .modal .selectpicker').selectpicker('refresh');
        $('.page table').bootstrapTable();
        $('.page .modal .btn-add-match').on('click', function (e) {
            e.preventDefault();

            var ligue = $('.page form .selectpicker').val();
            var journee = $('.page form .journee').val();
            var equipe1 = $('.page form select.equipe1').val();
            var equipe2 = $('.page form select.equipe2').val();
            var Home = JSON.parse($('.page form textarea.equipe1').val());
            var Away = JSON.parse($('.page form textarea.equipe2').val());
            
            Home.equipe = equipe1;
            Away.equipe = equipe2;
            
            var data = JSON.stringify({Home, Away});
            $.ajax({
                url: "ajax/ajout_resultat.php",
                method: "POST",
                data: {
                    ligue: ligue,
                    journee: journee,
                    json: data
                }
            }).done(function (data) {
                console.log(data);
                $('.page form input').val('');
                $('.page form textarea').val('');
                $('.page .modal').modal('hide');
                location.reload();
            });
        });
    });
}

module.exports = {
    getLive: getLive
}
$(function () {
    "use strict";

    /* Variables gloables */
    var postes = [
        'Aucun',
        'Gardien',
        'Défenseur',
        'Milieu',
        'Attaquant'
    ];

    /* Fonctions globales */

    function getResultats() {
        $.getJSON('data/journee_2_1.json', function (data) {
            // console.log(journee);
            var journee = data.data.results,
                date = new Date(journee.date),
                listeMatchs = journee.matches,
                $resultats = $('.page'),
                i,
                teamHome,
                teamAway;

            for (i in listeMatchs) {
                if (listeMatchs.hasOwnProperty(i)) {
                    teamHome = listeMatchs[i].teamHome;
                    teamAway = listeMatchs[i].teamAway;
                    // console.log(teamHome, teamAway);
                    $resultats.append(
                        $('<div/>').addClass('row').append(
                            $('<div/>').addClass('col-sm-5 text-right').text(teamHome.name),
                            $('<div/>').addClass('col-sm-2 text-center').append(
                                $('<a/>').attr('href', '?match').text(teamHome.score + ' - ' + teamAway.score)
                            ),
                            $('<div/>').addClass('col-sm-5').text(teamAway.name)
                        )
                    );
                }
            }
        });
    }

    function getMatch() {
        $.getJSON('data/match_2_1_4.json', function (data) {
            /*console.log(data.data);
            console.log(data.data.players.away[0].name);*/

            var teamHome = data.data.teamHome,
                teamAway = data.data.teamAway;

            $('.match').append(
                $('<div/>').addClass('row').append(
                    $('<div/>').addClass('col-sm-5 text-right').text(teamHome.name),
                    $('<div/>').addClass('col-sm-2 text-center').text(teamHome.score + ' - ' + teamAway.score),
                    $('<div/>').addClass('col-sm-5').text(teamAway.name)
                )
            );
        });
    }

    function getStatistiques() {

        var allRating = [];

        $.ajax({
            url: "ajax/liste.php",
            method: "POST",
            dataType : 'json',
            data: { page: 'statistiques' }
        }).done(function (data) {
            // console.log(data);

            $('.page').append(
                $('<div/>').addClass('row').append(
                    $('<div/>').addClass('col-sm-4').append(
                        $('<h3/>').text('Les plus gros transferts'),
                        $('<div/>').addClass('plus-gros-transferts')
                    ),
                    $('<div/>').addClass('col-sm-4'),
                    $('<div/>').addClass('col-sm-4')
                )
            );

            var stat_max_price = data.max_price,
                $tableau = $('.plus-gros-transferts'),
                i,
                $ligne;

            for (i in stat_max_price) {
                if (stat_max_price.hasOwnProperty(i)) {
                    $ligne = $('<div/>').addClass('row').append(
                        $('<div/>').addClass('col-sm-6 text-right').text(stat_max_price[i].nom),
                        $('<div/>').addClass('col-sm-6').text(stat_max_price[i].prix)
                    );
                    $tableau.append($ligne);
                }
            }
        });

        /*
        $.getJSON('data/ligue1/match_20_01.json', function( data ) {
            console.log(data);

            var joueurs = data.Home.players;
            for(i in joueurs) {
                var joueur = { 'id': joueurs[i].info.idplayer, 'name': joueurs[i].info.lastname, 'rating': [joueurs[i].info.note_final_2015] };

                allRating.push(joueur);
            }
        });

        $.getJSON('data/match_2_1_4.json', function( data ) {
            console.log(data.data);
            var joueurs = data.data.players;


            for(lieu in joueurs) {
                var liste = joueurs[lieu];

                for(i in liste){
                    console.log(liste[i]);
                    var joueur = { 'id': liste[i].id, 'name': liste[i].name, 'rating': [liste[i].rating] };
                    allRating.push(joueur);
                    $('.statistiques').append(
                        $('<div/>').addClass('row').append(
                            $('<div/>').addClass('col-sm-6').text(liste[i].name),
                            $('<div/>').addClass('col-sm-6').text(liste[i].rating)
                        )
                    )
                }
            }
            console.log(allRating);
        }); */
    }

    function getClassement() {
        $.ajax({
            url: "ajax/liste.php",
            method: "POST",
            dataType : 'json',
            data: { page: 'classement' }
        }).done(function (data) {
            var classement = data.ranking,
                clubs = data.teams,
                $tableau,
                i,
                donnees,
                $ligne,
                equipe;

            $tableau = $('<table/>').addClass('table').append(
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
            for (i = 0; i < classement.length; i += 1) {
                donnees = classement[i];
                $ligne = $('<tr/>');

                for (equipe in donnees) {
                    if (donnees.hasOwnProperty(equipe)) {
                        if (equipe === 'teamid') {
                            $ligne.append($('<td/>').text(clubs[donnees[equipe]].name));
                        } else if (equipe === 'rank') {
                            $ligne.prepend($('<td/>').text(donnees[equipe]));
                        } else {
                            $ligne.append($('<td/>').text(donnees[equipe]));
                        }
                    }
                }
                $tableau.append($ligne);
            }
            $('.page').append($tableau);
        });
    }

    function getEffectifs() {
        $.ajax({
            url: "ajax/liste.php",
            method: "POST",
            dataType : 'json',
            data: { page: 'effectif' }
        }).done(function (data) {
            var clubs = data.teamsid,
                effectifs = data.teams,
                i,
                effectif,
                tab_joueurs,
                equipe_joueurs,
                $ligne;

            function redirect(e) {
                window.location.href = '?joueur&id=' + $(e.target).data('idplayer');
            }

            $('.page').append(
                $('<div/>').addClass('filtres').append(
                    $('<div/>').addClass('row').append(
                        $('<div/>').addClass('col-md-2').append(
                            $('<label/>').text('Equipe')
                        ),
                        $('<div/>').addClass('col-md-10').append(
                            $('<select/>').addClass('selectpicker').append(
                                $('<option/>').val('all').text('Toutes')
                            )
                        )
                    )
                ),
                $('<table/>').addClass('table').append(
                    $('<thead/>').append(
                        $('<tr/>').append(
                            $('<th/>').text('Prénom'),
                            $('<th/>').text('Nom'),
                            $('<th/>').text('Poste'),
                            $('<th/>').text('Club'),
                            $('<th/>').text('Prix d\'achat'),
                            $('<th/>').text('Team MPG')
                        )
                    ),
                    $('<tbody/>')
                )
            );

            for (i = 0; i < clubs.length; i += 1) {
                $('.page .filtres .selectpicker').append($('<option/>').val(clubs[i].id).text(clubs[i].name));
            }

            for (effectif in effectifs) {
                if (effectifs.hasOwnProperty(effectif)) {
                    tab_joueurs = effectifs[effectif].players;
                    equipe_joueurs = effectifs[effectif].name;

                    for (i = 0; i < tab_joueurs.length; i += 1) {
                        $ligne = $('<tr/>').attr('data-idplayer', tab_joueurs[i].id).append(
                            $('<td/>').text(tab_joueurs[i].firstname),
                            $('<td/>').text(tab_joueurs[i].lastname),
                            $('<td/>').text(postes[tab_joueurs[i].position]),
                            $('<td/>').text(tab_joueurs[i].club),
                            $('<td/>').text(tab_joueurs[i].price_paid),
                            $('<td/>').attr('data-teamid', effectifs[effectif].id).text(equipe_joueurs)
                        ).on('click', redirect);
                        $('.page table tbody').append($ligne);
                    }
                }
            }
        });
    }

    function getLigue1() {
        $.ajax({
            url: "ajax/liste.php",
            method: "POST",
            dataType : 'json',
            data: { page: 'ligue1' }
        }).done(function (data) {
            var matchs = data,
                liste_notes = [],
                liste_journees = [],
                i,
                j,
                journee,
                j_home,
                j_away,
                eq_home,
                eq_away,
                joueurs,
                result,
                joueur,
                index,
                $ligne_head,
                $ligne,
                notes,
                k;

            function compare(e) {
                return e.id === j;
            }

            for (i in matchs) {
                if (matchs.hasOwnProperty(i)) {
                    // console.log(matchs[i]);
                    journee = i.split('_')[1];
                    j_home = matchs[i].Home.players;
                    eq_home = matchs[i].Home.club;
                    j_away = matchs[i].Away.players;
                    eq_away = matchs[i].Away.club;
                    joueurs = Object.assign(j_home, j_away);

                    if (liste_journees.indexOf(journee) === -1) {
                        liste_journees.push(journee);
                    }

                    for (j in joueurs) {
                        if (joueurs.hasOwnProperty(j)) {
                            result = $.grep(liste_notes, compare);

                            if (result.length === 0) {
                                joueur = {
                                    id: j,
                                    nom: joueurs[j].info.lastname,
                                    somme: joueurs[j].info.note_final_2015,
                                    notes: [
                                        {
                                            note: joueurs[j].info.note_final_2015,
                                            journee: journee
                                        }
                                    ]
                                };
                                liste_notes.push(joueur);
                            } else {
                                index = liste_notes.indexOf(result[0]);
                                liste_notes[index].somme += joueurs[j].info.note_final_2015;
                                liste_notes[index].notes.push(
                                    {
                                        note: joueurs[j].info.note_final_2015,
                                        journee: journee
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
                                        $('<textarea/>').attr('placeholder', 'Ajouter le fichier json du match ici')
                                    )
                                ),
                                $('<div/>').addClass('modal-footer').append(
                                    $('<button/>').attr('type', 'button').addClass('btn btn-default').attr('data-dismiss', 'modal').text('Annuler'),
                                    $('<button/>').attr('type', 'button').addClass('btn btn-primary').text('Enregistrer')
                                )
                            )
                        )
                    )
                ),
                $('<table/>').addClass('table').attr('data-toggle', 'table').append(
                    $('<thead/>'),
                    $('<tbody/>')
                )
            );

            $ligne_head = $('<tr/>').append(
                $('<th/>').attr('data-sortable', true).attr('data-field', 'joueur').text('Joueur'),
                $('<th/>').attr('data-sortable', true).attr('data-field', 'moyenne').text('Moyenne')
            );

            for (i = 0; i < liste_journees.length; i += 1) {
                $ligne_head.append($('<th/>').attr('data-sortable', true).attr('data-field', 'J' + liste_journees[i]).text('J' + liste_journees[i]));
            }
            $('.page table thead').append($ligne_head);

            for (i in liste_notes) {
                if (liste_notes.hasOwnProperty(i)) {
                    $ligne = $('<tr/>').append(
                        $('<td/>').html('<strong>' + liste_notes[i].nom + '</strong>')
                    );
                    notes = liste_notes[i].notes;
                    $ligne.append($('<td/>').text(Math.round(liste_notes[i].somme / notes.length * 100) / 100));
                    k = 0;
                    for (j = 0; j < liste_journees.length; j += 1) {

                        if (notes[k] !== undefined) {
                            if (liste_journees[j] === notes[k].journee) {
                                $ligne.append($('<td/>').text(notes[k].note));
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
            $('.page table').bootstrapTable({
                pagination: true
            });
        });
    }


    function loadPage() {
        var path = window.location.search,
            tab = path.split('?')[1].split('&'),
            page = tab[0];

        $('.page.' + page).removeClass('hidden');

        // selectMenu();
        if (page === 'classement') {
            getClassement();
        } else if (page === 'resultats') {
            getResultats();
        } else if (page === 'statistiques') {
            getStatistiques();
        } else if (page === 'equipes') {
            getEffectifs();
        } else if (page === 'match') {
            getMatch();
        } else if (page === 'ligue1') {
            getLigue1();
        }
        // getHome();
    }

    loadPage();
});
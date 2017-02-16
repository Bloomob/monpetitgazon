(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("js/app.js", function(exports, require, module) {
"use strict";

var utils = require('js/utils'),
    home = require('js/home'),
    resultats = require('js/resultats'),
    transferts = require('js/transferts'),
    live = require('js/live'),
    statistiques = require('js/statistiques'),
    classement = require('js/classement'),
    effectifs = require('js/effectifs'),
    ligue1 = require('js/ligue1'),

    /* Variables gloables */
    teams = [],
    $page = $('.page');

/* Fonctions globales */

function seConnecter(email, password) {
    $page.find('alert alert-danger').remove();
    $.post({
        url: "https://api.monpetitgazon.com/user/signIn",
        data: {
            email: email,
            password: password,
            language: "fr-FR"
        },
        dataType: 'json'
    }).done(function(data) {
        console.log(data);
        Cookies.set('token', data.token, { expires: 7 });
        // $page.append(data); 
    }).fail(function(data) {
        $page.find('form').before(
            $('<div/>').addClass('alert alert-danger').attr('role', 'alert').text('Erreur utilisateur / mot de passe incorrect')
        );
    });
}

function getMatch() {
    
}

function get404() {
    $page.append(
        $('<h1/>').text('La page demandée n\'existe pas !')
    )
}

function loadPage() {
    var path = window.location.search,
        tab = path.split('?')[1].split('&'),
        page = tab[0];

    utils.getTeams();
    if (page === 'home') {
        home.getHome();
    } else if (page === 'classement') {
        classement.getClassement();
    } else if (page === 'transferts') {
        transferts.getTransferts();
    } else if (page === 'resultats') {
        resultats.getResultats();
    } else if (page === 'live') {
        live.getLive();
    } else if (page === 'statistiques') {
        statistiques.getStatistiques();
    } else if (page === 'equipes') {
        effectifs.getEffectifs();
    } else if (page === 'match') {
        getMatch();
    } else if (page === 'ligue1') {
        ligue1.getLigue1();
    } else {
        get404();
    }
    // getHome();
}

loadPage();
});

require.register("js/classement.js", function(exports, require, module) {
"use strict";

var $page = $('.page');

function getClassement() {
    $.get({
        url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/ranking",
        headers: { "Authorization": Cookies.get('token') }
    }).done(function(data) {
        var classement = data.ranking,
            clubs = data.teams,
            $tableau,
            i,
            j,
            s,
            donnees,
            $ligne,
            serie,
            equipe;

        $tableau = $('<table/>').addClass('table classement').append(
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
                    }  else if (equipe === 'series') {
                        $ligne.append($('<td/>').addClass('serie'));
                        serie = donnees[equipe].split("");
                        
                        for(s in serie) {
                            $ligne.find('.serie').append($('<span/>').addClass(serie[s]));
                        }
                        
                    } else {
                        $ligne.append($('<td/>').text(donnees[equipe]));
                    }
                }
            }
            $tableau.append($ligne);
        }
        $page.append($tableau);
        $tableau.bootstrapTable();
    });
}

module.exports = {
    getClassement: getClassement
}
});

;require.register("js/effectifs.js", function(exports, require, module) {
"use strict";

var utils = require('js/utils'),
    $page = $('.page');

function getEffectifs() {
    $.get({
        url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/teams",
        headers: { "Authorization": Cookies.get('token') }
    }).done(function (data){
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
            /*$('<div/>').addClass('filtres').append(
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
            ),*/
            $('<table/>').addClass('table').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').append(
                $('<thead/>').append(
                    $('<tr/>').append(
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'joueur').text('Joueur'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'poste').text('Poste'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'club').text('Club'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'prix_achat').text('Prix d\'achat'),
                        $('<th/>').attr('data-sortable', true).attr('data-field', 'team_mpg').text('Team MPG')
                    )
                ),
                $('<tbody/>')
            )
        );

        /*for (i = 0; i < clubs.length; i += 1) {
            $('.page .filtres .selectpicker').append($('<option/>').val(clubs[i].id).text(clubs[i].name));
        }*/

        for (effectif in effectifs) {
            if (effectifs.hasOwnProperty(effectif)) {
                tab_joueurs = effectifs[effectif].players;
                equipe_joueurs = effectifs[effectif].name;

                for (i = 0; i < tab_joueurs.length; i += 1) {
                    $ligne = $('<tr/>').attr('data-idplayer', tab_joueurs[i].id).append(
                        $('<td/>').html((tab_joueurs[i].firstname) ? tab_joueurs[i].firstname + ' ' + tab_joueurs[i].lastname : '' + tab_joueurs[i].lastname),
                        $('<td/>').text(utils.postes[tab_joueurs[i].position]),
                        $('<td/>').text(tab_joueurs[i].club),
                        $('<td/>').text(tab_joueurs[i].price_paid),
                        $('<td/>').attr('data-teamid', effectifs[effectif].id).text(equipe_joueurs)
                    ).on('click', redirect);
                    $('.page table tbody').append($ligne);
                }
            }
        }
        // $('.page .filtres .selectpicker').selectpicker('refresh');
        $('.page table').bootstrapTable({
            pagination: true,
            search: true,
            showColumns: true
        });
    });
}

module.exports = {
    getEffectifs: getEffectifs
}
});

;require.register("js/home.js", function(exports, require, module) {
"use strict";

var $page = $('.page');

function getHome() {
    $page.append(
        $('<div/>').addClass('row').append(
            $('<div/>').addClass('col-sm-6 col-sm-offset-3').append(
                $('<form/>').append(
                    $('<div/>').addClass('form-group').append(
                        $('<label/>').attr('for', 'emailInput').text('Entrez votre Email MPG :'),
                        $('<input/>').addClass('form-control').attr('type', 'email').attr('placeholder', 'ex : test@mail.fr').attr('id', 'emailInput')
                    ),
                    $('<div/>').addClass('form-group').append(
                        $('<label/>').attr('for', 'passwordInput').text('Entrez votre mot de passe MPG :'),
                        $('<input/>').addClass('form-control').attr('type', 'password').attr('placeholder', 'Saissisez votre mote de passe MPG').attr('id', 'passwordInput')
                    ),
                    $('<button/>').addClass('btn btn-primary seconnecter').attr('type', 'submit').text('Se connecter')
                )
            )
        )
    );
    $('.seconnecter').click(function(e){
        e.preventDefault();
        seConnecter($('#emailInput').val(), $('#passwordInput').val());
    });
}

module.exports = {
    getHome: getHome
}
});

;require.register("js/ligue1.js", function(exports, require, module) {
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
                        if(matchs[j].home.score || matchs[j].home.score !== '') {
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
                                return { nom: myArray[i].name, poste: myArray[i].players[j].position };
                            }
                        }
                    }
                 }

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
            });
        });
    });
}

module.exports = {
    getLigue1: getLigue1
}
});

;require.register("js/live.js", function(exports, require, module) {
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
});

;require.register("js/resultats.js", function(exports, require, module) {
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
});

;require.register("js/statistiques.js", function(exports, require, module) {
"use strict";

var $page = $('.page');

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

module.exports = {
    getStatistiques: getStatistiques
}
});

;require.register("js/transferts.js", function(exports, require, module) {
"use strict";

var $page = $('.page');

function getTransferts() {
    $.get({
        url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/transfer/buy",
        headers: {"Authorization": Cookies.get('token')}
    }).done(function(data) {
        console.log(data);
    });
}

module.exports = {
    getTransferts: getTransferts
}
});

;require.register("js/utils.js", function(exports, require, module) {
"use strict";
var postes = [
        'Aucun',
        'Gardien',
        'Défenseur',
        'Milieu',
        'Attaquant'
    ],
    teams = [];

function getTeams() {
    $.ajax({
        url: "ajax/liste.php",
        method: "POST",
        dataType : 'json',
        data: { page: 'effectif' }
    }).done(function (data) {
        var clubs = data.teamsid,
            i;
        
        for (i = 0; i < clubs.length; i += 1) {
            teams.push(clubs[i].name);
        }
        return teams;
    });
}

module.exports = {
    postes: postes,
    getTeams: getTeams
}
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map
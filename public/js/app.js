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
    match = require('js/match'),

    /* Variables gloables */
    teams = [],
    $page = $('.page');

/* Fonctions globales */

function get404() {
    $page.append(
        $('<h1/>').text('La page demandée n\'existe pas !')
    )
}

function loadPage() {
    var path = window.location.search,
        tab = path.split('?')[1].split('&'),
        page = tab[0],
        id = tab[1];

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
        match.getMatch(id);
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
});

;require.register("js/live.js", function(exports, require, module) {
"use strict";

var utils = require('js/utils'),
    $page = $('.page'),
    tabPromesses = [],
    listeMatchsStorage = [],
    listePromesses,
    listePromesses1,
    listePromesses2,
    isStorage = true,
    listeMatchsStorage,
    i;

function getLive() {
    
    function getListeEquipesLive () {
        return $.get({
            url: "https://api.monpetitgazon.com/live",
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getEquipeLive (donnees) {
        return $.get({
            url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/pitch_game/" + donnees[0] + "/" + donnees[1],
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getDerniersResultats () {
        return $.get({
            url: "https://api.monpetitgazon.com/championship/1/calendar/",
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getListeMatchs (i) {
        return $.get({
            url: "https://api.monpetitgazon.com/championship/match/" + i,
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function loadMatchsLivePage (listeMatchsStorage) {
        console.log(listeMatchsStorage);
        
        for(i = 0; i < listeMatchsStorage.length - 1; i+=1) {
            console.log(listeMatchsStorage[i][0]);
        }
    }
    
    function loadLivePage (derniersResultats, listeEquipesLive) {        
        for(i = 0; i < derniersResultats.length - 1; i += 1) {
            if(derniersResultats[i].home.score !== undefined && derniersResultats[i].home.score !== '') {
                tabPromesses.push(derniersResultats[i].id);
                isStorage = utils.getStorage('match_' + derniersResultats[i].id) != null && isStorage;

                if(utils.getStorage('match_' + derniersResultats[i].id) != null)
                    listeMatchsStorage.push(utils.getStorage('match_' + derniersResultats[i].id).value);
            }
        }
        listePromesses1 = tabPromesses.map(getListeMatchs);
        
        for(i = 0; i < listeEquipesLive.length - 1; i += 1) {
            tabPromesses.push([listeEquipesLive[i].id, listeEquipesLive[0].home.id]);
            tabPromesses.push([listeEquipesLive[i].id, listeEquipesLive[0].away.id]);
            
            /*
                tabPromesses.push(listeEquipesLive[i].id);
                isStorage = utils.getStorage('match_' + derniersResultats[i].id) != null && isStorage;

                if(utils.getStorage('match_' + derniersResultats[i].id) != null)
                    listeMatchsStorage.push(utils.getStorage('match_' + derniersResultats[i].id).value);
            */
        }
        
        listePromesses2 = tabPromesses.map(getEquipeLive);        
        listePromesses = listePromesses1.concat(listePromesses2);
        
        if(isStorage) {
            loadMatchsLivePage(listeMatchsStorage);
        } else {
            $.when.apply($, listePromesses).then(function(){
                
                loadMatchsLivePage(arguments);
            });
        }
    }
    
    if(utils.getStorage('derniersResultats') != null && utils.getStorage('listeEquipesLive') != null) {
        loadLivePage(utils.getStorage('derniersResultats').value, utils.getStorage('listeEquipesLive').value);
    } else {
        $.when(getDerniersResultats(), getListeEquipesLive()).then(function(args1, args2){
            utils.setStorage('derniersResultats', args1[0].matches);
            utils.setStorage('listeEquipesLive', args2[0][0].matches);
            loadLivePage(args1[0].matches, args2[0][0].matches);
        });
    }
}

module.exports = {
    getLive: getLive
}
});

;require.register("js/match.js", function(exports, require, module) {
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

function fontAwesomeIcon(nom) {
    return $('<i/>').addClass('fa fa-' + nom).attr('aria-hidden', 'true');
}

function classNote (note) {
    if (note >= 7) {
        return 'perf-top';
    } else if (note >= 6) {
        return 'perf-good';
    } else if (note >= 5) {
        return 'perf-normal';
    } else if (note >= 4) {
        return 'perf-bad';
    } else {
        return 'perf-awful';
    }
}

function getStorage (key) {
    if(localStorage.getItem(key) != null) {
        return $.parseJSON(localStorage.getItem(key));
    } else {
        return null;
    }
}

function setStorage (key, value) {
    localStorage.setItem(key, JSON.stringify({value: value}));
}

module.exports = {
    postes: postes,
    getTeams: getTeams,
    fontAwesomeIcon: fontAwesomeIcon,
    classNote: classNote,
    getStorage: getStorage,
    setStorage: setStorage,
}
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map
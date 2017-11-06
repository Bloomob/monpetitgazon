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
require.register("js/api.js", function(exports, require, module) {
"use strict";

function getApiDashboard() {
	return $.get({
        url: "https://api.monpetitgazon.com/user/dashboard",
        headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiBadge(id) {
	return $.get({
        url: "https://api.monpetitgazon.com/user/badges/" + id,
        headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiClassement(tokenLeague) {
	return $.get({
    url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/ranking",
    headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiMatchParId (tokenLeague, id) {
  return $.get({
    url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/results/" + id,
    headers: { "Authorization": Cookies.get('token') }
  });
}

function getApiEffectifs (tokenLeague) {
	return $.get({
    url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/teams",
    headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiTransfertsHistorique (tokenLeague) {
	return $.get({
    url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/transfer/history",
    headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiTransfertsAchats (tokenLeague) {
	return $.get({
    url: "https://api.monpetitgazon.com/league/" + tokenLeague + "/transfer/buy",
    headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiListeCotes (leagueNumber) {
	return $.get({
    url: "https://api.monpetitgazon.com/quotation/" + leagueNumber,
    headers: { "Authorization": Cookies.get('token') }
	});
}

module.exports = {
  getApiBadge: getApiBadge,
  getApiDashboard: getApiDashboard,
  getApiClassement: getApiClassement,
  getApiMatchParId: getApiMatchParId,
  getApiEffectifs: getApiEffectifs,
  getApiTransfertsHistorique: getApiTransfertsHistorique,
  getApiTransfertsAchats: getApiTransfertsAchats,
  getApiListeCotes: getApiListeCotes
}
});

;require.register("js/app.js", function(exports, require, module) {
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
    pl = require('js/pl'),
    liga = require('js/liga'),
    match = require('js/match'),

    /* Variables gloables */
    teams = [],
    $page = $('.page');

/* Fonctions */
function loadPage() {
    var path = window.location.search,
        tab = (path.length > 0) ? path.split('?')[1].split('&') : [],
        page = tab[0],
        id = tab[1];

    $page.append(
        $('<div/>').addClass('text-center text-success').append(
            utils.fontAwesomeIcon('spinner fa-pulse fa-3x fa-fw')
        )
    );

    utils.getTeams();
    if (page === 'classement') {
        classement.getClassements();
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
    } else if (page === 'pl') {
        pl.getPl();
    } else if (page === 'liga') {
        liga.getLiga();
    } else {
        home.getHome();
    }
    // getHome();
}

loadPage();
});

require.register("js/classement.js", function(exports, require, module) {
"use strict";

var api = require('js/api');
    
var $page = $('.page'),
    classementTotal = {},
    user = 0,
    l,
    nomLeagues = [],
    tabPromessesLeagues = [],
    listePromessesLeague,
    i,
    j,
    p,
    s,
    classement,
    clubs,
    $tableau,
    i,
    donnees,
    $ligne,
    serie,
    equipe;

function getClassements() {
    $.when(api.getApiDashboard()).then(function(args){
        for(l of args.data.leagues) {
            tabPromessesLeagues.push(l.id);
            nomLeagues.push(l.name);
        }
        listePromessesLeague = tabPromessesLeagues.map(api.getApiClassement);
        
        $.when.apply($, listePromessesLeague).then(function(){
            for(p = 0; p < listePromessesLeague.length; ++p) {
                $tableau = $('<div/>').addClass('classement').append(
                    $('<h3/>').addClass('').text(nomLeagues[p]),
                    $('<table/>').addClass('table').append(
                        $('<thead/>').append(
                            $('<tr/>').append(
                                $('<th/>'),
                                $('<th/>').addClass('equipe').text('Equipe'),
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
                    )
                );
                classement = (arguments[p]) ? arguments[p][0].ranking : null,
                clubs = (arguments[p]) ? arguments[p][0].teams : null;
                
                if(classement != null) {
                    for (i = 0; i < classement.length; i += 1) {
                        donnees = classement[i];
                        $ligne = $('<tr/>');

                        for (equipe in donnees) {                            
                            if (donnees.hasOwnProperty(equipe)) {
                                if (equipe === 'teamid') {
                                    $ligne.append($('<td/>').addClass('equipe').text(clubs[donnees[equipe]].name));
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
                        user = donnees.teamid.split('_')[4];
                        classementTotal[user] = {
                            user: user,
                            played: (classementTotal[user]) ? donnees.played + classementTotal[user].played : donnees.played,
                            victory: (classementTotal[user]) ? donnees.victory + classementTotal[user].victory : donnees.victory,
                            draw: (classementTotal[user]) ? donnees.draw + classementTotal[user].draw : donnees.draw,
                            defeat: (classementTotal[user]) ? donnees.defeat + classementTotal[user].defeat : donnees.defeat,
                            goal: (classementTotal[user]) ? donnees.goal + classementTotal[user].goal : donnees.goal,
                            goalconceded: (classementTotal[user]) ? donnees.goalconceded + classementTotal[user].goalconceded : donnees.goalconceded,
                            difference: (classementTotal[user]) ? donnees.difference + classementTotal[user].difference : donnees.difference,
                            points: (classementTotal[user]) ? donnees.points + classementTotal[user].points : donnees.points
                        }
                        $tableau.find('tbody').append($ligne);
                    }
                }
                if(p == 0)
                    $page.html($tableau);
                else
                    $page.append($tableau);
            }
            $('.table').bootstrapTable();
            classement = Object.values(classementTotal);
            classement.sort(function (a, b) {
                return b.points - a.points;
            });
            
            $tableau = $('<div/>').addClass('classement').append(
                $('<h3/>').addClass('').text('Classement général'),
                $('<table/>').addClass('table').append(
                    $('<thead/>').append(
                        $('<tr/>').append(
                            $('<th/>'),
                            $('<th/>').addClass('equipe').text('Equipe'),
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
                )
            );
            j = 1;
            for (i in classement) {
                donnees = classement[i];
                $ligne = $('<tr/>');
                
                for (equipe in donnees) {                            
                    if (donnees.hasOwnProperty(equipe)) {
                        if(equipe === 'user') {
                            user = donnees.user;
                            $ligne.prepend($('<td/>').text(j));
                            $ligne.append($('<td/>').addClass('equipe user_' + user));
                            $.when(api.getApiBadge(user)).then(function(args){
                                $('.user_' + this.url.split('/')[5]).text(args.firstname);
                            });
                        } else
                            $ligne.append($('<td/>').text(donnees[equipe]));
                    }
                }
                j++;
                $tableau.find('tbody').append($ligne);
            }
            
            $page.prepend($tableau);
        });
    });
}

module.exports = {
    getClassements: getClassements
}
});

;require.register("js/effectifs.js", function(exports, require, module) {
"use strict";

var utils = require('js/utils'),
    api = require('js/api'),
    $page = $('.page'),
    clubs,
    equipes,
    i,
    effectif,
    tab_joueurs,
    equipe_joueurs,
    $ligne;


function redirect(e) {
    window.location.href = '?joueur&id=' + $(e.target).data('idplayer');
}

function loadPageEffectifs(effectifs) {
    clubs = effectifs.teamsid,
    equipes = effectifs.teams,
    
    $('.page').html(
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

    for (effectif in equipes) {
        if (equipes.hasOwnProperty(effectif)) {
            tab_joueurs = equipes[effectif].players;
            equipe_joueurs = equipes[effectif].name;

            for (i = 0; i < tab_joueurs.length; i += 1) {
                $ligne = $('<tr/>').attr('data-idplayer', tab_joueurs[i].id).append(
                    $('<td/>').html((tab_joueurs[i].firstname) ? tab_joueurs[i].firstname + ' ' + tab_joueurs[i].lastname : '' + tab_joueurs[i].lastname),
                    $('<td/>').text(utils.postes[tab_joueurs[i].position]),
                    $('<td/>').text(tab_joueurs[i].club),
                    $('<td/>').text(tab_joueurs[i].price_paid),
                    $('<td/>').text(equipe_joueurs)
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
}

function getEffectifs() {
    if(utils.getStorage('effectifs') != null) {
        loadPageEffectifs(utils.getStorage('effectifs').value);
    } else {
        $.when(api.getApiEffectifs()).then(function(args){
            utils.setStorage('effectifs', args);
            loadPageEffectifs(args);
        });
    }
}

module.exports = {
    getEffectifs: getEffectifs
}
});

;require.register("js/home.js", function(exports, require, module) {
"use strict";

var $page = $('.page');

function getHome() {
    $page.html(
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
                    $('<div/>').addClass('text-right').append(
                        $('<button/>').addClass('btn btn-success seconnecter').attr('type', 'submit').text('Se connecter')
                    )
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
        Cookies.set('token', data.token, { expires: 7 });
        window.location.href = '?classement';
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

;require.register("js/liga.js", function(exports, require, module) {
"use strict";

var utils = require('js/utils'),
    $page = $('.page');

function getLiga() {
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
            url: "https://api.monpetitgazon.com/championship/3/calendar/" + i,
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
            url: "https://api.monpetitgazon.com/championship/3/calendar/",
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getEffectifLiga () {
        return $.get({
            url: "https://api.monpetitgazon.com/league/qsgSTTDmhPD/teams",
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
        for(i = 1; i <= derniereJournee; i += 1) {
            tabPromessesMatchParJournee.push(i);
        }
        listePromessesMatchParJournee = tabPromessesMatchParJournee.map(getListeMatchParJournee);
    }

    function loadLiguePage(listeNotes, effectifs) {
        $page.html(
            $('<table/>').addClass('table liga').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').append(
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

    $.when(getDerniereJournee(), getEffectifLiga()).then(function(args1, args2){
        derniereJournee = args1[0].day;
        effectifs = args2[0];

        for(i = 1; i <= derniereJournee; i += 1) {
            tabPromessesMatchParJournee.push(i);
        }
        listePromessesMatchParJournee = tabPromessesMatchParJournee.map(getListeMatchParJournee);
        
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
            
            listePromessesDetailsParId = tabPromessesDetailsParId.map(getDetailsMatchParId);
            
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

                $('.page').html(
                    $('<table/>').addClass('table liga').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').attr('data-filter-control', 'true').attr('data-filter-show-clear', 'true').append(
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
    getLiga: getLiga
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
        for(i = 1; i <= derniereJournee; i += 1) {
            tabPromessesMatchParJournee.push(i);
        }
        listePromessesMatchParJournee = tabPromessesMatchParJournee.map(getListeMatchParJournee);
    }
    /*
    function loadLiguePage(listeNotes, effectifs) {
        $page.html(
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
            $('<th/>').attr('data-sortable', true).attr('data-field', 'moyenne').text('Moy.'),
            $('<th/>').attr('data-sortable', true).attr('data-field', 'moyenne').text('Moy. Red')
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
    */

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

        for(i = 1; i <= derniereJournee; i += 1) {
            tabPromessesMatchParJournee.push(i);
        }
        listePromessesMatchParJournee = tabPromessesMatchParJournee.map(getListeMatchParJournee);

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

            listePromessesDetailsParId = tabPromessesDetailsParId.map(getDetailsMatchParId);

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
                        moyenne = Math.round(somme / listeNotes[i].tabNotes.length * 100) / 100;
                        var noteClass = utils.classNote(moyenne);
                        $ligne.append($('<td/>').addClass(noteClass).text(moyenne));

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

    function loadNoLive () {
        $page.html(
            $('<div/>').addClass('alert alert-warning text-center').attr('role', 'alert').append(
                utils.fontAwesomeIcon('ban text-warning'),
                $('<span/>').text('Pas de live actuellement')
            )
        );
    }
    
    function loadMatchsLivePage (listeMatchsStorage, listeEquipesLive) {
        console.log(listeMatchsStorage, listeEquipesLive);
        
        for(i = 0; i < listeEquipesLive.length - 1; i+=1) {
            console.log(listeMatchsStorage[i][0]);
        }
    }
    
    function loadLivePage (derniersResultats, listeEquipesLive) {
        console.log(derniersResultats, listeEquipesLive);

        for(i = 0; i < derniersResultats.length; i += 1) {
            if(
                derniersResultats[i].home.score !== undefined && 
                derniersResultats[i].home.score !== ''
            ) {
                tabPromesses.push(derniersResultats[i].id);
                isStorage = utils.getStorage('match_' + derniersResultats[i].id) != null && isStorage;
                
                if(isStorage)
                    listeMatchsStorage.push(utils.getStorage('match_' + derniersResultats[i].id).value);
            }
        }
        listePromesses1 = tabPromesses.map(getListeMatchs);
        
        tabPromesses = [];
        for(i = 0; i < listeEquipesLive.length; i += 1) {
            tabPromesses.push([listeEquipesLive[i].id, listeEquipesLive[0].home.id]);
            tabPromesses.push([listeEquipesLive[i].id, listeEquipesLive[0].away.id]);
            
            /*
            isStorage = utils.getStorage('equipeLive_' + listeEquipesLive[i].id) != null && isStorage;

            if(utils.getStorage('equipeLive_' + listeEquipesLive[i].id) != null)
                listeEquipesStorage.push(utils.getStorage('equipeLive_' + listeEquipesLive[i].id).value);*/
        }
        listePromesses2 = tabPromesses.map(getEquipeLive);
        listePromesses = listePromesses1.concat(listePromesses2);

        $.when.apply($, listePromesses).then(function(){
            console.log(arguments);
            // loadMatchsLivePage(arguments);
        });
    }
    
    $.when(getDerniersResultats(), getListeEquipesLive()).then(function(args1, args2){
        utils.setStorage('derniersResultats', args1[0].matches);

        if(args2[0].success) {
            loadNoLive();
        } else {
            utils.setStorage('listeEquipesLive', args2[0][0].matches);
            loadLivePage(args1[0].matches, args2[0][0].matches);
        }
    });
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
            $page.html(
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

        $page.html(
            $('<div/>').append(
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
            )
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
                            $('<div/>').addClass('buteur').append( players.away[i].name, $icons )
                        );
                    } else {
                        $page.find('.buteursHome').append(
                            $('<div/>').addClass('buteur text-right').append( $icons, players.away[i].name )
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

;require.register("js/pl.js", function(exports, require, module) {
"use strict";

var utils = require('js/utils'),
    $page = $('.page');

function getPl() {
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
            url: "https://api.monpetitgazon.com/championship/2/calendar/" + i,
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
            url: "https://api.monpetitgazon.com/championship/2/calendar/",
            headers: { "Authorization": Cookies.get('token') }
        });
    }
    
    function getEffectifPL () {
        return $.get({
            url: "https://api.monpetitgazon.com/league/pVDbR4qmirg/teams",
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
        for(i = 1; i <= derniereJournee; i += 1) {
            tabPromessesMatchParJournee.push(i);
        }
        listePromessesMatchParJournee = tabPromessesMatchParJournee.map(getListeMatchParJournee);
    }

    function loadLiguePage(listeNotes, effectifs) {
        $page.html(
            $('<table/>').addClass('table pl').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').append(
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

    $.when(getDerniereJournee(), getEffectifPL()).then(function(args1, args2){
        derniereJournee = args1[0].day;
        effectifs = args2[0];

        for(i = 1; i <= derniereJournee; i += 1) {
            tabPromessesMatchParJournee.push(i);
        }
        listePromessesMatchParJournee = tabPromessesMatchParJournee.map(getListeMatchParJournee);
        
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
            
            listePromessesDetailsParId = tabPromessesDetailsParId.map(getDetailsMatchParId);
            
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

                $('.page').html(
                    $('<table/>').addClass('table pl').attr('data-sort-name', 'joueur').attr('data-toggle', 'table').attr('data-filter-control', 'true').attr('data-filter-show-clear', 'true').append(
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
    getPl: getPl
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
            $page.html(
                $('<div/>').append(
                    $('<div/>').addClass('listeJournees').append(
                        $('<ul/>')
                    ), 
                    $('<div/>').addClass('listeResultats')
                )
            );
            
            for(i = 0; i < listePromesses.length; ++i) {
                console.log(arguments[i]);
                if(arguments[i].length > 0) {
                    journee = arguments[i][0].data.results.currentMatchDay;
                    matchs = arguments[i][0].data.results.matches;
                } else {
                    journee = arguments[i].data.results.currentMatchDay;
                    matchs = arguments[i].data.results.matches;
                }
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

var utils = require('js/utils'),
    api = require('js/api'),
    $page = $('.page'),
    allRating = [],
    now,
    joueurs,
    listeJoueurs = [],
    prixMoyens = [0, [], [], [], []],
    result = [],
    stats = {},
    effectif,
    equipe,
    prix,
    prixPrec,
    i,
    j;

function loadPageStatistiques(equipes, budgets, cotes) { 
    console.log(cotes);
    
    for(i in equipes) {
        joueurs = equipes[i].players;

        for(j = 0; j < joueurs.length - 1; j += 1) {
            listeJoueurs.push(joueurs[j]);
        }
    }
    $('.page').html(
        $('<div/>').addClass('stats').append(
            $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-sm-6 prixMoyensParPoste'),
                $('<div/>').addClass('col-sm-6 prixMoyensParEquipe'),
                $('<div/>').addClass('col-sm-6 budgetParEquipe')
            )
        )
    );
    loadMoyPrixParPoste(listeJoueurs);
    loadMoyPrixParEquipe(equipes);
    loadBudgetParEquipe(equipes, budgets);
}

function loadMoyPrixParPoste(listeJoueurs) {
    $('.prixMoyensParPoste').append(
        $('<h3/>').text('Prix moyens par poste'),
        $('<table/>').addClass('table tabPrixMoyensParPoste').append(
            $('<tr/>').append(
                $('<th/>').text('Poste'),
                $('<th/>').text('Prix'),
                $('<th/>').text('Nbr'),
                $('<th/>').text('Total')
            )
        )
    );

    for(i = 0; i < listeJoueurs.length - 1; i += 1) {
        prixMoyens[listeJoueurs[i].position].push(listeJoueurs[i].price_paid);
    }

    for(i = 1; i < utils.postes.length; i += 1) {
        prix = Math.round(prixMoyens[i].reduce(function(a,b){ return a + b; }, 0) / prixMoyens[i].length);
        
        $('.tabPrixMoyensParPoste').append(
            $('<tr/>').append(
                $('<td/>').text(utils.postes[i]),
                $('<td/>').text(prix + 'M€'),
                $('<td/>').text(prixMoyens[i].length),
                $('<td/>').text(prixMoyens[i].reduce(function(a,b){ return a + b; }, 0) + 'M€')
            )
        );
    }
}

function loadMoyPrixParEquipe(equipes) {
    $('.prixMoyensParEquipe').append(
        $('<h3/>').text('Prix moyens par équipe'),
        $('<table/>').addClass('table tabPrixMoyensParEquipe').append(
            $('<tr/>').append(
                $('<th/>').text('Equipe'),
                $('<th/>').text('Prix'),
                $('<th/>').text('Nbr'),
                $('<th/>').text('Total')
            )
        )
    );

    for(i in equipes) {
        joueurs = equipes[i].players;
        equipe = equipes[i].name;
        listeJoueurs = [];

        for(j = 0; j < joueurs.length - 1; j += 1) {
            listeJoueurs.push(joueurs[j].price_paid);
        }
        prix = Math.round(listeJoueurs.reduce(function(a,b){ return a + b; }, 0) / listeJoueurs.length);
        
        $('.tabPrixMoyensParEquipe').append(
            $('<tr/>').append(
                $('<td/>').text(equipe),
                $('<td/>').text(prix + 'M€'),
                $('<td/>').text(listeJoueurs.length),
                $('<td/>').text(listeJoueurs.reduce(function(a,b){ return a + b; }, 0) + 'M€')
            )
        );
    }
}

function loadBudgetParEquipe(equipes, budgets) {
    $('.budgetParEquipe').append(
        $('<h3/>').text('Budget par équipe'),
        $('<table/>').addClass('table tabBudgetParEquipe').append(
            $('<tr/>').append(
                $('<th/>').text('Equipe'),
                $('<th/>').text('Investi'),
                $('<th/>').text('Restant'),
                $('<th/>').text('Total')
            )
        )
    );

    for(i in equipes) {
        joueurs = equipes[i].players;
        equipe = equipes[i].name;
        listeJoueurs = [];

        for(j = 0; j < joueurs.length - 1; j += 1) {
            listeJoueurs.push(joueurs[j].price_paid);
        }
        prix = Math.round(listeJoueurs.reduce(function(a,b){ return a + b; }, 0) / listeJoueurs.length);
        
        $('.tabBudgetParEquipe').append(
            $('<tr/>').append(
                $('<td/>').text(equipe),
                $('<td/>').text(listeJoueurs.reduce(function(a,b){ return a + b; }, 0) + 'M€'),
                $('<td/>').text( budgets[i.split('mpg_team_pVArFY4W1nn$$mpg_user_')[1]].budget + 'M€'),
                $('<td/>').text( (listeJoueurs.reduce(function(a,b){ return a + b; }, 0) + budgets[i.split('mpg_team_pVArFY4W1nn$$mpg_user_')[1]].budget) + 'M€')
            )
        );
    }
}

function getStatistiques() {
    now = new Date();
    
    if(
        utils.isStorage('effectifs') && 
        utils.isStorage('transfertsHistorique') && 
        utils.isStorage('listeCotes')
    ) {
        loadPageStatistiques(
            utils.getStorage('effectifs').value.teams, 
            utils.getStorage('transfertsHistorique').value,
            utils.getStorage('transfertsHistorique').value
        );
    } else {
        $.when(
            api.getApiEffectifs(),
            api.getApiTransfertsHistorique(), 
            api.getApiListeCotes()
        ).then(function(args1, args2, args3){
            utils.setStorage('effectifs', args1[0]);
            utils.setStorage('transfertsHistorique', args2[0]);
            utils.setStorage('listeCotes', args3[0]);
            loadPageStatistiques(args1[0].teams, args2[0].teams, args3[0]);
        });
    }
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
    teams = [],
    now;

function getTeams() {
    return teams;
}

function fontAwesomeIcon(nom) {
    return $('<i/>').addClass('fa fa-' + nom).attr('aria-hidden', 'true');
}

function classNote(note) {
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
    var expires = new Date();
    expires.setDate(expires.getDay() + 1);
    localStorage.setItem(key, JSON.stringify({value: value, expires: expires}));
}

function isStorage (key) {
    now = new Date();
    if(getStorage(key) != null && getStorage(key).expires < now.getTime()) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    postes: postes,
    getTeams: getTeams,
    fontAwesomeIcon: fontAwesomeIcon,
    classNote: classNote,
    getStorage: getStorage,
    setStorage: setStorage,
    isStorage: isStorage
}
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map
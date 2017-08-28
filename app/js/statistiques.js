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
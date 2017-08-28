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
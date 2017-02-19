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
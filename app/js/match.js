"use strict";

var utils = require('js/utils'),
    $page = $('.page');

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

    $.when(getMatchParId(id).fail(erreurPromesse())).then(function(args){
        console.log(args);

        $page.append(
            $('<h2/>').text('Vous cherchez le match ' + id)
        )
    });
}

module.exports = {
    getMatch: getMatch
}
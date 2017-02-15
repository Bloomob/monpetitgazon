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
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
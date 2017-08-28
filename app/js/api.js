"use strict";

function getApiClassement() {
	return $.get({
    url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/ranking",
    headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiMatchParId (id) {
  return $.get({
    url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/results/" + id,
    headers: { "Authorization": Cookies.get('token') }
  });
}

function getApiEffectifs () {
	return $.get({
    url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/teams",
    headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiTransfertsHistorique () {
	return $.get({
    url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/transfer/history",
    headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiTransfertsAchats () {
	return $.get({
    url: "https://api.monpetitgazon.com/league/pVArFY4W1nn/transfer/buy",
    headers: { "Authorization": Cookies.get('token') }
	});
}

function getApiListeCotes () {
	return $.get({
    url: "https://api.monpetitgazon.com/quotation/1",
    headers: { "Authorization": Cookies.get('token') }
	});
}

module.exports = {
  getApiClassement: getApiClassement,
  getApiMatchParId: getApiMatchParId,
  getApiEffectifs: getApiEffectifs,
  getApiTransfertsHistorique: getApiTransfertsHistorique,
  getApiTransfertsAchats: getApiTransfertsAchats,
  getApiListeCotes: getApiListeCotes
}
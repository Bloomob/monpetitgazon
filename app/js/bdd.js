"use strict";

var db;

if(window.openDatabase){
    db = openDatabase('mpg', '1.0', 'database', 10000000);
}

function onSuccess(e, data) {
    return data;
}
function onError(e) {
    console.error(e.message);
}

function createTable(tableName) {
    db.transaction( tx => {
        tx.executeSql(
            "CREATE TABLE "+ tableName +" (id REAL UNIQUE, text TEXT)",
            [],
            onSuccess,
            onError
        );
    });
}

function readTable(tableName, id) {
    db.readTransaction(function (t) {
        t.executeSql(
            'SELECT text FROM '+ tableName +' WHERE id=?',
            [id],
            onSuccess,
            onError
        );
    });
}

function writeTable(tableName, ch) {
    db.transaction( tx => {
        tx.executeSql(
            'INSERT INTO '+ tableName +' (id, text) VALUES (?, ?)', 
            [ch.key, ch.value],
            onSuccess, 
            onError
        );
    });
}

module.exports = {
    createTable: createTable,
    readTable: readTable,
    writeTable: writeTable
}
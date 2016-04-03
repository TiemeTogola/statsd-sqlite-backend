var sql = require('sql.js'),
    fs = require('fs');

// use NOT NULL, UNIQUE for sets
// CHECK and DEFAULT constraints
// use a primary key
// // schemas
//CREATE TABLE Gauges (timestamp varchar?text?int, name text, value real);
//CREATE TABLE Sets ...
//use datetime function, or use js function inside
//triggers

function onFlush(time_stamp, metrics) {
    console.log('onFlush...');
    console.log(time_stamp);
    console.log(metrics);

    var db = new sql.Database(fs.readFileSync('/home/tieme/workspace/test.sqlite'));

    function insert(table, name, value) {
        var res = db.run('INSERT INTO ' + table + ' VALUES("'
                    + time_stamp + '","' + name + '",' + value + ');');
    }

    var type = 'gauges';
    //types

    for (var metric in metrics.gauges)
        insert('gauges', metric, metrics[type][metric]);

    // not efficient :(
    fs.writeFileSync('/home/tieme/workspace/test.sqlite', new Buffer(db.export()));
    db.close();
}

function onStatus(writeCb) {
    //console.log('onStatus...');
}

function onPacket(packet, rinfo) {
    //console.log('onPacket...');
}

exports.init = function(startup_time, config, events, logger) {
    //set configs (db path, 
    //use passed-in logger
    // create tables if don't exist

    events.on('flush', onFlush);
    events.on('status', onStatus);
    events.on('packet', onPacket);

    //return false;
    return true;
};

var sql = require('sql.js'),
    fs = require('fs');

// TODO:  readable timestamp
        //set configs (db path, 
        //handle errors
        //options to configure desired schema

var options = {};
var blacklist = ['statsd.timestamp_lag',
          'statsd.bad_lines_seen',
          'statsd.packets_received',
          'statsd.metrics_received']

exports.init = function(startup_time, config, events, logger) {
    events.on('flush', onFlush);
    events.on('status', onStatus);
    events.on('packet', onPacket);

    //TODO: have proper defaults
    options.sqliteFile = config.sqlite.sqliteFile ||
                            '/home/tieme/workspace/test.sqlite';

    //return false; // fail to load to module (eg: config prob)
    return true;
};

// use NOT NULL, UNIQUE for sets
// CHECK and DEFAULT constraints
// use a primary key
// // schemas
//CREATE TABLE Gauges (timestamp varchar?text?int, name text, value real);
//CREATE TABLE Sets ...
//use datetime function, or use js function inside
//triggers

function onFlush(time_stamp, metrics) {
    console.log(time_stamp);
    console.log(metrics);
    //logger('x packets received, writing to file.sqlite...');

    var db = new sql.Database(fs.readFileSync(options.sqliteFile));

    function create(table) {
        db.run('CREATE TABLE IF NOT EXISTS ' + table
                + '(timestamp TEXT, name TEXT, value INT);');
    }
    function insert(table, name, value) {
        db.run('INSERT INTO ' + table + ' VALUES("'
                    + time_stamp + '","' + name + '",' + value + ');');
    }

    ['counters', 'gauges', 'timers', 'sets'].forEach((table) => {
        var names = [];
        // filter out blacklisted metrics
        for (var name in metrics[table])
            if (blacklist.indexOf(name) === -1) names.push(name);

        // don't create table if no entry
        if (names.length > 0) create(table);

        names.forEach((name) => {
            insert(table, name, metrics[table][name]);
        });
    });

    // not efficient :(
    fs.writeFileSync(options.sqliteFile, new Buffer(db.export()));
    db.close();
}

function onStatus(writeCb) {
    //console.log('onStatus...');
    //writeCb writes to status stream
}

function onPacket(packet, rinfo) {
    //console.log('onPacket...');
    //option to print info whenever packet received
}

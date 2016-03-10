// refresh vim tools

function onFlush(time_stamp, metrics) {

}

function onStatus(writeCb) {

}

function onPacket(packet, rinfo) {

}

exports.init = function(startup_time, config, events, logger) {

    events.on('flush', onFlush);
    events.on('status', onStatus);
    events.on('packet', onPacket);

    //return false;
    return true;
};

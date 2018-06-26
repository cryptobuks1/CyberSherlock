const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http'),
    appRoot = __dirname.replace('services', ''),
    serv = JSON.parse(process.argv[2]),
    Service = require(__dirname + '/' + serv.script),
    service = new Service(appRoot),
    state = service.state();
    if (!state) onError('Service ' + serv.name + ' state error!');
    // if (typeof state === 'object' && typeof state.then === 'function') state
    //     .then(msg => {
    //         process.send({
    //             state: 'listen',
    //             message: serv.name + ' (pid: ' + process.pid + ')' + ' listening'
    //             + (msg.port ? ' on ' + msg.port : '')
    //         })
    //     })
    //     .catch(error => {
    //         onError(error);
    //     });

const path = require('path');
global.appRoot = path.resolve(__dirname + '/../../');
const ServiceError = require(appRoot + '/lib/error/ServiceError');
const ErrorHandler = require(appRoot + '/lib/error/ErrorHandler');

    service.setKey(serv.key);
    app.set('port', serv.port);
    app.use(bodyParser.json());
    app.use('/', (req, res) => {
        let body = req.body || {};
        body.method = body.method || '';
        body.params = body.params || [];
        body.id = body.id || null;
        try {
            if (service[body.method]) {
                service[body.method](body.params)
                    .then(result => res.json({
                        result: result,
                        id: body.id}))
                    .catch(e => {
                        const err = new ErrorHandler(e);
                        res.json({
                            error: {
                                message: err.message,
                                code: err.code
                            },
                            id: body.id
                        })
                    });

            } else {
                throw new ServiceError('Method not found');
            }
        } catch (error) {
            const err = new ErrorHandler(error);
            res.json({
                error: {
                    message: err.message,
                    code: err.code
                },
                id: body.id
            })
        }
    });
    const server = http.createServer(app);
    server.listen(serv.port);
    server.on('error', onError);
    server.on('listening', onListening);
    function onError(error) {
        process.send({
            state: 'stop',
            message: 'Service ' + serv.name
            + ' stoped! ' + error.code + ' ' + error.message,
        });
        process.exit(1);
    }
    function onListening() {
        let addr = server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        process.send({
            state: 'listen',
            message: serv.name + ' (pid: ' + process.pid + ')' + ' listening on ' + bind
        });
    }



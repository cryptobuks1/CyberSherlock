//Import the mongoose module
const //config = require('../assets/config.json'),
    //Log = require('./log'),
    mongoose = require('mongoose');


module.exports = {
 /**
 * @summary Connect to MongoDB.
 * @params {
 *          db - {
 *          user - string,
 *          password - string,
 *          host - string,
 *          port - number,
 *          name - string
 *          },
 *          log - function
 *          } - input params.
 * @return {string} string - translated key value.
 */
    connect: (params) => {
        try {
            params = params || {};
            this.db = params.db || {};
            this.log = params.log || console.log;
            const mongoDB = 'mongodb://'
                + this.db.user + ':'
                + this.db.password + '@'
                + this.db.host + ':' + this.db.port + '/'
                + this.db.name;
            mongoose.connect(mongoDB, {
                useMongoClient: true
            });
// Get Mongoose to use the global promise library
            mongoose.Promise = global.Promise;
//Get the default connection
            params.service.db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
            params.service.db.on('error', e => {
                this.log('Database connection error: ' + e, 0);
                params.service.dbState = false;
            });
            return true;
        } catch (e) {
            this.log(e.message, 0);
            return false;
        }
    },
    id: mongoose.Types.ObjectId
};

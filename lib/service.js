module.exports = {
    /**
     * @summary Init common service object
     */
   init: function(service, initParams) {
       const self = this;
       initParams.models.forEach(model => self[model] = require(initParams.appRoot + '/models/' + model));
       initParams.libs.forEach(lib => self[lib] = require(initParams.appRoot + '/lib/' + lib));
       this.dbState = initParams.libs.indexOf('db') < 0 ? false : this.db.connect({
           service: self,
           db: initParams.config.db,
           log: this.log || console.log
       });
       this.errors = {
           adminError: require(initParams.appRoot + '/lib/errors/AdminError'),
           serviceError: require(initParams.appRoot + '/lib/errors/ServiceError'),
           userError: require(initParams.appRoot + '/lib/errors/UserError')
       };
       Object.assign(service, this);
       return true;
   },
    /**
     * @summary Check service state
     * @return boolean - service state (1 - Ok, 0 - Not working)
     */
   state: function () {
        return this.dbState;
   },
   setKey: function (key) {
        this._key = key;
    }
};
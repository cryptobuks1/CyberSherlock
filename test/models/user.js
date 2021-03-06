const should = require('should'),
    db = require('../../lib/db'),
    config = require('../../config'),
    User = require('../../models/user'),
    Email = require('../../models/email'),
    Profile = require('../../models/profile'),
    mongoose = require('mongoose');

describe('User, profile models test',()=> {
    it('user, profile create', (done) => {
        db();
        User.findOne()
            .where({name: 'Nick'})
            .exec( (err, nick) => {
                if (err) console.log(err);
                else if (nick) {
                    console.log(nick.name);
                    pfind(nick._id);
                }
                    else {
                    User.create({
                        name: 'Nick',
                        password: {
                            salt: 'sadfsd',
                            hash: 'fsdfads'
                            }
                        }, (err, uNick) => {
                        if (err) console.log(err);
                        else pfind(uNick._id)
                    })
                }
            });
        const pfind = (id) => {
            Profile.findOne()
                .where({user: id})
                .exec( (err, nickpfile) => {
                    if (err) console.log(err);
                    else if (nickpfile) {
                        console.log(nickpfile.role);
                        done();
                    } else {
                        Profile.create({
                            user: id
                        },(err, npfile) => {
                            if (err) console.log(err);
                            else {
                                console.log(npfile.role + ' new');
                                done();
                            }
                        });
                    }
                });
        }
    });
    it('user, profile find', (done) => {
        db();
        /*Profile.deleteOne({_id: '5a6f829b3a8d897b7bdc5c6f'}, err => {
                console.log(err);
                done();
            });*/
        /*User.create({
            name: 'July',
            password: {
                salt: 'sdfasdfas',
                hash: 'sdgfvfghgjfghn'
            }
        });*/
        /*Profile.findOne()
            .populate('user')
            // .where({'user.name': 'Nick'})
            .exec((err, pFile) => {
                console.dir(pFile.user[0]._doc.name);
                pFile.find()
                    .where({'user.name': 'Nic'})
                    .exec( (err, ni) => {
                        console.dir(ni);
                        done();
                    })
            });*/
        User.aggregate([{
            $lookup: {
                from: 'profiles',
                localField: '_id',
                foreignField: 'user',
                as: 'profiles'
                }
            }, {
            $match: {name: 'Nick'}
        }])
            .then(pf => {
            pf.forEach(p => {
                console.dir(p);
            });
            done();
        });
        //done();
    });
    it('User Create', done => {
        db();
        const nu = new User();
        let hash = nu.hash('13245678');
        nu.hash('12345678')
            .then(hash => {
                nu._id = nu.getId();
                nu.password = hash;
                nu.emai = 'nike@nk.co';
                nu.phon = null;
                return nu.save();
            })
            .then(err => {
                console.dir(err);
                console.dir(nu._id);
                console.dir(nu._doc._id.toString());done();
            })
            .catch(e => console.dir(e));

    });
    it('User some test', done => {
        const stateDB = db.connect({
            db: config.db,
            log: console.log
        });
        if (stateDB) {
            User.aggregate()
                .lookup({
                    from: 'emails',
                    localField: '_id',
                    foreignField: 'owner',
                    as: 'emails' })
                /*.lookup({
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'owner',
                    as: 'profiles'
                })*/
                //.match({'google.id': '109265904531099102897'})
                .match({emails: {$elemMatch: {
                    email: 'mykola_borodyn@ecoengineer.in.ua'
                        }}})
                .project({
                    _id: 1,
                    google: 1,
                    emails: {
                        email: 1,
                        status: 1,
                        primary: 1
                    },
                    status: 1,
                    profiles: 1
                })
                .exec()
                .then(users => {
                    users.forEach(user => console
                        .log(users.length));
                    console.dir(users.length ? users : 'no users');
                    return true;/*User.update({'google.id': '109265904531099102897'}, { $set: {
                        'google.token': 'YZbUbI1_-D'
                        }})*/
                    //done();
                })
                .then(user => {
                    console.dir(user);
                    done();
                })
                .catch(e => {
                    console.dir(e);
                    done();
                });
        } else {
            console.log('Db error.');
            done();
        }

    });
});
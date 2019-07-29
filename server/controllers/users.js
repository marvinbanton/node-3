const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const secret = require('../../secret');

module.exports = {
    create,
    list,
    getById,
    getProfile
};


function create(req, res) {
    const db = req.app.get('db');

    const { email, password } = req.body;
    argon2
        .hash(password)
        .then((hash) => {
            return db.users.insert(
                {
                    email,
                    password: hash,
                    user_profiles: [
                        {
                            userId: undefined,
                            about: null,
                            thumbnail: null
                        }
                    ]
                },
                {
                    fields: ['id', 'email']
                }
            );
        })
        .then((user) => {
            const token = jwt.sign({ userId: user.id }, secret);
            res.status(201).json({ ...user, token });
        })
        .catch(err => {
            console.error(err); // if something happens we handle the error as well.
            res.status(500).end();
        });
}

function list(req, res) {
    const db = req.app.get('db');

    db.users
        .find()
        .then(users => res.status(200).json(users))
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
}


function getById(req, res) {
    const db = req.app.get('db');

    db.users
        .findOne(req.params.id)
        .then(user => res.status(200).json(user))
        .catch(err => {
            console.log(err);
            res.status(500).end();
        });
}


function getProfile(req, res) {
    const db = req.app.get('db')

    db.users_profiles
        .findOne({
            userId: req.params.id,
        })
        .then(profile => res.status(200).json(profile))
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
}

// server/index.js - register the handler

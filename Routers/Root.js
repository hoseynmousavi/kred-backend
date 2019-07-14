const root_router = require('express').Router()

root_router.route('/')
    .get((req, res) =>
    {
        res.send('Welcome to \'Kred\' Restful API, Happy Hacking ;)')
    })

module.exports = root_router
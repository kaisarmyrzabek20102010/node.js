const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database:'qwerty',
    password:'kaisar2010',
    port: 5432,
})

module.exports = pool
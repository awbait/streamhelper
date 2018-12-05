require('dotenv').config()
const { Pool } = require('pg');

const connection = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    max: 20
})
connection.connect();

async function getUserByTID(id) {
    try {
        let res = await connection.query('SELECT * FROM users INNER JOIN points ON users.id = points.user_id WHERE users.t_id = $1', [id]);
        return res.rows[0];
    } catch (error) {
        console.log(error.stack);
    }
}
async function createUserByTID(user) {
    try {
        let res = await connection.query('INSERT INTO users(t_name, t_id) VALUES($1, $2) RETURNING id', [user.username, user['user-id']]);
        await connection.query('INSERT INTO points(user_id) VALUES($1)', [res.rows[0].id]);
        return;
    } catch (error) {
        console.log(error.stack);
    }
}

async function createUserPoints(username, points) {
    try {
        let res = await connection.query('INSERT INTO points(t_name, points) VALUES($1, $2)', [username, points]);
        return;
    } catch (error) {
        console.log(error.stack);
    }
}
async function getUserPoints(username) {
    let res = await connection.query('SELECT * FROM points WHERE t_name = $1', [username]);
    return res.rows[0];
}
async function addUserPoints(username) {
    let res = await connection.query('UPDATE points SET points = points+1 WHERE t_name = $1', [username]);
    return;
}
module.exports.getUserByTID = getUserByTID;
module.exports.createUserByTID = createUserByTID;
module.exports.createUserPoints = createUserPoints;
module.exports.getUserPoints = getUserPoints;
module.exports.addUserPoints = addUserPoints;
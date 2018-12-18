require('dotenv').config();

const { Pool } = require('pg');

const connection = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  max: 20,
});
connection.connect();

async function getUserByTID(id) {
  try {
    const res = await connection.query('SELECT * FROM users INNER JOIN points ON users.id = points.user_id WHERE users.t_id = $1', [id]);
    return res.rows[0];
  } catch (error) {
    console.log(error.stack);
    return undefined;
  }
}
async function getUserByDID(id) {
  try {
    const res = await connection.query('SELECT * FROM users INNER JOIN points ON users.id = points.user_id WHERE users.d_id = $1', [id]);
    return res.rows[0];
  } catch (error) {
    console.log(error.stack);
    return undefined;
  }
}
async function getUserByTU(username) {
  try {
    const res = await connection.query('SELECT * FROM users INNER JOIN points ON users.id = points.user_id WHERE users.t_name = $1', [username]);
    return res.rows[0];
  } catch (error) {
    console.log(error.stack);
    return undefined;
  }
}
async function addUserPoints(user_id) {
  try {
    await connection.query('UPDATE points SET amount = amount+1 WHERE user_id = $1', [user_id]);
    return;
  } catch (error) {
    console.log(error.stack);
  }
}
async function createUserByTID(t_name, t_id) {
  try {
    const res = await connection.query('INSERT INTO users(t_name, t_id) VALUES($1, $2) RETURNING id', [t_name, t_id]);
    await connection.query('INSERT INTO points(user_id) VALUES($1)', [res.rows[0].id]);
    return;
  } catch (error) {
    console.log(error.stack);
  }
}
async function updateUserD(id, d_id) {
  try {
    await connection.query('UPDATE users SET d_id = $1 WHERE id = $2 RETURNING *', [d_id, id]);
    return;
  } catch (error) {
    console.log(error.stack);
  }
}
module.exports = {
  getUserByTID,
  getUserByDID,
  getUserByTU,
  addUserPoints,
  createUserByTID,
  updateUserD,
};

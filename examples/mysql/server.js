

"use strict";
import express from "express";
import { AsyncLocalStorage } from "async_hooks";

// ALS Configuration //
const als = new AsyncLocalStorage();

function storeMiddleware(req, res, next) {
  const mail = req.headers["user-mail"];
  const store = {
    ["mail"]: mail
  };
  als.run(store, () => next());
}

function getMail() {
  return als.getStore()["mail"];
}

//Mysql Configuration //
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "mysql",
  user: "root",
  password: "Catch22",
  database: "main"
});

function executeQuery(q) {
  return new Promise((resolve, reject) => {
    pool.query(q, function(error, results, fields) {
      if (error) {reject(error);}
      resolve(getMail());
    });
  });
}


//Server Configuration //
const app = express();
app.use(express.json());
app.use(storeMiddleware);

app.get("/", async (req, res) => {
  const query = "select user_id from main.user limit 1;";
  const email1 = getMail();
  const email2 = await executeQuery(query);
  // const email2 = getMail();
  res.json({ email1, email2 });
});

const PORT = 7002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



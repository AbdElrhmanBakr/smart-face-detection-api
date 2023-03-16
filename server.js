const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "admin",
    database: "smart-face-detection",
  },
});

//# Middleware
app.use(express.json());
app.use(cors());

//# Running Server
app.listen(3000, () => {
  console.log("Server is running.");
  console.log(`Local:   http://localhost:3000`);
});

//# Log In
app.post("/login", async (req, res) => {
  if (req.body) {
    const { email, password } = req.body;
    try {
      //Get user from login table
      const user = await db("login")
        .select("email", "hash")
        .where({ email: email });

      //Compare password & hash
      const isValid = await bcrypt.compare(password, user[0].hash);

      if (isValid) {
        const userRegisterData = await db("users")
          .select("*")
          .where({ email: email });
        res.json(userRegisterData[0]);
      } else {
        res.status(400).json("Unable to login.");
      }
    } catch (error) {
      res.status(400).json("Error logging in.");
    }
  }
});

//# Sign Up - Register Using Async/Await
app.post("/signup", async (req, res) => {
  if (req.body) {
    const { name, email, password } = req.body;

    //Start transaction
    try {
      //Get the hash
      const hash = await bcrypt.hash(password, saltRounds);
      await db.transaction(async (trx) => {
        //Insert into login table
        const loginEmail = await trx("login")
          .insert({
            email,
            hash,
          })
          .returning("email"); //<-- Return email for using it in Register to make sure both inserting are connected.

        //Insert into users table
        const user = await trx("users")
          .insert({
            name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .returning("*"); //<-- Return all the user column.

        //Respond to post request with the user
        res.json(user[0]);
      });
    } catch (err) {
      res.status(400).json("Unable to register");
    }
  }
});

// //# Sign Up - Register Using Promises
// app.post("/signup", (req, res) => {
//   if (req.body) {
//     const { name, email, password } = req.body;

//     //Get the hash
//     bcrypt.hash(password, saltRounds, function (err, hash) {
//       //Start transaction
//       db.transaction((trx) => {
//         //Insert into login table
//         trx
//           .insert({
//             email: email,
//             hash: hash,
//           })
//           .into("login")
//           .returning("email")
//           .then((loginEmail) => {
//             return trx("users")
//               .returning("*")
//               .insert({
//                 name: name,
//                 email: loginEmail[0].email,
//                 joined: new Date(),
//               })
//               .then((user) => res.json(user[0]));
//           })
//           .then(trx.commit)
//           .catch(trx.rollback);
//       }).catch((Error) => res.status(400).json("Unable to register."));
//     });
//   }
// });

//# Profile
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("User Not Found.");
      }
    })
    .catch((error) => console.log("Error getting user."));
});

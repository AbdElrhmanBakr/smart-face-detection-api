export const handleRegister = async (req, res, db, bcrypt, saltRounds) => {
  if (req.body) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json("Incorrect input data.");
    }
    // Check if user already exist
    const allUsers = await db("users").select();
    allUsers.forEach((user) => {
      if (user.name === name || user.email === email) {
        return res.status(400).json("User is registered with this data.");
      }
    });

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
};

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

const dataBase = {
  users: [
    {
      id: "123",
      user: "Abdo",
      email: "abdo@gmail.com",
      password: "1234",
      date: new Date(),
    },
    {
      id: "124",
      user: "Heba",
      email: "heba@gmail.com",
      password: "12345",
      date: new Date(),
    },
  ],
};

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
//# Running Server
app.listen(3000, () => {
  console.log("Server is running.");
  console.log(`Local:   http://localhost:3000`);
});

//# Root
app.get("/", (req, res) => {
  if (req.body) {
    res.json(dataBase.users);
  }
});

//# Log In
app.post("/login", (req, res) => {
  if (req.body) {
    const { email, password } = req.body;
    if (
      email === dataBase.users[0].email &&
      password === dataBase.users[0].password
    ) {
      res.json(dataBase.users[0]);
    } else {
      res.status(400).json("Failed to Log In.");
    }
  }
});

//# Sign Up - Register
app.post("/signup", (req, res) => {
  if (req.body) {
    const { user, email, password } = req.body;
    dataBase.users.push({
      id: "125",
      user: user,
      email: email,
      password: password,
      date: new Date(),
    });
    res.json(dataBase.users[dataBase.users.length - 1]);
  }
});

//# Profile
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  dataBase.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("User Not Found.");
  }
});

export const handleLogin = async (req, res, db, bcrypt) => {
  if (req.body) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("Incorrect input data.");
    }
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
};

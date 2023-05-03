export const handleProfile = async (req, res, db) => {
  const { id } = req.params;
  try {
    const user = await db.select("*").from("users").where({ id });
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(404).json("User Not Found.");
    }
  } catch (error) {
    console.log("Error getting user.");
  }
};

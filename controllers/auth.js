import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

async function register(req, res, next) {
  const { password, email, subscription, token } = req.body;
  const emailInLowerCase = email.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await User.findOne({ email: emailInLowerCase });
    if (user !== null) {
      throw HttpError(409);
    }
    await User.create({
      password: passwordHash,
      email: emailInLowerCase,
      subscription,
      token,
    });
    
    res.status(201).json({ message: "Created" });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
};

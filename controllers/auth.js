import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
async function login(req, res, next){
    const { password, email } = req.body;
    const emailInLowerCase = email.toLowerCase();
    try {
       const user = await User.findOne({email:emailInLowerCase})
       if (user === null) {
        console.log("Email");
        throw HttpError(401);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch === false) {
        console.log("Password");
        throw HttpError(401);
      }

      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 },
      );
      await User.findByIdAndUpdate(user._id, { token });
        res.send({ token});
    } catch (error) {
       next(error); 
    }

}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}




export default {
  register,
  login,
  logout
};
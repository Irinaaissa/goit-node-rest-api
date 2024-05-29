import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/registerSchema.js";
import gravatar from 'gravatar';
import mail from "../mail.js";
import { nanoid } from "nanoid";

async function register(req, res, next) {
  const { password, email, subscription, token } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    if (!email || !password) {
      throw HttpError(400);
    }
    await registerSchema.validateAsync({ email, password });
    const user = await User.findOne({ email: email });
    if (user !== null) {
      throw HttpError(409);
    }
    let finalSubscription = subscription || "starter";

    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();


    await User.create({
      password: passwordHash,
      email: email,
      avatarURL,
      subscription: finalSubscription,
      token,
      verificationToken,
    });
    mail.sendMail({
      to: email,
      from: "irinaalisa7506@gmail.com",
      subject: "Welcome to Bookshelf!",
      html: `To confirm your email please click on the <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email please open the link http://localhost:3000/users/verify/${verificationToken}`,
    });
    
console.log(user);
    res
      .status(201)
      .json({ user: { email: email, subscription: finalSubscription,avatarURL, } });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { password, email } = req.body;

  try {
    if (!email || !password) {
      throw HttpError(400);
    }
    await loginSchema.validateAsync({ email, password });
    const user = await User.findOne({ email: email });
    if (user === null) {
      console.log("Email");
      throw HttpError(401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      console.log("Password");
      throw HttpError(401);
    }
    if (user.verify === false) {
      return res.status(401).send({ message: "Please verify your email" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    await User.findByIdAndUpdate(user._id, { token });
    const responseData = {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };

    res.json(responseData);
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).json({ message: "No Content" }).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  try {
    if (!req.user) {
      return next(HttpError(401, "Unauthorized"));
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(HttpError(404, "User not found"));
    }
    const responseData = {
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };
    console.log(responseData);
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
}

async function resendVerificationEmail(req, res, next) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      return res.status(400).json({ message: "Verification has already been passed" });
    }

    const verificationToken = nanoid();
    user.verificationToken = verificationToken;
    await user.save();

    

    mail.sendMail({
      to: email,
      from: "irinaalisa7506@gmail.com",
      subject: "Welcome to Bookshelf!",
      html: `To confirm your email please click on the <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
      
      text: `To confirm your email please open the link http://localhost:3000/users/verify/${verificationToken}`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  current,
  resendVerificationEmail, 
};
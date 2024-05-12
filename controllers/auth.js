import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/registerSchema.js";

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

    await User.create({
      password: passwordHash,
      email: email,
      subscription: finalSubscription,
      token,
    });

    res
      .status(201)
      .json({ user: { email: email, subscription: finalSubscription } });
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

export default {
  register,
  login,
  logout,
  current,
};

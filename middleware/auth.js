import jwt from "jsonwebtoken";

import User from "../models/user.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  console.log({ authorizationHeader });

  if (typeof authorizationHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token 1" });
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  console.log({ bearer, token });

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token 2" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token 3" });
    }
    try {
      const user = await User.findById(decode.id);

      if (user === null) {
        return res.status(401).send({ message: "Invalid token 4" });
      }

    //   if (user.token !== token) {
        // return res.status(401).send({ message: "Invalid token 5" });
    //   }

      console.log({ decode });

      req.user = {
        id: user._id,
      };

      next();
    } catch (error) {
      next(error);
    }
  });
}

export default auth;

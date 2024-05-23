import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import Jimp from "jimp";

async function uploadAvatar(req, res, next) {
    try {
        const avatarPath = path.resolve('public/avatars', req.file.filename);
      await fs.rename(
        req.file.path,
        avatarPath
      );
      const avatar = await Jimp.read(avatarPath);
      await avatar.resize(250, 250).writeAsync(avatarPath);
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatarURL: req.file.filename },
        { new: true },
      );
  
      if (user === null) {
        return res.status(401).send({ message: "Not authorized" });
      }
      const responseData = {
        avatarURL: {
            avatarURL: user.avatarURL,
          
        },
      };
     
      res.status(200).json(responseData);
    
    } catch (error) {
      next(error);
    }
  }

  async function getAvatar(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
  
      if (user === null) {
        return res.status(404).send({ message: "User not found" });
      }
  
      if (user.avatarURL === null) {
        return res.status(404).send({ message: "Avatar not found" });
      }
  
      res.sendFile(path.resolve("public/avatars", user.avatarURL));
    } catch (error) {
      next(error);
    }
  }
  async function verify(req, res, next) {
    const { verificationToken } = req.params;
  
    try {
      // const user = await User.findOne({verificationToken:verificationToken });
  
      // if (user === null) {
        // return res.status(404).send({message: "User not found"});
      // }
  
      // await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});
      // res.status(200).send({ message: "Email confirm successfully" });
      const user = await User.findOneAndUpdate(
        { verificationToken:verificationToken },
        { verify: true, verificationToken: null },
        { new: true },
      );
  
      if (user === null) {
        return res.status(404).send({ message: "User not found" });
      }
  
      res.status(200).send({ message: "Verification successful" });
    } catch (error) {
      next(error);
    }
  }

export default {uploadAvatar,getAvatar,verify};


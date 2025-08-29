import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtSecret } from "../middlewares/auth.js";

const bcryptSalt = bcrypt.genSaltSync(10);

export const register = async (req, res) => {
  try {
     const { name, email, password, role } = req.body; 
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
      role
    });
    res.json(user);
  } catch (e) {
    res.status(422).json(e);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const passOk = bcrypt.compareSync(password, user.password);
  if (!passOk) return res.status(401).json({ error: "Wrong password" });

 jwt.sign(
    { email: user.email, id: user._id, role: user.role },
    jwtSecret,
    { expiresIn: "7d" }, // optional
    (err, token) => {
      if (err) throw err;

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax", // or "none" + secure:true for production
      }).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  );
};

export const profile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ name: user.name, email: user.email, _id: user._id });
};

export const logout = (req, res) => {
  res.cookie("token", "").json(true);
};

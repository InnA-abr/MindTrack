import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";
import getConfigs from "../config/getConfigs.js";
import keys from "./keys.js";

const User = mongoose.model("users");

export default async function (passport) {
  const opts = {};
  const configs = await getConfigs();

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = configs?.JWT_SECRET || keys.JWT_SECRET;

  passport.use(
    "jwt",
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .select("-password")
        .then((user) => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );

  passport.use(
    "jwt-admin",
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .select("-password")
        .then((user) => {
          if (user && user.isAdmin) return done(null, user);
          return done(null, false, {
            message: "You do not have enough permissions for this operation",
          });
        })
        .catch((err) => console.log(err));
    })
  );
}

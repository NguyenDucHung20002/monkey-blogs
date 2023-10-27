const passport = require("passport");
const User = require("../models/User");
const Role = require("../models/Role");
const { env } = require("../config/env");
const emailToUserName = require("../utils/emailToUserName");
const { ErrorResponse } = require("../response/ErrorResponse");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_HOST}:${env.SERVER_PORT}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const role = await Role.findOne({ slug: "user" });
        if (!role) throw new ErrorResponse(404, "role not found");

        let user = await User.findOne({ email: profile._json.email });
        if (!user) {
          const username = emailToUserName(profile._json.email);

          user = new User({
            avatar: profile._json.picture,
            fullname: profile._json.name,
            email: profile._json.email,
            username,
            role: role._id,
          });

          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

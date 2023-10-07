const passport = require("passport");
const User = require("../models/User");
const Role = require("../models/Role");
const { env } = require("../config/env");
const Profile = require("../models/Profile");
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
        if (!role) {
          throw new ErrorResponse(404, "role not found");
        }

        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            role: role._id,
            loginType: "Google",
            status: "active",
          });

          await user.save();

          const username = emailToUserName(user.email);

          const newProfile = new Profile({
            user: user._id,
            avatar: profile.photos[0].value,
            fullname: profile.displayName,
            username,
          });

          await newProfile.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

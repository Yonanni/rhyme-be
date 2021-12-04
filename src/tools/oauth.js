import GoogleStrategy from "passport-google-oauth20"
import passport from "passport"
import authorModel from "../services/authors/schema.js"
import jwt from 'jsonwebtoken'

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      // We are receiving some profile information from Google
      console.log(profile)

      // 1. Check if user is already in db or not.

      const user = await authorModel.findOne({ googleId: profile.id })

      if (user) {
        // 2. If user was already there we are creating the tokens for him/her

        const token = jwt.sign({ 
            id: user._id,
            name: user.name,
            avatar:user.avatar,
            role:user.role }, process.env.JWT_SECRET, {
            expiresIn: '1 week'
          });

        passportNext(null, { token })
      } else {
        // 3. If it is not we are creating a new record and then we are creating the tokens for him/her
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 2,
          avatar: profile._json['picture'],
          googleId: profile.id,
        }

        const createdUser = new authorModel(newUser)
        const savedUser = await createdUser.save()
        const token = jwt.sign({ 
            id: savedUser._id,
            name: savedUser.name,
            avatar:savedUser.avatar,
            role:savedUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1 week'
          });

        passportNext(null, { user: savedUser, token })
      }
    } catch (error) {
      console.log(error)
      passportNext(error)
    }
  }
)

passport.serializeUser(function (user, passportNext) {
  passportNext(null, user) // MANDATORY. This attaches stuff to req.user
})

export default googleStrategy
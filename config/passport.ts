import type { PassportStatic } from 'passport';
import passportJwt from 'passport-jwt';
import User from '../models/user.ts';
import Keys from './keys.ts';

const { Strategy: JwtStrategy, ExtractJwt } = passportJwt;

export default function(passport: PassportStatic) {

    const opts: passportJwt.StrategyOptionsWithoutRequest = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: Keys.secretOrKey
    };
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id, (err, user) => {
          if (err) {
              return done(err, false);
          }
          if (user) {
              return done(null, user);
          }
          else {
              return done(null, false);
          }
        })
    }))

}

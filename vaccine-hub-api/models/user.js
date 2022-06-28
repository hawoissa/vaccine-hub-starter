const { UnauthorizedError } = require("../utils/errors");
class User {
   static async login(creds) {
      // we want users to register
      // throw error if creds are missing

      //look up email to compare password entered with password in db
      // if match, return user
      // if not match, return error
   }

   static async register(creds) {
      // should submit email, name, date, location, password
      // throw error if creds are missing
   }
}

module.exports = User;
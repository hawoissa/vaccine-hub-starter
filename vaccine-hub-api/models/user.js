const bcrypt = require("bcrypt");
const db = require("../db");
const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
   static async makePublicUser(user) {
      return {
         id: user.id,
         email: user.email,
         first_name: user.first_name,
         last_name: user.last_name,
         location: user.location,
         date: user.date
      }
   }

   static async login(creds) {
      const required = ["email", "password"];
      required.forEach(field => {
         if (!creds.hasOwnProperty(field)) {
            throw new BadRequestError(`Missing ${field} in request.`);
         }
      });  

      const user = await User.fetchUserByEmail(creds.email);
      if (user) {
         const isValid = await bcrypt.compare(creds.password, user.password);
         if (isValid) {
            return User.makePublicUser(user);
         }
      }
      throw new UnauthorizedError("Invalid email or password");
   }

   static async register(creds) {
      // should submit email, name, date, location, password
      const required = ["email", "first_name", "last_name", "password", "location", "date"];
      required.forEach(field => {
         if (!creds.hasOwnProperty(field)) {
            throw new BadRequestError(`Missing ${field} in request.`);
         }
      });

      if (creds.email.indexOf("@") <= 0) {
         throw new BadRequestError("Invalid email.");
      }

      const existingUser = await User.fetchUserByEmail(creds.email);
      if (existingUser) {
         throw new BadRequestError("Email already exists in database");
      }
      const hashedPassword = await bcrypt.hash(creds.password, BCRYPT_WORK_FACTOR)
      const lowercaseEmail = creds.email.toLowerCase();
      const result = await db.query(`
         INSERT INTO users (
            email, first_name, last_name, password, location, date
         ) VALUES (
            $1, $2, $3, $4, $5, $6
         ) RETURNING email, first_name, last_name, password, location, date;
      `, [lowercaseEmail, creds.first_name, creds.last_name,
         hashedPassword, creds.location, creds.date]); 

      const user = result.rows[0];
      return User.makePublicUser(user);;
   }

   static async fetchUserByEmail(email) {
      if (!email) {
         throw BadRequestError("No email provided.");
      }
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await db.query(query, [email.toLowerCase()]);
      const user = result.rows[0];
      
      return user;

   }
}

module.exports = User;
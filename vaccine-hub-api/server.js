const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {PORT} = require("./config");
const authRoutes = require("./routes/auth");

const {BadRequestError, NotFoundError} = require("./utils/errors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/auth", authRoutes);

app.use((req, res, next) => {
   return next(new NotFoundError());
});

app.use((error, res, req, next) => {
   const status = error.status || 500;
   const message = error.message;

   return res.status(status).json({
      error: {message, status}
   });
});

app.listen(PORT, () => {
   console.log(`⭐️Server running http://localhost:${PORT}`);
})


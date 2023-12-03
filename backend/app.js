//require modules
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const bodyParser = require("body-parser");
const mysqlStore = require("express-mysql-session")(session);
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const db = require("./models");
const dbConfig = require("./config/dbConfig");

//create app
const app = express();

//configure app
let port = 3001;
let host = "localhost";

//mount middleware
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://urchin-app-j9dc9.ondigitalocean.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, OPTIONS, POST, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Strict-Transport-Security", "maxAge=100000");
  res.header("X-Frame-Options", "DENY");
  res.header("Content-Security-Policy", "frame-ancestors 'none'");
  next();
});
app.use(
  session({
    secret: "ajfeirf90aeu9eroejfoefj",
    resave: false,
    saveUninitialized: false,
    store: new mysqlStore({
      connectionLimit: dbConfig.pool.max,
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB,
      // port: 3306,
      createDatabaseTable: true,
    }),
    cookie: { maxAge: 60 * 1000 }, // TODO: Remove '3 *'
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// parse requests of content-type application/json
app.use(bodyParser.json());

// parse requests of content-type application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//set up routing and error handling middleware
app.use(morgan("tiny"));
app.use("/items", itemRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  let err = new Error("The server cannot locate '" + req.url + "'.");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal server error.";
  }
  res.status(err.status);
  res.json({ sendError: { status: err.status, message: err.message } });
});

db.sequelize
  .sync()
  .then(() => {
    //start the server
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

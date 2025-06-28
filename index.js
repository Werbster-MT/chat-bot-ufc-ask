const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const path = require("path");

const router = require("./routers/index");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); 
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'ufc_ask_secret',
  resave: false,
  saveUninitialized: false
}));

router(app);

const sequelize = require('./config/database');

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(port, () => {
    console.log(`Application running at: http://localhost:${port}/`);
  });
}).catch(err => console.error('DB error:', err));
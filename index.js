require("dotenv").config(); // Carregar as variáveis de ambiente

const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const path = require("path");
const fs = require('fs');

// Garante que a pasta uploads exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const router = require("./routers/index");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json()); 
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.JWT_SECRET,
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
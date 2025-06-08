const express = require("express");
const app = express();
const port = 3000;
const router = require("./routers/index");

router(app);

app.listen(port, (error) => {
    if(error) {
        console.log(`Error: ${error}`);
        return;
    }
    console.log(`Application running at: http://localhost:${port}/`)
})

const sequelize = require('./config/database');

// Sincronizar os modelos com o banco de dados
sequelize.sync({ force: true }) // Força a recriação das tabelas. Apenas em desenvolvimento.
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => console.error('Unable to connect to the database:', err));

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet());
const principalRoutes = require('./src/routes/principalRoutes');

app.use(express.json());
app.use('', principalRoutes);

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}!`));

module.exports = app;
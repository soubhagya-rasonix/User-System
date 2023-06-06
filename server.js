const express = require("express");
const { sequelize } = require("./database/index");
const route = require("./routes/route.js")

const app = express();

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', route)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
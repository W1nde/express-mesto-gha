const express = require("express");
const { default: mongoose } = require("mongoose");

const app = express();
// const { PORT = 3000 } = process.env;

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133" // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use("/users", require("./routes/user"));
app.use("/cards", require("./routes/card"));

app.all("*", (req, res) => {
  res.status(404).send({ message: "Путь не найден" });
});

app.listen(3000);

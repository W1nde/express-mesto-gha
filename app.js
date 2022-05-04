const express = require('express');
const { default: mongoose } = require('mongoose');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use((req, res, next) => {
  req.user = {
    _id: '625850df1e722638355859a0',
  };

  next();
});

app.use('/cards', require('./routes/card'));
app.use('/users', require('./routes/user'));

const { PORT = 3000 } = process.env;

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Путь не найден' });
});

app.listen(PORT)

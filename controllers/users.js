const User = require('../models/user')

module.exports.getUser = (req, res, next) => {
  Users.find({})
    .then((user) =>
      res.status(200).send(user))
    .catch((err) =>
      next(err));
};

module.exports.getUserAbout = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        next(new ErrorNotFound('Пользователь не найден'));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы данные некорректны'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserId = (req, res, next) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user._id) {
        next(new ErrorNotFound('Пользователь не найден'));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы данные некорректны'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {

  const { name, about, avatar, email, password } = req.body;

  Users.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ErrorConflict(`${email} уже используется`));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash
    }))

    .then((user) => {
      res.status(200).send(user);
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы данные некорректны'));
      } else if (err.code === 11000) {
        next(new ErrorConflict({ message: err.errorMessage }));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new BadRequestError('Переданы данные некорректны'));
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы данные некорректны'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new BadRequestError('Переданы данные некорректны'));
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы данные некорректны'));
      }
      next(err);
    });
};

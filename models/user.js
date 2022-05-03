const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },

  avatar: {
    type: String,
    required: true
  },
  
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Некорректные данные поля email',
    }
  },

  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }, { runValidators: true })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthorizationError("Неверные почта или пароль"),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthorizationError("Неверные почта или пароль"),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, getUserId, updateUserInfo, updateAvatar } = require("../controllers/user");

router.get('/', getUsers);

router.get('/me', getUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserId,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .pattern(
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
        )
        .required(),
    }),
  }),
  updateAvatar,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo,
);

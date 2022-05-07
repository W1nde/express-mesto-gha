const Card = require("../models/card");
const NotFound = require("../errors/NotFound");
const Forbidden = require("../errors/Forbidden");
const BadRequest = require("../errors/BadRequest");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "BadRequest") {
        next(new BadRequest("Переданы неккоректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound("Карточки с таким ID не существует"));
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound("Карточки с указанным ID не существует"));
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound("Карточка не найдена"));
      }
      if (req.user._id !== card.owner._id.toString()) {
        next(new Forbidden("Вы не можете удалить чужую карточку"));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "BadRequest") {
        next(new BadRequest("Некорректный id карточки"));
      } else {
        next(err);
      }
    });
};

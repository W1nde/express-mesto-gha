const router = require("express").Router();

const {
  createCard, getCards, likeCard, dislikeCard, deleteCard
} = require("../controllers/card");

router.post("/", createCard);
router.get("/", getCards);
router.put("/:cardId/likes", likeCard);
router.delete("/:cardId/likes", dislikeCard);
router.delete("/:cardId", deleteCard);

module.exports = router;

const express = require('express');
const asyncHandler = require('express-async-handler');
const { requireAuth } = require('../../utils/auth');
const { Review, User } = require('../../db/models');

const router = express.Router();

router.put('/:reviewId', requireAuth, asyncHandler(async (req, res) => {
    let review = await Review.findByPk(req.params.reviewId, {include: User});
    if(review.userId === req.user.id) {
        review.text = req.body.text;
        await review.save();
        return res.json(review);
    }
}))

router.delete('/:reviewId', requireAuth, asyncHandler(async (req, res) => {
    let review = await Review.findByPk(req.params.reviewId);
    if(review.userId === req.user.id) {
        await review.destroy();
        return res.sendStatus(200);
    }
}))

module.exports = router;
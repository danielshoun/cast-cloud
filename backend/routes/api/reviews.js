const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Review, User } = require('../../db/models');

const router = express.Router();

const reviewValidators = [
    check('text')
        .exists({checkFalsy: true})
        .withMessage('NO REVIEW TEXT')
        .isLength({max: 2000})
        .withMessage('REVIEW TOO LONG'),
    handleValidationErrors
]

router.put('/:reviewId', reviewValidators, requireAuth, asyncHandler(async (req, res) => {
    let review = await Review.findByPk(req.params.reviewId, {include: User});
    if(review.userId === req.user.id) {
        review.text = req.body.text;
        review.rating = req.body.rating;
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
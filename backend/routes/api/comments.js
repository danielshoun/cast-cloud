const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Comment, User } = require('../../db/models');

const router = express.Router();

const commentValidators = [
    check('text')
        .exists({checkFalsy: true})
        .withMessage('NO COMMENT TEXT')
        .isLength({max: 500})
        .withMessage('COMMENT TOO LONG'),
    handleValidationErrors
]

router.put('/:commentId', commentValidators, requireAuth, asyncHandler(async (req, res) => {
    let comment = await Comment.findByPk(req.params.commentId, {include: User});
    if(comment.userId === req.user.id) {
        comment.text = req.body.text;
        await comment.save();
        return res.json(comment);
    }
}))

router.delete('/:commentId', requireAuth, asyncHandler(async (req, res) => {
    let comment = await Comment.findByPk(req.params.commentId);
    if(comment.userId === req.user.id) {
        await comment.destroy();
        return res.sendStatus(200);
    }
}))

module.exports = router;
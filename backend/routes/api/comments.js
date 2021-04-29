const express = require('express');
const asyncHandler = require('express-async-handler');
const { requireAuth } = require('../../utils/auth');
const { Comment, User } = require('../../db/models');

const router = express.Router();

router.put('/:commentId', requireAuth, asyncHandler(async (req, res) => {
    let comment = await Comment.findByPk(req.params.commentId, {include: User});
    console.log(comment);
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
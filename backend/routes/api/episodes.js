const express = require('express');
const asyncHandler = require('express-async-handler')
const {requireAuth} = require("../../utils/auth");
const { Comment, User } = require('../../db/models');

const router = express.Router();

router.get('/:episodeId/comments', asyncHandler(async (req, res) => {
    const episodeId = req.params.episodeId;
    const comments = await Comment.findAll({where: {episodeId}, include: User})
    return res.json(comments);
}))

router.post('/:episodeId/comments', requireAuth, asyncHandler(async (req, res) => {
    const episodeId = req.params.episodeId;
    const userId = req.user.id;
    const newComment = await Comment.create({
        userId,
        episodeId,
        timestamp: req.body.timestamp,
        text: req.body.text
    });

    return res.json(newComment);
}));

module.exports = router;
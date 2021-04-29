const express = require('express');
const asyncHandler = require('express-async-handler')
const { Comment, User } = require('../../db/models');

const router = express.Router();

router.get('/:episodeId/comments', asyncHandler(async (req, res) => {
    const episodeId = req.params.episodeId;
    const comments = await Comment.findAll({where: {episodeId}, include: User})
    return res.json(comments);
}))

module.exports = router;
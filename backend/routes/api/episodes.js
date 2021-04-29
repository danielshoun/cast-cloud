const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();

router.get('/:episodeGuid/comments', asyncHandler(async (req, res) => {
    const episodeGuid = req.params.episodeGuid;
    let comments = [];
    return res.json(comments);
}))

module.exports = router;
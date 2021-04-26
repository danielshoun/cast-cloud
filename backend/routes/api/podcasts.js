const express = require('express');
const asyncHandler = require('express-async-handler');
const fetch = require("node-fetch");

const router = express.Router();

router.get('/search', asyncHandler(async (req, res) => {
    const term = req.query.term;
    const itunesRes = await fetch(`https://itunes.apple.com/search?media=podcast&term=${term}`);
    const itunesData = await itunesRes.json();
    return res.json(itunesData.results);
}))

module.exports = router;
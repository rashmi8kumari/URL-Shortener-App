const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    const shortCode = nanoid(6);
    const newUrl = await Url.create({ originalUrl, shortCode });
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const redirectUrl = async (req, res) => {
  const { code } = req.params;
  try {
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    url.clickCount += 1;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getStats = async (req, res) => {
  const { code } = req.params;
  try {
    const url = await Url.findOne({ shortCode: code });
    if (!url) {return res.status(404).json({ error: 'URL not found' });}


    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const shortUrl = `${baseUrl}/${url.shortCode}`;


    res.json({
      originalUrl: url.originalUrl,
      shortUrl: shortUrl,
      clickCount: url.clickCount,
      createdAt: url.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { shortenUrl, redirectUrl, getStats };

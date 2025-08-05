const Url = require('../models/Url');
const { nanoid } = require('nanoid');

// Utility to get client IP
const getClientIP = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

// 🔹 Create Short URL
const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const userId = req.user?.id || null;

  if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    const shortCode = nanoid(6);
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      user: userId,
    });

    res.status(201).json({ shortUrl: `${baseUrl}/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 🔹 Redirect to Original URL + Track IP + Timestamp
const redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    // Increment count and log IP/timestamp
    url.clickCount += 1;
    url.clicks.push({
      ip: getClientIP(req),
      timestamp: new Date(),
    });

    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Redirection failed' });
  }
};

// 🔹 Get Stats (with shortUrl)
const getStats = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    res.json({
      originalUrl: url.originalUrl,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      clicks: url.clicks, // optional: include full click data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { shortenUrl, redirectUrl, getStats };


const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    // Clear the token cookie
    res.clearCookie('token').json({ message: 'Logged out successfully' });
});

module.exports = router;

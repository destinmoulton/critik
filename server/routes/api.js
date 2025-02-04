const fsp = require('fs').promises;
const path = require('path');

const express = require('express');
const router = express.Router(); // Use Express Router for better organization

// Example 1: GET request to fetch all items
router.get('/files', async (req, res) => {
    res.json(dir_results.concat(file_results));
});

module.exports = router;
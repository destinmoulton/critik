const express = require('express');
const router = express.Router(); // Use Express Router for better organization

// Example 1: GET request to fetch all items
router.get('/items', (req, res) => {
  // In a real application, you would fetch data from a database or other source
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];
});

module.exports = router;
const express = require ('express');
const authMiddleware = require ('../middleware/auth.js');
const User = require ('../models/User.model.js');

const router = express.Router();

// Toggle wishlist product
router.post('/toggle', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    const user = await User.findById(userId);

    const index = user.wishlist.indexOf(productId);

    if (index > -1) {
      user.wishlist.splice(index, 1); // Remove if exists
    } else {
      user.wishlist.push(productId); // Add if not exists
    }

    await user.save();
    res.json({ wishlist: user.wishlist, message: 'Wishlist updated.' });
  } catch (error) {
    console.error('Wishlist toggle error:', error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

module.exports = router;

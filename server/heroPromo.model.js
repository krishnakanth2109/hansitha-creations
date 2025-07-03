const mongoose = require('mongoose');

const heroPromoSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  image: String,
  bgColor: String,
});

module.exports = mongoose.model('HeroPromo', heroPromoSchema);

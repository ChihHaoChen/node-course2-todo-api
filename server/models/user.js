const mongoose = require('mongoose');

let User = mongoose.model('Users', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    default: null
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    default: null
  },
  telephone: {
    type: String,
    trim: true,
    default: null
  }
});

module.exports = { User };

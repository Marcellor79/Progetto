const mongoose = require('mongoose');

// Schema per la macchina
const macchinaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  guasti: [
    { 
      tipoGuasto: { type: String, required: true },
      dataGuasto: { type: Date, default: Date.now }
    }
  ]
});

const Macchina = mongoose.model('Macchina', macchinaSchema);

module.exports = Macchina;

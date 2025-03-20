// Importa i moduli necessari
const express = require('express'); // Importa Express
const mongoose = require('mongoose'); // Importa Mongoose
const bodyParser = require('body-parser'); // Importa Body-Parser

// Inizializza l'app Express
const app = express();

// Usa i middleware
app.use(bodyParser.json());

// Connessione a MongoDB Atlas
mongoose.connect('mongodb+srv://<admi>:<EASIb2iqZIh1yXKX>@cluster0.mongodb.net/gestione_macchine?retryWrites=true&w=majority', {
    dbName: 'gestione_macchine'
})
.then(() => console.log('Connessione a MongoDB Atlas riuscita'))
.catch(err => console.error('Errore nella connessione a MongoDB:', err));




// Definizione del modello "Macchina"
const macchinaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    guasti: { type: [String], default: [] }
});
const Macchina = mongoose.model('Macchina', macchinaSchema);

// Endpoint per salvare una nuova macchina
app.post('/api/macchine', async (req, res) => {
    const { nome } = req.body;

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ message: "Nome della macchina richiesto" });
    }

    try {
        const nuovaMacchina = new Macchina({ nome, guasti: [] });
        const macchinaSalvata = await nuovaMacchina.save();
        res.status(201).json(macchinaSalvata);
    } catch (err) {
        console.error('Errore nel salvataggio della macchina:', err);
        res.status(500).json({ message: "Errore nel salvataggio della macchina" });
    }
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});

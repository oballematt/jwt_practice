const express = require('express');
const app = express();
const cors = require('cors');

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/jwtAuth'))

app.use('/dashboard', require('./routes/dashboard'))

app.listen(PORT, () => {

    console.log("Server has started on port " + PORT);
});
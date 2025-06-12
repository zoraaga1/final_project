const express = require("express");
const dotenv = require ("dotenv")

dotenv.config();
app = express();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})
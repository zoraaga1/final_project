const express = require("express");
const dotenv = require ("dotenv");
const mongoose = require("mongoose");
const products = require("./routes/productRoutes");
const cors = require("cors")

dotenv.config();
app = express();

const port = process.env.PORT;
const mongoDB_URI = process.env.MONGO_URI;


app.use(cors());

app.use("/products", products)

//Get connect to the database
mongoose.connect(mongoDB_URI)
.then(
    async () => {
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections (tables) in DB:', collections.map(col => col.name));
    }
)
.catch((err) => {
    console.log(err);
});

//Create server
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})
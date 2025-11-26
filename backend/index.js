import express from 'express';
import cors from 'cors';
import "dotenv/config";
import checkout from "./routes/checkout.js";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get(
    "/",
    (req, res) => {
        res.send("KEKEKEKEKEK");
    },
);

app.use("/", checkout);

app.listen(
    port,
    () => {
        console.log(`Listening on port ${port}`);
    },
);

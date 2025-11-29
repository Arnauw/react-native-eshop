import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import "dotenv/config";
import checkout from "./routes/checkout.js";

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // Limit each IP to 20 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many checkout attempts, please try again later.' }
});

const checkKey = (req, res, next) => {
    const authHeader = req.headers['x-app-secret'];
    
    if (authHeader !== process.env.APP_SHARED_SECRET) {
        return res.status(403).json({ error: 'Forbidden: Invalid App Secret' });
    }
    next();
};

app.get(
    "/",
    (req, res) => {
        res.send("Backend is running.");
    },
);

app.use("/checkout", limiter, checkKey);
app.use("/", checkout);

app.listen(
    port,
    () => {
        console.log(`Listening on port ${port}`);
    },
);
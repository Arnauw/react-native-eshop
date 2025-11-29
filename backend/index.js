import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import "dotenv/config";
import checkout from "./routes/checkout.js";

const app = express();
const port = process.env.PORT || 3000;

// 1. Mandatory for Nginx + Rate Limiting
// Tells Express to trust the X-Forwarded-For header from Nginx
app.set('trust proxy', 1);

// 2. Security Headers (Hides "X-Powered-By: Express" etc.)
app.use(helmet());

app.use(cors());
app.use(express.json());

// 3. Rate Limiter Configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // Limit each IP to 20 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many checkout attempts, please try again later.' }
});

// 4. Shared Secret "Latch" Middleware
const checkKey = (req, res, next) => {
    const authHeader = req.headers['x-app-secret'];

    // Compare header with the secret in your Server's .env
    if (authHeader !== process.env.APP_SHARED_SECRET) {
        return res.status(403).json({ error: 'Forbidden: Invalid App Secret' });
    }
    next();
};

// 5. Public Health Check (Keep this open to test if server is alive)
app.get(
    "/",
    (req, res) => {
        res.send("KEKEKEKEKEK");
    },
);

// // 6. Apply Security Middleware ONLY to checkout routes
// // The request goes: Limiter -> Check Secret Key -> Checkout Logic
// 6.1. Apply Security Middleware specifically to the /checkout path
// This ensures that before the request even reaches your logic, it is checked.
app.use("/checkout", limiter, checkKey);

// 6.2. Mount the Router
// This loads your checkout.js file
app.use("/", checkout);

app.listen(
    port,
    () => {
        console.log(`Listening on port ${port}`);
    },
);
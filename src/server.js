import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { redisClient, redisConnection } from "./lib/redisConnection.js";
import errorCodes from "./constants/errorCodes.js";
import { connectToDatabase } from "./lib/dbConnection.js";
import { RedisStore } from "connect-redis";
import config from "./config/config.js";
import apiRoute from "./indexRoute.js";
// import webhookController from "./components/webhook/webhook.controller.js";

const port = config.port.port || 3000;
const app = express();

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   webhookController.listenToWebhook
// );

app.use((req, res, next) => {
  if (req.originalUrl === "/api/webhook/") {
    next();
  } else {
    bodyParser.json()(req, res, next);
    // app.use(express.json());
    // app.use(bodyParser.json());
  }
});

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: config.redis.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use("/api", apiRoute);

app.use("/", (err, req, res, next) => {
  const errorNames = Object.keys(errorCodes);
  const errorMsg = err.message;
  const errorMatch = errorNames.includes(errorMsg);
  if (errorMatch) {
    const status = errorCodes[errorMsg].httpStatusCode;
    const code = errorCodes[errorMsg].body.code;
    const message = errorCodes[errorMsg].body.message;
    res.status(status).json({ code, message });
  } else {
    res.status(500).json({
      code: err.code || "server crashed",
      message: err.message || "Server Crashed",
    });
  }
});

connectToDatabase();
redisConnection();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

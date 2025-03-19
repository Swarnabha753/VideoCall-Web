import dotenv from "dotenv";
dotenv.config();


import express from "express";

import { createServer } from "node:http";


import { Server } from "socket.io";

import mongoose from "mongoose";


import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";


const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/users", userRoutes);

app.get("/home", (req, res) => {
    return res.json({ "hello": "world" });
});



const start = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined. Check your .env file.");
        }

        const connectionDb = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);

        server.listen(app.get("port"), () => {
            console.log(`LISTENING ON PORT ${app.get("port")}`);
        });
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); // Exit process on failure
    }
};

start();

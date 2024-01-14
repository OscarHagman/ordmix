"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
const server = app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("joinGame", (gameId) => {
        console.log(`Client ${socket.id} joined game ${gameId}`);
        socket.join(gameId);
    });
    socket.on("startGame", (gameId) => {
        console.log(`Game ${gameId} started`);
        const randomLetters = (0, utils_1.generateRandomLetters)();
        io.in(gameId).emit("startGame", randomLetters);
    });
    socket.on("movingLetter", (gameId, letter) => {
        console.log("movingLetter");
        if (letter) {
            console.log('position:', letter.x, letter.y);
            socket.to(gameId).emit("movingLetter", letter);
        }
    });
    socket.on("updateState", (gameId, state) => {
        console.log(`Game: ${gameId} - client ${socket.id} updated state`);
        socket.to(gameId).emit("updateState", state);
    });
    socket.on("message", (message) => {
        console.log(message);
        io.emit("message", `${socket.id.slice(0, 2)} said: ${message}`);
    });
});

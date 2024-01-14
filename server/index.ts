import express from "express"
import cors from "cors"
import { Server } from "socket.io"
import { generateRandomLetters } from "./utils"

const app = express()
app.use(cors({ origin: "http://localhost:3000" }))

const server = app.listen(5000, () => {
  console.log("Server is running on port 5000")
})

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
})


type MovingLetter = {
  x: number,
  y: number,
  index: number
}


io.on("connection", (socket) => {
  console.log("New client connected")

  socket.on("joinGame", (gameId) => {
    console.log(`Client ${socket.id} joined game ${gameId}`)

    socket.join(gameId)
  })

  socket.on("startGame", (gameId) => {
    console.log(`Game ${gameId} started`)

    const randomLetters = generateRandomLetters();
    io.in(gameId).emit("startGame", randomLetters);
  })

  socket.on("movingLetter", (gameId, letter: MovingLetter) => {
    console.log("movingLetter")
    if (letter) {
      console.log('position:', letter.x, letter.y)
      socket.to(gameId).emit("movingLetter", letter)
    }
  })

  socket.on("updateState", (gameId, state) => {
    console.log(`Game: ${gameId} - client ${socket.id} updated state`)

    socket.to(gameId).emit("updateState", state)
  })



  socket.on("message", (message) => {
    console.log(message)
    io.emit("message", `${socket.id.slice(0, 2)} said: ${message}`)
  })
})

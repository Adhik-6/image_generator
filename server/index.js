import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import "express-async-error"
import cors from 'cors'
import router from './routes/route.js';
import connectDB from './db/connect.js'
import {errorHandler, pageNotFound} from './middleware/index.js';

const app = express();
dotenv.config()
const __dirname = path.resolve();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}))

app.use(express.json({limit: "50mb"})) //increase deafult limit so that the backend can accept large payloads

// app.get("/", (req, res) => {
//   res.send("Hello, This is the Home Route")
// })
app.use("/api/v1", router);
console.log("Before working")
console.log(process.env.NODE_ENV, " length: ", process.env.NODE_ENV.length)
if(process.env.NODE_ENV === "production"){ // look out, when setting node_env's value in pkg.json file there came a unexpected space after the word "production". so we gave "production " //with one trailing space.
    console.log("working")
    app.use(express.static(path.join(__dirname, "/client/dist")))

    app.get("/", (req, res) =>{
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    })
}

app.use(errorHandler)
app.use(pageNotFound)

async function startServer(){
  await connectDB(process.env.MONGO_URI)
  app.listen(process.env.PORT, console.log("Server started at http://localhost:8000"))
}
startServer()

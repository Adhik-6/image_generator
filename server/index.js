import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import "express-async-error"
import cors from 'cors'
import router from './routes/route.js';
import connectDB from './db/connect.js'
import errorHandler from './middleware/errorHandler.js';

dotenv.config()
const app = express();

const __dirname = path.resolve();
app.use(express.json({limit: "50mb"})) //increase deafult limit so that the backend can accept large payloads

// You can remove this when in production if you're combining your frontend and backend together into a single webpage.
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"]
}))


app.use("/api/v1", router);
// console.log("Before working")
// console.log(process.env.NODE_ENV, " length: ", process.env.NODE_ENV.length)
if(process.env.NODE_ENV === "production"){ 
  console.log("Production running...")
  app.use(express.static(path.join(__dirname, "/client/dist")))
  app.get("*", (req, res) =>{
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  })
}

app.use(errorHandler)

async function startServer(){
  await connectDB(process.env.MONGO_URI)
  app.listen(process.env.PORT || 8000, console.log("Server started"))
}
startServer()

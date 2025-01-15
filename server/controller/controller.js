// import OpenAI from "openai";

import fs from "node:fs";
import dotenv from "dotenv"
import FormData from "form-data";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';
import { posts } from "../models/model.js"

dotenv.config()

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

const getAllImg = async (req, res) =>{
  const data = await posts.find().sort({"_id": -1})
  console.log("Fetched all data")
  res.status(200).json({success:true, images: data})
}

const getGenImg = async (req, res) =>{
  try{    
    const response = await axios.postForm( `https://api.stability.ai/v2beta/stable-image/generate/core`,
      axios.toFormData({
        prompt: `${req.body.prompt}`,
        output_format: "png"
      }, 
      new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: { 
          Authorization: `Bearer ${process.env.STABLEAI_API_KEY}`, 
          Accept: "image/*" 
        },
      },
    );
    // responseType: "arraybuffer"  - is neccessary when getting img data as response
    fs.writeFileSync(`./server/generated_images/${req.body.prompt.slice(10)}.png`, Buffer.from(response.data));
    // const blob = new Blob([response.data], { type: 'image/png' });
    // const url = URL.createObjectURL(blob);
    // console.log(`Image URL: ${url}`);
    // res.set("Content-Type", "image/png")
    // // console.log("res.data:", response.data)
    // res.send(response.data);

    // let response = await axios.get("https://th.bing.com/th?id=OSK.oAPLJ33yhiFp9xD_aZmqjb-cQQI_-BjOfhE6fgFEBwE&w=80&h=80&c=7&o=6&dpr=1.5&pid=SANGAM", {responseType: 'arraybuffer'})
    const base64String = Buffer.from(response.data).toString('base64')
    const mimeType = response.headers['content-type']; 
  
    // console.log(base64String, typeof(base64String));
    res.json({b64: `data:${mimeType};base64,${base64String}`})

  } catch(err){
    console.log("Stable API error: ",err.message, " | ", err.name)
    res.send({message:"failure", photo: './../../public/vite.svg'})
  }
}

function getBlobUrl(data, dtype){
  const blob = new Blob([data], { type: `image/${dtype}` }); 
    console.log("blob_1", blob)
    const url = URL.createObjectURL(blob);
    return url;
}

const postToCom = async (req, res) => {
  try{
    console.log("on posting to community", req.body)

    const uploadResult = await cloudinary.uploader.upload(req.body.photo, {public_id: `${req.body.prompt.slice(-10)}`})
    console.log("upload results: ", uploadResult);
  
    const data = await posts.create({ prompt: req.body.prompt, name: req.body.name.length==0?"Anonymous":req.body.name, photo: uploadResult.secure_url});
    console.log("Created: ", data);
    res.json({message: data})
  } catch(err){
    console.log(err.message);
  }
}

export {getAllImg, getGenImg, postToCom}
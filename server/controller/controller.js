import dotenv from "dotenv"
// import fs from "node:fs"; // To save image locally during development
// import FormData from "form-data"; // Use this when using stability AI API
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';
import { posts } from "../models/model.js"

dotenv.config()

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
    // const response = await axios.postForm( `https://api.stability.ai/v2beta/stable-image/generate/core`,
    //   axios.toFormData({
    //     prompt: `${req.body.prompt}`,
    //     output_format: "png"
    //   }, new FormData()),
    //   {
    //     validateStatus: undefined,
    //     responseType: "arraybuffer",
    //     headers: { 
    //       Authorization: `Bearer ${process.env.STABLEAI_API_KEY}`, 
    //       Accept: "image/*" 
    //     },
    //   },
    // );
    //
    // // fs.writeFileSync(`./server/generated_images/${req.body.prompt.slice(10)}.${mimeType}`, Buffer.from(response.data));
    
    // // let response = await axios.get("https://th.bing.com/th?id=OSK.oAPLJ33yhiFp9xD_aZmqjb-cQQI_-BjOfhE6fgFEBwE&w=80&h=80&c=7&o=6&dpr=1.5&pid=SANGAM", {responseType: 'arraybuffer'})
    
    // const base64String = Buffer.from(response.data).toString('base64')
    // const mimeType = response.headers['content-type']; 
    // console.log("response.mimeType: ", response.headers['content-type'])
    // if(mimeType==="application/json") throw new Error("Image generation Limit Reached")
    
    // res.json({b64: `data:${mimeType};base64,${base64String}`})
    
    // responseType: "arraybuffer"  - is neccessary when getting img data as response as this will convert raw bytes into an array buffer

    // > stabilityai/stable-diffusion-xl-base-1.0
    // > CompVis/stable-diffusion-v1-4
    console.log("Generating....")
    const response = await axios.post("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", JSON.stringify({inputs: req.body.prompt}), 
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      responseType: 'arraybuffer'
    }
  );
    // response.data returns an array buffer
    console.log("Generated.")
    // fs.writeFileSync(`./server/generated_images/${req.body.prompt.slice(10)}.${mimeType}`, Buffer.from(response.data));
    const base64String = Buffer.from(response.data).toString('base64')
    const mimeType = response.headers['content-type']
    if(mimeType==="application/json") throw new Error("Image generation Limit Reached")
    
    console.log("Image successfully sent")
    res.json({b64: `data:${mimeType};base64,${base64String}`})

  } catch(err){
    console.log("Image generation API error: ",err.message, " | ", err.name)
  }
}


const postToCom = async (req, res) => {
  try{
    console.log("Posting: ", req.body)

    const uploadResult = await cloudinary.uploader.upload(req.body.photo)
    console.log("Cloudinar upload results: ", uploadResult);
  
    const data = await posts.create({ prompt: req.body.prompt, name: req.body.name.length==0?"Anonymous":req.body.name, photo: uploadResult.secure_url});
    res.json({message: "Successfully Posted", "data": data})
  } catch(err){
    console.log("Posting error: ",err.message, " | ", err.name);
  }
}

export {getAllImg, getGenImg, postToCom}

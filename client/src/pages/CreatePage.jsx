import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { surpriseMePrompts } from '../../constants/index.js'
import {Loader} from "./../components/index.js"
import { preview } from './../assets/index.js'
// import viteLogo from './../../public/vite.svg'
// downloading, material UI icon, using theme.extend in tailwind, shadow-card hover:shadow-cardhover

const CreatePage = () => {
  const [newPost, setNewPost] = useState({ name:"", prompt:"", photo: preview})
  const [errMsg, setErrMsg] = useState("")
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const navigate = useNavigate();

  function inchange(e){
    setErrMsg("");
    setNewPost((prev) => ({...prev, [e.target.name]:e.target.value}))
  }
  
  function getSurprisePrompts(currPrompt){
    let randomPrompt = surpriseMePrompts[Math.floor(Math.random()*(surpriseMePrompts.length))]
    if(randomPrompt == currPrompt) randomPrompt = getSurprisePrompts(currPrompt);
    return randomPrompt;
  }

  function getBlobUrl(data, dtype){
    const blob = new Blob([data], { type: `image/${dtype}` }); 
      console.log("blob_1", blob)
      const url = URL.createObjectURL(blob);
      return url;
  }

  async function genImg(e){
    e.preventDefault();
    try{
      setErrMsg("")
      setLoading(true);
      if(!newPost.prompt){
        setErrMsg("Prompt is required!")
        return
      }
      let response = await axios.post("https://image-generator-tazg.onrender.com/api/v1/dalle", newPost) 
      // let response = await axios.get("./../../public/vite.svg", {responseType: "blob"})
      // // mentioning response type here is necessary else we won't know a blob data is coming
      // console.log("create page 1: ", response.data.b64, typeof(response.data.b64))
      
      // setNewPost({...newPost, binPhoto: response.data, photo: getBlobUrl(response.data, "svg+xml")})
      setNewPost({...newPost, photo: response.data.b64})
    } catch(err){
      console.log(err)
      setErrMsg(err.message)
    } finally{
      setLoading(false);
    }
  }

  async function shareToCom(){
    try{
      if(newPost.photo == preview){
        setErrMsg("Can't share ungenerated images")
        return
      }
      // console.log("create page 2: ",newPost)
      setSharing(true)
      let response = await axios.post("https://image-generator-tazg.onrender.com/api/v1/posts", newPost)
      console.log("Successfully posted!")
      navigate("/");
    } catch(err){
      console.log(err.message);
    } finally{
      setSharing(false);
    }
  }

  function handleSurpise(e){
    e.preventDefault()
    setErrMsg("")
    setNewPost((prev) => ({...prev, prompt: getSurprisePrompts(prev.prompt)}) )
  }

  return (
    <section className='flex flex-col gap-4'>
      {sharing && (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-[#2525258f] z-20'>
          <Loader />
        </div>
      )}
      <div>
        <h1 className='font-semibold text-3xl mb-2'>Create</h1>
        <p className='text-slate-500 text-[15px]'>Generate an imaginative image through DALL-E AI and share it with the community.</p>
      </div>

      <form className='flex flex-col gap-4 mt-6 mb-4'>
        <div>
          <label htmlFor="name">Your Name or Title</label> <br />
          <input className='mt-1 border border-slate-300 dark:border-slate-600 dark:focus:border-slate-300 px-2 py-1 w-full' name='name' id='name' type="text" placeholder='Jhon Doe' value={newPost.name} onChange={inchange} />
        </div>

        <div>
          <label htmlFor="prompt">Prompt</label>
          <button onClick={handleSurpise} className='ml-5 bg-yellow-400 text-slate-800 font-serif rounded-md px-1 py-1'>Surprise me!</button> <br />
          <textarea className='mt-3 border bg-transparent border-slate-300 dark:border-slate-600 dark:focus:border-slate-300 px-2 py-1 w-full max-h-52 min-h-9' name='prompt' id='prompt' type="text" placeholder='A painting of a fox in the style of Starry Night' value={newPost.prompt} onChange={inchange} />
        </div>

        <div className='my-4 relative mx-auto sm:mx-0 w-64 h-auto border-2 border-[#2323234c] dark:border-slate-700 dark:bg-slate-400 rounded-md p-2'>
          {loading && (
            <div className='absolute inset-0 h-full bg-[#2525258f]'>
              <Loader/>
          </div>
          )}
          <img className='w-full' src={newPost.photo} alt="Image preview" />
        </div>

        <div className='w-full sm:w-fit'>
          <button onClick={genImg} className='bg-green-500 w-full font-semibold rounded-md py-[0.4em] px-3 text-white'>Generate</button>
          {errMsg && <p className='text-center sm:text-left font-medium mt-5 text-md text-red-500'>{errMsg}</p>}
        </div>
      </form>

      <section>
        <p className='text-slate-500 text-[15px]'>** Once you have created the image, You can share it with others in the community **</p>
        <div className='w-full sm:w-fit'>
          <button onClick={shareToCom} className='rounded-md w-full bg-purple-500 py-2 px-3 text-white font-semibold mt-3'>Share in Community</button>  
        </div>
      </section>

    </section>
  )
}

export default CreatePage

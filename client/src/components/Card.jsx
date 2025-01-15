import React from 'react'
import axios from 'axios'
import { download } from '../assets/index.js'
import vite from "./../../public/vite.svg"

const Card = ({data}) => {

    async function downloadImg(){
      let response = await axios.get(data.photo, {responseType: 'blob'})
      const mimeType = response.headers['content-type']; 
      const blob = new Blob([response.data], { type: `image/${mimeType}` }); 
      console.log("blob_1", blob)
      const url = URL.createObjectURL(blob);
      // const base64String = Buffer.from(response.data).toString('base64')
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${data.prompt.slice(-10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

  return (
    <div className='card_cont min-h-[170px] min-w-[170px] border border-slate-800 overflow-hidden rounded-lg relative'>
      <img className='w-full h-full' src={data.photo} />
      <article className='hover_bg absolute bottom-[-200%] left-1 right-1 rounded-lg p-2 bg-slate-800 text-white'>
        <div>
          <p className='text-[12px]'>{data.prompt}</p>
        </div>
        <div className='flex mt-2 items-center justify-between'>
          <div className='flex items-center'>
            <div className='inline text-xs bg-emerald-700 p-[2px_6px] mr-[6px] rounded-full'>{data.name.charAt(0)}</div>
            <p className='inline text-[15px]'>{data.name}</p>
          </div>
          <button onClick={downloadImg} className='h-7 inline bg-slate-100 rounded-full'>
            <img className='w-full h-full' src={download} alt="Download" />
          </button>
        </div>
      </article>
    </div>
  )
}

export default Card
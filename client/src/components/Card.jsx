import axios from 'axios'
import { download } from '../assets/index.js'

const Card = ({data}) => {

  async function downloadImg() {
    try {
      const response = await axios.get(data.photo, { responseType: 'blob' });      
      const blob = response.data; 
      
      const extension = blob.type.split('/')[1] || 'png';
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.download = `generated-image-${Date.now()}.${extension}`;
      
      document.body.appendChild(link);
      link.click();      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      window.alert("Failed to download image. Please try again.");
    }
  }

  return (
    <div className='card_cont min-h-42.5
     min-w-42.5 border border-slate-800 overflow-hidden rounded-lg relative'>
      <img className='w-full h-full' src={data.photo} />
      <article className='hover_bg absolute bottom-[-200%] left-1 right-1 rounded-lg p-2 bg-slate-800 text-white'>
        <div>
          <p className='text-[12px]'>{data.prompt}</p>
        </div>
        <div className='flex mt-2 items-center justify-between'>
          <div className='flex items-center'>
            <div className='inline text-xs bg-emerald-700 p-[2px_6px] mr-1.5 rounded-full'>{data.name.charAt(0)}</div>
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
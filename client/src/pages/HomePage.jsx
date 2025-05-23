import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { Card, Loader } from './../components/index.js'
// import vite from './../../public/vite.svg'

const HomePage = () => {
  const [imgData, setImgData] = useState([])
  const [filteredData, setFilteredData] = useState([]);
  const [searchfield, setSearchfield] = useState("");
  const [loading, setloading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    async function getAllImg() {
      try{
        setloading(true)
        let response = await axios.get("https://image-generator-tazg.onrender.com/api/v1/posts")
        // let response = await axios.get("http://localhost:8000/api/v1/posts")
        setImgData(response.data.images)
        setFilteredData(response.data.images)
      } catch(err) {
        console.log(err.message)
      } finally{
        setloading(false);
      }
    }
    getAllImg()
  },[location])

  useEffect(() =>{
    if(searchfield)
      setFilteredData(imgData.filter((currItem) => currItem.name.toLowerCase().includes(searchfield.toLowerCase()) || currItem.prompt.toLowerCase().includes(searchfield.toLowerCase())))
    else
      setFilteredData(imgData);
  },[searchfield])

  return (
    <>
    <section className='flex flex-col gap-5 min-h-full'>
      <div className='flex flex-col gap-5'>
        <h1 className='font-semibold text-3xl'>The Community Showcase</h1>
        <p className='text-slate-500 text-[15px]'>Explore a world of AI-generated art. Dive into our extensive library of captivating AI-generated images. Browse, discover, and download your next favorite image.</p>
      </div>

      <form className='mt-3'>
        <label htmlFor="searchText">Search Post</label> <br />
        <input className='mt-2 w-full bg-transparent border border-slate-400 dark:border-slate-700 dark:focus:border-slate-300 px-2 py-2' type="search" name="searchText" id="searchText" placeholder='Search Something...' value={searchfield} onChange={e => setSearchfield(e.target.value)}/>
      </form>

      {loading? (
        <div className='w-full mt-10 grid place-items-center'>
          <Loader />
        </div>
      ) : (
        <div>
          {searchfield && (
            <p className='font-bold text-lg'>Showing reaults for: <span className='font-normal italic'>{searchfield}</span></p>
          )}
          {filteredData.length==0?(
            <p className='w-fit text-3xl mt-7 mx-auto'>NO DATA FOUND</p>
          ) : (
          <section className='mt-7 grid grid-cols-1 gap-x-4 gap-y-4 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4'>
            {filteredData?.map((item) => <Card key={item._id} data={item} /> )}
          </section>
          )}
        </div>
      )}

    </section>
    </>
  )
}

export default HomePage

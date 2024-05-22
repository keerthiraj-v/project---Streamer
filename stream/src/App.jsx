import thumbnail from "./assets/cover.jpg"

import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from 'react-player';
import axios from "axios";
import Hls from 'hls.js';
import { endpoints } from './urls';


export default function App() {

  let video = useRef(null)
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  let [menu, setMenu] = useState(false)
  let [videos, setVideos] = useState([])
  let [player, setPlayer] = useState(false)
  let [vid, setVid] = useState('')


  useEffect(() => {
    axios.get(endpoints.videos)
    .then((response) => {
      setVideos([])
      response.data.map((data) => {
        console.log(data);
        setVideos(prev => [...prev, data])
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }, []);

  /*
  useEffect(() => {
    if (Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(`${endpoints.stream}/1715703675397/1715703675397.m3u8`);
      hlsRef.current.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = `${endpoints.stream}/1715703675397/1715703675397.m3u8`
    }
  }, []);
  */

  function Thumbnail({ metadata }){
    return(
      <div className="column is-3-desktop is-6-tablet is-12-mobile is-flex is-justify-content-center">
      <div className="parent has-text-centered">
          <img src={thumbnail} style={{borderRadius: "10px"}}/>
          <div className="overlay is-flex is-justify-content-center is-align-items-center is-flex-direction-column">
              <p className="has-text-white poppins-semibold is-size-5">{metadata.file}</p>
              <div className="is-flex options mt-5">
                  <button className="button mx-3" onClick={() => {
                    setVid(metadata.uid)
                    setPlayer(!player)
                  }}>
                      <span className="icon is-small">
                        <i className="fa-solid fa-play"></i>
                      </span>
                  </button>
                  <button className="button mx-3" onClick={() => deleteVideo(metadata.uid)}>
                      <span className="icon is-small">
                        <i className="fa-solid fa-trash"></i>
                      </span>
                  </button>
              </div>
          </div>
      </div>
    </div>
    )
  }

  async function uploadFile(e){
    console.log(e.target.files[0]);
    try{
      let metadata = {
        uid: new Date().getTime(),
        file: e.target.files[0].name,
        size: parseInt(e.target.files[0].size / 1024**2) + ' MB',
        type: e.target.files[0].type,
        date: new Date().getDate().toString() + '/' + parseInt(new Date().getMonth()+1).toString() + '/' + new Date().getFullYear(),
        location: '/',
        meta: {
          lastModified: e.target.files[0].lastModified,
          lastModifiedDate: e.target.files[0].lastModifiedDate
        }
      }

      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      formData.append('objectData', JSON.stringify(metadata))
      
      /* To upload the videos */
      try {
        const response = await axios.post(endpoints.upload, formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        });
  
        /* To list the videos */
        if(response.data.status == 'success'){
            console.log('File uploaded successfully...!');
            axios.get(endpoints.videos)
            .then((response) => {
              setVideos([])
              response.data.map((data) => {
                setVideos(prev => [...prev, data])
              })
            })
            .catch((err) => {
              console.log(err);
            })
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    catch(e){
      console.log('File not selected to upload.');
    }
  }

  function deleteVideo(vid){
    /* To delete the video */
    axios.get(`${endpoints.delete}/${vid}`)
    .then((response) => {
      let filtered = videos.filter((item) => {
        return item.uid != vid
      })
      setVideos(filtered)
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <div>
      <nav className="navbar" role="navigation" aria-label="main navigation" style={{backgroundColor: "transparent"}}>
        <div className="navbar-brand">
          <a role="button" className={`navbar-burger ${menu ? 'is-active' : null}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={()=>setMenu(!menu)}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      
        <div className={`navbar-menu ${menu ? 'is-active' : null}`} style={{backgroundColor: "transparent"}}>
          <div className="navbar-start">
            <p className="navbar-item has-text-white has-text-weight-bold poppins-bold is-size-3">
              Streamer
            </p>
          </div>
      
          <div className="navbar-end is-flex is-align-items-center">
            <div className="field mx-3 mt-3">
                <p className="control is-expanded has-icons-right">
                  <input className="input is-small poppins-regular" type="text" placeholder="Search" />
                  <span className="icon is-small is-right">
                    <i className="fa-brands fa-searchengin"></i>
                  </span>
                </p>
            </div>
              <button className="button mx-3">
                <label>
                  <span>Upload</span>
                  <span className="icon is-small">
                    <i className="fa-solid fa-upload"></i>
                    <input type='file' style={{display: "none"}} onChange={uploadFile}/>
                  </span>
                </label>
              </button>
          </div>
        </div>
    </nav>
      <div className={`columns is-flex is-justify-content-center is-align-items-center my-6 ${player ? null : 'is-hidden-touch is-hidden-tablet'}`} id="player">
        <div className="column is-8-desktop is-6-tablet is-10-mobile is-flex is-justify-content-center">
          <ReactPlayer ref={video} controls url={`${endpoints.stream}/${vid}/${vid}.m3u8`}/>
        </div>
      </div>
      <div className="columns is-multiline p-4 mt-6" id="lib">
        {/* Videos will be generated here */}
        {
          videos.map((item) => (
            <Thumbnail metadata={item}/>
          ))
        }
      </div>
    </div>
  )
}

//is-hidden-touch is-hidden-tablet
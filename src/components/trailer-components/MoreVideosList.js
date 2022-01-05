import React , {useEffect} from 'react'
import {ReactComponent as PlayIcon} from '../../icons/play_btn.svg';
import LoadingWrapper from '../LoadingWrapper';

function MoreVideosList({list , current_video , changeCurrentVideo , fetch_status} = {
  list : [] , current_video : null , changeCurrentVideo : ()=>{}
}) {
  useEffect(()=>{
    if(current_video.key){
      const target_element = document.getElementById(`video-thumb-${current_video.key}`);
      if(target_element){
        if(window.innerWidth < 800) {
          const element = document.querySelector('#film-movie-container')
          if(element) element.scrollIntoView(false);
        }
        else target_element.scrollIntoView(false);
      }
    }

  },[current_video])
  return (
    <div className="movies-videos-list-wrapper">
      <h3 className="movies-videos-list--heading">More from This Movie</h3>
      <ul className="movies-videos-list">
      <LoadingWrapper show_condition={list} loading_status={fetch_status.status} error={fetch_status.error}>
        {list.map((video)=>{
          return <li className="movies-videos-list__item" id={'video-thumb-'.concat(video.key)} key={video.key} onClick={changeCurrentVideo.bind(null , video.key)} video-selected={video.key === current_video.key ? "1" : "0"}>
            <img src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`} alt={current_video.name}/>
            <h3 className="movies-videos-list__item__title">{video.name}</h3>
            {video.key ===  current_video.key ? <i className="movies-videos-list__item__icon">
              <PlayIcon/>
            </i> : null}
          </li>
        })} 
      </LoadingWrapper>
      </ul>
    </div>
  )
}

export default MoreVideosList

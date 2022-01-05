import YoutubePlayer from "../../utils/youtube_api"
import { ReactComponent as PlayButton } from '../../icons/play_btn.svg';
import { ReactComponent as PauseButton } from '../../icons/pause_btn.svg';
import { ReactComponent as ChangeTrackButton } from '../../icons/next_btn.svg';
import { ReactComponent as StopButton } from '../../icons/stop_btn.svg';
import { useState , useEffect } from "react";

function YoutubeVideo({id , label , changeToNextTrack , changeToPrevTrack , prev_track_id , next_track_id , loading_status}){
  const [video_object , set_video_object] = useState({});
  const [player_ready , set_player_ready] = useState(false);
  const [playing_state , set_playing_state] = useState(-1);
  useEffect(()=>{
    const load_video = async ()=>{
      if(id && id.length > 0 && !video_object.playerInstance && loading_status.status === 'idle'){
        const new_video_object = new YoutubePlayer({
          width : '100%',
          height : '100%',
          videoID : id,
          containerID : label,
          events : {
            onReady : ()=>{
              set_player_ready(true);
            },
            onStateChange : ({data})=>{
              if(data === 2) set_playing_state(0);
              else if(data === 1) set_playing_state(1);
            }
          }
        })
        await new_video_object.createVideoInstance();
        set_video_object(new_video_object);
      }
      else if(video_object.playerInstance){
        if(id) video_object.playerInstance.cueVideoById(id);
      }
    }
    load_video();
  },[id,loading_status])

  return <div className="youtube-video">
    <div className="youtube-video__window" loading={player_ready ? "0" : "1"} id={label}></div>
    <div className="youtube-video__controls" buttons-disabled={player_ready ? "0" : "1"}>
      <button className="youtube-video__controls__change-track-btn youtube-video__controls__change-track-btn--prev" 
      disabled={!prev_track_id}
      onClick={changeToPrevTrack}
      >
        <ChangeTrackButton/>
      </button>
      <button className="youtube-video__controls__play-btn" onClick={()=>{
        if(!video_object.playerInstance) return;
        if(playing_state === -1 || playing_state === 0){
          video_object.playerInstance.playVideo();
        }
        else if(playing_state === 1){
          video_object.playerInstance.pauseVideo();
        }
      }}>
        {playing_state === 0 ? <PlayButton/> : null}
        {playing_state === 1 ? <PauseButton/> : null}
        {playing_state === -1 ? <StopButton/> : null}
      </button>
      <button className="youtube-video__controls__change-track-btn youtube-video__controls__change-track-btn--next"
      onClick={changeToNextTrack}  disabled={!next_track_id}
      >
        <ChangeTrackButton/>
      </button>
    </div>
  </div>

}

export function VideoInfo({title , description , releaseDate , videoType}){
  return (
    <div className="trailer-embed-video-info">
      <span className="trailer-embed-video-info__video-type">{videoType}</span>
      <h1 className="trailer-embed-video-info__title">{title}</h1>
      <p className="trailer-embed-video-info__description">{description}</p>
      <h4 className="trailer-embed-video-info__release-date">Coming To Theaters on {releaseDate}</h4>
    </div>
  )
}

export default function TrailerEmbedVideoPlayer({next_track_id , prev_track_id, current_track_id , changeToPrevTrack , changeToNextTrack , fetch_status}){

  return <div className="trailer-embed-video-player" id="film-movie-container">
    <YoutubeVideo label={"film-movie"} 
      loading_status={fetch_status}
      changeToNextTrack={changeToNextTrack} 
      changeToPrevTrack={changeToPrevTrack} 
      id={current_track_id} 
      prev_track_id={prev_track_id}
      next_track_id={next_track_id}
    />
  </div>
}
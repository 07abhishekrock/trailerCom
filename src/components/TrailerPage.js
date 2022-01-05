import { apiKey } from "../app-store/movies_reducer";
import { VideoInfo } from "./trailer-components/TrailerEmbedVideoPlayer";
import TrailerEmbedVideoPlayer from "./trailer-components/TrailerEmbedVideoPlayer";
import { useLoader } from "../utils/custom_hooks";
import { useState , useEffect } from "react";
import { useSelector } from "react-redux";
import MoreVideosList from "./trailer-components/MoreVideosList";
import AvailableOnBlock from "./trailer-components/AvailableOnBlock";
import MovieCast from "./trailer-components/MovieCast";
import TrailerBar from "./trailer-components/TrailerBar";

export default function TrailerPage({movie_id}){
  const {idle : movie_info_idle, loading : movie_info_loading , error : movie_info_error , loading_status : movie_info_fetch_status} = useLoader('loading');
  const {idle : videos_list_idle, loading : videos_list_loading , error : videos_list_error , loading_status : videos_list_fetch_status} = useLoader('loading');
  const [video_results , set_video_results] = useState([]);
  const [current_playing_videos , set_current_playing_videos] = useState({
    current : {key : null , type : ''},
    next : {key : null , type : ''}, 
    prev : {key : null , type : ''},
    index : 0
  });
  const [movie_data , set_movie_data] = useState({
    title : '' , description : '' , releaseDate : '' , videoType : ''
  });
  const isTrailerWindowActive = useSelector(state=>state.should_trailer_window_open);
  useEffect(()=>{
    async function getMovieVideos(){
      if(!movie_id) return;
      videos_list_loading();
      const movie_videos_response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${apiKey}`)
      if(movie_videos_response.ok){
        const movie_data = await movie_videos_response.json();
        if(movie_data.success !== "false" && movie_data.results){
          const youtube_video_results = movie_data.results.filter(video=>video.site === "YouTube")
          set_current_playing_videos(c=>{
            return {
              ...c,
              current : youtube_video_results[0] || {key : null , type : null},
              next : youtube_video_results[1] || {key : null , type : null},
              prev : {key : null , type : null},
              index : 0
            }
          });
          set_video_results(youtube_video_results);
          videos_list_idle();
        }
        else{
          set_video_results([]);
          videos_list_error(movie_data.status_message);
        }
      }
      else{
        set_video_results([]);
        videos_list_error('Some Error Occurred');
      }
    }
    async function getMovieInfo(){
      movie_info_loading();
      const movie_info_response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${apiKey}`) 
      if(movie_info_response.ok){
        const movie_data = await movie_info_response.json();
        if(movie_data.success !== "false"){
          set_movie_data({
            title : movie_data.original_title,
            releaseDate : movie_data.release_date,
            description : movie_data.overview,
            rating : Number(movie_data.vote_average * 10).toFixed(0),
          }) 
          movie_info_idle();
        }
        else{
          movie_info_error(movie_data.status_message || 'Some Error Occurred');
        }
      }
      else{
        movie_info_error('Some Error Occurred');
      }     
    }
    getMovieVideos();
    getMovieInfo();
  },[movie_id])
  return (
    <div className="trailer-page-wrapper" view={isTrailerWindowActive && movie_id ? "1" : "0"}>
      <TrailerBar movie_title={movie_data.title}/>
      <div className="trailer-page">
        <div className="trailer-page-video">
          <TrailerEmbedVideoPlayer current_track_id={current_playing_videos.current.key} 
            next_track_id={current_playing_videos.next.key} 
            prev_track_id={current_playing_videos.prev.key}
            fetch_status={videos_list_fetch_status}
            changeToNextTrack={()=>{
              if(current_playing_videos.next.key){
                const index = current_playing_videos.index;
                const new_index = index + 1;
                const isNextAvailable = new_index + 1 < video_results.length;
                const isPrevAvailable = new_index - 1 >= 0;
                set_current_playing_videos({
                  current : current_playing_videos.next,
                  next : isNextAvailable ? video_results[new_index + 1] : {key : null},
                  prev : isPrevAvailable ? video_results[new_index - 1] : {key : null},
                  index : new_index
                })
              }
            }}
            changeToPrevTrack={()=>{
              if(current_playing_videos.prev.key){
                const index = current_playing_videos.index;
                const new_index = index - 1;
                const isNextAvailable = new_index + 1 < video_results.length;
                const isPrevAvailable = new_index - 1 >= 0;
                set_current_playing_videos({
                  current : current_playing_videos.prev,
                  next : isNextAvailable ? video_results[new_index + 1] : {key : null},
                  prev : isPrevAvailable ? video_results[new_index - 1] : {key : null},
                  index : new_index
                })
              }
            }}
          />
          <VideoInfo status={movie_info_fetch_status.status} {...movie_data} movie_type={current_playing_videos.current.type}/>
        </div>
        <div className="trailer-page-movie-information">
          <AvailableOnBlock movie_id={movie_id}/>
          <MovieCast movie_id={movie_id}/>
        </div>
        <MoreVideosList fetch_status={videos_list_fetch_status} list={video_results} current_video={current_playing_videos.current} 
        changeCurrentVideo={(new_video_key)=>{
          let current_video , current_index;

          video_results.every((video, index)=>{
            if(video.key === new_video_key){
              current_video = video;
              current_index = index;
              return false;
            }
            return true;
          })
          if(current_index !== undefined){
            const next = current_index >= video_results.length - 1 ? {key : null} : video_results[current_index + 1];
            const prev = current_index === 0 ? {key : null} : video_results[current_index - 1];
            set_current_playing_videos(c=>{
              return {
              ...c,
              current : current_video,
              index : current_index,
              next,
              prev
              }
            })
          }
        }}/>

      </div>
    </div>
  )
}
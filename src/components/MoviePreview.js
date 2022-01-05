import {ReactComponent as RatingIcon} from '../icons/rating.svg';
import {ReactComponent as PlayIcon} from '../icons/play_button.svg';
import { useLoader } from '../utils/custom_hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useState , useEffect, useRef } from 'react';
import { apiKey, image_host_url } from '../app-store/movies_reducer';
import { useSelector , useDispatch } from 'react-redux';
import fallback_image from '../images/fallback.png';

function clipTextToLimit(text,limit=50){
  if(!text) return text;
  if(text.length){
    if(text.length < limit) return text;
    return text.slice(0 , limit).concat('...');
  }
}

function MoviePreview(){

  const preview_id = useSelector(state=>state.currentSelectedImage);
  const {idle , error , loading_status , loading} = useLoader();
  const [toPreview , set_preview_data] = useState({});
  const dispatch = useDispatch();
  const preview_ref = useRef(null);
  useEffect(()=>{
    async function getMoviePreview(){
      loading();
      const movie_response = await fetch(`https://api.themoviedb.org/3/movie/${preview_id}?api_key=${apiKey}`);
      if(movie_response.ok){
        const movie_data = await movie_response.json();
        if(movie_data.success !== "false"){
          set_preview_data({
            id : movie_data.id,
            title : movie_data.original_title,
            yearOfRelease : movie_data.release_date.split('-')[0],
            description : movie_data.overview,
            rating : Number(movie_data.vote_average * 10).toFixed(0),
            image : image_host_url(500).concat(movie_data.poster_path)
          }) 
          idle();
        }
        else{
          error(movie_data.status_message || 'Some Error Occurred');
        }
      }
      else{
        error('Some Error Occurred');
      }
    }
    getMoviePreview();
    if(window.innerWidth < 851){
      preview_ref.current && preview_ref.current.scrollIntoView(false);
    }
  },[preview_id])

  if(loading_status.status === 'loading'){
    return <div className="movie-preview movie-preview__fallback movie-preview__loading">
      <i className="movie-preview__icon" loading="1">
        <FontAwesomeIcon icon={faCircleNotch}/>
      </i>
      <span>Loading Preview</span>
    </div>
  }
  else if(loading_status.error){
    return <div className="movie-preview movie_preview__fallback movie-preview__error">
      <i className="movie-preview__icon">
        <FontAwesomeIcon icon={faExclamationTriangle}/>
      </i>
      <span>{loading_status.error}</span>
    </div>
  }
  return <div className="movie-preview" ref={preview_ref}>
    <img className="movie-preview__image" src={toPreview.image} alt={toPreview.title} onError={(e)=>{
      e.target.src = fallback_image;
    }}/>
    <div className="movie-preview__content">
      <div className="movie-preview__info-wrapper">
        <div className="movie-preview__info">
          <h1>{toPreview.title}</h1>
          <h3>{toPreview.yearOfRelease || 2013}</h3>
        </div>
        <h4 className="movie-preview__rating">
          <i className="movie-preview__rating-icon">
            <RatingIcon/>
          </i>
          {toPreview.rating}%
        </h4>
      </div>
      <p className="movie-preview__description">{clipTextToLimit(toPreview.description , 140) || 'No Description Provided'}</p>
      <button className="movie-preview__watch-trailer-btn" onClick={()=>{
        dispatch({type : 'movies/queueMovieToTrailerWindow' , payload : {id : preview_id , title : toPreview.title}})
      }}>
        <i className="movie-preview__play-icon"><PlayIcon/></i>
        Watch Trailer
      </button>
    </div>
  </div>
}

export default MoviePreview;
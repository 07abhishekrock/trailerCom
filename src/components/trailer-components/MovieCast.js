import React, { useState , useEffect } from 'react'
import { apiKey, getImageURL } from '../../app-store/movies_reducer';
import { useLoader } from '../../utils/custom_hooks'
import LoadingWrapper from '../LoadingWrapper';
import avatar_fallback_image from '../../images/avatar.svg';

function CastMember({character , name , profile}){
  return <div className="cast-member">
    <img src={getImageURL(profile)} onError={(e)=>{
      e.target.src = avatar_fallback_image;
    }} className="cast-member__image" alt={name}/>
    <h5 className="cast-member__name">{name}</h5>
    <h5 className="cast-member__character">{character}</h5>
  </div>
}

function MovieCast({movie_id}){
  const {idle , error , loading_status} = useLoader('loading');
  const [movie_cast_list , set_movie_cast_list] = useState([]);
  useEffect(()=>{
    async function load_cast(){
      const movie_cast_response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${apiKey}`);
      if(movie_cast_response.ok){
        const movie_cast_data = await movie_cast_response.json();
        set_movie_cast_list(movie_cast_data.cast.slice(0 , 6));
        idle();
      }
      else{
        error('Some Error Occurred');
      }
    }
    load_cast();
  },[movie_id])
  return (
    <div className="movie-cast">
      <h3 className="movie-cast__heading">Cast</h3> 
      <div className="movie-cast__container">
        <LoadingWrapper loading_status={loading_status.status} error={loading_status.error} show_condition={movie_cast_list.length > 0}>
          <ul className="movie-cast__list">
            {movie_cast_list.map((cast)=>{
              return <CastMember key={cast.id} name={cast.name} character={cast.character} profile={cast.profile_path}/>
            })}
          </ul>
        </LoadingWrapper>
      </div>
    </div>
  )
}

export default MovieCast

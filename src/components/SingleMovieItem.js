import { useDispatch } from 'react-redux';
import fallback from '../images/fallback.png';

export default function SingleMovieItem({id , image , title , year}){
  const dispatch = useDispatch();
  return <div className="single-movie-item" onClick={()=>{
    dispatch({type : 'movies/shiftToPreview' , payload : id});
  }}>
    <img className="single-movie-item__image" src={image} onError={(e)=>{
      e.target.setAttribute('src', fallback);
    }} alt={title}/>
    <h3 className="single-movie-item__heading">{title}</h3>
    <span className="single-movie-item__year">{year}</span>
  </div>
}
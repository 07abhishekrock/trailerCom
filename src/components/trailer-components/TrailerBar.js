import React from 'react'
import {ReactComponent as ArrowIcon} from '../../icons/back_btn.svg';
import {useDispatch , useSelector} from 'react-redux';

function TrailerBar({type}) {
  const dispatch = useDispatch();
  const current_trailer_state = useSelector(state=>state.should_trailer_window_open);
  const movie = useSelector(state=>state.watching_trailer_for);
  return (
    <div className="trailer-bar" floating={type === "fixed" ? "1" : "0"}>
      <i className="trailer-bar__arrow" onClick={()=>{
        if(current_trailer_state){
          return dispatch({type : 'movies/closeTrailer'});
        }
        dispatch({type : 'movies/watchTrailer'});
      }}>
        <ArrowIcon/>
      </i>
      <div className="trailer-bar__heading">
        <h4 className="trailer-bar__heading__status">{movie && movie.title ? "Watching Now" : "No Movie Selected"}</h4>
        <h1 className="trailer-bar__heading__movie">{(movie && movie.title) || "No Movie Selected"}</h1>
      </div>
    </div>
  )
}

export default TrailerBar

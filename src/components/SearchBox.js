import React , { useRef } from "react";
import {useSelector , useDispatch} from 'react-redux';
import { fetchMovieList } from "../app-store/movies_reducer";
import { ReactComponent as SearchIcon } from '../icons/search_icon.svg';

export default function SearchBox(){
  const search_text = useSelector(state=>state.searchQuery);
  const dispatch = useDispatch();
  const timeout_ref = useRef(null);
  return <form className="search-box" onSubmit={(e)=>{
    e.preventDefault();
    clearTimeout(timeout_ref.current);
    dispatch({type : 'movies/changePageNumber' , payload : 1});
    dispatch(fetchMovieList())
    //submit code comes here
  }}>
    <div className="search-box__input-wrapper">
      <i className="search-box__search-icon"><SearchIcon/></i>
      <input type="text" className="search-box__input" placeholder="Enter Your Movie Here" value={search_text} onInput={(e)=>{
        clearTimeout(timeout_ref.current);
        timeout_ref.current = setTimeout(()=>dispatch(fetchMovieList())
        ,1000)
      }} onChange={(e)=>{
        if(search_text === e.target.value) return;
        dispatch({
          type : 'movies/searchQuery',
          payload : e.target.value
          }) 
      }}/>
    </div>
  </form>
}
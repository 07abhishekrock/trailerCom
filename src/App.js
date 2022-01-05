import React , {useEffect} from "react";
import { fetchMovieList } from "./app-store/movies_reducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

import SearchBox from "./components/SearchBox";
import MoviesList from "./components/MoviesList";
import Navbar from "./components/Navbar";

import './sass/main.scss';
import TrailerPage from "./components/TrailerPage";
import TrailerBar from "./components/trailer-components/TrailerBar";
import LogoHeading from "./components/LogoHeading";

function App() {
  const movies = useSelector(state=>state.allMoviesList , shallowEqual)
  const movies_loading_error = useSelector(state=>state.moviesLoadingError);
  const movies_loading_status = useSelector(state=>state.moviesLoadingStatus);
  const movies_loading_text = useSelector(state=>state.moviesLoadingText);
  const trailer_window_open = useSelector(state => state.watching_trailer_for && state.should_trailer_window_open);
  const movie_trailer_id = useSelector(state => state.watching_trailer_for && state.watching_trailer_for.id);

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchMovieList());
  },[dispatch])
  return (
    <div className="all-content-wrapper" style={{
      height : '100vh',
      overflow : trailer_window_open ? 'hidden' : 'initial'
    }}>
      <Navbar/>
      <LogoHeading title={"Trailer.com"}/>
      <TrailerBar type="fixed"/>
      <main className="main">
        <SearchBox/>
        <MoviesList movies={movies} error={movies_loading_error} status={movies_loading_status} text={movies_loading_text}/>
        <TrailerPage movie_id={movie_trailer_id}/>
      </main> 
    </div>
  );
}

export default App;

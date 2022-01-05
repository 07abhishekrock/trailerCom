import SingleMovieItem from "./SingleMovieItem";
import MoviePreview from "./MoviePreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle , faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useSelector , useDispatch } from "react-redux";
import { fetchMovieList } from "../app-store/movies_reducer";
import { ReactComponent as LoadMoreIcon } from '../icons/load_more_btn.svg';


function MovieFetchStatusComponent({error , text , status}){
  return <>
  {
    status === 'loading' ? <div className="movies-list__status-component">
      <i loading="1"><FontAwesomeIcon icon={faCircleNotch}/></i>
      <span>{text}</span>
    </div> : null
  }
  {
    error ? <div className="movies-list__status-component">
      <i><FontAwesomeIcon icon={faExclamationTriangle}/></i>
      <span>{error}</span>
    </div> : null
  }
  </>
}

export default function MoviesList({movies , error , text , status}){
  const currentPageNumber = useSelector(state=>state.currentPageNumber);
  const totalPages = useSelector(state=>state.totalPages);
  const dispatch = useDispatch();
  return (
    <div>
      {currentPageNumber === 1 ? <MovieFetchStatusComponent error={error} text={text} status={status}/> : null}
      <div className="movies-list-wrapper">
        <MoviePreview/>
        <div className="movies-list-container">
          <ul className="movies-list">
            {
              movies.map((movie)=>{
                return <li key={movie.id} className="single-movie-item-wrapper"><SingleMovieItem key={movie.id} {...movie}/></li>
              })
            }
          </ul>
          {totalPages !== 1 && totalPages > currentPageNumber ? <button className="load-more-results-button" onClick={()=>{
            dispatch(fetchMovieList(currentPageNumber + 1))
          }}>
            <i className="load-more-results-button__icon"><LoadMoreIcon/></i>
            <span className="load-more-results-button__text">Load More</span>
          </button> : null}
          {currentPageNumber > 1 ? <MovieFetchStatusComponent error={error} status={status} text={text}/> : null}
        </div>
      </div>
    </div>
  )
}
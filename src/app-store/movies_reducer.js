const initialState = {
  allMoviesList : [],
  userFavourites : [],
  currentPageNumber : 1,
  totalPages : 1,
  moviesLoadingStatus : "idle",
  moviesLoadingError : null,
  moviesLoadingText : "Currently Idle",
  searchQuery : "blade",
  currentSelectedImage : null,
  watching_trailer_for : null,
  should_trailer_window_open : false
};


const movies_reducer = (state=initialState , action)=>{
  const current_favourites_list = state.userFavourites;
  const all_movies_loaded_from_server = action.payload?.moviesList;
  const currentPageNumber = action.payload?.pageNumber;
  const totalPages = action.payload?.totalPages;
  switch(action.type){
    case 'movies/loadMovies' : 
      return {...state , allMoviesList : all_movies_loaded_from_server , currentPageNumber , totalPages , currentSelectedImage : all_movies_loaded_from_server[0].id};
    case 'movies/appendMovies' : 
      return {...state , allMoviesList : [...state.allMoviesList , ...all_movies_loaded_from_server] , currentPageNumber , totalPages};
    case 'movies/changePageNumber' : 
      return {...state , currentPageNumber : 1 , totalPages : 1}
    case 'movies/searchQuery' : 
      return {...state , searchQuery : action.payload}
    case 'movies/loading' : 
      return {...state , moviesLoadingStatus : 'loading' , moviesLoadingError : null , moviesLoadingText : action.payload}
    case 'movies/idle' : 
      return {...state , moviesLoadingStatus : 'idle' , moviesLoadingError : null , moviesLoadingText : ""}
    case 'movies/error' : 
      return {...state , moviesLoadingStatus : 'error' , moviesLoadingError : action.payload , moviesLoadingText : ""};
    case 'movies/watchTrailer' : 
      return {...state , should_trailer_window_open : true}
    case 'movies/closeTrailer' : 
      return {...state , should_trailer_window_open : false}
    case 'movies/queueMovieToTrailerWindow' : 
      return {...state , should_trailer_window_open : true , watching_trailer_for : action.payload}
    case 'movies/markFavourite' :
      const favourite_marked_movie = action.payload;
      return {...state , allMoviesList : [favourite_marked_movie , ...current_favourites_list]}
    case 'movies/unmarkFavourite' :
      const favourite_unmarked_movie = action.payload;
      return {...state , allMoviesList : current_favourites_list.filter(movie=>movie.id !== favourite_unmarked_movie.id)}
    case 'movies/shiftToPreview' :
      const to_preview_image_id = action.payload; 
      return {...state , currentSelectedImage : to_preview_image_id}
    default : return state;
  }
}

//thunk middleware functions (dispatch)
export const fetchMovieList = (page=1)=>{
  return async (dispatch , getState)=>{
    if(page !== 1 && page === getState().totalPages + 1) return;
    dispatch({
      type : 'movies/loading',
      payload : "Loading Movies"
    })
    const response = await fetch(generateAPIURL(getState().searchQuery , page));

    if(response.ok){
      const {results , page , total_pages} = await response.json();
      let type = "";
      if(results && results.length > 0){
        dispatch({type : 'movies/idle'})
        if(page === 1){
          type = 'movies/loadMovies'
        }
        else if(page > 1){
          type = 'movies/appendMovies'
        }
        return dispatch({type , 
            payload : {
              moviesList : results.map((movie)=>{
                return {
                  id : movie.id,
                  title : movie.original_title,
                  image : ("https://image.tmdb.org/t/p/w200/").concat(movie.poster_path),
                  rating : movie.vote_average
                }
              }),
              pageNumber : page,
              totalPages : total_pages
            }
        })
      }
    }
    else{
      return dispatch({
        type : 'movies/error',
        payload : 'Some Error Occurred'
      })
    }
  }
}

export const generateAPIURL = (search="blade" , page)=>{
  const apiKey = "ea8eecd3805db04152f121eaffe4bf7c";
  const host = 'https://api.themoviedb.org/3/search/movie?';

  return host.concat("api_key=",apiKey,"&query=",search,"&page=",page);
  
}

export const getImageURL = (endpoint)=>{
  return ("https://image.tmdb.org/t/p/w200/").concat(endpoint);
}

export const apiKey = "ea8eecd3805db04152f121eaffe4bf7c";
export const image_host_url = (width)=>`https://image.tmdb.org/t/p/w${width}/`;


export default movies_reducer;


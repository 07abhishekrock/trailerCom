import React, { useEffect , useState } from 'react'
import { apiKey } from '../../app-store/movies_reducer';
import LoadingWrapper from '../LoadingWrapper';


function WatchBlock({list , heading}={list : [] , heading : ''}){
  return <div className="watch-providers-list__block">
    <h5 className="watch-providers-list__block__heading">{heading}</h5>
    {list && list.length > 0 ? <ul className="watch-providers-list__block__items">
      {list.map((watch)=>{
        return <li className="watch-providers-list__block__single-provider" key={watch.provider_id}>
          <img src={`https://image.tmdb.org/t/p/w200/${watch.logo_path}`} alt={watch.provider_name}/>
        </li>
      })}
    </ul> : <h6 className="watch-providers-list__block__fallback">Not Found</h6>}
  </div>
}

function AvailableOnBlock({
  movie_id
}={movie_id : null}) {
  const [fetch_status , set_fetch_status] = useState({
    status : 'loading',
    error : null
  });
  const [watch_providers_list , set_watch_providers_list] = useState({});
  useEffect(()=>{
    async function fetchWatchProviders(id){
      set_fetch_status({
        status : 'loading',
        error : null
      })
      if(id === null) return;
      const watch_providers_response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/watch/providers?api_key=${apiKey}`);
      if(watch_providers_response.ok){
        const watch_providers_json = await watch_providers_response.json();
        set_fetch_status({
          status : 'idle',
          error : null
        })
        set_watch_providers_list(watch_providers_json.results['IN']);
      }
      else{
        set_fetch_status({
          status : 'idle',
          error : 'Some Error Occurred'
        })
      }
    }
    fetchWatchProviders(movie_id);
  },[movie_id])
  return (
    <div className="watch-providers">
      <h3 className="watch-providers__heading">Available On</h3>
        <div className="watch-providers-list">
          <LoadingWrapper loading_status={fetch_status.status} error={fetch_status.error} show_condition={watch_providers_list}>
            <WatchBlock list={watch_providers_list?.flatrate} heading={"Flat Rate"}/>
            <WatchBlock list={watch_providers_list?.rent} heading={"Rent"}/>
            <WatchBlock list={watch_providers_list?.buy} heading={"Buy"}/> 
          </LoadingWrapper>
        </div>
    </div>
  )
}

export default AvailableOnBlock

window.loadYoutubeAPI = ()=>{
  return new Promise((resolve)=>{
    if(window.youtubeAPILoaded()) resolve('API Loaded');
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if(firstScriptTag){
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    else{
      document.body.insertAdjacentElement('beforeend',tag);
    }

    const event_callback = ()=>{
      resolve('API Loaded');
      document.removeEventListener('api-loaded',event_callback);
    }
    document.addEventListener('api-loaded', event_callback);
  })
}

window.onYouTubeIframeAPIReady = ()=>{
  window.youtubeAPILoadedValue = true;
  const api_loaded_event = new Event('api-loaded');
  document.dispatchEvent(api_loaded_event);
}

window.youtubeAPILoaded = ()=>{
  return window.youtubeAPILoadedValue;
}


export default class YoutubePlayer{
  constructor({width , height , videoID , containerID , playerVars , events}={
    width : '300', height : '300' , events : {
      onReady : ()=>{},
      onStateChange : ()=>{}
    }
  }){
    this.video_width = width;
    this.video_height = height;
    this.videoID = videoID;
    this.playerVars = playerVars;
    this.playerInstance = {};
    this.playingState = -1;
    this.video_events = {
      onReady : events.onReady ? events.onReady.bind(this) : null,
      onStateChange : events.onStateChange ? events.onStateChange.bind(this) : null 
    };
    this.containerID = containerID;
  }
  async createVideoInstance(){
    await window.loadYoutubeAPI();
    this.playerInstance = new window.YT.Player(this.containerID , {
      height: this.video_width,
      width: this.video_height,
      videoId: this.videoID,
      playerVars: {
        playsinline : 1,
        enablejsapi : 1,
      },
      events: this.video_events
    });

    return this.playerInstance;
  }
}
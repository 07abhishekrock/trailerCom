import { useReducer } from "react"


/**
 * custom loading hook with basic features like loading , idle , idle with error
 *
 * @return {idle : function , error : function , loading : function , loading_status : object} 
 */
 export const useLoader = (initialState)=>{
  const [loading_status , dispatch_loading_status] = useReducer((state, action)=>{
    switch(action.type){
      case 'loading' : return {
        ...state , 
        status : 'loading',
        error : null 
      }
      case 'idle' : return {
        ...state,
        status : 'idle',
        error : null
      }
      case 'error' : return {
        ...state, 
        status : 'idle',
        error : action.payload.error
      }
      default : return state;
    }
  },initialState === 'loading' ? {
    status : 'loading',
    error : null
  } : {
    status : 'idle',
    error : null
  }) 

  return {
    idle : () => dispatch_loading_status({type : 'idle'}),
    error : (error) => dispatch_loading_status({type : 'error' , payload : {error}}),
    loading : () => dispatch_loading_status({type : 'loading'}),
    loading_status
  }

}

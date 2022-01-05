import React from 'react'
import {ReactComponent as SpinnerIcon} from '../icons/spinner.svg';
import {ReactComponent as ErrorIcon} from '../icons/error.svg';

function LoadingWrapper({children , loading_status , show_condition , error}) {
  return (
    <>
      {loading_status === 'loading' ? <div className="fallback-wrapper fallback-wrapper--spinning">
        <i className="spinner-loading__icon">
          <SpinnerIcon/>
        </i>
      </div> : null}
      {error ? <div className="fallback-wrapper fallback-wrapper__error">
        <i className="error__icon">
          <ErrorIcon/>
        </i>
      </div> : null}
      {loading_status === 'idle' && show_condition ? children : null}
    </>
  )
}

export default LoadingWrapper

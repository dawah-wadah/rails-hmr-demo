import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Root from './Root.jsx'

document.addEventListener('DOMContentLoaded', () => {

  const render = () => 
    ReactDOM.render(<AppContainer><Root /></AppContainer>,
      document.getElementById('root'))

  if (module.hot) {
    render()
    module.hot.accept('./Root', render)
  } else {
    render()
  }

})


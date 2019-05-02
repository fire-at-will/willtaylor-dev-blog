import React from 'react'
import Helmet from 'react-helmet'
import Header from '../Header'
import '../../assets/scss/init.scss'

require('prismjs/plugins/line-numbers/prism-line-numbers.css')

class Layout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <div>
        <Header />
        <div className="layout">
          <Helmet defaultTitle="Will Taylor" />
          {children}
        </div>
      </div>
    )
  }
}

export default Layout

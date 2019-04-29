import React from 'react'
import './style.scss'
import { Link } from 'gatsby'


class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <h1
          className="header"
          style={
            {
              margin: 0,
              textAlign: 'center',
              paddingTop: '10px',
              paddingBottom: '10px',
            }
          }
        >
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
          Will Taylor
          </Link>
        </h1>
      </div>
    )
  }
}

export default Header

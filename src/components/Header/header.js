import React from 'react'
import NavLink from './NavLink'
import headerList from '../../data/Navigation'
import BackButton from '../button/backButton.js'
import '../../styles/account.css'

const Header = () => (
  <nav className='nav'>
    <div className="nav-list">
      <BackButton />
    </div>
    <div className="nav-list">
      {
        headerList.map(navItem => (<NavLink info={navItem} key={navItem.label} />))
      }
    </div>
  </nav>
)

export default Header

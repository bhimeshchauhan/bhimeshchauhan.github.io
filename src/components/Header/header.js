import React, { useEffect, useRef } from 'react'
import NavLink from './NavLink'
import headerList from '../../data/Navigation'
import BackButton from '../button/backButton.js'
import '../../styles/account.css'

const Header = () => {
  const pill = useRef(null)
  // Centre the current page's link in the scrollable pill so it is visible on small screens.
  useEffect(() => {
    const box = pill.current
    const cur = box && box.querySelector('a.active')
    if (cur) {
      const b = box.getBoundingClientRect()
      const c = cur.getBoundingClientRect()
      box.scrollLeft += c.left - b.left - (b.width - c.width) / 2
    }
  }, [])
  return (
  <nav className='nav'>
    <div className="nav-list">
      <BackButton />
    </div>
    <div className="nav-list" ref={pill}>
      {
        headerList.map(navItem => (<NavLink info={navItem} key={navItem.label} />))
      }
    </div>
  </nav>
  )
}

export default Header

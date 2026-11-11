import React, { useEffect, useRef, useState } from 'react'
import NavLink from './NavLink'
import headerList from '../../data/Navigation'
import BackButton from '../button/backButton.js'
import '../../styles/account.css'

// Wide screens: the usual pill of links. Phones: a "Menu" button that opens a full list with large tap targets
// (the old sideways-scrolling pill hid links, including the current page, with no hint that it scrolled).
const Header = () => {
  const [open, setOpen] = useState(false)
  const nav = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onDown = (e) => nav.current && !nav.current.contains(e.target) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
    }
  }, [open])

  return (
    <nav className='nav' ref={nav}>
      <div className="nav-list">
        <BackButton />
      </div>
      <div
        id="site-menu"
        className={`nav-list${open ? ' open' : ''}`}
        onClick={(e) => e.target.closest('a') && setOpen(false)}
      >
        {headerList.map((navItem) => (<NavLink info={navItem} key={navItem.label} />))}
      </div>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="nav-toggle-icon" aria-hidden="true" />
        {open ? 'Close' : 'Menu'}
      </button>
    </nav>
  )
}

export default Header

import React from 'react'
import {navigate} from 'gatsby'
import '../styles/account.css'
import accountItem from '../data/account.js'

const NetflixPage = () => {
  return (
    <div className="wrapper">
    	<h1>Who are you?</h1>
    	<div className="profile-wrap">
      {accountItem.map(item => (
    		<div className="profile" key={item.id}>
    			<div
            className={`profile-icon ${item.title}`}
            style={{backgroundImage: `url(${item.icon})`}}
            onClick={() => {navigate(item.linkTo)}}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
          >
    			</div>
    			<div className="profile-name">
            {item.title}
          </div>
    		</div>
        )
      )}
    	</div>
    </div>
  )
}

export default NetflixPage

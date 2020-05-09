import React from 'react'
import './blogCard.css'
import { withPrefix } from "gatsby"
import Helmet from "react-helmet"

const BlogCard = ({ info }) => (
    <div className="wrapper">
        <Helmet>
            <script src={withPrefix('script.js')} type="text/javascript" />
        </Helmet>
        <div className="container">
          <div className="card-column column-0">
            <div className="card card-color-0">
              <div className="border"></div>
              <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/53148/deathtostock-00.jpg" />
              <h1>Hey now, youre an allstar</h1>
            </div>
          </div>
        </div>

        <div id="cover" className="cover"></div>

        <div id="open-content" className="open-content">
          <a href="#" id="close-content" className="close-content"><span className="x-1"></span><span className="x-2"></span></a>
          <img id="open-content-image" src="" />
          <div className="text" id="open-content-text">
          </div>
        </div>
    </div>
);

export default BlogCard;

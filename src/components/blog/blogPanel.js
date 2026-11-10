import React from 'react'
import './blogPanel.css'
import blogs from '../../data/blog';
import {BlogWriteUp} from './blogWriteUp';

// Card images are plain <img loading="lazy"> so the 12 cards below the fold are not fetched on first load.
export const BlogPanel = () => (
    <div className="container pt-3">
        <div className="row">
            {
                blogs.map(item => (
                    <article className="best-post" id={`post-${item.id}`} key={item.id}>
                        <div className="best-post-image">
                            <img
                                src={item.panelImageUrl}
                                alt=""
                                width="160"
                                height="560"
                                loading="lazy"
                                decoding="async"
                                style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                            />
                        </div>
                        <div className="best-post-content">
                            <div className="best-post-content-sub"><BlogWriteUp article={item}/></div>
                        </div>
                    </article>
                ))
            }
        </div>
    </div>
)

import React, {useEffect, useState} from 'react'
import './blogPanel.css'
import blogs from '../../data/blog';
import {BlogWriteUp} from './BlogWriteUp';
import axios from 'axios';

export const BlogPanel = () => {
    const [image, setImage] = useState({});
    useEffect(()=>{
        const headers = {
            authorization: "Client-ID dgD-DQc4cGrBqLvLT5GklBY2j24L1kxAVj7z_4sx3H0"
        }
        let setObj = {}
        blogs.forEach((item) => {
            if(image[item.panelImage] === undefined) {
                axios.get('https://api.unsplash.com/photos/'+item.panelImage, {headers: headers})
                .then(res => {
                    const panelImage = item.panelImage;
                    setObj[panelImage] = res.data.urls.raw
                    setImage({...image, ...setObj});
                })
            }
        })

    })
    return (
        <div className="container pt-3">
            <div className="row">
                {
                    blogs.map(item => (
                        <article className="best-post">
                            <div
                            className="best-post-image"
                            style={{
                                backgroundImage: `url(${image[item.panelImage]})`
                            }}
                            ></div>
                                <div className="best-post-content">
                                <div className="best-post-content-sub"><BlogWriteUp article={item}/></div>
                            </div>
                        </article>
                    ))
                }

            </div>
        </div>
    )
}
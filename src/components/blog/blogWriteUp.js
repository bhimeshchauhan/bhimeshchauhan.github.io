import React from 'react';
import './BlogWriteUp.css';
import { Block } from './Prose';

const parseTemplate = (tag, html) => {
    if(tag === "img") {
        return(<img className='uk-width-1-1' src={html} alt="" loading="lazy" decoding="async"/>);
    } else if(tag === "h4") {
        return(<h4>{html}</h4>);
    } else if(tag === "h3") {
        return(<h3>{html}</h3>);
    } else if(tag === 'p') {
        let data = "<p> "
        data += html.map(([key, value]) => {
            if(key === 'em') {
                return(`<em>${value}</em>`);
            } else if(key === 'normal') {
                return(value);
            } else if(key === 'strong') {
                return(`<strong>${value}</strong>`);
            } else if(key === 'code') {
                return(`<code>${value}</code>`);
            } else {
                return ``;
            }
        }).join('');
        data += "</p>"
        return data;
    } else if(tag === 'blockquote') {
        return(<blockquote>{html}</blockquote>);
    } else if(tag === "pre") {
        let data = "<pre> "
        data += html.map(([key, value]) => {
            if(key === 'em') {
                return(`<em>${value}</em>`);
            } else if(key === 'normal') {
                return(value);
            } else if(key === 'strong') {
                return(`<strong>${value}</strong>`);
            } else if(key === 'code') {
                return(`<code>${value}</code>`);
            } else if(key === 'br') {
                return(`<br>`);
            } else {
                return ``;
            }
        }).join('');
        data += "</pre>";
        return data;
    }
}

export const BlogWriteUp = (props) => {
    return (
        <div className="blogWriteUp">
            <article className="uk-article uk-section-small">
                <header className="uk-container">
                    <div className="author">
                        <img src="/me.jpg" className="avatar" alt="Bhimesh Chauhan" width="48" height="48" style={{ borderRadius: "50%", objectFit: "cover", objectPosition: "50% 20%", width: 48, height: 48 }}/>
                        <div className="info uk-text-meta">
                            <div className="best-post-content-cat">{props.article.author}</div>
                            <p>{props.article.dated}</p>
                        </div>
                    </div>
                    <h2>{props.article.title}</h2>
                    <p>{props.article.tagLine}</p>
                </header>
                {
                    props.article.description.map((item, idx) => (
                        ['bars', 'pairs', 'steps'].includes(item[0]) ?
                            <section className="content uk-section-small" key={idx}>
                                <div className="uk-container"><Block block={item} alt={props.article.title} /></div>
                            </section> :
                        item[0] === "img"?
                            <section className="hero uk-section-small">
                                {parseTemplate(item[0], item[1])}
                            </section> :
                            <section className="content uk-section-small">
                                <div className="uk-container">
                                    {typeof parseTemplate(item[0], item[1]) === "string" ?
                                    <div dangerouslySetInnerHTML={{ __html: parseTemplate(item[0], item[1])}}></div> :
                                    parseTemplate(item[0], item[1])}
                                </div>
                            </section>
                    ))
                }
            </article>
        </div>
    )
}

import React from 'react';
import './BlogWriteUp.css';
import favicon from '../../assets/images/bhimesh-favicon.svg';

const parseTemplate = (tag, html) => {
    if(tag === "img") {
        return(<img class='uk-width-1-1' src={html} alt="blog"/>);
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
        });
        data += "</p>"
        return data.split(',').join('');
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
        });
        data += "</pre>";
        return data.split(',').join('');
    }
}

export const BlogWriteUp = (props) => {
    return (
        <div class="blogWriteUp">
            <article class="uk-article uk-section-small">
                <header class="uk-container">
                    <div class="author">
                        <img src={favicon} class="avatar" alt="Go to the profile of Brandon Morelli"/>
                        <div class="info uk-text-meta">
                            <div className="best-post-content-cat">{props.article.author}</div>
                            <p>{props.article.dated}</p>
                        </div>
                    </div>
                    <h1>{props.article.title}</h1>
                    <p>{props.article.tagLine}</p>
                </header>
                {
                    props.article.description.map(item => (
                        item[0] === "img"?
                            <section class="hero uk-section-small">
                                {parseTemplate(item[0], item[1])}
                            </section> :
                            <section class="content uk-section-small">
                                <div class="uk-container">
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
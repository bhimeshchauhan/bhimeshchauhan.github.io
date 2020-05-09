import React from 'react'
import Blog from '../data/blog'
import { BlogWrapper, BlogBox, BlogDes } from '../styles/blogStyle'
import Layout from '../components/layout'
import BlogCard from '../components/blog/blogCard'

const BlogLayout = () => (
  <Layout>
  <BlogWrapper>
    <h1>Blog</h1>
    <BlogCard/>
    {
      Blog.map(item => (<BlogBox key={item.id} >
      <h3><a href={item.userLink}>{item.name}</a></h3>
        <p>{item.designation}</p>
        <p>{item.dated}</p>
        <BlogDes>{item.description}</BlogDes>
        <hr/>
      </BlogBox>
      ))
    }
  </BlogWrapper>
  </Layout>
)

export default BlogLayout

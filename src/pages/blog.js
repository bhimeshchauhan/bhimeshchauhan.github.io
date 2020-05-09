import React from 'react'
//import Blog from '../data/blog'
//import { BlogWrapper, BlogBox, BlogDes } from '../styles/blogStyle'
import { BlogWrapper, Blogs } from '../styles/blogStyle'
import Layout from '../components/layout'
import { BlogCard } from '../components/blog/blogCard'

const BlogLayout = () => (
  <Layout>
      <BlogWrapper>
        <h1>Blog</h1>
        <Blogs className="blog-container">
            <BlogCard id={'0'}/>
            <BlogCard id={'1'}/>
            <BlogCard id={'2'}/>
            <BlogCard id={'3'}/>
        </Blogs>
      </BlogWrapper>
  </Layout>
)

export default BlogLayout

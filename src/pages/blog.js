import React from 'react'
import { Helmet } from 'react-helmet';
//import Blog from '../data/blog'
//import { BlogWrapper, BlogBox, BlogDes } from '../styles/blogStyle'
import { BlogWrapper, Blogs } from '../styles/blogStyle'
import Layout from '../components/layout'
import { BlogPanel } from '../components/blog/blogPanel'

const BlogLayout = () => (
  <Layout>
      <Helmet title="Blog | Bhimesh Chauhan" />
      <BlogWrapper>
        <h1>Blog</h1>
        <Blogs className="blog-container">
            <BlogPanel />
        </Blogs>
      </BlogWrapper>
  </Layout>
)

export default BlogLayout

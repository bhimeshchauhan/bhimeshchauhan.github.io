import React from 'react'
import Blog from '../data/blog'
import { blogSchema } from '../utils/schema'
//import { BlogWrapper, BlogBox, BlogDes } from '../styles/blogStyle'
import { BlogWrapper, Blogs } from '../styles/blogStyle'
import Layout from '../components/layout'
import { BlogPanel } from '../components/blog/blogPanel'

const BlogLayout = () => (
  <Layout seo={{ title: "Blog", description: "Essays and reflections from Bhimesh Chauhan on engineering, AI systems, and building products.", structuredData: blogSchema(Blog) }}>
      <BlogWrapper>
        <h1>Blog: notes on engineering, AI and building products</h1>
        <Blogs className="blog-container">
            <BlogPanel />
        </Blogs>
      </BlogWrapper>
  </Layout>
)

export default BlogLayout

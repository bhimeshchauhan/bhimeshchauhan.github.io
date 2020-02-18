import React from 'react'
import RashSelfIcon from '../assets/images/coding.gif'
import AboutBox from '../components/About/AboutBox'
import about from '../data/About'
import { UserWrapper, UserTitle, UserDescription, DownloadButton, UserTopic } from '../styles/indexStyle.js'
import Layout from '../components/layout'

const IndexPage = () => {
  return <Layout>
  <UserWrapper>
    <UserTitle>Bhimesh <span>Chauhan</span></UserTitle>
    <UserDescription>
      <div>
        <p>
        Hello there, welcome to my portfolio. I am a
        Full-Stack Developer with specialization in Machine Learning
        and Computer Vision.
        </p>
        <DownloadButton href="https://github.com/bhimeshchauhan/react-personal-portfolio/raw/master/resume.pdf"  download title="Resume">Download Resume</DownloadButton>
      </div>
      <img src={RashSelfIcon} alt="bhimesh self" />
    </UserDescription>
    <UserTopic>
      {
        about.map(item => (<AboutBox key={item.id} info={item} />))
      }
    </UserTopic>
  </UserWrapper>
  </Layout>
}

export default IndexPage

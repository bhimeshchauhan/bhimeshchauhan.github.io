import React from 'react'
import BhimeshIcon from '../assets/images/coding.gif'
import AboutBox from '../components/About/AboutBox'
import about from '../data/About'
import { UserWrapper, UserTitle, UserDescription, DownloadButton, UserTopic } from '../styles/bhimeshStyle.js'
import '../styles/bhimeshStyle.css'
import Layout from '../components/layout'

const BhimeshPage = () => {
  return <Layout>
  <UserWrapper>
    <UserTitle>Bhimesh <span>Chauhan</span></UserTitle>
    <UserDescription>
      <div>
        <p>
        Hello there, thank you for checking out my website. I am a
        Full-Stack Engineer with specialization in Computer Vision and Graphic utilizing ML.
        </p>
        <DownloadButton href="https://github.com/bhimeshchauhan/react-personal-portfolio/raw/master/resume.pdf"  download title="Resume">Download Resume</DownloadButton>
      </div>
      <img src={BhimeshIcon} alt="bhimesh self" />
    </UserDescription>
    <UserTopic>
      {
        about.map(item => (<AboutBox key={item.id} info={item} />))
      }
    </UserTopic>
  </UserWrapper>
  </Layout>
}

export default BhimeshPage

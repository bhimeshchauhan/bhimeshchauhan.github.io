import React from 'react'
import { Helmet } from 'react-helmet';
import SocialContact from '../components/Contact/SocialContact'
import contact from '../data/Contact'
import social from '../data/Social'
import { ContactWrapper, ContactContainer, ContactHeader, InputBox, Input, Label, FormContainer, TextArea, FormButton } from '../styles/contactStyle.js'
import Layout from '../components/layout'

const StyledInput = () => {
  return (
    <InputBox>
      <Input id="email" name="email" type="email" placeholder=''required />
      <Label htmlFor="email">Email</Label>
    </InputBox>
  );
};

const StyledTextArea = () => {
  return (
    <InputBox>
      <TextArea id="msg" type="text" name="message" required />
      <Label htmlFor="msg">Message</Label>
    </InputBox>
  );
}

const Contact = () => (
  <Layout>
      <Helmet title="Contact | Bhimesh Chauhan" />
    <ContactWrapper>
      <ContactContainer>
          <ContactHeader>
            Get in touch
          </ContactHeader>
            <form action="https://getform.io/f/275143c6-10cf-4c83-a630-0c7381081eb6" method="POST">
              <FormContainer>
                  <StyledInput />
                  <StyledTextArea />
                  <FormButton type="submit">Send message</FormButton>
              </FormContainer>
            </form>
      {/* <form action="">
        <h2>Login</h2>

        <div class="input-box">
          <span class="icon">
            <ion-icon name="mail"></ion-icon>
          </span>
          <input type="email" required>
          <label>Email</label>
        </div>

        <div class="input-box">
          <span class="icon">
            <ion-icon name="lock-closed"></ion-icon>
          </span>
          <input type="password" required>
          <label>Password</label>
        </div>

        <div class="remember-forgot">
          <label><input type="checkbox"> Remember me</label>
          <a href="#">Forgot Password?</a>
        </div>

        <button type="submit">Login</button>

        <div class="register-link">
          <p>Don't have an account? <a href="#">Register</a></p>
        </div>
      </form> */}

      </ContactContainer>
      {/* <ContactHeader>Get in touch</ContactHeader>
      <ContactDetails>
          <ContactBox>
            <h3>Contact Details</h3>
            {
              contact.map(item => (<SocialContact key={item.id} info={item} />))
            }
          </ContactBox>
          <ContactBox>
            <h3>Look me up online</h3>
            {
              social.map(item => (<SocialContact key={item.id} info={item} />))
            }
          </ContactBox>
      </ContactDetails> */}
    </ContactWrapper>
  </Layout>
)

export default Contact

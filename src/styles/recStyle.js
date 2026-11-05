import styled from 'styled-components'

export const RecWrapper = styled.div`
  padding: 5%;
  >h1{
    color: var(--ink);
    font-family: "Space Grotesk", "Signika", sans-serif;
    font-size: clamp(2.2rem, 5.5vw, 4rem);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.05;
    padding-bottom: 1.5rem;
    border-bottom: 0;
  }
  @media (max-width: 700px) {
    padding: 10% 0 20%;
  }
`
export const RecBox = styled.div`
  margin-top: 2rem;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: clamp(1.25rem, 4vw, 2.25rem);
  color: #eeeeee;
  h3 a{
    margin: 0;
    color: #eeeeee;
    text-decoration: none;
    font-weight: 300;
  }
  h3 a:hover{
    color: #7fa1e8;
  }
  hr{
    background: var(--accent);
    border: 0;
    width: 15%;
    height: 3px;
    margin: 3% 0;
  }
  >p:first-of-type{
    font-size: 18px;
    margin: 0;
    font-weight: 300;
  }
  >p:nth-of-type(2){
    font-size: 16px;
    font-weight: 300;
  }
`
export const RecDes = styled.p`
  margin: 2% 0;
  font-weight: 300;
  max-width: 62rem;
  color: var(--muted);
  line-height: 1.7;
`

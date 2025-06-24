import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import instagramService from '../../services/instagramService';
import Art3DRenderer from './Art3DRenderer';

// Styled Components
const GridContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const GridTitle = styled.h1`
  text-align: center;
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 2rem;
`;

const ImageCard = styled(motion.div)`
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  ${ImageCard}:hover & {
    transform: translateY(0);
  }
`;

const Caption = styled.p`
  margin: 0 0 10px 0;
  font-weight: 500;
`;

const Stats = styled.div`
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  z-index: 10;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const CanvasContainer = styled.div`
  width: 600px;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 10px;
  margin: 20px 0;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const InstagramGrid = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [instagramData, setInstagramData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstagramData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await instagramService.fetchInstagramPosts(12);
        setInstagramData(data);
      } catch (error) {
        console.error('Error fetching Instagram data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const render3DVersion = (imageUrl) => {
    return (
      <CanvasContainer>
        <Art3DRenderer imageUrl={imageUrl} />
      </CanvasContainer>
    );
  };

  if (isLoading) {
    return (
      <GridContainer>
        <LoadingSpinner>Loading your Instagram feed...</LoadingSpinner>
      </GridContainer>
    );
  }

  if (error) {
    return (
      <GridContainer>
        <GridTitle>🎨 Creative Instagram Gallery</GridTitle>
        <ErrorMessage>
          <h3>❌ Unable to load Instagram posts</h3>
          <p>{error}</p>
          <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            Please check your Instagram API configuration in <code>src/config/instagram.js</code>
          </p>
        </ErrorMessage>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      <Grid>
        {instagramData.map((post) => (
          <ImageCard
            key={post.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleImageClick(post)}
          >
            <Image src={post.imageUrl} alt={post.caption} />
            <ImageOverlay>
              <Caption>{post.caption}</Caption>
              <Stats>
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
                <span>⏰ {post.timestamp}</span>
              </Stats>
            </ImageOverlay>
          </ImageCard>
        ))}
      </Grid>

      <AnimatePresence>
        {selectedImage && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeModal}>×</CloseButton>
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
                🎭 3D Art Rendering
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                Move your mouse to interact with the 3D version of your artwork
              </p>
              {render3DVersion(selectedImage.imageUrl)}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3>{selectedImage.caption}</h3>
                <p style={{ color: '#666' }}>
                  ❤️ {selectedImage.likes} • 💬 {selectedImage.comments} • ⏰ {selectedImage.timestamp}
                </p>
              </div>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </GridContainer>
  );
};

export default InstagramGrid; 
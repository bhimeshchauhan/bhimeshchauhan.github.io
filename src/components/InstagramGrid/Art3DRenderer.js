import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader material for depth effect
const DepthMaterial = shaderMaterial(
  {
    time: 0,
    mouse: new THREE.Vector2(0, 0),
    texture: null,
    depthIntensity: 0.5,
    displacementScale: 0.1,
  },
  // Vertex shader
  `
    uniform float time;
    uniform vec2 mouse;
    uniform float depthIntensity;
    uniform float displacementScale;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      // Create displacement based on UV coordinates and mouse position
      float depth = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time) * 0.1;
      
      // Add mouse-based displacement
      vec2 mouseDisplacement = mouse * displacementScale;
      
      // Apply displacement to position
      vec3 newPosition = position;
      newPosition.z += depth + mouseDisplacement.x + mouseDisplacement.y;
      
      // Calculate normal for lighting
      vNormal = normal;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform sampler2D texture;
    uniform float time;
    uniform vec2 mouse;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec4 texColor = texture2D(texture, vUv);
      
      // Add dynamic lighting based on mouse position
      vec3 lightDir = normalize(vec3(mouse.x, mouse.y, 1.0));
      float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
      
      // Add specular highlight
      vec3 viewDir = normalize(cameraPosition - vPosition);
      vec3 reflectDir = reflect(-lightDir, normalize(vNormal));
      float specular = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      
      // Add some animated color variation
      float colorVariation = sin(time * 2.0 + vUv.x * 5.0) * 0.1;
      
      // Combine lighting
      vec3 finalColor = texColor.rgb * (0.3 + 0.7 * diffuse) + 0.2 * specular;
      finalColor += vec3(colorVariation, colorVariation * 0.5, colorVariation * 0.8);
      
      gl_FragColor = vec4(finalColor, texColor.a);
    }
  `
);

// Enhanced 3D Art Model with depth and mouse interaction
const ArtModel = ({ imageUrl, renderMode = 'plane' }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const [texture, setTexture] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Load texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Load main texture
    loader.load(imageUrl, (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, [imageUrl]);

  // Handle mouse movement
  const handlePointerMove = (event) => {
    if (materialRef.current) {
      try {
        // Get the canvas element or use the event target
        const canvas = event.currentTarget || event.target;
        const rect = canvas.getBoundingClientRect ? canvas.getBoundingClientRect() : {
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
        
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        setMouse({ x, y });
        materialRef.current.mouse.set(x, y);
      } catch (error) {
        console.warn('Error handling pointer move:', error);
        // Fallback to normalized coordinates
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        setMouse({ x, y });
        if (materialRef.current) {
          materialRef.current.mouse.set(x, y);
        }
      }
    }
  };

  // Animation loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      
      // Gentle rotation based on mouse position
      if (meshRef.current) {
        meshRef.current.rotation.y = mouse.x * 0.3;
        meshRef.current.rotation.x = mouse.y * 0.2;
        
        // Hover effect
        if (hovered) {
          meshRef.current.scale.setScalar(1.05);
        } else {
          meshRef.current.scale.setScalar(1);
        }
      }
    }
  });

  const renderGeometry = () => {
    switch (renderMode) {
      case 'sphere':
        return <sphereGeometry args={[1, 64, 64]} />;
      case 'cube':
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.8, 0.8, 2, 32]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.3, 16, 100]} />;
      case 'depth':
        return <planeGeometry args={[2, 2, 64, 64]} />;
      default:
        return <planeGeometry args={[2, 2, 64, 64]} />;
    }
  };

  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderGeometry()}
      <primitive 
        object={new DepthMaterial()} 
        ref={materialRef}
        attach="material"
        texture={texture}
        depthIntensity={0.3}
        displacementScale={0.05}
        transparent
      />
    </mesh>
  );
};

// Particle System for background effects
const ParticleSystem = ({ count = 100 }) => {
  const meshRef = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
};

// Main 3D Renderer Component
const Art3DRenderer = ({ imageUrl, renderMode = 'depth', showParticles = true }) => {
  const [currentMode, setCurrentMode] = useState(renderMode);

  const renderModes = [
    { key: 'depth', label: '3D Depth', icon: '🏔️' },
    { key: 'plane', label: '2D Plane', icon: '⬜' },
    { key: 'sphere', label: 'Sphere', icon: '🔵' },
    { key: 'cube', label: 'Cube', icon: '⬛' },
    { key: 'cylinder', label: 'Cylinder', icon: '🔘' },
    { key: 'torus', label: 'Torus', icon: '⭕' }
  ];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
        <directionalLight position={[0, 5, 5]} intensity={0.8} />

        {/* Main Art Model */}
        <ArtModel imageUrl={imageUrl} renderMode={currentMode} />

        {/* Particle System */}
        {showParticles && <ParticleSystem count={50} />}

        {/* Environment */}
        <Environment preset="sunset" />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          maxDistance={10}
          minDistance={1}
        />

        {/* Instructions Text */}
        <Text
          position={[0, -2.5, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Move mouse to interact • Scroll to zoom
        </Text>
      </Canvas>

      {/* Render Mode Selector */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        display: 'flex',
        gap: '5px',
        flexWrap: 'wrap'
      }}>
        {renderModes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setCurrentMode(mode.key)}
            style={{
              background: currentMode === mode.key ? '#667eea' : 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '5px 10px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.3s ease'
            }}
          >
            {mode.icon} {mode.label}
          </button>
        ))}
      </div>

      {/* Depth Info */}
      {currentMode === 'depth' && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          🎯 <strong>3D Depth Mode:</strong><br/>
          • Move mouse to create depth effect<br/>
          • Animated surface displacement<br/>
          • Dynamic lighting and colors
        </div>
      )}
    </div>
  );
};

export default Art3DRenderer; 
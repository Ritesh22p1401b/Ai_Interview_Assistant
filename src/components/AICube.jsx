import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function VoxelCube({ isSpeaking }) {
  const meshRef = useRef();
  const size = 9; // Grid dimensions (9x9x9)
  const spacing = 0.4;
  const count = Math.pow(size, 3);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate positions for a cube grid
  const grid = useMemo(() => {
    const temp = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          temp.push({
            pos: [
              (x - size / 2) * spacing,
              (y - size / 2) * spacing,
              (z - size / 2) * spacing,
            ],
            factor: Math.random(),
          });
        }
      }
    }
    return temp;
  }, [size, spacing]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    grid.forEach((data, i) => {
      const { pos, factor } = data;

      // Individual "Jitter" Motion
      // Cubes shift more aggressively when isSpeaking is true
      const speed = isSpeaking ? 8 : 2;
      const amplitude = isSpeaking ? 0.15 : 0.04;
      
      const offX = Math.sin(time * speed + factor * 10) * amplitude;
      const offY = Math.cos(time * speed + factor * 12) * amplitude;
      const offZ = Math.sin(time * speed + factor * 15) * amplitude;

      dummy.position.set(pos[0] + offX, pos[1] + offY, pos[2] + offZ);

      // Scaling effect - pulses with time
      const s = isSpeaking 
        ? 1 + Math.sin(time * 10 + factor * 5) * 0.2 
        : 1 + Math.sin(time * 2 + factor * 5) * 0.05;
      
      dummy.scale.set(s, s, s);
      
      // Makes them all slightly rotate individually
      dummy.rotation.x = time * 0.2 * factor;
      dummy.rotation.y = time * 0.3 * factor;

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Slow rotation of the whole cube cluster
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += 0.002;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      {/* Light, clean color that pops against black and blue glow */}
      <meshStandardMaterial 
        color="#e0f7fa" 
        roughness={0.1} 
        metalness={0.4}
        emissive="#0088ff"
        emissiveIntensity={isSpeaking ? 0.5 : 0.1} 
      />
    </instancedMesh>
  );
}

export default function AICubeComponent({ isSpeaking }) {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [6, 6, 6], fov: 40 }}>
        <ambientLight intensity={0.4} />

        {/* Central blue light that reflects off the light-colored cubes */}
        <pointLight 
          position={[0, 0, 0]} 
          intensity={isSpeaking ? 30 : 15} 
          color="#0088ff" 
          distance={12} 
        />
        
        {/* Top-down white highlight */}
        <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
        
        {/* Subtle rim light for depth */}
        <pointLight position={[-5, -5, -5]} intensity={1} color="#0044aa" />

        <VoxelCube isSpeaking={isSpeaking} />
        
        <fog attach="fog" args={["#000000", 5, 20]} />
      </Canvas>
    </div>
  );
}
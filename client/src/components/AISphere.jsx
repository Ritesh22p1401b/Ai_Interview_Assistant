// import { Canvas, useFrame } from "@react-three/fiber";
// import { Stars } from "@react-three/drei";
// import * as THREE from "three";
// import { useRef, useMemo } from "react";

// function EnvatoLayeredSphere({ isSpeaking }) {
//   const pointsRef = useRef();
//   const count = 6000; 

//   const [positions, initialPositions, factors] = useMemo(() => {
//     const pos = new Float32Array(count * 3);
//     const initial = new Float32Array(count * 3);
//     const f = new Float32Array(count);

//     for (let i = 0; i < count; i++) {
//       const phi = Math.acos(-1 + (2 * i) / count);
//       const theta = Math.sqrt(count * Math.PI) * phi;
      
//       // REDUCED: baseRadius changed from 2 to 1.4
//       const baseRadius = 1.4;
//       const layerVariation = (Math.random() - 0.5) * 0.4; 
//       const radius = baseRadius + layerVariation;

//       const x = radius * Math.sin(phi) * Math.cos(theta);
//       const y = radius * Math.sin(phi) * Math.sin(theta);
//       const z = radius * Math.cos(phi);

//       pos.set([x, y, z], i * 3);
//       initial.set([x, y, z], i * 3);
//       f[i] = Math.random(); 
//     }
//     return [pos, initial, f];
//   }, [count]);

//   useFrame((state) => {
//     const time = state.clock.getElapsedTime() * 0.5;
//     const posAttr = pointsRef.current.geometry.attributes.position;

//     for (let i = 0; i < count; i++) {
//       const i3 = i * 3;
//       const x = initialPositions[i3];
//       const y = initialPositions[i3 + 1];
//       const z = initialPositions[i3 + 2];
      
//       const dist = Math.sqrt(x * x + y * y + z * z);
      
//       // UPDATED: Threshold adjusted for the smaller radius (1.5 instead of 2.1)
//       const isOuterLayer = dist > 1.5;

//       let distortion = 1.0;

//       if (isSpeaking) {
//         if (isOuterLayer) {
//           const flicker = Math.sin(time * 15 + factors[i] * 50) * 0.08;
//           const wave = Math.sin(time * 6 + (x + y + z) * 1.2) * 0.12;
//           const pulse = Math.sin(time * 3) * 0.05;
//           distortion = 1.05 + flicker + wave + pulse;
//         } else {
//           distortion = 1.0 + Math.sin(time * 4 + factors[i] * 2) * 0.02;
//         }
//       } else {
//         distortion = 1.0 + Math.sin(time * 0.8 + factors[i] * 2) * 0.015;
//       }

//       posAttr.array[i3] = x * distortion;
//       posAttr.array[i3 + 1] = y * distortion;
//       posAttr.array[i3 + 2] = z * distortion;
//     }

//     posAttr.needsUpdate = true;
//     pointsRef.current.rotation.y += 0.0005;
//     pointsRef.current.rotation.x += 0.0003;
//   });

//   return (
//     <points ref={pointsRef}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={count}
//           array={positions}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={0.025} // Slightly smaller points to match the smaller scale
//         color={isSpeaking ? "#4df3ff" : "#00e5ff"}
//         transparent
//         opacity={0.6}
//         sizeAttenuation={true}
//         blending={THREE.AdditiveBlending}
//         depthWrite={false}
//       />
//     </points>
//   );
// }

// export default function AISphereVisual({ isSpeaking }) {
//   return (
//     <div className="w-full h-screen bg-[#01050a]">
//       <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
//         <pointLight position={[0, 0, 2]} intensity={isSpeaking ? 15 : 5} color="#00e5ff" />
//         <ambientLight intensity={0.2} />
//         <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={0.2} />
//         <EnvatoLayeredSphere isSpeaking={isSpeaking} />
//         <fog attach="fog" args={["#01050a", 5, 18]} />
//       </Canvas>
//     </div>
//   );
// }

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";

function EnvatoLayeredSphere({ isSpeaking }) {
  const pointsRef = useRef();
  const count = 6000; 

  const [positions, initialPositions, factors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    const f = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const baseRadius = 1.6; // Slightly increased for a more prominent sphere
      const layerVariation = (Math.random() - 0.5) * 0.4; 
      const radius = baseRadius + layerVariation;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      pos.set([x, y, z], i * 3);
      initial.set([x, y, z], i * 3);
      f[i] = Math.random(); 
    }
    return [pos, initial, f];
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.5;
    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = initialPositions[i3];
      const y = initialPositions[i3 + 1];
      const z = initialPositions[i3 + 2];
      
      const dist = Math.sqrt(x * x + y * y + z * z);
      const isOuterLayer = dist > 1.7;

      let distortion = 1.0;

      if (isSpeaking) {
        if (isOuterLayer) {
          const flicker = Math.sin(time * 15 + factors[i] * 50) * 0.08;
          const wave = Math.sin(time * 6 + (x + y + z) * 1.2) * 0.12;
          const pulse = Math.sin(time * 3) * 0.05;
          distortion = 1.05 + flicker + wave + pulse;
        } else {
          distortion = 1.0 + Math.sin(time * 4 + factors[i] * 2) * 0.02;
        }
      } else {
        distortion = 1.0 + Math.sin(time * 0.8 + factors[i] * 2) * 0.015;
      }

      posAttr.array[i3] = x * distortion;
      posAttr.array[i3 + 1] = y * distortion;
      posAttr.array[i3 + 2] = z * distortion;
    }

    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += 0.0005;
    pointsRef.current.rotation.x += 0.0003;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color={isSpeaking ? "#4df3ff" : "#00e5ff"}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function AISphereVisual({ isSpeaking }) {
  return (
    <div className="w-full h-full"> {/* Changed to h-full to fill parent container */}
      <Canvas camera={{ position: [0, 0, 7], fov: 35 }}> {/* Adjusted FOV for larger look */}
        <pointLight position={[0, 0, 2]} intensity={isSpeaking ? 15 : 5} color="#00e5ff" />
        <ambientLight intensity={0.2} />
        <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={0.2} />
        <EnvatoLayeredSphere isSpeaking={isSpeaking} />
        <fog attach="fog" args={["#0b0f0c", 5, 18]} />
      </Canvas>
    </div>
  );
}
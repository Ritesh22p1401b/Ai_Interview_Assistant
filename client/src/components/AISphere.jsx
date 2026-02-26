import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";

function EnvatoLayeredSphere({ isSpeaking }) {
  const pointsRef = useRef();
  const count = 6000; // Increased density to make the layers look fuller

  // Pre-calculate the distribution
  const [positions, initialPositions, factors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    const f = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      // We vary the radius slightly during generation to create "depth" layers
      const baseRadius = 2;
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
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Calculate distance from center to determine if it's "outer" or "inner"
      const x = initialPositions[i3];
      const y = initialPositions[i3 + 1];
      const z = initialPositions[i3 + 2];
      const distance = Math.sqrt(x*x + y*y + z*z);

      // THRESHOLD: Particles with distance > 2.0 are considered the "outer layers"
      const isOuterLayer = distance > 2.0;

      let drift = Math.sin(time * 1.5 + factors[i] * 10) * 0.03; // Base idle drift
      let expansion = 1.0;

      if (isSpeaking && isOuterLayer) {
        // Only the outer 5-6 layers get the aggressive motion
        drift = Math.sin(time * 12 + factors[i] * 25) * 0.25; 
        expansion = 1.25 + Math.sin(time * 6) * 0.1;
      }

      posAttr.array[i3] = x * expansion + drift;
      posAttr.array[i3 + 1] = y * expansion + drift;
      posAttr.array[i3 + 2] = z * expansion + drift;
    }

    posAttr.needsUpdate = true;

    // Smooth rotation for the whole system
    pointsRef.current.rotation.y += 0.002;
    pointsRef.current.rotation.x += 0.001;
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
        size={0.03}
        color="#00e5ff"
        transparent
        opacity={0.7}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function AISphereVisual({ isSpeaking }) {
  return (
    <div className="w-full h-screen bg-[#01050a]">
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
        <pointLight position={[0, 0, 0]} intensity={isSpeaking ? 15 : 6} color="#00e5ff" />
        <ambientLight intensity={0.1} />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        <EnvatoLayeredSphere isSpeaking={isSpeaking} />
        
        <fog attach="fog" args={["#01050a", 5, 15]} />
      </Canvas>
    </div>
  );
}
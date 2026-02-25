import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";

function CoreSphere({ isSpeaking }) {
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.y += 0.003;
    mesh.current.rotation.x += 0.002;

    if (isSpeaking) {
      mesh.current.scale.x = 1.05 + Math.sin(Date.now() * 0.01) * 0.05;
      mesh.current.scale.y = 1.05 + Math.sin(Date.now() * 0.01) * 0.05;
      mesh.current.scale.z = 1.05 + Math.sin(Date.now() * 0.01) * 0.05;
    } else {
      mesh.current.scale.set(1, 1, 1);
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.4, 128, 128]} />
      <meshStandardMaterial
        color="#0a1a2f"
        emissive="#00bfff"
        emissiveIntensity={isSpeaking ? 2.5 : 1.2}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function OrbitRing({ isSpeaking }) {
  const lineRef = useRef();

  const points = useMemo(() => {
    const pts = [];
    const radius = 2.2;

    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * radius,
          Math.sin(theta) * radius,
          0
        )
      );
    }
    return pts;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame(() => {
    if (!lineRef.current) return;

    lineRef.current.rotation.z += 0.002;

    if (isSpeaking) {
      lineRef.current.scale.setScalar(
        1 + Math.sin(Date.now() * 0.02) * 0.05
      );
    } else {
      lineRef.current.scale.setScalar(1);
    }
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#00e5ff"
        linewidth={2}
      />
    </line>
  );
}

export default function AISphere({ isSpeaking }) {
  return (
    <div className="w-full h-[450px] bg-gradient-to-b from-[#050b18] to-black">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 5]} intensity={2} color="#00bfff" />
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          fade
        />
        <CoreSphere isSpeaking={isSpeaking} />
        <OrbitRing isSpeaking={isSpeaking} />
      </Canvas>
    </div>
  );
}


import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CropModelProps {
  pos: [number, number, number];
  color: string;
  scale: number;
  cropType: string;
}

const CropModel: React.FC<CropModelProps> = ({ pos, color, scale, cropType }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle wind Sway
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime + pos[0] + pos[2]) * 0.02;
    }
  });

  const renderCrop = () => {
    switch (cropType.toLowerCase()) {
      case "wheat":
      case "paddy":
      case "rice":
        return (
          <>
            {/* Dense Wheat Cluster */}
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 0.3,
                0.25 * scale,
                (Math.random() - 0.5) * 0.3
              ]} rotation={[0.1, Math.random() * Math.PI, 0]} castShadow>
                <cylinderGeometry args={[0.015, 0.02, 0.5 * scale, 4]} />
                <meshStandardMaterial color="#eab308" roughness={0.8} />
              </mesh>
            ))}
            {/* Heads */}
            {[...Array(5)].map((_, i) => (
              <mesh key={`head-${i}`} position={[
                (Math.random() - 0.5) * 0.2,
                0.55 * scale,
                (Math.random() - 0.5) * 0.2
              ]} castShadow>
                <capsuleGeometry args={[0.025 * scale, 0.15 * scale, 4, 8]} />
                <meshStandardMaterial color="#d97706" roughness={0.9} />
              </mesh>
            ))}
          </>
        );
      
      case "corn":
      case "maize":
        return (
          <>
            {/* Stalk */}
            <mesh position={[0, 0.4 * scale, 0]} castShadow>
              <cylinderGeometry args={[0.03 * scale, 0.05 * scale, 0.8 * scale, 6]} />
              <meshStandardMaterial color="#65a30d" roughness={0.7} />
            </mesh>
            {/* Leaves */}
            {[...Array(4)].map((_, i) => (
              <mesh key={i} position={[
                Math.sin(i * Math.PI/2) * 0.1,
                0.3 * scale + i * 0.08,
                Math.cos(i * Math.PI/2) * 0.1
              ]} rotation={[0.5, i * Math.PI/2, 0.4]} castShadow>
                <boxGeometry args={[0.02, 0.35 * scale, 0.05]} />
                <meshStandardMaterial color="#4d7c0f" roughness={0.6} side={THREE.DoubleSide} />
              </mesh>
            ))}
             {/* Cobs */}
             <mesh position={[0.05, 0.5 * scale, 0]} rotation={[0, 0, 0.5]} castShadow>
               <capsuleGeometry args={[0.04 * scale, 0.15 * scale, 4, 8]} />
               <meshStandardMaterial color="#facc15" />
             </mesh>
          </>
        );
      
      case "tomato":
        return (
          <>
            {/* Bushy Plant */}
            <mesh position={[0, 0.2 * scale, 0]} castShadow>
               <cylinderGeometry args={[0.02 * scale, 0.03 * scale, 0.4 * scale, 5]} />
               <meshStandardMaterial color="#15803d" />
            </mesh>
            {/* Leaves Clump */}
            <mesh position={[0, 0.25 * scale, 0]} castShadow>
               <dodecahedronGeometry args={[0.2 * scale, 0]} />
               <meshStandardMaterial color="#16a34a" roughness={0.8} />
            </mesh>
            {/* Fruits */}
            {[...Array(4)].map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 0.25,
                0.15 * scale + Math.random() * 0.2,
                (Math.random() - 0.5) * 0.25
              ]} castShadow>
                <sphereGeometry args={[0.05 * scale, 8, 8]} />
                <meshStandardMaterial color="#dc2626" roughness={0.3} />
              </mesh>
            ))}
          </>
        );
      
      case "potato":
      case "onion":
        return (
          <>
            {/* Low Bush */}
            <mesh position={[0, 0.1 * scale, 0]} castShadow>
               <sphereGeometry args={[0.18 * scale, 7, 6]} />
               <meshStandardMaterial color="#1e3a8a" />
            </mesh>
            {[...Array(6)].map((_, i) => (
              <mesh key={i} position={[0, 0.05, 0]} rotation={[0, i * (Math.PI/3), 0.3]} castShadow>
                 <planeGeometry args={[0.1, 0.3]} />
                 <meshStandardMaterial color="#15803d" side={THREE.DoubleSide} />
              </mesh>
            ))}
          </>
        );
      
      default:
        // Generic Green Plant
        return (
          <group>
             <mesh position={[0, 0.2 * scale, 0]} castShadow>
               <cylinderGeometry args={[0.04 * scale, 0.06 * scale, 0.4 * scale, 5]} />
               <meshStandardMaterial color="#4ade80" />
             </mesh>
             <mesh position={[0, 0.4 * scale, 0]} castShadow>
               <sphereGeometry args={[0.15 * scale, 6, 5]} />
               <meshStandardMaterial color="#22c55e" />
             </mesh>
          </group>
        );
    }
  };

  return (
    <group ref={groupRef} position={pos}>
      {renderCrop()}
    </group>
  );
};

export default CropModel;

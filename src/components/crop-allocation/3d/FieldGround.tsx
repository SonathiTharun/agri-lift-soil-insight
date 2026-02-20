
import React from 'react';

const FieldGround: React.FC = () => {
  return (
    <group position={[0, -0.05, 0]}>
      {/* 1. Infinite Grass Base */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#4ade80" 
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* 2. Central Dirt Path Area (Cross Shape) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial 
          color="#d6d3d1" // Light dirt/stone path
          roughness={0.9}
        />
      </mesh>

      {/* 3. Four Soil Beds (Tilled Earth) */}
      {/* Top Left */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0, -2.5]}>
        <boxGeometry args={[4, 4, 0.2]} />
        <meshStandardMaterial color="#3f2e26" roughness={1} />
      </mesh>
      
      {/* Top Right */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0, -2.5]}>
        <boxGeometry args={[4, 4, 0.2]} />
        <meshStandardMaterial color="#3f2e26" roughness={1} />
      </mesh>

      {/* Bottom Left */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, 0, 2.5]}>
        <boxGeometry args={[4, 4, 0.2]} />
        <meshStandardMaterial color="#3f2e26" roughness={1} />
      </mesh>

      {/* Bottom Right */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0, 2.5]}>
        <boxGeometry args={[4, 4, 0.2]} />
        <meshStandardMaterial color="#3f2e26" roughness={1} />
      </mesh>
    </group>
  );
};

export default FieldGround;

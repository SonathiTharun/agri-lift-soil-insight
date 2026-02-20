
import React from 'react';

const FieldDecorations: React.FC = () => {
  return (
    <>
      {/* Rustic Wooden Posts at Corners of the 4 Plots */}
      {/* Outer Corners */}
      {[-4.6, 4.6].map((x) => (
        [-4.6, 4.6].map((z) => (
          <mesh key={`post-${x}-${z}`} position={[x, 0.5, z]} castShadow receiveShadow>
            <boxGeometry args={[0.15, 1, 0.15]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
        ))
      ))}
      
      {/* Inner Corners near path crossing */}
      {[-0.4, 0.4].map((x) => (
        [-0.4, 0.4].map((z) => (
          <mesh key={`post-inner-${x}-${z}`} position={[x * 2, 0.5, z * 2]} castShadow receiveShadow>
             <boxGeometry args={[0.1, 0.8, 0.1]} />
             <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
        ))
      ))}
      
      {/* Wooden Handcart */}
      <group position={[3.5, 0.3, 0]} rotation={[0, -0.2, 0]}>
         {/* Cart Body */}
         <mesh castShadow position={[0, 0.2, 0]}>
            <boxGeometry args={[1.2, 0.5, 0.8]} />
            <meshStandardMaterial color="#8d6e63" roughness={0.8} />
         </mesh>
         
         {/* Wheels */}
         <mesh castShadow position={[-0.4, -0.1, 0.45]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
            <meshStandardMaterial color="#212121" />
         </mesh>
         <mesh castShadow position={[0.4, -0.1, 0.45]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
            <meshStandardMaterial color="#212121" />
         </mesh>
         <mesh castShadow position={[-0.4, -0.1, -0.45]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
            <meshStandardMaterial color="#212121" />
         </mesh>
         <mesh castShadow position={[0.4, -0.1, -0.45]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
            <meshStandardMaterial color="#212121" />
         </mesh>
         
         {/* Handle */}
         <mesh castShadow position={[0.6, 0.4, 0]} rotation={[0, 0, -0.5]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6]} />
            <meshStandardMaterial color="#3e2723" />
         </mesh>
      </group>

      {/* Background Trees (Simple Low Poly) */}
      {[
          { pos: [-8, 0, -8], scale: 1.2 },
          { pos: [8, 0, -9], scale: 1.5 },
          { pos: [-10, 0, 5], scale: 1.1 },
          { pos: [10, 0, 6], scale: 1.3 },
          { pos: [0, 0, -12], scale: 1.8 }
      ].map((tree, i) => (
         <group key={`tree-${i}`} position={tree.pos as any} scale={tree.scale}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]} castShadow>
               <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
               <meshStandardMaterial color="#5d4037" roughness={0.9} />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 2.5, 0]} castShadow>
               <dodecahedronGeometry args={[1.5, 0]} />
               <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
            </mesh>
         </group>
      ))}
    </>
  );
};

export default FieldDecorations;

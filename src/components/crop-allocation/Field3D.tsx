import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Sky, ContactShadows, BakeShadows } from "@react-three/drei";
import * as THREE from "three";
import FieldGround from "./3d/FieldGround";
import FieldDecorations from "./3d/FieldDecorations";
import CropPlacement from "./3d/CropPlacement";
import { SelectedCrop } from "./types";

interface Field3DProps {
  crops: SelectedCrop[];
  rotationEnabled: boolean;
}

const Field3DScene: React.FC<Field3DProps> = ({
  crops,
  rotationEnabled
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Slow rotation for showcase, but user can override with controls
  useFrame((state) => {
    if (rotationEnabled && groupRef.current) {
     // groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <FieldGround />
      <FieldDecorations />
      <CropPlacement crops={crops} />
      
      {/* Realistic Sun and Shadows */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>

      {/* Realistic Info Labels (World Space UI) */}
      {crops.length > 0 && (
        <Html position={[0, 3, 0]} center distanceFactor={12} className="pointer-events-none">
          <div className="bg-white/90 text-gray-800 px-3 py-1.5 rounded-md shadow-md border border-gray-200">
            <div className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Yield Forecast</div>
            <div className="text-xl font-bold font-serif text-green-800">
              {crops.reduce((sum, crop) => sum + crop.estimatedYield, 0).toFixed(1)} <span className="text-xs text-gray-600">tons</span>
            </div>
          </div>
          <div className="h-6 w-0.5 bg-white/50 mx-auto"></div>
        </Html>
      )}
    </group>
  );
};

const Field3D: React.FC<Field3DProps> = ({
  crops,
  rotationEnabled
}) => {
  const [showInfo, setShowInfo] = useState(true);
  
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-xl border border-gray-200 relative bg-sky-100">
      <Canvas shadows camera={{
        position: [8, 6, 8],
        fov: 50
      }} gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace
      }}>
        {/* Realistic Atmosphere */}
        <Sky sunPosition={[10, 20, 10]} turbidity={0.5} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
        <Environment preset="park" background={false} />
        
        <Field3DScene crops={crops} rotationEnabled={rotationEnabled} />
        
        <OrbitControls 
          enablePan={true} 
          enableDamping={true} 
          dampingFactor={0.05} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={3} 
          maxDistance={25}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Simple Clean UI Overlay */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100">
             <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🚜</span>
                <span className="font-bold text-gray-800 text-sm">Farm Simulation</span>
             </div>
             <div className="text-xs text-gray-500">
                {crops.length} Active Crops • Healthy Soil
             </div>
        </div>
      </div>
    </div>
  );
};

export default Field3D;

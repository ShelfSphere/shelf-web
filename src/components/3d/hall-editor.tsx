"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Text } from "@react-three/drei";
import type { Hall, Shelf } from "@/types";
import * as THREE from "three";

interface Props {
  hall: Hall;
  onShelfToggle?: (shelfId: string, isAvailable: boolean) => void;
  readonly?: boolean;
}

function ShelfMesh({
  shelf,
  onClick,
  selected,
}: {
  shelf: Shelf;
  onClick?: () => void;
  selected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = shelf.isAvailable
    ? hovered || selected
      ? "#27AE60"
      : "#2ECC71"
    : hovered || selected
    ? "#C0392B"
    : "#E74C3C";

  return (
    <group position={[shelf.positionX, shelf.positionY, shelf.positionZ]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[shelf.width, shelf.height, shelf.depth]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={hovered || selected ? 1 : 0.85}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* shelf label */}
      <Text
        position={[0, shelf.height / 2 + 0.15, 0]}
        fontSize={0.15}
        color="#0F1F3D"
        anchorX="center"
        anchorY="bottom"
      >
        {shelf.name}
      </Text>
      {/* price label */}
      <Text
        position={[0, shelf.height / 2 + 0.35, 0]}
        fontSize={0.12}
        color={shelf.isAvailable ? "#27AE60" : "#C0392B"}
        anchorX="center"
        anchorY="bottom"
      >
        {shelf.isAvailable ? `$${shelf.pricePerDay}/day` : "Booked"}
      </Text>
    </group>
  );
}

function HallWalls({ hall }: { hall: Hall }) {
  const { width, depth, height } = hall;
  const wallThickness = 0.15;
  const wallColor = "#CBD5E1";

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#F1F5F9" roughness={0.8} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.25} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.25} />
      </mesh>
      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

export default function HallEditor3D({ hall, onShelfToggle, readonly = false }: Props) {
  const [selected, setSelected] = useState<Shelf | null>(null);

  const handleShelfClick = (shelf: Shelf) => {
    if (readonly) return;
    if (selected?.id === shelf.id) {
      setSelected(null);
    } else {
      setSelected(shelf);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900" style={{ height: 600 }}>
      {/* Selected shelf panel */}
      {selected && !readonly && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-xl p-4 w-56 space-y-3">
          <h3 className="font-semibold text-brand-navy text-sm">{selected.name}</h3>
          <p className="text-xs text-gray-500">Tier: {selected.tier.replace("_", " ")}</p>
          <p className="text-xs text-gray-500">${selected.pricePerDay} / day</p>
          <p className="text-xs text-gray-500">
            {selected.width}m × {selected.depth}m × {selected.height}m
          </p>
          <button
            onClick={() => {
              onShelfToggle?.(selected.id, !selected.isAvailable);
              setSelected(null);
            }}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
              selected.isAvailable
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-brand-green hover:bg-brand-green-dark text-white"
            }`}
          >
            {selected.isAvailable ? "Mark as booked" : "Mark as available"}
          </button>
          <button
            onClick={() => setSelected(null)}
            className="w-full py-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}

      <Canvas
        camera={{ position: [hall.width * 0.8, hall.height * 1.2, hall.depth * 1.5], fov: 50 }}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />

        <Environment preset="city" />

        <HallWalls hall={hall} />

        {hall.shelves.map((shelf) => (
          <ShelfMesh
            key={shelf.id}
            shelf={shelf}
            onClick={() => handleShelfClick(shelf)}
            selected={selected?.id === shelf.id}
          />
        ))}

        <Grid
          position={[0, 0, 0]}
          args={[hall.width, hall.depth]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#94A3B8"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#64748B"
          fadeDistance={50}
          infiniteGrid={false}
        />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={2}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

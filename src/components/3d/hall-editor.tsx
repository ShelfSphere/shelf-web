"use client";

import { useRef, useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Text } from "@react-three/drei";
import type { Hall, Shelf } from "@/types";
import * as THREE from "three";

interface Props {
  hall: Hall;
  onShelfToggle?: (shelfId: string, isAvailable: boolean) => void;
  onShelfDelete?: (shelfId: string) => void;
  onFloorClick?: (x: number, z: number) => void;
  placementMode?: boolean;
  readonly?: boolean;
}

function ShelfMesh({ shelf, onClick, selected }: { shelf: Shelf; onClick?: () => void; selected: boolean }) {
  const [hovered, setHovered] = useState(false);

  const color = shelf.isAvailable
    ? hovered || selected ? "#16a34a" : "#22c55e"
    : hovered || selected ? "#dc2626" : "#ef4444";

  return (
    <group position={[shelf.positionX, shelf.positionY, shelf.positionZ]}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        castShadow
      >
        <boxGeometry args={[shelf.width, shelf.height, shelf.depth]} />
        <meshStandardMaterial color={color} transparent opacity={hovered || selected ? 1 : 0.88} roughness={0.3} metalness={0.15} />
      </mesh>
      {/* Shelf planks */}
      {[-0.12, 0, 0.12].map((offset, i) => (
        <mesh key={i} position={[0, shelf.height / 2 - 0.02 + offset * 0.1, 0]}>
          <boxGeometry args={[shelf.width - 0.05, 0.03, shelf.depth - 0.05]} />
          <meshStandardMaterial color={color} roughness={0.6} metalness={0} opacity={0.6} transparent />
        </mesh>
      ))}
      <Text position={[0, shelf.height / 2 + 0.12, 0]} fontSize={0.14} color="#fff" anchorX="center" anchorY="bottom">
        {shelf.name}
      </Text>
      <Text position={[0, shelf.height / 2 + 0.3, 0]} fontSize={0.11} color={shelf.isAvailable ? "#86efac" : "#fca5a5"} anchorX="center" anchorY="bottom">
        {shelf.isAvailable ? `$${shelf.pricePerDay}/day` : "Booked"}
      </Text>
    </group>
  );
}

function Floor({ hall, onFloorClick, placementMode }: { hall: Hall; onFloorClick?: (x: number, z: number) => void; placementMode?: boolean }) {
  const [hoverPos, setHoverPos] = useState<[number, number] | null>(null);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!placementMode) return;
    e.stopPropagation();
    setHoverPos([e.point.x, e.point.z]);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!placementMode || !onFloorClick) return;
    e.stopPropagation();
    onFloorClick(Math.round(e.point.x * 2) / 2, Math.round(e.point.z * 2) / 2);
    setHoverPos(null);
  };

  return (
    <>
      <mesh
        position={[0, -0.05, 0]}
        receiveShadow
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverPos(null)}
        onClick={handleClick}
      >
        <boxGeometry args={[hall.width, 0.1, hall.depth]} />
        <meshStandardMaterial color={placementMode ? "#1e3a5f" : "#1a2744"} roughness={0.9} />
      </mesh>

      {/* Ghost preview shelf on hover */}
      {placementMode && hoverPos && (
        <mesh position={[hoverPos[0], 0.2, hoverPos[1]]}>
          <boxGeometry args={[2, 0.4, 0.5]} />
          <meshStandardMaterial color="#22c55e" transparent opacity={0.45} roughness={0.3} />
        </mesh>
      )}
    </>
  );
}

function HallWalls({ hall }: { hall: Hall }) {
  const { width, depth, height } = hall;
  const wallColor = "#1e3a5f";

  return (
    <group>
      {/* Ceiling */}
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#0f1729" roughness={0.9} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, 0.15]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.35} roughness={0.8} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, depth]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.35} roughness={0.8} />
      </mesh>
      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, depth]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.35} roughness={0.8} />
      </mesh>
      {/* Ceiling lights strip */}
      {[-width / 3, 0, width / 3].map((x, i) => (
        <mesh key={i} position={[x, height - 0.05, 0]}>
          <boxGeometry args={[0.3, 0.05, depth * 0.8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}

export default function HallEditor3D({ hall, onShelfToggle, onShelfDelete, onFloorClick, placementMode = false, readonly = false }: Props) {
  const [selected, setSelected] = useState<Shelf | null>(null);

  const handleShelfClick = (shelf: Shelf) => {
    if (readonly || placementMode) return;
    setSelected(selected?.id === shelf.id ? null : shelf);
  };

  return (
    <div className="relative w-full h-full">
      {/* Selected shelf panel */}
      {selected && !readonly && !placementMode && (
        <div className="absolute top-4 left-4 z-10 bg-[#0f1729]/95 backdrop-blur border border-white/10 rounded-2xl shadow-2xl p-5 w-64 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">{selected.name}</h3>
              <p className="text-xs text-white/40 mt-0.5">{selected.tier.replace("_", " ")}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white/70 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-white/50">
            <div className="flex justify-between"><span>Price</span><span className="text-white/80 font-semibold">${selected.pricePerDay}/day</span></div>
            <div className="flex justify-between"><span>Size</span><span className="text-white/80">{selected.width}×{selected.height}×{selected.depth}m</span></div>
            <div className="flex justify-between"><span>Position</span><span className="text-white/80">({selected.positionX}, {selected.positionZ})</span></div>
          </div>

          <button
            onClick={() => { onShelfToggle?.(selected.id, !selected.isAvailable); setSelected(null); }}
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${
              selected.isAvailable ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30" : "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
            }`}
          >
            {selected.isAvailable ? "Mark as booked" : "Mark as available"}
          </button>

          {onShelfDelete && (
            <button
              onClick={() => { onShelfDelete(selected.id); setSelected(null); }}
              className="w-full py-2 rounded-xl text-xs font-semibold text-white/30 hover:text-red-400 hover:bg-red-500/10 border border-white/10 transition-colors"
            >
              Remove shelf
            </button>
          )}
        </div>
      )}

      {/* Placement mode hint */}
      {placementMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-[#0f1729]/90 backdrop-blur border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-white text-xs font-semibold">Click on the floor to place shelf</span>
        </div>
      )}

      <Canvas
        camera={{ position: [hall.width * 0.8, hall.height * 1.4, hall.depth * 1.5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#0b1120"]} />
        <fog attach="fog" args={["#0b1120", 20, 60]} />

        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow shadow-mapSize={[2048, 2048]} />
        <pointLight position={[0, hall.height - 0.2, 0]} intensity={1.2} color="#e8f0ff" distance={hall.width * 2} />
        <pointLight position={[-hall.width / 3, hall.height - 0.2, 0]} intensity={0.8} color="#e8f0ff" distance={hall.width} />
        <pointLight position={[hall.width / 3, hall.height - 0.2, 0]} intensity={0.8} color="#e8f0ff" distance={hall.width} />

        <HallWalls hall={hall} />
        <Floor hall={hall} onFloorClick={onFloorClick} placementMode={placementMode} />

        {hall.shelves.map((shelf) => (
          <ShelfMesh
            key={shelf.id}
            shelf={shelf}
            onClick={() => handleShelfClick(shelf)}
            selected={selected?.id === shelf.id}
          />
        ))}

        <Grid
          position={[0, 0.01, 0]}
          args={[hall.width, hall.depth]}
          cellSize={1}
          cellThickness={0.3}
          cellColor="#1e3a5f"
          sectionSize={5}
          sectionThickness={0.8}
          sectionColor="#2a4a7f"
          fadeDistance={50}
          infiniteGrid={false}
        />

        <OrbitControls
          enablePan={!placementMode}
          enableZoom
          enableRotate={!placementMode}
          minDistance={2}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}

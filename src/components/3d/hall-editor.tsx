"use client";

import { useState } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import type { Hall, Shelf } from "@/types";

interface Props {
  hall: Hall;
  onShelfToggle?: (shelfId: string, isAvailable: boolean) => void;
  onShelfDelete?: (shelfId: string) => void;
  onFloorClick?: (x: number, z: number) => void;
  placementMode?: boolean;
  readonly?: boolean;
}

// Gondola stand — red uprights, cream shelves, matching the real-world look
function StandMesh({ shelf, onClick, selected }: { shelf: Shelf; onClick?: () => void; selected: boolean }) {
  const [hovered, setHovered] = useState(false);

  const levels = shelf.levels ?? 4;
  const standH = shelf.height;
  const levelH = standH / levels;
  const uprightW = 0.06;
  const shelfT = 0.035;

  const accentColor = selected ? "#b91c1c" : hovered ? "#c0392b" : "#dc2626";
  const boardColor = selected ? "#ede0cc" : "#f5ede0";
  const backColor = "#f0e8d8";

  return (
    <group
      position={[shelf.positionX, 0, shelf.positionZ]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      {/* Left end cap */}
      <mesh position={[-shelf.width / 2 + uprightW / 2, standH / 2, 0]} castShadow>
        <boxGeometry args={[uprightW, standH, shelf.depth]} />
        <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Right end cap */}
      <mesh position={[shelf.width / 2 - uprightW / 2, standH / 2, 0]} castShadow>
        <boxGeometry args={[uprightW, standH, shelf.depth]} />
        <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.08} />
      </mesh>

      {/* Back panel */}
      <mesh position={[0, standH / 2, -shelf.depth / 2 + 0.015]} castShadow>
        <boxGeometry args={[shelf.width - uprightW * 2, standH, 0.025]} />
        <meshStandardMaterial color={backColor} roughness={0.7} />
      </mesh>

      {/* Shelf boards — bottom + one per level */}
      {Array.from({ length: levels + 1 }).map((_, i) => (
        <mesh key={i} position={[0, i * levelH, 0]} castShadow receiveShadow>
          <boxGeometry args={[shelf.width, shelfT, shelf.depth]} />
          <meshStandardMaterial color={boardColor} roughness={0.65} />
        </mesh>
      ))}

      {/* Ghost outline when selected */}
      {selected && (
        <mesh position={[0, standH / 2, 0]}>
          <boxGeometry args={[shelf.width + 0.04, standH + 0.04, shelf.depth + 0.04]} />
          <meshStandardMaterial color="#2563eb" transparent opacity={0.08} wireframe={false} />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, standH + 0.18, 0]}
        fontSize={0.15}
        color="#1e293b"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.008}
        outlineColor="#ffffff"
      >
        {shelf.name}
      </Text>
      <Text
        position={[0, standH + 0.02, 0]}
        fontSize={0.12}
        color={shelf.isAvailable ? "#16a34a" : "#dc2626"}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.006}
        outlineColor="#ffffff"
      >
        {shelf.isAvailable ? `$${shelf.pricePerDay}/day` : "Booked"}
      </Text>
    </group>
  );
}

function GhostStand({ pos, width, depth, levels }: { pos: [number, number]; width: number; depth: number; levels: number }) {
  const standH = levels * 0.45 + 0.05;
  return (
    <group position={[pos[0], 0, pos[1]]}>
      <mesh position={[0, standH / 2, 0]}>
        <boxGeometry args={[width, standH, depth]} />
        <meshStandardMaterial color="#2563eb" transparent opacity={0.22} roughness={0.5} />
      </mesh>
      <mesh position={[0, standH / 2, 0]}>
        <boxGeometry args={[width + 0.02, standH + 0.02, depth + 0.02]} />
        <meshStandardMaterial color="#2563eb" transparent opacity={0.12} wireframe />
      </mesh>
    </group>
  );
}

function Floor({ hall, onFloorClick, placementMode, ghostLevels }: {
  hall: Hall;
  onFloorClick?: (x: number, z: number) => void;
  placementMode?: boolean;
  ghostLevels?: number;
}) {
  const [hoverPos, setHoverPos] = useState<[number, number] | null>(null);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!placementMode) return;
    e.stopPropagation();
    setHoverPos([Math.round(e.point.x * 2) / 2, Math.round(e.point.z * 2) / 2]);
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
        <meshStandardMaterial color="#e8e5df" roughness={0.8} />
      </mesh>

      {placementMode && hoverPos && (
        <GhostStand pos={hoverPos} width={2} depth={0.5} levels={ghostLevels ?? 4} />
      )}
    </>
  );
}

function HallWalls({ hall }: { hall: Hall }) {
  const { width, depth, height } = hall;
  return (
    <group>
      {/* Ceiling */}
      <mesh position={[0, height + 0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#dbd8d0" roughness={0.85} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, 0.15]} />
        <meshStandardMaterial color="#d8d5ce" roughness={0.85} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, depth]} />
        <meshStandardMaterial color="#d8d5ce" roughness={0.85} />
      </mesh>
      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, depth]} />
        <meshStandardMaterial color="#d8d5ce" roughness={0.85} />
      </mesh>
      {/* Ceiling light strips */}
      {[-width / 3, 0, width / 3].map((x, i) => (
        <mesh key={i} position={[x, height - 0.04, 0]}>
          <boxGeometry args={[0.25, 0.04, depth * 0.8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function HallEditor3D({
  hall,
  onShelfToggle,
  onShelfDelete,
  onFloorClick,
  placementMode = false,
  readonly = false,
  ghostLevels,
}: Props & { ghostLevels?: number }) {
  const [selected, setSelected] = useState<Shelf | null>(null);

  const handleStandClick = (shelf: Shelf) => {
    if (readonly || placementMode) return;
    setSelected(selected?.id === shelf.id ? null : shelf);
  };

  return (
    <div className="relative w-full h-full">
      {/* Selected stand panel */}
      {selected && !readonly && !placementMode && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-xl p-5 w-64 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{selected.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{selected.levels ?? 4} shelf levels</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-300 hover:text-gray-600 transition-colors">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-gray-400">
            <div className="flex justify-between"><span>Price</span><span className="text-gray-700 font-semibold">${selected.pricePerDay}/day</span></div>
            <div className="flex justify-between"><span>Size</span><span className="text-gray-700">{selected.width}×{selected.height.toFixed(2)}×{selected.depth}m</span></div>
            <div className="flex justify-between"><span>Position</span><span className="text-gray-700">({selected.positionX}, {selected.positionZ})</span></div>
          </div>

          <button
            onClick={() => { onShelfToggle?.(selected.id, !selected.isAvailable); setSelected(null); }}
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors border ${
              selected.isAvailable
                ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                : "bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
            }`}
          >
            {selected.isAvailable ? "Mark as booked" : "Mark as available"}
          </button>

          {onShelfDelete && (
            <button
              onClick={() => { onShelfDelete(selected.id); setSelected(null); }}
              className="w-full py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 transition-colors"
            >
              Remove stand
            </button>
          )}
        </div>
      )}

      {/* Placement hint */}
      {placementMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur border border-gray-200 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-gray-700 text-xs font-semibold">Click on the floor to place stand</span>
        </div>
      )}

      <Canvas
        camera={{ position: [hall.width * 0.8, hall.height * 1.4, hall.depth * 1.5], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#f0ede8"]} />

        <ambientLight intensity={2.2} />
        <directionalLight position={[10, 20, 10]} intensity={1.4} castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-8, 12, -8]} intensity={0.8} />
        <pointLight position={[0, hall.height - 0.1, 0]} intensity={1.8} color="#fff8f0" distance={hall.width * 3} />

        <HallWalls hall={hall} />
        <Floor hall={hall} onFloorClick={onFloorClick} placementMode={placementMode} ghostLevels={ghostLevels} />

        {hall.shelves.map((shelf) => (
          <StandMesh
            key={shelf.id}
            shelf={shelf}
            onClick={() => handleStandClick(shelf)}
            selected={selected?.id === shelf.id}
          />
        ))}

        <Grid
          position={[0, 0.01, 0]}
          args={[hall.width, hall.depth]}
          cellSize={1}
          cellThickness={0.4}
          cellColor="#c8c4bc"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#a8a49c"
          fadeDistance={60}
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

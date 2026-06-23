"use client";

import { useRef, useState } from "react";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import type { Hall, Shelf } from "@/types";

interface Props {
  hall: Hall;
  onShelfToggle?: (shelfId: string, isAvailable: boolean) => void;
  onShelfDelete?: (shelfId: string) => void;
  onLineDrop?: (positions: { x: number; z: number }[], rotation: number) => void;
  placementMode?: boolean;
  readonly?: boolean;
  ghostLevels?: number;
  ghostWidth?: number;
  ghostDepth?: number;
}

// ─── Stand mesh (gondola: red uprights + cream boards) ────────────────────────

function StandMesh({
  shelf,
  onClick,
  selected,
}: {
  shelf: Shelf;
  onClick?: () => void;
  selected: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const levels = shelf.levels ?? 4;
  const standH = shelf.height;
  const levelH = standH / levels;
  const uprightW = 0.06;
  const boardT = 0.035;

  const accent = selected ? "#b91c1c" : hovered ? "#c0392b" : "#dc2626";
  const board  = selected ? "#ede0cc" : "#f5ede0";

  return (
    <group
      position={[shelf.positionX, 0, shelf.positionZ]}
      rotation={[0, shelf.rotation ?? 0, 0]}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      {/* Left end cap */}
      <mesh position={[-shelf.width / 2 + uprightW / 2, standH / 2, 0]} castShadow>
        <boxGeometry args={[uprightW, standH, shelf.depth]} />
        <meshStandardMaterial color={accent} roughness={0.35} metalness={0.08} />
      </mesh>
      {/* Right end cap */}
      <mesh position={[shelf.width / 2 - uprightW / 2, standH / 2, 0]} castShadow>
        <boxGeometry args={[uprightW, standH, shelf.depth]} />
        <meshStandardMaterial color={accent} roughness={0.35} metalness={0.08} />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, standH / 2, -shelf.depth / 2 + 0.015]} castShadow>
        <boxGeometry args={[shelf.width - uprightW * 2, standH, 0.025]} />
        <meshStandardMaterial color="#f0e8d8" roughness={0.7} />
      </mesh>
      {/* Shelf boards */}
      {Array.from({ length: levels + 1 }).map((_, i) => (
        <mesh key={i} position={[0, i * levelH, 0]} castShadow receiveShadow>
          <boxGeometry args={[shelf.width, boardT, shelf.depth]} />
          <meshStandardMaterial color={board} roughness={0.65} />
        </mesh>
      ))}
      {/* Selection glow */}
      {selected && (
        <mesh position={[0, standH / 2, 0]}>
          <boxGeometry args={[shelf.width + 0.06, standH + 0.06, shelf.depth + 0.06]} />
          <meshStandardMaterial color="#2563eb" transparent opacity={0.07} />
        </mesh>
      )}
      {/* Labels */}
      <Text position={[0, standH + 0.18, 0]} fontSize={0.15} color="#1e293b"
        anchorX="center" anchorY="bottom" outlineWidth={0.008} outlineColor="#ffffff">
        {shelf.name}
      </Text>
      <Text position={[0, standH + 0.02, 0]} fontSize={0.12}
        color={shelf.isAvailable ? "#16a34a" : "#dc2626"}
        anchorX="center" anchorY="bottom" outlineWidth={0.006} outlineColor="#ffffff">
        {shelf.isAvailable ? `$${shelf.pricePerDay}/day` : "Booked"}
      </Text>
    </group>
  );
}

// ─── Ghost stand preview ──────────────────────────────────────────────────────

function GhostStand({
  x, z, width, depth, levels, rotation = 0,
}: {
  x: number; z: number; width: number; depth: number; levels: number; rotation?: number;
}) {
  const standH = levels * 0.45 + 0.05;
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, standH / 2, 0]}>
        <boxGeometry args={[width, standH, depth]} />
        <meshStandardMaterial color="#2563eb" transparent opacity={0.2} roughness={0.5} />
      </mesh>
      <mesh position={[0, standH / 2, 0]}>
        <boxGeometry args={[width + 0.04, standH + 0.04, depth + 0.04]} />
        <meshStandardMaterial color="#2563eb" transparent opacity={0.1} wireframe />
      </mesh>
    </group>
  );
}

// ─── Floor with drag-to-fill ──────────────────────────────────────────────────

type DragRow = { positions: { x: number; z: number }[]; rotation: number };

function computeRow(
  start: [number, number],
  end: [number, number],
  standWidth: number,
): DragRow {
  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const alongX = Math.abs(dx) >= Math.abs(dz);
  const length = alongX ? Math.abs(dx) : Math.abs(dz);
  const count = Math.max(1, Math.round(length / standWidth));
  const rotation = alongX ? 0 : Math.PI / 2;
  const positions: { x: number; z: number }[] = [];

  for (let i = 0; i < count; i++) {
    if (alongX) {
      const sign = dx >= 0 ? 1 : -1;
      positions.push({ x: start[0] + sign * (i * standWidth + standWidth / 2), z: start[1] });
    } else {
      const sign = dz >= 0 ? 1 : -1;
      positions.push({ x: start[0], z: start[1] + sign * (i * standWidth + standWidth / 2) });
    }
  }
  return { positions, rotation };
}

function Floor({
  hall,
  onLineDrop,
  placementMode,
  ghostLevels = 4,
  ghostWidth = 2,
  ghostDepth = 0.5,
}: {
  hall: Hall;
  onLineDrop?: (positions: { x: number; z: number }[], rotation: number) => void;
  placementMode?: boolean;
  ghostLevels?: number;
  ghostWidth?: number;
  ghostDepth?: number;
}) {
  const snap = (v: number) => Math.round(v * 2) / 2;

  // Use refs so values are always fresh inside event handlers
  const dragStartRef = useRef<[number, number] | null>(null);
  const isDraggingRef = useRef(false);
  // Trigger re-renders when drag state changes
  const [dragRow, setDragRow] = useState<DragRow | null>(null);
  const [hoverPos, setHoverPos] = useState<[number, number] | null>(null);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!placementMode) return;
    e.stopPropagation();
    // Capture pointer so moves register even when moving fast
    (e.nativeEvent.target as Element).setPointerCapture(e.nativeEvent.pointerId);
    const pt: [number, number] = [snap(e.point.x), snap(e.point.z)];
    dragStartRef.current = pt;
    isDraggingRef.current = true;
    setDragRow({ positions: [{ x: pt[0], z: pt[1] }], rotation: 0 });
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!placementMode) return;
    e.stopPropagation();
    const pt: [number, number] = [snap(e.point.x), snap(e.point.z)];
    setHoverPos(pt);
    if (isDraggingRef.current && dragStartRef.current) {
      setDragRow(computeRow(dragStartRef.current, pt, ghostWidth));
    }
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!placementMode || !isDraggingRef.current) return;
    e.stopPropagation();
    isDraggingRef.current = false;
    if (dragStartRef.current) {
      const pt: [number, number] = [snap(e.point.x), snap(e.point.z)];
      const row = computeRow(dragStartRef.current, pt, ghostWidth);
      onLineDrop?.(row.positions, row.rotation);
    }
    dragStartRef.current = null;
    setDragRow(null);
  };

  const standH = ghostLevels * 0.45 + 0.05;

  return (
    <>
      <mesh
        position={[0, -0.05, 0]}
        receiveShadow
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { if (!isDraggingRef.current) setHoverPos(null); }}
      >
        <boxGeometry args={[hall.width, 0.1, hall.depth]} />
        <meshStandardMaterial color={placementMode ? "#dedad3" : "#e8e5df"} roughness={0.8} />
      </mesh>

      {/* Ghost stands: dragging row OR single hover */}
      {dragRow
        ? dragRow.positions.map((p, i) => (
            <GhostStand key={i} x={p.x} z={p.z} width={ghostWidth} depth={ghostDepth}
              levels={ghostLevels} rotation={dragRow.rotation} />
          ))
        : hoverPos
        ? <GhostStand x={hoverPos[0]} z={hoverPos[1]} width={ghostWidth} depth={ghostDepth}
            levels={ghostLevels} />
        : null}

      {/* Row count label */}
      {dragRow && dragRow.positions.length > 1 && (() => {
        const mid = dragRow.positions[Math.floor(dragRow.positions.length / 2)];
        return (
          <Text
            position={[mid.x, standH + 0.5, mid.z]}
            fontSize={0.28}
            color="#1e40af"
            anchorX="center"
            anchorY="bottom"
            outlineWidth={0.015}
            outlineColor="#ffffff"
          >
            {`×${dragRow.positions.length} stands`}
          </Text>
        );
      })()}

      {/* Drag line strip on floor */}
      {dragRow && dragRow.positions.length > 1 && (() => {
        const first = dragRow.positions[0];
        const last  = dragRow.positions[dragRow.positions.length - 1];
        const cx = (first.x + last.x) / 2;
        const cz = (first.z + last.z) / 2;
        const totalLen = dragRow.positions.length * ghostWidth;
        const isAlongX = dragRow.rotation === 0;
        return (
          <mesh position={[cx, 0.02, cz]} rotation={[0, dragRow.rotation, 0]}>
            <boxGeometry args={[totalLen, 0.01, ghostDepth + 0.1]} />
            <meshStandardMaterial color="#2563eb" transparent opacity={0.12} />
          </mesh>
        );
      })()}
    </>
  );
}

// ─── Hall walls & ceiling ─────────────────────────────────────────────────────

function HallWalls({ hall }: { hall: Hall }) {
  const { width, depth, height } = hall;
  return (
    <group>
      <mesh position={[0, height + 0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#dbd8d0" roughness={0.85} />
      </mesh>
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, 0.15]} />
        <meshStandardMaterial color="#d8d5ce" roughness={0.85} />
      </mesh>
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, depth]} />
        <meshStandardMaterial color="#d8d5ce" roughness={0.85} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, depth]} />
        <meshStandardMaterial color="#d8d5ce" roughness={0.85} />
      </mesh>
      {[-width / 3, 0, width / 3].map((x, i) => (
        <mesh key={i} position={[x, height - 0.04, 0]}>
          <boxGeometry args={[0.25, 0.04, depth * 0.8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Main editor ─────────────────────────────────────────────────────────────

export default function HallEditor3D({
  hall,
  onShelfToggle,
  onShelfDelete,
  onLineDrop,
  placementMode = false,
  readonly = false,
  ghostLevels = 4,
  ghostWidth = 2,
  ghostDepth = 0.5,
}: Props) {
  const [selected, setSelected] = useState<Shelf | null>(null);

  const handleClick = (shelf: Shelf) => {
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
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-gray-400">
            <div className="flex justify-between"><span>Price</span>
              <span className="text-gray-700 font-semibold">${selected.pricePerDay}/day</span></div>
            <div className="flex justify-between"><span>Size</span>
              <span className="text-gray-700">{selected.width}×{selected.height.toFixed(2)}×{selected.depth}m</span></div>
            <div className="flex justify-between"><span>Position</span>
              <span className="text-gray-700">({selected.positionX}, {selected.positionZ})</span></div>
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
          <span className="text-gray-700 text-xs font-semibold">
            Click &amp; drag to fill a row — or click to place a single stand
          </span>
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
        <Floor
          hall={hall}
          onLineDrop={onLineDrop}
          placementMode={placementMode}
          ghostLevels={ghostLevels}
          ghostWidth={ghostWidth}
          ghostDepth={ghostDepth}
        />

        {hall.shelves.map((shelf) => (
          <StandMesh key={shelf.id} shelf={shelf} onClick={() => handleClick(shelf)} selected={selected?.id === shelf.id} />
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

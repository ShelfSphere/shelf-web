"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import * as THREE from "three";
import type { Hall, Shelf } from "@/types";

interface Props {
  hall: Hall;
  onShelfToggle?: (shelfId: string, isAvailable: boolean) => void;
  onShelfDelete?: (shelfId: string) => void;
  onLineDrop?: (positions: { x: number; z: number }[], rotation: number) => void;
  onPositionUpdate?: (shelfId: string, x: number, z: number) => void;
  placementMode?: boolean;
  readonly?: boolean;
  ghostLevels?: number;
  ghostWidth?: number;
  ghostDepth?: number;
}

interface DragState {
  stand: Shelf;
  startClientX: number;
  startClientY: number;
  clickedObject: THREE.Object3D | null;
  allowDrag: boolean; // only true when stand was already selected on pointer-down
}

interface LevelSelection {
  stand: Shelf;
  levelIndex: number; // 0-based, 0 = bottom
}

// ─── Drag manager: tracks pointer on canvas to move stands ───────────────────

function DragManager({
  dragging,
  onDragMove,
  onDragEnd,
}: {
  dragging: DragState | null;
  onDragMove: (x: number, z: number) => void;
  onDragEnd: (x: number, z: number, didDrag: boolean) => void;
}) {
  const { camera, gl } = useThree();
  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const ray = useRef(new THREE.Raycaster());

  const getPoint = useCallback((e: PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    ray.current.setFromCamera(ndc, camera);
    const pt = new THREE.Vector3();
    ray.current.ray.intersectPlane(floorPlane.current, pt);
    return { x: Math.round(pt.x * 2) / 2, z: Math.round(pt.z * 2) / 2 };
  }, [camera, gl]);

  useEffect(() => {
    if (!dragging) return;
    const canvas = gl.domElement;

    const handleMove = (e: PointerEvent) => {
      const { x, z } = getPoint(e);
      onDragMove(x, z);
    };
    const handleUp = (e: PointerEvent) => {
      const dx = e.clientX - dragging.startClientX;
      const dy = e.clientY - dragging.startClientY;
      const { x, z } = getPoint(e);
      onDragEnd(x, z, Math.sqrt(dx * dx + dy * dy) > 8);
    };

    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerup", handleUp);
    return () => {
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerup", handleUp);
    };
  }, [dragging, getPoint, onDragMove, onDragEnd, gl]);

  return null;
}

// ─── Stand mesh ───────────────────────────────────────────────────────────────

function StandMesh({
  shelf,
  onPointerDown,
  onBoardDoubleClick,
  selected,
  selectedLevelIndex,
  overridePosX,
  overridePosZ,
}: {
  shelf: Shelf;
  onPointerDown: (e: ThreeEvent<PointerEvent>) => void;
  onBoardDoubleClick: (levelIdx: number) => void;
  selected: boolean;
  selectedLevelIndex: number | null;
  overridePosX?: number;
  overridePosZ?: number;
}) {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  const levels = shelf.levels ?? 4;
  const standH = shelf.height;
  const levelH = standH / levels;
  const uprightW = 0.06;
  const boardT = 0.035;

  const posX = overridePosX ?? shelf.positionX;
  const posZ = overridePosZ ?? shelf.positionZ;

  const accentColor = selected ? "#b91c1c" : "#dc2626";

  const boardColor = (i: number) => {
    if (i === selectedLevelIndex) return "#fbbf24"; // selected = amber
    if (i === hoveredLevel) return "#fde68a";       // hovered = light amber
    return "#f5ede0";                               // normal = cream
  };

  return (
    <group
      position={[posX, 0, posZ]}
      rotation={[0, shelf.rotation ?? 0, 0]}
      onPointerDown={onPointerDown}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = selected ? "grab" : "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = "auto"; }}
    >
      {/* Left upright */}
      <mesh position={[-shelf.width / 2 + uprightW / 2, standH / 2, 0]} castShadow>
        <boxGeometry args={[uprightW, standH, shelf.depth]} />
        <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.08} />
      </mesh>
      {/* Right upright */}
      <mesh position={[shelf.width / 2 - uprightW / 2, standH / 2, 0]} castShadow>
        <boxGeometry args={[uprightW, standH, shelf.depth]} />
        <meshStandardMaterial color={accentColor} roughness={0.35} metalness={0.08} />
      </mesh>
      {/* Back panel */}
      <mesh position={[0, standH / 2, -shelf.depth / 2 + 0.015]}>
        <boxGeometry args={[shelf.width - uprightW * 2, standH, 0.025]} />
        <meshStandardMaterial color="#f0e8d8" roughness={0.7} />
      </mesh>

      {/* Shelf boards — double-click to select level */}
      {Array.from({ length: levels + 1 }).map((_, i) => (
        <mesh
          key={i}
          position={[0, i * levelH, 0]}
          castShadow
          receiveShadow
          userData={{ isBoard: true, levelIdx: i }}
          onPointerOver={(e) => { e.stopPropagation(); setHoveredLevel(i); document.body.style.cursor = i < levels ? "zoom-in" : "auto"; }}
          onPointerOut={(e) => { e.stopPropagation(); setHoveredLevel(null); document.body.style.cursor = selected ? "grab" : "pointer"; }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            if (i < levels) onBoardDoubleClick(i);
          }}
        >
          <boxGeometry args={[shelf.width, boardT, shelf.depth]} />
          <meshStandardMaterial color={boardColor(i)} roughness={0.65} />
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

function GhostStand({ x, z, width, depth, levels, rotation = 0 }: {
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

function computeRow(start: [number, number], end: [number, number], standWidth: number): DragRow {
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

function Floor({ hall, onLineDrop, placementMode, ghostLevels = 4, ghostWidth = 2, ghostDepth = 0.5 }: {
  hall: Hall;
  onLineDrop?: (positions: { x: number; z: number }[], rotation: number) => void;
  placementMode?: boolean;
  ghostLevels?: number;
  ghostWidth?: number;
  ghostDepth?: number;
}) {
  const snap = (v: number) => Math.round(v * 2) / 2;
  const dragStartRef = useRef<[number, number] | null>(null);
  const isDraggingRef = useRef(false);
  const [dragRow, setDragRow] = useState<DragRow | null>(null);
  const [hoverPos, setHoverPos] = useState<[number, number] | null>(null);

  const standH = ghostLevels * 0.45 + 0.05;

  return (
    <>
      <mesh
        position={[0, -0.05, 0]}
        receiveShadow
        onPointerDown={(e) => {
          if (!placementMode) return;
          e.stopPropagation();
          (e.nativeEvent.target as Element).setPointerCapture(e.nativeEvent.pointerId);
          isDraggingRef.current = true;
          const pt: [number, number] = [snap(e.point.x), snap(e.point.z)];
          dragStartRef.current = pt;
          setDragRow({ positions: [{ x: pt[0], z: pt[1] }], rotation: 0 });
        }}
        onPointerMove={(e) => {
          if (!placementMode) return;
          e.stopPropagation();
          const pt: [number, number] = [snap(e.point.x), snap(e.point.z)];
          setHoverPos(pt);
          if (isDraggingRef.current && dragStartRef.current)
            setDragRow(computeRow(dragStartRef.current, pt, ghostWidth));
        }}
        onPointerUp={(e) => {
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
        }}
        onPointerLeave={() => { if (!isDraggingRef.current) setHoverPos(null); }}
      >
        <boxGeometry args={[hall.width, 0.1, hall.depth]} />
        <meshStandardMaterial color={placementMode ? "#dedad3" : "#e8e5df"} roughness={0.8} />
      </mesh>

      {dragRow
        ? dragRow.positions.map((p, i) => (
            <GhostStand key={i} x={p.x} z={p.z} width={ghostWidth} depth={ghostDepth}
              levels={ghostLevels} rotation={dragRow.rotation} />
          ))
        : hoverPos
        ? <GhostStand x={hoverPos[0]} z={hoverPos[1]} width={ghostWidth} depth={ghostDepth} levels={ghostLevels} />
        : null}

      {dragRow && dragRow.positions.length > 1 && (() => {
        const mid = dragRow.positions[Math.floor(dragRow.positions.length / 2)];
        return (
          <Text position={[mid.x, standH + 0.5, mid.z]} fontSize={0.28} color="#1e40af"
            anchorX="center" anchorY="bottom" outlineWidth={0.015} outlineColor="#ffffff">
            {`×${dragRow.positions.length} stands`}
          </Text>
        );
      })()}

      {dragRow && dragRow.positions.length > 1 && (() => {
        const first = dragRow.positions[0];
        const last = dragRow.positions[dragRow.positions.length - 1];
        const cx = (first.x + last.x) / 2;
        const cz = (first.z + last.z) / 2;
        return (
          <mesh position={[cx, 0.02, cz]} rotation={[0, dragRow.rotation, 0]}>
            <boxGeometry args={[dragRow.positions.length * ghostWidth, 0.01, ghostDepth + 0.1]} />
            <meshStandardMaterial color="#2563eb" transparent opacity={0.12} />
          </mesh>
        );
      })()}
    </>
  );
}

// ─── Hall walls ───────────────────────────────────────────────────────────────

function HallWalls({ hall }: { hall: Hall }) {
  const { width, depth, height } = hall;
  return (
    <group>
      {/* Ceiling — ghost outline only */}
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.08} roughness={0.85} />
      </mesh>
      {/* Walls — transparent with edge tint */}
      {[{ pos: [0, height / 2, -depth / 2] as [number,number,number], args: [width, height, 0.15] as [number,number,number] },
        { pos: [-width / 2, height / 2, 0] as [number,number,number], args: [0.15, height, depth] as [number,number,number] },
        { pos: [width / 2, height / 2, 0] as [number,number,number], args: [0.15, height, depth] as [number,number,number] }
      ].map(({ pos, args }, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={args} />
          <meshStandardMaterial color="#93c5fd" transparent opacity={0.10} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
      ))}
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
  onPositionUpdate,
  placementMode = false,
  readonly = false,
  ghostLevels = 4,
  ghostWidth = 2,
  ghostDepth = 0.5,
}: Props) {
  const [selectedStand, setSelectedStand] = useState<Shelf | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<LevelSelection | null>(null);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [dragPreview, setDragPreview] = useState<{ x: number; z: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Refs so DragManager callbacks always read the latest values — no stale closures
  const draggingRef = useRef(dragging);
  draggingRef.current = dragging;
  const selectedLevelRef = useRef(selectedLevel);
  selectedLevelRef.current = selectedLevel;
  const selectedStandRef = useRef(selectedStand);
  selectedStandRef.current = selectedStand;
  const onPositionUpdateRef = useRef(onPositionUpdate);
  onPositionUpdateRef.current = onPositionUpdate;
  const onShelfDeleteRef = useRef(onShelfDelete);
  onShelfDeleteRef.current = onShelfDelete;

  useEffect(() => {
    if (placementMode) { setSelectedStand(null); setSelectedLevel(null); }
  }, [placementMode]);

  // Delete key shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedStandRef.current && !placementMode) {
        // Only trigger if not focused on an input
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
        setConfirmDelete(true);
      }
      if (e.key === "Escape") {
        setConfirmDelete(false);
        setSelectedStand(null);
        setSelectedLevel(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [placementMode]);

  const handleStandPointerDown = (e: ThreeEvent<PointerEvent>, stand: Shelf) => {
    if (readonly || placementMode) return;
    e.stopPropagation();
    const alreadySelected = selectedStandRef.current?.id === stand.id;
    setDragging({
      stand,
      startClientX: e.nativeEvent.clientX,
      startClientY: e.nativeEvent.clientY,
      clickedObject: e.object,
      allowDrag: alreadySelected, // drag only works on the second interaction
    });
    if (alreadySelected) document.body.style.cursor = "grabbing";
  };

  const handleBoardDoubleClick = (stand: Shelf, levelIdx: number) => {
    const curLevel = selectedLevelRef.current;
    if (curLevel !== null && curLevel.stand.id === stand.id && curLevel.levelIndex === levelIdx) {
      setSelectedLevel(null);
    } else {
      setSelectedLevel({ stand, levelIndex: levelIdx });
      setSelectedStand(null);
    }
  };

  const handleDragMove = useCallback((x: number, z: number) => {
    if (draggingRef.current?.allowDrag) setDragPreview({ x, z });
  }, []);

  // Empty deps — always reads from refs so it's never stale
  const handleDragEnd = useCallback((x: number, z: number, didDrag: boolean) => {
    const drag = draggingRef.current;
    if (!drag) return;
    document.body.style.cursor = "auto";

    if (didDrag && drag.allowDrag) {
      // Move the stand to the new position
      onPositionUpdateRef.current?.(drag.stand.id, x, z);
    } else {
      // Single click → select / deselect stand
      const curStand = selectedStandRef.current;
      if (curStand?.id === drag.stand.id) {
        setSelectedStand(null);
        setConfirmDelete(false);
      } else {
        setSelectedStand(drag.stand);
        setSelectedLevel(null);
        setConfirmDelete(false);
      }
    }

    setDragging(null);
    setDragPreview(null);
  }, []);

  // Compute level display info — fully guarded
  const levelInfo = (() => {
    if (!selectedLevel || selectedLevel.levelIndex == null || !selectedLevel.stand) return null;
    const { stand, levelIndex } = selectedLevel;
    const levels = stand.levels ?? 4;
    if (levelIndex < 0 || levelIndex >= levels) return null;
    const levelH = stand.height / levels;
    const fromFloor = Math.round(levelIndex * levelH * 100);
    const toFloor = Math.round((levelIndex + 1) * levelH * 100);
    return { stand, levelIndex, levels, fromFloor, toFloor };
  })();

  return (
    <div className="relative w-full h-full">

      {/* ── Stand info panel ────────────────────────────── */}
      {selectedStand && !placementMode && (
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur border border-gray-200 rounded-2xl shadow-xl p-5 w-64 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{selectedStand.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{selectedStand.levels ?? 4} shelf levels</p>
            </div>
            <button onClick={() => setSelectedStand(null)} className="text-gray-300 hover:text-gray-600">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Price</span>
              <span className="text-gray-700 font-semibold">${selectedStand.pricePerDay}/day</span>
            </div>
            <div className="flex justify-between">
              <span>Size</span>
              <span className="text-gray-700">{selectedStand.width}×{selectedStand.height.toFixed(2)}×{selectedStand.depth}m</span>
            </div>
            <div className="flex justify-between">
              <span>Position</span>
              <span className="text-gray-700">X: {selectedStand.positionX}, Z: {selectedStand.positionZ}</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 bg-gray-50 rounded-lg px-2.5 py-1.5 leading-relaxed">
            Click &amp; drag to reposition. Double-click a shelf board to select a level.
            Press <kbd className="font-mono bg-white border border-gray-200 rounded px-1">Del</kbd> to delete.
          </p>

          <button
            onClick={() => { onShelfToggle?.(selectedStand.id, !selectedStand.isAvailable); setSelectedStand(null); }}
            className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors border ${
              selectedStand.isAvailable
                ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                : "bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
            }`}
          >
            {selectedStand.isAvailable ? "Mark as booked" : "Mark as available"}
          </button>

          {onShelfDelete && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-100 transition-colors"
            >
              Delete stand
            </button>
          )}

          {onShelfDelete && confirmDelete && (
            <div className="space-y-2">
              <p className="text-xs text-center text-gray-500">Are you sure?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onShelfDelete(selectedStand.id); setSelectedStand(null); setConfirmDelete(false); }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Level info panel ────────────────────────────── */}
      {levelInfo && !placementMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur border border-amber-200 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-5 min-w-80">
          {/* Level visualiser */}
          <div className="flex flex-col-reverse gap-0.5 flex-shrink-0">
            {Array.from({ length: levelInfo.levels }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-3 rounded-sm border transition-colors ${
                  i === levelInfo.levelIndex
                    ? "bg-amber-400 border-amber-500"
                    : "bg-gray-100 border-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 leading-none">{levelInfo.stand.name}</p>
            <p className="font-bold text-gray-900 text-sm mt-0.5">
              Level {levelInfo.levelIndex + 1}
              <span className="font-normal text-gray-400 ml-1">of {levelInfo.levels}</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{levelInfo.fromFloor}cm – {levelInfo.toFloor}cm from floor</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5 font-medium whitespace-nowrap">
              Per-level pricing soon
            </span>
            <button
              onClick={() => setSelectedLevel(null)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* ── Drag-to-place hint ───────────────────────────── */}
      {placementMode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur border border-gray-200 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-gray-700 text-xs font-semibold">
            Click &amp; drag to fill a row — or click to place a single stand
          </span>
        </div>
      )}

      {/* ── Dragging indicator ───────────────────────────── */}
      {dragging && dragPreview && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-blue-600 text-white rounded-full px-4 py-1.5 text-xs font-semibold shadow-lg pointer-events-none">
          Moving {dragging.stand.name}…
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

        <DragManager dragging={dragging} onDragMove={handleDragMove} onDragEnd={handleDragEnd} />

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
          <StandMesh
            key={shelf.id}
            shelf={shelf}
            onPointerDown={(e) => handleStandPointerDown(e, shelf)}
            selected={selectedStand?.id === shelf.id}
            onBoardDoubleClick={(lvl) => handleBoardDoubleClick(shelf, lvl)}
            selectedLevelIndex={
              selectedLevel != null && selectedLevel.stand != null && selectedLevel.levelIndex != null && selectedLevel.stand.id === shelf.id
                ? selectedLevel.levelIndex
                : null
            }
            overridePosX={dragging?.stand.id === shelf.id ? dragPreview?.x : undefined}
            overridePosZ={dragging?.stand.id === shelf.id ? dragPreview?.z : undefined}
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
          enabled={!dragging && !placementMode}
          enablePan
          enableZoom
          enableRotate
          minDistance={2}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}

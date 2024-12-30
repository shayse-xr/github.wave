import React, { useState, useEffect, useRef } from "react";
import { ControlInput } from "./ControlInput";
import { calculateCellEffects } from "./utils/effects";
import { CONTRIBUTION_LEVELS, DEFAULT_CONFIG } from "./constants";
import type { Cell } from "./types";

const GitHubGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Grid configuration
  const [horizontalSeparation, setHorizontalSeparation] = useState<number>(
    DEFAULT_CONFIG.horizontalSeparation
  );
  const [verticalSeparation, setVerticalSeparation] = useState<number>(
    DEFAULT_CONFIG.verticalSeparation
  );
  const [cellSize, setCellSize] = useState<number>(DEFAULT_CONFIG.cellSize);
  const [rows, setRows] = useState<number>(DEFAULT_CONFIG.rows);
  const [columns, setColumns] = useState<number>(DEFAULT_CONFIG.columns);
  const [effectRadius, setEffectRadius] = useState<number>(
    DEFAULT_CONFIG.effectRadius
  );
  const [force, setForce] = useState<number>(DEFAULT_CONFIG.force);

  const [cells, setCells] = useState<Cell[]>(() =>
    Array.from({ length: rows * columns }).map(() => ({
      level: Math.floor(Math.random() * 5),
      angle: 0,
      scale: 1,
      x: 0,
      y: 0,
    }))
  );

  const handleReset = () => {
    setHorizontalSeparation(DEFAULT_CONFIG.horizontalSeparation);
    setVerticalSeparation(DEFAULT_CONFIG.verticalSeparation);
    setCellSize(DEFAULT_CONFIG.cellSize);
    setRows(DEFAULT_CONFIG.rows);
    setColumns(DEFAULT_CONFIG.columns);
    setEffectRadius(DEFAULT_CONFIG.effectRadius);
    setForce(DEFAULT_CONFIG.force);
    setCells(
      Array.from({ length: DEFAULT_CONFIG.rows * DEFAULT_CONFIG.columns }).map(
        () => ({
          level: Math.floor(Math.random() * 5),
          angle: 0,
          scale: 1,
          x: 0,
          y: 0,
        })
      )
    );
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX =
          "touches" in event ? event.touches[0].clientX : event.clientX;
        const clientY =
          "touches" in event ? event.touches[0].clientY : event.clientY;

        const isInside =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;

        setIsHovering(isInside);

        if (isInside) {
          setMousePosition({
            x: clientX - rect.left,
            y: clientY - rect.top,
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove as EventListener);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove as EventListener);
    };
  }, []);

  useEffect(() => {
    setCells((prevCells) =>
      prevCells.map((cell, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const cellX = col * (cellSize + horizontalSeparation) + cellSize / 2;
        const cellY = row * (cellSize + verticalSeparation) + cellSize / 2;

        const dx = mousePosition.x - cellX;
        const dy = mousePosition.y - cellY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > effectRadius || !isHovering) {
          return { ...cell, angle: 0, scale: 1, x: 0, y: 0 };
        }

        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const { displacement, rotation, scale } = calculateCellEffects(
          distance,
          effectRadius,
          force,
          angle
        );

        const x = (dx / distance) * displacement;
        const y = (dy / distance) * displacement;

        return {
          ...cell,
          x,
          y,
          angle: rotation,
          scale,
        };
      })
    );
  }, [
    mousePosition,
    columns,
    cellSize,
    horizontalSeparation,
    verticalSeparation,
    effectRadius,
    force,
    isHovering,
  ]);

  useEffect(() => {
    setCells(
      Array.from({ length: rows * columns }).map(() => ({
        level: Math.floor(Math.random() * 5),
        angle: 0,
        scale: 1,
        x: 0,
        y: 0,
      }))
    );
  }, [rows, columns]);

  const calculateMaxRows = (cellSize: number, verticalSeparation: number) => {
    const availableHeight = window.innerHeight - 300;
    return Math.floor(availableHeight / (cellSize + verticalSeparation));
  };

  const handleRowsChange = (value: number) => {
    const maxRows = calculateMaxRows(cellSize, verticalSeparation);
    setRows(Math.min(value, maxRows));
  };

  return (
    <div className="w-full h-screen flex flex-col bg-black p-6 justify-center overflow-hidden">
      <h1 className="text-[#ffefe4] text-4xl font-mono text-center mb-16 mt-10">[github.wave]</h1>
      <div className="flex flex-col items-center gap-2 m-4">
        <div className="flex flex-wrap justify-center gap-4">
          <ControlInput
            label="X-Spaceing"
            value={horizontalSeparation}
            onChange={(value) => setHorizontalSeparation(value)}
            min={2}
            max={8}
          />
          <ControlInput
            label="Y-Spaceing"
            value={verticalSeparation}
            onChange={(value) => setVerticalSeparation(value)}
            min={2}
            max={8}
          />
          <ControlInput
            label="Size"
            value={cellSize}
            onChange={(value) => setCellSize(value)}
            min={8}
            max={14}
          />
          <ControlInput
            label="Rows"
            value={rows}
            onChange={handleRowsChange}
            min={7}
            max={calculateMaxRows(cellSize, verticalSeparation)}
          />
          <ControlInput
            label="Cols"
            value={columns}
            onChange={(value) => setColumns(value)}
            min={52}
            max={150}
          />
          <ControlInput
            label="Radius"
            value={effectRadius}
            onChange={(value) => setEffectRadius(value)}
            min={60}
            max={250}
          />
          <ControlInput
            label="Force"
            value={force}
            onChange={(value) => setForce(value)}
            min={0}
            max={40}
          />
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div
          ref={containerRef}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            gap: `${verticalSeparation}px ${horizontalSeparation}px`,
            padding: "20px",
            backgroundColor: "black",
            position: "relative",
            borderRadius: "12px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          onTouchMove={(e) => e.preventDefault()}
        >
          {cells.map((cell, index) => (
            <div
              key={index}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: CONTRIBUTION_LEVELS[cell.level],
                transform: `
                  translate(${cell.x}px, ${cell.y}px)
                  rotate(${cell.angle}deg)
                  scale(${cell.scale})
                `,
                transformOrigin: "center",
                transition: "transform 0.08s ease-in-out",
                borderRadius: "2px",
                willChange: "transform",
                position: "relative",
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="mt-4 max-w-xs mx-auto px-4 py-2 bg-gray-900 text-gray-300 rounded-sm hover:bg-gray-800 transition-colors font-mono text-sm"
      >
        Reset
      </button>

      <div className="text-center text-gray-500 font-mono text-xs border-t-[0.5 border-gray-500 p-4 mt-16">
        Created by <a href="https://shaysegal.co" className="text-grey-900 underline">
          shaysegal.co
        </a>
      </div>
    </div>
  );
};

export default GitHubGrid;

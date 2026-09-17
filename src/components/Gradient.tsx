"use client";

import { useEffect, useRef } from "react";

export default function Gradient({ children }: { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app: unknown = null;
    let initialized = false;

    const initTubes = async () => {
      if (initialized || !canvasRef.current) return;
      if (
        canvasRef.current.clientWidth === 0 ||
        canvasRef.current.clientHeight === 0
      )
        return;

      try {
        const moduleInstance =
          await import("threejs-components/build/cursors/tubes1.min.js");
        const TubesCursor = moduleInstance.default || moduleInstance;
        app = (TubesCursor as /* eslint-disable-line @typescript-eslint/no-explicit-any */ any)(canvasRef.current, {
          tubes: {
            colors: ["#2563eb", "#6366f1", "#8b5cf6"],
            lights: {
              intensity: 200,
              colors: ["#3b82f6", "#6366f1", "#8b5cf6"],
            },
          },
        });
        initialized = true;
      } catch (e: unknown) {
        console.error("Failed to load TubesCursor", e);
      }
    };
    const resizeObserver = new ResizeObserver(() => {
      if (!initialized) {
        initTubes();
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      resizeObserver.disconnect();
      if (app && typeof (app as /* eslint-disable-line @typescript-eslint/no-explicit-any */ any).destroy === "function") {
        (app as /* eslint-disable-line @typescript-eslint/no-explicit-any */ any).destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:flex w-1/2 flex-col items-center justify-center overflow-hidden text-white"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />
      <div className="relative z-10 flex max-w-md flex-col text-center pointer-events-none transition-transform duration-700 hover:scale-105">
        <div className="rounded-3xl p-10 ">{children}</div>
      </div>
    </div>
  );
}

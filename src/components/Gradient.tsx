"use client";

import { useEffect, useRef } from "react";

export default function Gradient({ children }: { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let app: any = null;
    let initialized = false;

    const initTubes = async () => {
      if (initialized || !canvasRef.current) return;
      if (canvasRef.current.clientWidth === 0 || canvasRef.current.clientHeight === 0) return;

      try {
        const module = await import("threejs-components/build/cursors/tubes1.min.js");
        const TubesCursor = module.default || module;
        
        app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
            }
          }
        });
        initialized = true;
      } catch (e) {
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

    const handleClick = () => {
      if (app && app.tubes) {
        const randomColors = (count: number) => 
          new Array(count).fill(0).map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
        
        app.tubes.setColors(randomColors(3));
        app.tubes.setLightsColors(randomColors(4));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleClick);
    }

    return () => {
      resizeObserver.disconnect();
      if (container) {
        container.removeEventListener('click', handleClick);
      }
      if (app && typeof app.destroy === 'function') {
        app.destroy();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative hidden lg:flex w-1/2 flex-col items-center justify-center overflow-hidden text-white cursor-pointer">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />
      <div className="relative z-10 flex max-w-md flex-col text-center pointer-events-none transition-transform duration-700 hover:scale-105">
        <div className="rounded-3xl border border-white/10 backdrop-blur-md p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

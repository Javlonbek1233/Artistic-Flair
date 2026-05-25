import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Vehicle } from "../types";
import { Play, Pause, RefreshCw, Layers, Sliders } from "lucide-react";

interface ThreeCarShowcaseProps {
  selectedVehicle: Vehicle;
  neonPower: number; // 0 to 100 for intensity
  warpFactor: number; // 1 to 5 for speed effect
}

export default function ThreeCarShowcase({
  selectedVehicle,
  neonPower,
  warpFactor,
}: ThreeCarShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(true);
  const [activeThemeColor, setActiveThemeColor] = useState<string>(selectedVehicle.imageColor);

  // Keep references to update three.js objects in real-time
  const carGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const underglowLightRef = useRef<THREE.PointLight | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const wheelGeomsRef = useRef<THREE.Mesh[]>([]);

  // Reset theme color when vehicle changes
  useEffect(() => {
    setActiveThemeColor(selectedVehicle.imageColor);
  }, [selectedVehicle]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050505"); // Deep matte charcoal-black
    scene.fog = new THREE.FogExp2("#050505", 0.08);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 2, 6);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lights
    const ambientLight = new THREE.AmbientLight("#0f172a", 0.95); // Artistic clean ambient light
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 1.5);
    keyLight.position.set(5, 10, 5);
    scene.add(keyLight);

    // Dynamic glowing custom color pointlight under the car
    const underglowLight = new THREE.PointLight(activeThemeColor, 3, 8);
    underglowLight.position.set(0, -0.6, 0);
    scene.add(underglowLight);
    underglowLightRef.current = underglowLight;

    // Subtly colored ambient accents
    const sideLight = new THREE.DirectionalLight(activeThemeColor, 1.2);
    sideLight.position.set(-5, 2, -5);
    scene.add(sideLight);

    // 5. Creating a beautiful futuristic car mesh procedurally
    const carGroup = new THREE.Group();
    scene.add(carGroup);
    carGroupRef.current = carGroup;

    // Car Body Material
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: wireframeMode ? new THREE.Color("#0f172a") : new THREE.Color(activeThemeColor),
      wireframe: wireframeMode,
      roughness: 0.1,
      metalness: 0.9,
      emissive: new THREE.Color(activeThemeColor),
      emissiveIntensity: wireframeMode ? 0.35 : 0.15,
    });
    bodyMaterialRef.current = bodyMaterial;

    // Glowing Chassis Accents
    const neonMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activeThemeColor),
      wireframe: true,
    });

    // Part A: Core sleek cabin structure (Fuselage)
    const cabinGeom = new THREE.BoxGeometry(2.6, 0.4, 1.1);
    const cabinMesh = new THREE.Mesh(cabinGeom, bodyMaterial);
    cabinMesh.position.set(-0.1, 0.1, 0);
    carGroup.add(cabinMesh);

    // Part B: Slanted cockpit bubble
    const cockpitGeom = new THREE.ConeGeometry(0.62, 0.8, 4);
    cockpitGeom.rotateZ(Math.PI / 2);
    cockpitGeom.scale(1, 0.45, 1.1);
    const cockpitMesh = new THREE.Mesh(cockpitGeom, bodyMaterial);
    cockpitMesh.position.set(0.2, 0.36, 0);
    carGroup.add(cockpitMesh);

    // Part C: Front wings / Aero intakes
    const noseGeom = new THREE.BoxGeometry(0.9, 0.22, 1.4);
    const noseMesh = new THREE.Mesh(noseGeom, bodyMaterial);
    noseMesh.position.set(1.4, -0.06, 0);
    carGroup.add(noseMesh);

    // Part D: Neon exhaust thrusters in the back
    const thrusterGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.4, 8);
    thrusterGeom.rotateZ(Math.PI / 2);
    const thrusterMeshL = new THREE.Mesh(thrusterGeom, neonMaterial);
    thrusterMeshL.position.set(-1.4, 0.05, -0.3);
    const thrusterMeshR = new THREE.Mesh(thrusterGeom, neonMaterial);
    thrusterMeshR.position.set(-1.4, 0.05, 0.3);
    carGroup.add(thrusterMeshL);
    carGroup.add(thrusterMeshR);

    // Part E: Interactive Glowing under-rails
    const railGeom = new THREE.BoxGeometry(2.4, 0.06, 0.06);
    const railL = new THREE.Mesh(railGeom, neonMaterial);
    railL.position.set(0, -0.22, 0.58);
    const railR = new THREE.Mesh(railGeom, neonMaterial);
    railR.position.set(0, -0.22, -0.58);
    carGroup.add(railL);
    carGroup.add(railR);

    // Part F: Futuristic hubless rotating cylinders as wheels
    const wheelGeom = new THREE.TorusGeometry(0.38, 0.09, 12, 24);
    const wheelMaterial = new THREE.MeshStandardMaterial({
      color: "#0a0c10",
      wireframe: true,
      roughness: 0.1,
      metalness: 1.0,
      emissive: new THREE.Color(activeThemeColor),
      emissiveIntensity: 0.4
    });

    const wheelPositions = [
      { x: 0.9, y: -0.2, z: 0.65 },  // Front Left
      { x: 0.9, y: -0.2, z: -0.65 }, // Front Right
      { x: -0.9, y: -0.2, z: 0.65 }, // Back Left
      { x: -0.9, y: -0.2, z: -0.65 } // Back Right
    ];

    wheelGeomsRef.current = [];
    wheelPositions.forEach((pos) => {
      const wheelContainer = new THREE.Group();
      wheelContainer.position.set(pos.x, pos.y, pos.z);

      const wMesh = new THREE.Mesh(wheelGeom, wheelMaterial);
      wMesh.rotation.y = Math.PI / 2;
      wheelContainer.add(wMesh);

      // Add spin hubs
      const hubGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.22, 6);
      hubGeom.rotateX(Math.PI / 2);
      const hubMesh = new THREE.Mesh(hubGeom, neonMaterial);
      wheelContainer.add(hubMesh);

      carGroup.add(wheelContainer);
      wheelGeomsRef.current.push(wMesh); // Track to rotate them
    });

    // 6. Flying speed indicator warp particles behind or surrounding the car
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Create trailing tunnel particles
      positions[i * 3] = (Math.random() - 0.5) * 10; // X spread
      positions[i * 3 + 1] = (Math.random() - 0.4) * 4; // Y height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z depth
      speeds[i] = 0.02 + Math.random() * 0.08;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(activeThemeColor),
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 7. Ground grid
    const gridHelper = new THREE.GridHelper(30, 30, activeThemeColor, "#1e1b4b");
    gridHelper.position.y = -0.58;
    scene.add(gridHelper);

    // Resize handling using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const w = entry.contentRect.width || width;
      const h = entry.contentRect.height || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(containerRef.current);

    // Mouse interactive drag control for orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !carGroup) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      
      carGroup.rotation.y += deltaX * 0.01;
      carGroup.rotation.x += deltaY * 0.01;

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const canvasElement = canvasRef.current;
    canvasElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 8. Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Slow dynamic float (levitation wave) effect
      if (carGroup) {
        carGroup.position.y = Math.sin(elapsedTime * 2.0) * 0.08;
        
        if (isRotating && !isDragging) {
          carGroup.rotation.y += 0.006;
          // stabilize pitch gently back to ground base
          carGroup.rotation.x = THREE.MathUtils.lerp(carGroup.rotation.x, 0.08, 0.05);
        }
      }

      // Rotate wheel tires corresponding to the active speed factor
      wheelGeomsRef.current.forEach((wheel) => {
        wheel.rotation.x += 0.04 * warpFactor;
      });

      // Update particle stream
      if (particles) {
        const pPositions = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          pPositions[i * 3] -= speeds[i] * warpFactor; // Stream backward
          if (pPositions[i * 3] < -5) {
            pPositions[i * 3] = 5; // wrap around
            pPositions[i * 3 + 1] = (Math.random() - 0.4) * 4;
            pPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
          }
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      canvasElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      renderer.dispose();
      scene.clear();
    };
  }, [selectedVehicle, isRotating, wireframeMode]);

  // Real-time changes using state updates
  useEffect(() => {
    const colorHex = activeThemeColor;
    const colorObj = new THREE.Color(colorHex);

    // Update underglow light color
    if (underglowLightRef.current) {
      underglowLightRef.current.color = colorObj;
      underglowLightRef.current.intensity = (neonPower / 100) * 4;
    }

    // Update body material glowing color
    if (bodyMaterialRef.current) {
      if (!wireframeMode) {
        bodyMaterialRef.current.color = colorObj;
      }
      bodyMaterialRef.current.emissive = colorObj;
    }

    if (particlesRef.current) {
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      mat.color = colorObj;
    }
  }, [activeThemeColor, neonPower, wireframeMode]);

  return (
    <div className="relative w-full h-[400px] bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Absolute Header Overlay */}
      <div className="absolute top-4 left-6 z-10">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em] bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
          Integrated 3D Holo-Grid
        </span>
        <h3 className="text-xl font-sans font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2 italic">
          {selectedVehicle.name} <span className="text-xs font-mono text-white/40 font-normal tracking-wider">[{selectedVehicle.model}]</span>
        </h3>
      </div>

      {/* Actual WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Control Overlays Bottom */}
      <div className="absolute top-4 right-6 z-10 flex gap-2">
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            wireframeMode
              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
              : "bg-white/5 text-white/50 border-white/5 hover:border-white/20"
          }`}
          title="Toggle wireframe mode"
        >
          <Layers className="w-4 h-4" />
          <span>{wireframeMode ? "Wireframe" : "Solid Alloy"}</span>
        </button>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            isRotating
              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
              : "bg-white/5 text-white/50 border-white/5 hover:border-white/20"
          }`}
          title="Auto Rotation"
        >
          {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRotating ? "Auto Spin" : "Static"}</span>
        </button>
      </div>

      {/* Holo Color Customizer */}
      <div className="absolute bottom-4 left-6 right-6 z-10 flex flex-wrap items-center justify-between gap-3 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-white/50 tracking-wider">Holo Spectrum:</span>
          <div className="flex gap-2.5">
            {["#00f3ff", "#ff00ea", "#ffdd00", "#7000ff", "#00ff66"].map((color) => (
              <button
                key={color}
                onClick={() => setActiveThemeColor(color)}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 transform hover:scale-125 cursor-pointer ${
                  activeThemeColor === color ? "border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "border-white/10 hover:border-white/40"
                }`}
                title={`Spectrum shade ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-white/80">
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">Glow:</span>
            <span className="text-cyan-400 font-bold">{neonPower}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">Warp Speed:</span>
            <span className="text-pink-400 font-bold">{warpFactor}x</span>
          </div>
          <button
            onClick={() => {
              setActiveThemeColor(selectedVehicle.imageColor);
              setWireframeMode(true);
              setIsRotating(true);
            }}
            className="flex items-center gap-1 text-white/40 hover:text-white transition duration-200 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Factory</span>
          </button>
        </div>
      </div>
    </div>
  );
}

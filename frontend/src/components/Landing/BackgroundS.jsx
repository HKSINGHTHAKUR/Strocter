import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Precomputed S-Shape Positions Setup ---
// We map out the "S" using a small number of instances (target ~35).
// The S is built from blocks arrayed in an S curve.
const createSPositions = () => {
    const positions = [];

    // Top curve
    for (let i = 0; i < 8; i++) {
        const angle = Math.PI - (i / 7) * Math.PI; // PI to 0
        positions.push(new THREE.Vector3(Math.cos(angle) * 1.5, 2.5 + Math.sin(angle), 0));
    }

    // Middle diag descent
    for (let i = 1; i < 7; i++) {
        const t = i / 7;
        positions.push(new THREE.Vector3(1.5 - t * 3, 2.5 - t * 5, 0));
    }

    // Bottom curve
    for (let i = 0; i < 8; i++) {
        const angle = Math.PI + (i / 7) * Math.PI; // PI to 2PI
        positions.push(new THREE.Vector3(Math.cos(angle) * 1.5, -2.5 + Math.sin(angle), 0));
    }

    return positions;
};

// --- Single InstancedMesh for performance ---
const InstancedS = () => {
    const meshRef = useRef(null);

    // Precompute layout data
    const { positions, baseMatrices, targetMatrices, count } = useMemo(() => {
        const pos = createSPositions();
        const count = pos.length; // roughly 22 instances in this simple setup
        const baseMat = new Array(count);
        const targetMat = new Array(count);

        const dummy = new THREE.Object3D();

        for (let i = 0; i < count; i++) {
            // Base assembled state
            dummy.position.copy(pos[i]);
            // Slight inward facing rotation for an engineered look
            dummy.rotation.set(0, pos[i].x * 0.1, 0);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            baseMat[i] = dummy.matrix.clone();

            // Target fragmented state (falling, scattering gently)
            dummy.position.set(
                pos[i].x * (1 + Math.random() * 2),
                pos[i].y - 5 - Math.random() * 5, // drop down
                pos[i].z + (Math.random() - 0.5) * 4 // slight depth variation
            );
            dummy.rotation.set(
                Math.random() * Math.PI * 0.5,
                Math.random() * Math.PI * 0.5,
                0
            );
            dummy.updateMatrix();
            targetMat[i] = dummy.matrix.clone();
        }

        return { positions: pos, count, baseMatrices: baseMat, targetMatrices: targetMat };
    }, []);

    // Set initial base matrices
    useEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < count; i++) {
                meshRef.current.setMatrixAt(i, baseMatrices[i]);
            }
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [count, baseMatrices]);

    // Handle GSAP Breathing + Scrolling combined
    useEffect(() => {
        if (!meshRef.current) return;
        const mesh = meshRef.current;

        // We use a dummy object to interpolate between base and target matrices
        const dummy = new THREE.Object3D();

        // Object to hold scroll progress (0 to 1)
        const scrollState = { progress: 0 };

        // 1. The main GSAP scroll trigger timeline
        const st = ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1, // smooth scrub
            onUpdate: (self) => {
                // Only trigger update if the values actually changed
                // We use Math.pow to create an exponential delay (starts stable, fractures later)
                const rawProgress = self.progress;

                let visualProgress = 0;
                if (rawProgress > 0.1) {
                    // map 0.1 -> 1.0 to 0.0 -> 1.0
                    visualProgress = (rawProgress - 0.1) / 0.9;
                    // ease in the fracture
                    visualProgress = Math.pow(visualProgress, 2);
                }

                scrollState.progress = visualProgress;

                // Manual interpolation loop per instance
                for (let i = 0; i < count; i++) {

                    // Determine the final matrix for this frame:
                    // Decompose Base and Target
                    const basePos = new THREE.Vector3().setFromMatrixPosition(baseMatrices[i]);
                    const baseQuat = new THREE.Quaternion().setFromRotationMatrix(baseMatrices[i]);
                    const baseScale = new THREE.Vector3().setFromMatrixScale(baseMatrices[i]);

                    const targetPos = new THREE.Vector3().setFromMatrixPosition(targetMatrices[i]);
                    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetMatrices[i]);
                    const targetScale = new THREE.Vector3().setFromMatrixScale(targetMatrices[i]);

                    // Interpolate
                    dummy.position.lerpVectors(basePos, targetPos, visualProgress);
                    dummy.quaternion.slerpQuaternions(baseQuat, targetQuat, visualProgress);
                    dummy.scale.lerpVectors(baseScale, targetScale, visualProgress);

                    // Optional: Add breathing scale IF near top (progress == 0)
                    // To keep it simple, we just apply a global scale on the entire mesh container via GSAP later,
                    // OR we do a micro scale here if we want per-block breathing.

                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                }
                mesh.instanceMatrix.needsUpdate = true;
            }
        });

        // 2. The breathing animation on the entire mesh group
        // This runs completely independently of the per-instance scroll splitting, 
        // keeping it ultra cheap.
        const breathTw = gsap.to(mesh.scale, {
            x: 1.03,
            y: 1.03,
            z: 1.03,
            duration: 5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            paused: false
        });

        // Pause breathing if scrolled too far down to save cycles
        ScrollTrigger.create({
            trigger: document.body,
            start: '10% top',
            onEnter: () => breathTw.pause(),
            onLeaveBack: () => breathTw.play()
        });

        return () => {
            st.kill();
            breathTw.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [count, baseMatrices, targetMatrices]);

    // Manual cleanup to prevent GPU leaks
    const { gl, scene } = useThree();
    useEffect(() => {
        return () => {
            scene.traverse((object) => {
                if (object.isMesh) {
                    if (object.geometry) object.geometry.dispose();
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(mat => mat.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                }
            });
            gl.dispose();
        };
    }, [gl, scene]);

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]} castShadow={false} receiveShadow={false}>
            {/* Low Complexity Box Geometry, slightly beveled feel */}
            <boxGeometry args={[0.5, 0.5, 0.3, 1, 1, 1]} />
            {/* Luxury Standard Material */}
            <meshStandardMaterial
                color="#ffffff"
                metalness={0.4}
                roughness={0.45}
                envMapIntensity={0.6}
            />
        </instancedMesh>
    );
};

export default function BackgroundS() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(document.visibilityState === 'visible');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        // CSS-based background enhancements
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#0B0F14] overflow-hidden">

            {/* Soft radial glow behind the S */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />

            {/* Canvas Layer */}
            <Canvas
                frameloop={isVisible ? 'always' : 'demand'}
                camera={{ position: [0, 0, 12], fov: 45 }}
                dpr={Math.min(window.devicePixelRatio, 1.3)} // Optimization: Cap DPR
                gl={{
                    antialias: false,  // Optimization: Disable antialias
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                shadows={false}
                className="w-full h-full"
            >
                <ambientLight intensity={0.2} />
                {/* Soft Key Light */}
                <directionalLight position={[5, 5, 5]} intensity={1.5} color="#FFEDD5" />
                {/* Subtle Rim Light to fake depth without shadows */}
                <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#7C3AED" />

                <InstancedS />
            </Canvas>

            {/* Micro-grain texture overlay for luxury feel */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>
        </div>
    );
}

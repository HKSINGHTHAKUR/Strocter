import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function NeuralMesh() {
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, linePositions } = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const spread = 4;

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }

    // Create connections between nearby points
    const lines: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 0.8) {
          lines.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          lines.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }

    return { positions: pos, linePositions: new Float32Array(lines) };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.05;
      meshRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.05;
      linesRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        <points ref={meshRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#F97316"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePositions.length / 3}
              array={linePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#7C3AED" transparent opacity={0.15} />
        </lineSegments>
      </group>
    </Float>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.008} color="#ffffff" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.3;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.3;
      camera.position.x += (x - camera.position.x) * 0.02;
      camera.position.y += (-y - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera]);

  return null;
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#0B0F14']} />
      <fog attach="fog" args={['#0B0F14', 5, 20]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#F97316" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#7C3AED" />

      <NeuralMesh />
      <ParticleField />
      <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />
      <CameraController />

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

const headlineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.5 }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }
};

function AnimatedHeadline({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      variants={headlineVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {text.split('').map((char, i) => (
        <motion.span key={i} variants={letterVariants} className="inline-block">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* WebGL Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full section-padding text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="label-sm mb-8 text-primary"
        >
          Behavioral Finance AI Platform
        </motion.p>

        <h1 className="heading-xl mb-6 max-w-5xl">
          <AnimatedHeadline text="Behavior Is The" />
          <br />
          <span className="text-gradient-primary">
            <AnimatedHeadline text="New Alpha." />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="body-lg max-w-xl mb-12"
        >
          Decode impulse. Engineer stability. Predict behavioral risk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <button className="group relative px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium tracking-wide text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]">
            <span className="relative z-10">Explore Intelligence</span>
          </button>
          <button className="px-8 py-4 rounded-full border border-border text-foreground font-medium tracking-wide text-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
            View Platform
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="label-sm text-xs">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/50 to-transparent" />
      </motion.div>
    </section>
  );
}

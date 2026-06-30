import { Html, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { memo, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { type FaultId, type ViewMode } from '../data/faults';

interface MachineSceneProps {
  activeFault: FaultId;
  viewMode: ViewMode;
  onSelectFault: (fault: FaultId) => void;
  cameraResetKey: number;
}

interface SceneContentProps extends Omit<MachineSceneProps, 'cameraResetKey'> {}

const hotspotPositions: Record<FaultId, [number, number, number]> = {
  bearings: [0.35, 0.72, 0.03],
  coupling: [-1.56, 0.55, 0],
  electrical: [1.04, 0.92, 0],
  driven: [-3.15, 0.9, 0],
  mounts: [-0.15, 0.08, 0.72],
  inpod: [3.25, 0.82, 1.35],
};

const labels: Record<FaultId, string> = {
  bearings: 'Bearings',
  coupling: 'Coupling',
  electrical: 'Electrical',
  driven: 'Driven Machine',
  mounts: 'Mounts',
  inpod: 'INPOD',
};

const faultColor: Record<FaultId, string> = {
  bearings: '#39d6ff',
  coupling: '#ffb23f',
  electrical: '#57ff9b',
  driven: '#8da2ff',
  mounts: '#ff6b6b',
  inpod: '#f8e36b',
};

function cylinderMaterial(viewMode: ViewMode, active: boolean, color: string) {
  const xray = viewMode === 'xray';
  const fault = viewMode === 'fault' && active;

  return {
    color: fault ? faultColor.electrical : color,
    metalness: xray ? 0.2 : 0.72,
    roughness: xray ? 0.24 : 0.36,
    transparent: xray,
    opacity: xray ? 0.26 : 1,
    emissive: fault ? faultColor.electrical : '#000000',
    emissiveIntensity: fault ? 0.36 : 0,
  };
}

function stop(event: ThreeEvent<MouseEvent>) {
  event.stopPropagation();
}

function Hotspot({
  id,
  active,
  onSelect,
}: {
  id: FaultId;
  active: boolean;
  onSelect: (id: FaultId) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 3.4) * 0.16;
    ref.current.scale.setScalar(active ? pulse * 1.26 : pulse);
  });

  return (
    <group position={hotspotPositions[id]}>
      <mesh
        ref={ref}
        onClick={(event) => {
          stop(event);
          onSelect(id);
        }}
      >
        <sphereGeometry args={[0.085, 32, 32]} />
        <meshStandardMaterial
          color={faultColor[id]}
          emissive={faultColor[id]}
          emissiveIntensity={active ? 2.2 : 1.25}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial color={faultColor[id]} transparent opacity={active ? 0.18 : 0.08} />
      </mesh>
      <Html center distanceFactor={7.5} position={[0, 0.28, 0]}>
        <button
          className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-normal backdrop-blur-md transition ${
            active
              ? 'border-white/40 bg-white/18 text-white'
              : 'border-white/15 bg-black/45 text-slate-200 hover:border-white/30'
          }`}
          type="button"
          onClick={() => onSelect(id)}
        >
          {labels[id]}
        </button>
      </Html>
    </group>
  );
}

function SignalLine({
  from,
  active,
  color,
  viewMode,
}: {
  from: [number, number, number];
  active: boolean;
  color: string;
  viewMode: ViewMode;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...hotspotPositions.inpod);
    const mid = start.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.62, 0.2));
    return new THREE.CatmullRomCurve3([start, mid, end]);
  }, [from]);

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 48, 0.012, 8, false), [curve]);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const t = (clock.elapsedTime * 0.28) % 1;
    pulseRef.current.position.copy(curve.getPoint(t));
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={active || viewMode === 'xray' ? 0.82 : 0.28}
          toneMapped={false}
        />
      </mesh>
      {(active || viewMode === 'fault') && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.045, 18, 18]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function MachineModel({ activeFault, viewMode, onSelectFault }: SceneContentProps) {
  const xray = viewMode === 'xray';
  const fault = viewMode === 'fault';
  const active = (id: FaultId) => activeFault === id;
  const glowMaterial = {
    transparent: true,
    opacity: xray ? 0.72 : 0.2,
    emissiveIntensity: xray ? 1.3 : 0.4,
    toneMapped: false,
  };

  return (
    <group rotation={[0, -0.24, 0]} position={[0, -0.22, 0]}>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[6.25, 0.22, 1.72]} />
        <meshStandardMaterial color="#252b2d" metalness={0.64} roughness={0.38} />
      </mesh>

      <group onClick={(event) => stop(event)}>
        <mesh position={[-3.18, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.68, 0.84, 0.98, 48]} />
          <meshStandardMaterial
            color={active('driven') && fault ? faultColor.driven : '#5f747a'}
            metalness={0.7}
            roughness={0.32}
            emissive={active('driven') ? faultColor.driven : '#000000'}
            emissiveIntensity={active('driven') && fault ? 0.45 : 0}
          />
        </mesh>
        <mesh position={[-3.77, 0.46, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.44, 0.58, 0.42, 44]} />
          <meshStandardMaterial color="#364347" metalness={0.68} roughness={0.34} />
        </mesh>
        <mesh position={[-2.52, 0.52, 0]}>
          <boxGeometry args={[0.36, 0.82, 1.06]} />
          <meshStandardMaterial color="#405158" metalness={0.62} roughness={0.35} />
        </mesh>
      </group>

      <group>
        <mesh position={[0.62, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.72, 0.72, 2.58, 64]} />
          <meshStandardMaterial
            {...cylinderMaterial(viewMode, active('electrical'), '#465058')}
          />
        </mesh>
        <mesh position={[-0.84, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.78, 0.78, 0.28, 64]} />
          <meshStandardMaterial color="#2a3237" metalness={0.74} roughness={0.32} />
        </mesh>
        <mesh position={[2.05, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.78, 0.78, 0.28, 64]} />
          <meshStandardMaterial color="#2a3237" metalness={0.74} roughness={0.32} />
        </mesh>
        <mesh position={[0.62, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 3.7, 40]} />
          <meshStandardMaterial color="#9ca7aa" metalness={0.9} roughness={0.22} />
        </mesh>
        <mesh position={[0.66, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.42, 0.035, 16, 80]} />
          <meshStandardMaterial
            color={active('bearings') && fault ? faultColor.bearings : '#76b3c3'}
            emissive={faultColor.bearings}
            emissiveIntensity={active('bearings') || xray ? 0.72 : 0.12}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[1.72, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.42, 0.035, 16, 80]} />
          <meshStandardMaterial
            color={active('bearings') && fault ? faultColor.bearings : '#76b3c3'}
            emissive={faultColor.bearings}
            emissiveIntensity={active('bearings') || xray ? 0.72 : 0.12}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.7, 0.66, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.56, 0.018, 12, 80]} />
          <meshStandardMaterial
            color="#41d8ff"
            emissive="#41d8ff"
            {...glowMaterial}
          />
        </mesh>
      </group>

      <mesh position={[-1.58, 0.64, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.34, 0.46, 48]} />
        <meshStandardMaterial
          color={active('coupling') && fault ? faultColor.coupling : '#dd8f34'}
          metalness={0.72}
          roughness={0.26}
          emissive={faultColor.coupling}
          emissiveIntensity={active('coupling') || xray ? 0.55 : 0.08}
          toneMapped={false}
        />
      </mesh>

      {[-2.95, -0.45, 1.65].map((x) => (
        <mesh key={x} position={[x, 0.16, -0.48]}>
          <boxGeometry args={[0.72, 0.28, 0.28]} />
          <meshStandardMaterial
            color={active('mounts') && fault ? faultColor.mounts : '#30383a'}
            metalness={0.64}
            roughness={0.38}
            emissive={active('mounts') ? faultColor.mounts : '#000000'}
            emissiveIntensity={active('mounts') && fault ? 0.42 : 0}
          />
        </mesh>
      ))}
      {[-2.95, -0.45, 1.65].map((x) => (
        <mesh key={`${x}-front`} position={[x, 0.16, 0.48]}>
          <boxGeometry args={[0.72, 0.28, 0.28]} />
          <meshStandardMaterial color="#30383a" metalness={0.64} roughness={0.38} />
        </mesh>
      ))}

      <group position={[3.25, 0.5, 1.35]} rotation={[0, -0.34, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.8, 0.18]} />
          <meshStandardMaterial
            color={active('inpod') && fault ? '#6d6440' : '#171f24'}
            metalness={0.58}
            roughness={0.3}
            emissive={active('inpod') ? faultColor.inpod : '#000000'}
            emissiveIntensity={active('inpod') && fault ? 0.32 : 0}
          />
        </mesh>
        <mesh position={[0, 0.12, -0.095]}>
          <boxGeometry args={[0.34, 0.2, 0.012]} />
          <meshBasicMaterial color="#59e8ff" transparent opacity={0.78} toneMapped={false} />
        </mesh>
        <mesh position={[-0.15, -0.2, -0.1]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#57ff9b" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.2, -0.1]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#ffb23f" toneMapped={false} />
        </mesh>
        <mesh position={[0.15, -0.2, -0.1]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#41d8ff" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.58, 0]}>
          <boxGeometry args={[0.36, 0.32, 0.16]} />
          <meshStandardMaterial color="#20282d" metalness={0.52} roughness={0.34} />
        </mesh>
      </group>

      {(Object.keys(hotspotPositions) as FaultId[]).map((id) => (
        <Hotspot key={id} id={id} active={activeFault === id} onSelect={onSelectFault} />
      ))}

      {(['bearings', 'coupling', 'electrical', 'driven', 'mounts'] as FaultId[]).map((id) => (
        <SignalLine
          key={id}
          from={hotspotPositions[id]}
          color={faultColor[id]}
          active={activeFault === id}
          viewMode={viewMode}
        />
      ))}
    </group>
  );
}

function SceneContent(props: SceneContentProps) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 4, 3]} intensity={2.3} color="#f4fbff" />
      <pointLight position={[-3, 2.5, 2.5]} intensity={1.4} color="#41d8ff" />
      <pointLight position={[3.5, 1.4, 2.2]} intensity={1.1} color="#ffb23f" />
      <fog attach="fog" args={[props.viewMode === 'xray' ? '#05090c' : '#090d10', 7.5, 13]} />
      <MachineModel {...props} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
        <planeGeometry args={[8.5, 4]} />
        <meshStandardMaterial color="#111719" metalness={0.18} roughness={0.7} />
      </mesh>
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        autoRotate
        autoRotateSpeed={0.42}
        minDistance={4.3}
        maxDistance={8.5}
        target={[0, 0.55, 0]}
      />
    </>
  );
}

function MachineScene({ cameraResetKey, ...props }: MachineSceneProps) {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera
        key={cameraResetKey}
        makeDefault
        position={[4.2, 2.25, 4.15]}
        fov={43}
      />
      <SceneContent {...props} />
    </Canvas>
  );
}

export default memo(MachineScene);

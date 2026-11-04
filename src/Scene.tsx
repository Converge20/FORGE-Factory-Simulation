import { Component, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createFactory } from "./factory";
import { createDemonstration } from "./machinery";
import { makeLabel } from "./product";
import { chapters, eased } from "./story";
import { departureState } from "./truckMotion";
import ExplorerWorld from "./ExplorerWorld";
import { pointOnFlow } from "./process";
import { advanceFlow } from "./productionMotion";
import type { FlowClock } from "./productionMotion";

interface Props {
  index: number;
  revision: number;
  reduced: boolean;
  paused: boolean;
  onReady: () => void;
  onFinale: () => void;
  onClosing: () => void;
  mode: "welcome" | "guided" | "explorer";
  selected: number | null;
  reset: number;
  onSelect: (index: number) => void;
}
function World({
  index,
  revision,
  reduced,
  paused,
  onReady,
  onFinale,
  onClosing,
  flowClock,
}: Props & { flowClock: FlowClock }) {
  const { camera, gl, scene, size, invalidate } = useThree();
  const factory = useMemo(createFactory, []);
  const texture = useMemo(makeLabel, []);
  const demo = useMemo(
    () => createDemonstration(index, texture),
    [index, texture],
  );
  const conveyor = useRef<T.InstancedMesh>(null);
  const keyLight = useRef<T.DirectionalLight>(null);
  const keyTarget = useMemo(() => new T.Object3D(), []);
  const matrix = useMemo(() => new T.Matrix4(), []);
  const elapsed = useRef(0),
    transition = useRef(0),
    finaleDone = useRef(false),
    closingDone = useRef(false);
  const look = useRef(new T.Vector3(0, 1, 0));
  const from = useRef(new T.Vector3()),
    fromLook = useRef(new T.Vector3());
  const eye = useRef(new T.Vector3()),
    aim = useRef(new T.Vector3());
  useEffect(() => {
    const env = new RoomEnvironment();
    const pmrem = new T.PMREMGenerator(gl);
    const result = pmrem.fromScene(env, 0.04);
    scene.environment = result.texture;
    scene.environmentIntensity = 0.8;
    env.dispose();
    onReady();
    return () => {
      result.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [gl, scene, onReady]);
  useEffect(() => () => factory.dispose(), [factory]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => () => demo.dispose(), [demo]);
  useEffect(() => {
    from.current.copy(camera.position);
    fromLook.current.copy(look.current);
    const c = chapters[index];
    eye.current.fromArray(c.eye);
    aim.current.fromArray(c.look);
    if (size.width / size.height < 0.8) {
      eye.current
        .sub(aim.current)
        .multiplyScalar(index === 0 ? 1.45 : 1.55)
        .add(aim.current);
      aim.current.x = 0;
    }
    transition.current = 0;
    elapsed.current = 0;
    finaleDone.current = false;
    closingDone.current = false;
    invalidate();
  }, [index, revision, size.width, size.height, camera, invalidate]);
  useEffect(() => {
    invalidate();
  }, [paused, reduced, invalidate]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 1);
    transition.current = reduced
      ? 1
      : Math.min(1, transition.current + delta / 1.2);
    if (!paused && !reduced) elapsed.current += dt;
    const t = elapsed.current;
    if (keyLight.current) {
      if (index === 13) {
        const pose = departureState(t, reduced);
        keyLight.current.position.set(pose.x + 4, 12, pose.z + 7);
        keyTarget.position.set(pose.x, 0, pose.z);
      } else {
        keyLight.current.position.set(4, 12, 7);
        keyTarget.position.set(0, 0, 0);
      }
    }
    const flowTime = advanceFlow(flowClock, delta, paused, reduced);
    demo.update(index === 13 ? t : flowTime, reduced);
    gl.domElement.dataset.flowTime = String(flowTime);
    gl.domElement.dataset.processState = JSON.stringify(demo.root.userData);
    if (index === 13) {
      const state = departureState(t, reduced);
      gl.domElement.dataset.departure = JSON.stringify(state);
      if (state.closing && !closingDone.current) {
        closingDone.current = true;
        onClosing();
      }
      if (state.finished && !finaleDone.current) {
        finaleDone.current = true;
        onFinale();
      }
    }
    // Existing Phase 1 factory retained for the connected opening, including its own conveyance context.
    factory.rotor.rotation.y = -t * 0.22;
    if (index === 0 && conveyor.current) {
      for (let i = 0; i < 72; i++) {
        matrix.makeTranslation(...pointOnFlow(i / 72 + t * 0.013));
        conveyor.current.setMatrixAt(i, matrix);
      }
      conveyor.current.instanceMatrix.needsUpdate = true;
    }
    const k = reduced ? 1 : eased(transition.current);
    camera.position.lerpVectors(from.current, eye.current, k);
    look.current.lerpVectors(fromLook.current, aim.current, k);
    if (index === 13 && transition.current >= 1) {
      const p = departureState(t, reduced);
      const dockEye = new T.Vector3(17, 8, 20),
        dockAim = new T.Vector3(-2, 1.8, 0);
      camera.position.lerp(dockEye, p.dock);
      look.current.lerp(dockAim, p.dock);
      const followEye = new T.Vector3(p.x - 18, 8, p.z + 16),
        followAim = new T.Vector3(p.x - 2, 1.6, p.z);
      if (size.width / size.height < 0.8)
        followEye.sub(followAim).multiplyScalar(2.1).add(followAim);
      camera.position.lerp(followEye, p.follow);
      look.current.lerp(followAim, p.follow);
    }
    camera.lookAt(look.current);
    camera.updateProjectionMatrix();
    gl.render(scene, camera);
    gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
    gl.domElement.dataset.triangles = String(gl.info.render.triangles);
    gl.domElement.dataset.textures = String(gl.info.memory.textures);
    gl.domElement.dataset.chapter = String(index + 1);
    gl.domElement.dataset.mode = "guided";
    gl.domElement.dataset.target = JSON.stringify(look.current.toArray());
    gl.domElement.dataset.selected = "none";
    gl.domElement.dataset.camera = JSON.stringify(camera.position.toArray());
    if (
      (!paused &&
        !reduced &&
        !(index === 13 && departureState(t, reduced).finished)) ||
      transition.current < 1
    )
      invalidate();
  }, 1);
  return (
    <>
      <color attach="background" args={["#080f18"]} />
      <fog
        attach="fog"
        args={[
          "#080f18",
          index === 13 && size.width / size.height < 0.8 ? 40 : 24,
          index === 0 ? 100 : index === 13 ? 150 : 55,
        ]}
      />
      <hemisphereLight args={["#b6d8f2", "#14202b", 0.45]} />
      <primitive object={keyTarget} />
      <directionalLight
        ref={keyLight}
        target={keyTarget}
        position={[4, 12, 7]}
        color="#dcecff"
        intensity={3.2}
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-17}
        shadow-camera-right={17}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-normalBias={0.035}
        shadow-bias={-0.0003}
      />
      <directionalLight position={[-6, 6, -4]} color="#dca267" intensity={3} />
      <pointLight
        position={[-3, 4, 3]}
        color="#67a7de"
        intensity={14}
        distance={18}
      />
      <group visible={index === 0}>
        <primitive object={factory.root} />
        <instancedMesh
          ref={conveyor}
          args={[undefined, undefined, 72]}
          castShadow
        >
          <cylinderGeometry args={[0.105, 0.108, 0.37, 12]} />
          <meshStandardMaterial
            color="#c6d6e0"
            metalness={0.93}
            roughness={0.25}
          />
        </instancedMesh>
      </group>
      <group visible={index !== 0}>
        <primitive object={demo.root} />
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, index === 0 ? -0.92 : -0.035, 0]}
        receiveShadow
      >
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial
          color="#0d1822"
          metalness={0.55}
          roughness={0.31}
        />
      </mesh>
      {index !== 0 && index !== 13 && (
        <>
          <mesh position={[0, -0.17, 0]} receiveShadow>
            <cylinderGeometry args={[4.6, 4.65, 0.25, 96]} />
            <meshStandardMaterial
              color="#15212b"
              metalness={0.65}
              roughness={0.4}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
            <ringGeometry args={[4.57, 4.59, 96]} />
            <meshStandardMaterial
              color="#9a7960"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </>
      )}
      {index !== 13 &&
        [-12, 12].map((x) => (
          <group key={x}>
            <mesh position={[x, 5, -9]}>
              <boxGeometry args={[0.12, 10, 0.2]} />
              <meshStandardMaterial color="#1a2835" metalness={0.6} />
            </mesh>
            <mesh position={[x, 5.4, -8.85]}>
              <boxGeometry args={[0.025, 7, 0.03]} />
              <meshStandardMaterial
                color="#6b9fbb"
                emissive="#6b9fbb"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        ))}
      {index !== 13 && (
        <mesh position={[0, 7, -11]}>
          <boxGeometry args={[28, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#9eb7bf"
            emissive="#6f9daa"
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </>
  );
}
class Boundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function Scene(props: Props) {
  const flowClock = useRef<FlowClock>({ time: 0 });
  const [webgl, setWebgl] = useState(() => {
    try {
      return !!document.createElement("canvas").getContext("webgl2");
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (!webgl) {
      props.onReady();
      if (props.mode === "guided" && props.index === 13) {
        props.onClosing();
        props.onFinale();
      }
    }
  }, [
    webgl,
    props.onReady,
    props.mode,
    props.index,
    props.onClosing,
    props.onFinale,
  ]);
  const fallback = (
    <div className="webgl-fallback">
      <span>3D VIEW UNAVAILABLE</span>
      <h2>This journey needs WebGL.</h2>
      <p>
        Enable hardware acceleration to see the machinery. Chapter text and
        sources remain available. In Explorer, use Find a process to inspect a
        station.
      </p>
    </div>
  );
  return (
    <Boundary
      fallback={fallback}
      onError={() => {
        setWebgl(false);
        props.onReady();
      }}
    >
      {webgl ? (
        <Canvas
          frameloop="demand"
          shadows
          dpr={[1, 1.4]}
          camera={{ position: [27, 19, 28], fov: 38, near: 0.15, far: 350 }}
          gl={{ antialias: true, powerPreference: "default" }}
          onCreated={({ gl }) => {
            gl.toneMapping = T.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1;
            gl.domElement.setAttribute(
              "aria-label",
              "FORGE 3D factory. Guided uses an automatic camera. Explorer supports orbit, zoom and pan.",
            );
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setWebgl(false);
            });
          }}
        >
          {props.mode === "guided" ? (
            <World {...props} flowClock={flowClock.current} />
          ) : (
            <ExplorerWorld {...props} flowClock={flowClock.current} />
          )}
        </Canvas>
      ) : (
        fallback
      )}
    </Boundary>
  );
}

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as T from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createFacility } from "./facilityModel";
import { createDemonstration } from "./machinery";
import { makeLabel } from "./product";
import { advanceFlow } from "./productionMotion";
import type { FlowClock } from "./productionMotion";
import {
  explorerStations,
  overview,
  canRoute,
  packRoute,
  routePoint,
} from "./facility";

export interface ExplorerProps {
  flowClock: FlowClock;
  mode: "welcome" | "guided" | "explorer";
  selected: number | null;
  reset: number;
  reduced: boolean;
  paused: boolean;
  onReady: () => void;
  onSelect: (index: number) => void;
}
export default function ExplorerWorld({
  mode,
  selected,
  reset,
  reduced,
  paused,
  onReady,
  onSelect,
  flowClock,
}: ExplorerProps) {
  const { camera, gl, scene, size, invalidate } = useThree();
  const label = useMemo(makeLabel, []);
  const facility = useMemo(() => createFacility(label), [label]);
  const active = useMemo(() => {
    if (mode !== "explorer" || selected === null) return null;
    const d = createDemonstration(selected, label);
    if (selected === 13) {
      const env = d.root.getObjectByName("Illustrative dock and access road");
      if (env) env.visible = false;
    }
    return d;
  }, [mode, selected, label]);
  const controls = useMemo(
    () => new OrbitControls(camera, gl.domElement),
    [camera, gl],
  );
  const flying = useRef(true),
    elapsed = useRef(0),
    from = useRef(new T.Vector3()),
    fromTarget = useRef(new T.Vector3()),
    eye = useRef(new T.Vector3()),
    aim = useRef(new T.Vector3()),
    flight = useRef(0);
  const markers = useRef<(HTMLButtonElement | null)[]>([]);
  const projected = useMemo(() => new T.Vector3(), []);
  const cans = useRef<T.InstancedMesh>(null),
    packs = useRef<T.InstancedMesh>(null);
  const matrix = useMemo(() => new T.Matrix4(), []);
  useEffect(() => {
    controls.connect(gl.domElement);
    const env = new RoomEnvironment();
    const pmrem = new T.PMREMGenerator(gl);
    const texture = pmrem.fromScene(env, 0.04);
    scene.environment = texture.texture;
    scene.environmentIntensity = 0.75;
    env.dispose();
    controls.enableDamping = !reduced;
    controls.dampingFactor = 0.09;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.65;
    controls.panSpeed = 0.65;
    controls.minDistance = 7;
    controls.maxDistance = size.width / size.height < 0.8 ? 190 : 95;
    controls.minPolarAngle = 0.12;
    controls.maxPolarAngle = 1.46;
    controls.screenSpacePanning = false;
    controls.listenToKeyEvents(gl.domElement);
    gl.domElement.tabIndex = 0;
    const stop = () => {
      flying.current = false;
      invalidate();
    };
    const change = () => invalidate();
    controls.addEventListener("start", stop);
    controls.addEventListener("change", change);
    onReady();
    return () => {
      controls.removeEventListener("start", stop);
      controls.removeEventListener("change", change);
      controls.dispose();
      texture.dispose();
      pmrem.dispose();
      scene.environment = null;
    };
  }, [controls, gl, scene, onReady, reduced, invalidate]);
  useEffect(() => {
    controls.enabled = mode === "explorer";
    markers.current = explorerStations.map((s) =>
      document.querySelector<HTMLButtonElement>(
        `[data-station="${s.chapter}"]`,
      ),
    );
    invalidate();
  }, [controls, mode, invalidate]);
  useEffect(() => () => facility.dispose(), [facility]);
  useEffect(() => () => label.dispose(), [label]);
  useEffect(() => () => active?.dispose(), [active]);
  useEffect(() => {
    elapsed.current = 0;
    flight.current = 0;
    flying.current = true;
    from.current.copy(camera.position);
    fromTarget.current.copy(controls.target);
    const s = explorerStations.find((s) => s.chapter === selected);
    controls.minDistance = selected === 13 ? 14 : selected === null ? 12 : 7;
    controls.maxDistance = size.width / size.height < 0.8 ? 190 : 95;
    if (mode === "explorer" && s) {
      aim.current.fromArray(s.focus);
      eye.current
        .copy(aim.current)
        .add(new T.Vector3(s.radius * 1.9, s.radius * 1.5, s.radius * 2.25));
    } else {
      eye.current.fromArray(overview.eye);
      aim.current.fromArray(overview.target);
    }
    if (size.width / size.height < 0.8)
      eye.current
        .sub(aim.current)
        .multiplyScalar(selected === null ? 2.25 : 1.35)
        .add(aim.current);
    for (const [index, group] of facility.stations)
      group.visible = !(mode === "explorer" && index === selected);
    invalidate();
  }, [
    mode,
    selected,
    reset,
    camera,
    controls,
    facility,
    size.width,
    size.height,
    invalidate,
  ]);
  useEffect(() => invalidate(), [paused, reduced, invalidate]);
  useFrame((_, delta) => {
    if (!paused && !reduced && mode === "explorer")
      elapsed.current += Math.min(delta, 1);
    const t = advanceFlow(
      flowClock,
      delta,
      paused || mode !== "explorer",
      reduced,
    );
    active?.update(t, reduced);
    if (flying.current) {
      flight.current = Math.min(1, flight.current + delta / 1.2);
      const f = reduced
        ? 1
        : flight.current * flight.current * (3 - 2 * flight.current);
      camera.position.lerpVectors(from.current, eye.current, f);
      controls.target.lerpVectors(fromTarget.current, aim.current, f);
      if (f >= 1) flying.current = false;
    }
    controls.target.x = T.MathUtils.clamp(controls.target.x, -26, 35);
    controls.target.z = T.MathUtils.clamp(controls.target.z, -17, 30);
    controls.target.y = T.MathUtils.clamp(controls.target.y, 0.6, 5);
    const changed = controls.update();
    if (cans.current) {
      for (let i = 0; i < 70; i++) {
        const position = routePoint(canRoute, i / 70 + t * 0.008);
        const st = explorerStations.find((s) => s.chapter === selected);
        const detailed =
          st &&
          [1, 2, 8, 9, 10, 11].includes(st.chapter) &&
          Math.abs(position[0] - st.position[0]) < 5 &&
          Math.abs(position[2] - st.position[2]) < 1;
        matrix.makeTranslation(...position);
        if (detailed) matrix.scale(new T.Vector3(0, 0, 0));
        cans.current.setMatrixAt(i, matrix);
      }
      cans.current.instanceMatrix.needsUpdate = true;
    }
    if (packs.current) {
      for (let i = 0; i < 10; i++) {
        const position = routePoint(packRoute, i / 10 + t * 0.005);
        const st = explorerStations.find((s) => s.chapter === selected);
        const detailed =
          st &&
          [11, 12, 13].includes(st.chapter) &&
          Math.abs(position[0] - st.position[0]) < 5 &&
          Math.abs(position[2] - st.position[2]) < 1;
        matrix.makeTranslation(...position);
        if (detailed) matrix.scale(new T.Vector3(0, 0, 0));
        packs.current.setMatrixAt(i, matrix);
      }
      packs.current.instanceMatrix.needsUpdate = true;
    }
    explorerStations.forEach((s, i) => {
      const el = markers.current[i];
      if (!el) return;
      projected
        .set(s.focus[0], s.chapter === 13 ? 5 : 4.1, s.focus[2])
        .project(camera);
      el.style.left = `${(projected.x * 0.5 + 0.5) * 100}%`;
      el.style.top = `${(-projected.y * 0.5 + 0.5) * 100}%`;
      el.style.visibility =
        mode === "explorer" &&
        Math.abs(projected.x) < 0.95 &&
        Math.abs(projected.y) < 0.9 &&
        projected.z < 1
          ? "visible"
          : "hidden";
    });
    gl.render(scene, camera);
    Object.assign(gl.domElement.dataset, {
      mode,
      flowTime: String(t),
      processState: JSON.stringify(active?.root.userData ?? {}),
      selected: selected === null ? "overview" : String(selected),
      camera: JSON.stringify(
        camera.position.toArray().map((v) => Number(v.toFixed(3))),
      ),
      target: JSON.stringify(
        controls.target.toArray().map((v) => Number(v.toFixed(3))),
      ),
      drawCalls: String(gl.info.render.calls),
      triangles: String(gl.info.render.triangles),
      focusComplete: String(!flying.current),
      stationCount: String(facility.stations.size),
    });
    if (
      (!paused && !reduced && mode === "explorer") ||
      flying.current ||
      changed
    )
      invalidate();
  }, 1);
  const station = explorerStations.find((s) => s.chapter === selected);
  return (
    <>
      <color attach="background" args={["#080f18"]} />
      <fog
        attach="fog"
        args={[
          "#080f18",
          size.width / size.height < 0.8 ? 150 : 70,
          size.width / size.height < 0.8 ? 420 : 200,
        ]}
      />
      <hemisphereLight args={["#b6d8f2", "#18272a", 0.65]} />
      <directionalLight
        position={[5, 30, 18]}
        color="#dcecff"
        intensity={3.3}
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-camera-bottom={-32}
        shadow-normalBias={0.05}
      />
      <directionalLight
        position={[-18, 12, -10]}
        intensity={2.7}
        color="#d9ac7e"
      />
      <primitive object={facility.root} />
      {active && station && (
        <group
          position={station.position}
          rotation={[0, selected === 11 || selected === 12 ? Math.PI : 0, 0]}
        >
          <primitive object={active.root} />
        </group>
      )}
      {mode === "explorer" && station && (
        <mesh
          position={[station.position[0], 0.025, station.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[station.radius, station.radius + 0.045, 64]} />
          <meshBasicMaterial color="#c49b74" transparent opacity={0.75} />
        </mesh>
      )}
      <instancedMesh ref={cans} args={[undefined, undefined, 70]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.86, 16]} />
        <meshStandardMaterial
          color="#c5d3dc"
          metalness={0.9}
          roughness={0.24}
        />
      </instancedMesh>
      <instancedMesh ref={packs} args={[undefined, undefined, 10]} castShadow>
        <boxGeometry args={[1.4, 0.665, 0.9]} />
        <meshStandardMaterial color="#a9926e" roughness={0.85} />
      </instancedMesh>
      {mode === "explorer" &&
        explorerStations.map((s) => (
          <mesh
            key={s.id}
            position={[s.position[0], 2, s.position[2]]}
            onClick={(e) => {
              e.stopPropagation();
              if (e.delta < 5) onSelect(s.chapter);
            }}
            onPointerOver={() => {
              gl.domElement.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              gl.domElement.style.cursor = "grab";
            }}
          >
            <boxGeometry
              args={[s.radius * 1.8, 4.5, s.chapter === 13 ? 5 : 4.6]}
            />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      <mesh
        position={[0, -0.65, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial
          color="#0d1822"
          roughness={0.65}
          metalness={0.25}
        />
      </mesh>
    </>
  );
}

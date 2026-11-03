import { useEffect, useMemo, useRef, useState, Component } from 'react';
import type { ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as T from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createFactory } from './factory';
import { pointOnFlow, stations } from './process';

interface Props { selected: number|null; running: boolean; reduced: boolean; view: number; onSelect:(i:number)=>void; onReady:()=>void; zoom:number; labels:boolean; }
function World({selected,running,reduced,view,onSelect,onReady,zoom,labels}:Props){
 const {camera,gl,scene,size}=useThree();
 const previousZoom=useRef(0);
 const factory=useMemo(createFactory,[]);
 const cans=useRef<T.InstancedMesh>(null);
 const markers=useRef<(HTMLButtonElement|null)[]>([]);
 const controls=useMemo(()=>new OrbitControls(camera,gl.domElement),[camera,gl]);
 const desiredZoom=useRef(30);const transition=useRef(true);const elapsed=useRef(0);const dest=useRef(new T.Vector3(23,20,25));const target=useRef(new T.Vector3(0,0,0));
 const matrix=useMemo(()=>new T.Matrix4(),[]);const v=useMemo(()=>new T.Vector3(),[]);
 useEffect(()=>{
  controls.connect(gl.domElement);controls.enableDamping=!reduced;controls.dampingFactor=.08;controls.minPolarAngle=.2;controls.maxPolarAngle=Math.PI*.46;controls.minZoom=10;controls.maxZoom=95;controls.enablePan=true;
  const stop=()=>{transition.current=false;};controls.addEventListener('start',stop);
  const env=new RoomEnvironment();const pmrem=new T.PMREMGenerator(gl);const tex=pmrem.fromScene(env,.04);scene.environment=tex.texture;env.dispose();onReady();
  return()=>{controls.removeEventListener('start',stop);controls.dispose();tex.dispose();pmrem.dispose();scene.environment=null;};
 },[controls,gl,scene,reduced,onReady]);
 useEffect(()=>()=>factory.dispose(),[factory]);
 useEffect(()=>{desiredZoom.current=Math.min(size.width/35,size.height/23.5)*(selected===null?1:1.65);if(selected===null){dest.current.set(23,20,25);target.current.set(0,1.2,0);}else{dest.current.fromArray(stations[selected].camera);target.current.fromArray(stations[selected].position);}transition.current=true;},[selected,view]);
 useEffect(()=>{if(camera instanceof T.OrthographicCamera){const step=zoom-previousZoom.current;if(step===0)return;transition.current=false;previousZoom.current=zoom;camera.zoom=T.MathUtils.clamp(camera.zoom+step*5,10,95);camera.updateProjectionMatrix();}},[zoom,camera]);
 useEffect(()=>{if(camera instanceof T.OrthographicCamera){camera.zoom=Math.min(size.width/35,size.height/23.5);camera.updateProjectionMatrix();}},[size.width,size.height,camera,view]);
 useEffect(()=>{markers.current=stations.map((_,i)=>document.querySelector<HTMLButtonElement>(`[data-marker="${i}"]`));},[]);
 useFrame((_,delta)=>{
  const dt=Math.min(delta,.05);if(running&&!reduced)elapsed.current+=dt;
  factory.rotor.rotation.y=-elapsed.current*.28;factory.robot.rotation.y=Math.sin(elapsed.current*.6)*.7-.6;
  if(cans.current){for(let i=0;i<100;i++){const p=pointOnFlow(i/100+elapsed.current*.013);matrix.makeTranslation(...p);cans.current.setMatrixAt(i,matrix);}cans.current.instanceMatrix.needsUpdate=true;}
  if(transition.current){const k=reduced?1:1-Math.exp(-dt*3);camera.position.lerp(dest.current,k);controls.target.lerp(target.current,k);if(camera instanceof T.OrthographicCamera){camera.zoom=T.MathUtils.lerp(camera.zoom,desiredZoom.current,k);camera.updateProjectionMatrix();}if(camera.position.distanceTo(dest.current)<.025)transition.current=false;}
  controls.update();
  stations.forEach((s,i)=>{const el=markers.current[i];if(!el)return;v.set(s.position[0],i===2?4.5:3.8,s.position[2]).project(camera);el.style.left=`${(v.x*.5+.5)*100}%`;el.style.top=`${(-v.y*.5+.5)*100}%`;el.style.visibility=labels&&v.z<1?'visible':'hidden';});
 });
 return <>
  <color attach="background" args={['#173338']}/>
  <hemisphereLight args={['#d3e9f1','#3d5148',.7]}/>
  <directionalLight position={[-9,18,9]} intensity={2.8} color="#fff0d6" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-.0007} shadow-normalBias={.035}/>
  <directionalLight position={[10,12,-8]} intensity={1.8} color="#b5e5f4"/>
  <primitive object={factory.root}/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.92,0]} receiveShadow><planeGeometry args={[200,200]}/><meshStandardMaterial color="#081c22" roughness={.9}/></mesh>
  <instancedMesh ref={cans} args={[undefined,undefined,100]} castShadow><cylinderGeometry args={[.105,.108,.37,12]}/><meshStandardMaterial color="#c6dee0" metalness={.9} roughness={.22}/></instancedMesh>
  {stations.map((s,i)=><mesh key={s.id} position={[s.position[0],1.8,s.position[2]]} onClick={e=>{e.stopPropagation();onSelect(i);}} onPointerOver={()=>{gl.domElement.style.cursor='pointer';}} onPointerOut={()=>{gl.domElement.style.cursor='grab';}}><boxGeometry args={[3,4,3]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/></mesh>)}
 </>;
}
class Boundary extends Component<{children:ReactNode;fallback:ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return {error:true};}render(){return this.state.error?this.props.fallback:this.props.children;}}
export default function Scene(props:Props){
 const [webgl,setWebgl]=useState(()=>{try{const c=document.createElement('canvas');return !!c.getContext('webgl2');}catch{return false;}});
 useEffect(()=>{if(!webgl)props.onReady();},[webgl,props.onReady]);
 const fallback=<div className="webgl-fallback" role="status"><span className="fallback-symbol">◇</span><h2>The factory needs WebGL</h2><p>Enable hardware acceleration in your browser to explore in 3D. You can still inspect every production station below.</p><div className="fallback-flow">COIL → FORM → FINISH → FILL → PACK</div></div>;
 return <Boundary fallback={fallback}>{webgl?<Canvas shadows orthographic camera={{position:[23,20,25],zoom:30,near:.1,far:200}} dpr={[1,1.6]} gl={{antialias:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=.95;gl.domElement.setAttribute('aria-label','Interactive 3D beverage factory. Use the station buttons to inspect machinery.');gl.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();setWebgl(false);});}}><World {...props}/></Canvas>:fallback}</Boundary>;
}

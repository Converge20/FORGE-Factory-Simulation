import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { flowPoints } from './process';

// Original procedural models. Geometry is batched by material for low draw-call cost.
export function createFactory(){
 const root=new T.Group();
 const mats:Record<string,T.MeshStandardMaterial>={
  silver:new T.MeshStandardMaterial({color:'#9eafb3',metalness:.88,roughness:.28}),
  light:new T.MeshStandardMaterial({color:'#bcccca',metalness:.5,roughness:.32}),
  dark:new T.MeshStandardMaterial({color:'#263e42',metalness:.68,roughness:.4}),
  black:new T.MeshStandardMaterial({color:'#15272c',metalness:.2,roughness:.68}),
  orange:new T.MeshStandardMaterial({color:'#df682e',metalness:.45,roughness:.3}),
  yellow:new T.MeshStandardMaterial({color:'#e2b84f',metalness:.4,roughness:.4}),
  blue:new T.MeshStandardMaterial({color:'#3d7885',metalness:.55,roughness:.32}),
  floor:new T.MeshStandardMaterial({color:'#82948b',roughness:.86}),
  base:new T.MeshStandardMaterial({color:'#3a5352',metalness:.3,roughness:.6}),
  white:new T.MeshStandardMaterial({color:'#dce0c5',roughness:.7}),
  wood:new T.MeshStandardMaterial({color:'#a07f50',roughness:.85}),
  carton:new T.MeshStandardMaterial({color:'#bda578',roughness:.8}),
  led:new T.MeshStandardMaterial({color:'#a5ffe0',emissive:'#42d9b1',emissiveIntensity:2}),
  screen:new T.MeshStandardMaterial({color:'#163c40',emissive:'#0b6466',emissiveIntensity:.55}),
 };
 const batches:Record<string,T.BufferGeometry[]>={};
 function add(g:T.BufferGeometry,m:string,x=0,y=0,z=0,rx=0,ry=0,rz=0){g.applyMatrix4(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(1,1,1)));(batches[m]??=[]).push(g);}
 function box(x:number,y:number,z:number,w:number,h:number,d:number,m='silver',r=.035){add(r?new RoundedBoxGeometry(w,h,d,1,r):new T.BoxGeometry(w,h,d),m,x,y,z);}
 function cyl(x:number,y:number,z:number,r:number,h:number,m='silver',rx=0,rz=0,r2=r){add(new T.CylinderGeometry(r2,r,h,32,1),m,x,y,z,rx,0,rz);}
 function ring(x:number,y:number,z:number,r:number,t=.04,m='silver',rx=Math.PI/2){add(new T.TorusGeometry(r,t,8,48),m,x,y,z,rx);}
 function pipe(points:number[][],r=.06,m='silver'){const p=points.map(v=>new T.Vector3(...v));add(new T.TubeGeometry(new T.CatmullRomCurve3(p),40,r,8,false),m);}
 function beam(a:number[],b:number[],r=.04,m='silver'){const va=new T.Vector3(...a),vb=new T.Vector3(...b);const g=new T.CylinderGeometry(r,r,va.distanceTo(vb),8);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),vb.clone().sub(va).normalize()));const c=va.add(vb).multiplyScalar(.5);add(g,m,c.x,c.y,c.z);}
 function bolts(x:number,y:number,z:number,w:number,d:number){for(const sx of [-1,1])for(const sz of [-1,1])cyl(x+sx*w/2,y,z+sz*d/2,.045,.04,'dark');}
 function feet(x:number,z:number,w:number,d:number,h=.65){for(const sx of [-1,1])for(const sz of [-1,1]){box(x+sx*w/2,h/2,z+sz*d/2,.1,h,.1,'silver');cyl(x+sx*w/2,.12,z+sz*d/2,.13,.08,'black');}}
 function panel(x:number,z:number){box(x,1.5,z,.58,1,.32,'light');box(x,1.66,z+.175,.41,.32,.025,'screen');for(let i=0;i<3;i++)cyl(x-.15+i*.15,1.35,z+.18,.038,.028,i===2?'orange':'led',Math.PI/2);box(x,.7,z,.09,.7,.09,'silver');}
 function fence(x:number,z:number,w:number,alongZ=false){for(let i=0;i<=w;i+=1){box(x+(alongZ?0:i),1,z+(alongZ?i:0),.07,1.9,.07,'yellow');}for(let h=.3;h<1.9;h+=.16)box(x+(alongZ?0:w/2),h,z+(alongZ?w/2:0),alongZ?.022:w,.022,alongZ?w:.022,'dark',0);for(let i=.15;i<w;i+=.16)box(x+(alongZ?0:i),1,z+(alongZ?i:0),.02,1.6,.02,'dark',0);}
 function pallet(x:number,y:number,z:number,loaded=true){for(let k=0;k<5;k++)box(x-.65+k*.325,y,z, .23,.1,1.1,'wood',0);for(const a of [-.48,0,.48])box(x,y-.12,z+a,1.5,.18,.12,'wood',0);if(loaded)for(let l=0;l<3;l++)for(let a=0;a<2;a++)for(let b=0;b<2;b++){box(x-.36+a*.72,y+.28+l*.43,z-.27+b*.54,.69,.41,.51,'carton',.012);box(x-.36+a*.72,y+.3+l*.43,z-.27+b*.54+.26,.42,.06,.006,'dark',0);}}
 // Cutaway building, raised foundation, expansion joints and painted floor markings.
 box(0,-.48,0,27,.8,16,'base',.18);box(0,-.04,0,26.7,.12,15.7,'floor',.04);
 for(let x=-12;x<=12;x+=3)box(x,.027,0,.018,.008,15.4,'base',0);
 for(let z=-7;z<=7;z+=3)box(0,.028,z,26.4,.008,.018,'base',0);
 box(0,.7,-7.6,26.7,1.4,.18,'light');box(-13.25,.7,-3,.18,1.4,9.3,'light');
 for(let x=-12;x<=12;x+=4){box(x,2.5,-7.58,.18,5,.22,'dark');box(x,4.9,-7.5,.28,.15,.4,'orange');}
 box(0,4.9,-7.6,26.5,.16,.26,'dark');
 for(let x=-12;x<13;x+=.8){box(x,.035,5.8,.42,.015,.07,'yellow',0);box(x,.035,-6.55,.42,.015,.07,'white',0);}
 for(let x=-12;x<13;x+=4){box(x,.04,6.75,1.4,.012,.09,'white',0);box(x+.6,.04,6.75,.6,.012,.09,'white',0);}
 // Stainless conveyor beds, individually modeled rollers, rails, motors and supports.
 for(let i=0;i<flowPoints.length-1;i++){
  const a=flowPoints[i],b=flowPoints[i+1],len=Math.hypot(b[0]-a[0],b[2]-a[2]),vertical=a[0]===b[0],x=(a[0]+b[0])/2,z=(a[2]+b[2])/2;
  box(x,1.08,z,vertical?.7:len,.22,vertical?len:.7,'silver');box(x,1.21,z,vertical?.53:len,.025,vertical?len:.53,'black',0);
  for(const s of [-1,1])box(x+(vertical?s*.38:0),1.52,z+(vertical?0:s*.38),vertical?.04:len,.065,vertical?len:.04,'silver',.01);
  for(let t=.15;t<len;t+=.24)cyl(a[0]+(b[0]-a[0])*t/len,1.23,a[2]+(b[2]-a[2])*t/len,.055,.57,'light',vertical?0:Math.PI/2,vertical?Math.PI/2:0);
  for(let t=.3;t<len;t+=1.5){let xx=a[0]+(b[0]-a[0])*t/len,zz=a[2]+(b[2]-a[2])*t/len;feet(xx,zz,vertical?.5:.05,vertical?.05:.5,1);}
  box(x+(vertical?.6:0),1,z+(vertical?0:.6),.34,.3,.38,'blue');
 }
 // Coil uncoiler and feed sheet.
 box(-11.4,.4,1.1,1.7,.65,2,'dark');cyl(-11.4,1.6,1.1,.91,1.25,'silver',Math.PI/2);
 for(let r=.25;r<.91;r+=.065)ring(-11.4,1.6,1.735,r,.009,'dark',0);
 cyl(-11.4,1.6,1.78,.22,.16,'dark',Math.PI/2);box(-10.2,1.45,1.1,1.7,.035,1.15,'silver',0);
 // Cupping press with open die bed, columns and flywheel.
 box(-8.9,.4,1.1,2.2,.7,2.5,'blue');box(-8.9,3.25,1.1,2.35,.75,2.45,'blue');
 for(const x of [-9.78,-8.02])for(const z of [.2,2]){cyl(x,1.95,z,.13,2.55,'silver');ring(x,2.87,z,.16,.035,'dark');}
 box(-8.9,1.05,1.1,1.7,.23,1.8,'silver');box(-8.9,2.12,1.1,1.65,.3,1.75,'orange');cyl(-8.9,2.7,1.1,.24,.75,'silver');
 for(let i=0;i<3;i++){cyl(-9.45+i*.55,1.25,1.1,.19,.2,'dark');cyl(-9.45+i*.55,1.4,1.1,.14,.12,'silver');}
 cyl(-8.9,3.5,-.3,.6,.3,'dark',Math.PI/2);ring(-8.9,3.5,-.48,.44,.08,'silver',0);bolts(-8.9,3.65,1.1,1.8,1.9);panel(-10.1,2.8);
 // Bodymaker: long horizontal ram, cooling motor and die housing.
 box(-9.4,.65,-2.8,3.65,.9,1.75,'light');feet(-9.4,-2.8,3.2,1.4,.35);
 box(-10.6,1.5,-2.8,1.1,.9,1.5,'blue');cyl(-9.25,1.5,-2.8,.23,2.2,'silver',0,Math.PI/2);
 box(-7.9,1.5,-2.8,.65,1,1.5,'blue');cyl(-7.5,1.5,-2.8,.4,.2,'dark',0,Math.PI/2);cyl(-11.1,1.1,-3.8,.26,.65,'blue',Math.PI/2);
 pipe([[-10.6,1.9,-3.5],[-10.6,2.25,-3.7],[-8,2.25,-3.7],[-8,1.8,-3.5]],.05,'dark');
 // Wash and curing enclosure: service hatches, vents and extraction chimneys.
 box(-5.5,1.5,-2.25,2.6,2.4,2.55,'light');feet(-5.5,-2.25,2.3,2.2,.4);
 for(let i=0;i<3;i++){box(-6.32+i*.83,1.55,-.95,.75,1.7,.06,'silver');box(-6.32+i*.83,1.7,-.9,.53,.65,.035,'screen');box(-6.07+i*.83,1.1,-.84,.035,.3,.05,'dark');}
 for(const x of [-6.2,-4.9]){cyl(x,3,-2.25,.2,.9,'silver');cyl(x,3.48,-2.25,.32,.07,'dark');}
 for(let i=0;i<9;i++)box(-6.5+i*.24,2.75,-2.2,.06,.035,1.55,'dark',0);
 // Compact necking and inspection module on exit.
 box(-4.2,.85,.3,1.25,.65,1.8,'blue');for(const x of [-4.66,-3.74])box(x,1.8,.3,.1,1.6,.1,'silver');box(-4.2,2.65,.3,1.3,.2,1.85,'light');
 for(let i=0;i<5;i++){cyl(-4.2,2.15,-.3+i*.3,.11,.45,'silver');cyl(-4.2,1.9,-.3+i*.3,.16,.1,'dark');}
 box(-4.2,2.3,1.1,.48,.25,.3,'dark');cyl(-4.2,2.13,1.1,.09,.1,'led');panel(-5.35,1.1);
 // Blending vessels: dished shoulders, banding, manways, agitators and valve skid.
 for(let i=0;i<3;i++){
  const x=-2+i*1.85,z=-4.9;
  feet(x,z,1.1,1.1,.8);cyl(x,2.3,z,.72,2.8,'silver');cyl(x,.95,z,.34,.55,'silver',0,0,.72);cyl(x,3.83,z,.72,.32,'silver',0,0,.32);
  for(const y of [1.1,3.55])ring(x,y,z,.73,.045,'light');cyl(x,4.12,z,.15,.45,'blue');cyl(x,4.4,z,.23,.15,'dark');
  cyl(x,2.5,z+.73,.22,.08,'dark',Math.PI/2);cyl(x,2.5,z+.79,.16,.08,'silver',Math.PI/2);
  pipe([[x,.9,z],[x,.5,z+.3],[x,.5,-3.3],[x+.45,.5,-3.3]],.075);ring(x,.55,-3.1,.15,.025,'orange',0);
  pipe([[x,3.8,z],[x,4.2,z-.3],[x,4.2,-6.1],[2.5,4.2,-6.1]],.055);
 }
 pipe([[2.5,4.2,-6.1],[3,4,-5.8],[3,2.8,-2],[1,2.8,-.2]],.09);box(.1,.5,-3.2,3.7,.3,.65,'dark');
 for(let i=0;i<5;i++){cyl(-1.3+i*.65,.9,-3.2,.12,.7,'silver');ring(-1.3+i*.65,1.25,-3.2,.17,.025,'orange');}panel(2.5,-3);
 // Rotary filling carousel with visible valves and cutaway guard posts.
 cyl(.7,.6,1.5,1.65,1,'light');cyl(.7,1.13,1.5,1.84,.16,'silver');cyl(.7,2.95,1.5,1.72,.27,'light');cyl(.7,3.15,1.5,1.6,.12,'silver');cyl(.7,2.1,1.5,.42,1.85,'silver');
 ring(.7,1.2,1.5,1.75,.07,'orange');ring(.7,2.76,1.5,1.68,.045,'silver');
 for(let i=0;i<24;i++){const a=i*Math.PI*2/24,x=.7+Math.cos(a)*1.43,z=1.5+Math.sin(a)*1.43;cyl(x,2.5,z,.065,.6,'silver');cyl(x,2.17,z,.1,.12,'dark');pipe([[x,2.8,z],[x,3.02,z],[.7+Math.cos(a)*.6,3.15,1.5+Math.sin(a)*.6]],.025);}
 for(let i=0;i<8;i++){const a=i*Math.PI/4;box(.7+Math.cos(a)*1.86,2,1.5+Math.sin(a)*1.86,.055,2,.055,'silver');}
 box(.7,3.32,1.5,1.1,.2,.8,'blue');cyl(.7,3.55,1.5,.2,.3,'dark');panel(2.8,3.5);
 // Seamer, can-end magazine and transfer wheel.
 cyl(3.6,.8,1.5,.78,1.35,'light');cyl(3.6,1.6,1.5,.8,.16,'silver');cyl(3.6,2.6,1.5,.75,.3,'blue');
 for(let i=0;i<6;i++){const a=i*Math.PI/3;cyl(3.6+Math.cos(a)*.54,2.15,1.5+Math.sin(a)*.54,.1,.7,'silver');}
 for(let i=0;i<14;i++)cyl(3.6,3+i*.035,1.5,.3,.025,'silver');for(const x of [3.22,3.98])box(x,3.25,1.5,.035,.8,.035,'dark');
 cyl(2.65,1.4,2.1,.45,.12,'orange');
 // Packaging enclosure, film roll and exposed grouping bed.
 box(6.2,1.05,.8,1.8,.45,2.6,'light');feet(6.2,.8,1.5,2.2,.9);box(6.2,2.3,.3,2.1,.5,1.5,'blue');
 for(const x of [5.24,7.16])for(const z of [-.4,1])box(x,1.7,z,.1,1.5,.1,'silver');
 box(6.2,1.73,-.42,1.9,1,.04,'dark');cyl(6.2,2.9,.3,.35,1.5,'white',0,Math.PI/2);cyl(6.2,2.9,.3,.09,1.8,'dark',0,Math.PI/2);
 for(let i=0;i<7;i++)box(5.4+i*.26,2.57,.3,.09,.025,.8,'silver',0);panel(7.6,1.7);
 // Robot cell pedestal. Arm added separately for animation.
 cyl(9,.35,1.6,.8,.6,'dark');cyl(9,.75,1.6,.55,.3,'orange');
 fence(7.9,4.25,4);fence(11.9,.25,4,true);fence(7.9,-.1,1.7);pallet(10.6,.28,2.3);pallet(9.3,.28,-.7,false);
 // Warehouse racks: steel uprights, load beams and loaded pallets.
 for(let bay=0;bay<2;bay++){
  const x=7.4+bay*3;
  for(const xx of [x-1.35,x+1.35])for(const z of [-6.7,-4.5]){box(xx,2.45,z,.13,4.9,.13,'blue');box(xx,.12,z,.35,.12,.35,'silver');}
  for(const y of [.4,2.25,4.1]){for(const z of [-6.7,-4.5])box(x,y,z,2.8,.16,.12,'orange');for(let j=0;j<5;j++)box(x-1.1+j*.55,y,-5.6,.06,.07,2.15,'silver',0);if(y<4.1){pallet(x-.65,y+.16,-5.6);pallet(x+.68,y+.16,-5.6);}}
  beam([x-1.3,.5,-6.7],[x+1.3,4.1,-6.7],.025,'dark');beam([x+1.3,.5,-6.7],[x-1.3,4.1,-6.7],.025,'dark');
 }
 // Outfeed pallet rollers and pallets.
 for(let i=0;i<15;i++)cyl(8+i*.24,.45,-2.3,.085,1.6,'silver',Math.PI/2);box(9.7,.3,-3.18,3.8,.25,.1,'blue');box(9.7,.3,-1.42,3.8,.25,.1,'blue');pallet(10.1,.7,-2.3);
 // Utilities, stair access and cable routes add industrial scale cues.
 for(let x=-11;x<=4;x+=1.8){pipe([[x,.2,-7],[x,.45,-7],[x,.45,-6.8]],.055,'dark');}
 box(-10,.8,-5.7,3.3,1.5,.65,'light');for(let i=0;i<3;i++){box(-11.05+i,1,-5.34,.85,1.13,.035,'silver');box(-10.75+i,1.02,-5.29,.04,.25,.04,'dark');box(-10.88+i,1.37,-5.29,.1,.06,.02,'led');}
 for(let i=0;i<4;i++)box(-1.9,.13+i*.18,-1+i*.23,1.1,.22,.3,'silver');
 // Batch opaque static parts by material; all original geometries disposed after merge.
 for(const [key,geos] of Object.entries(batches)){const merged=mergeGeometries(geos.map(g=>{const b=g.index?g.toNonIndexed():g; b.deleteAttribute('uv');return b;}));if(merged){const mesh=new T.Mesh(merged,mats[key]);mesh.castShadow=key!=='floor';mesh.receiveShadow=true;root.add(mesh);}geos.forEach(g=>g.dispose());}
 const robot=new T.Group();robot.position.set(9,.9,1.6);
 function part(g:T.BufferGeometry,m:string,x:number,y:number,z:number,rx=0,rz=0){const mesh=new T.Mesh(g,mats[m]);mesh.position.set(x,y,z);mesh.rotation.set(rx,0,rz);mesh.castShadow=true;robot.add(mesh);}
 part(new T.CylinderGeometry(.4,.45,.5,32),'orange',0,.25,0);
 part(new RoundedBoxGeometry(.44,1.65,.48,2,.09),'orange',-.4,1.1,0,0,-.45);
 part(new T.CylinderGeometry(.29,.29,.65,24),'dark',-.74,1.8,0,Math.PI/2);
 part(new RoundedBoxGeometry(1.8,.38,.4,2,.07),'orange',.02,2.13,0,0,.22);
 part(new T.CylinderGeometry(.24,.24,.52,24),'silver',.86,2.31,0,Math.PI/2);
 part(new RoundedBoxGeometry(.26,.7,.27,2,.04),'orange',1.02,1.99,0,0,.4);
 part(new T.BoxGeometry(.75,.14,.65),'dark',1.15,1.6,0);
 for(let i=0;i<4;i++)part(new T.CylinderGeometry(.07,.07,.15,12),'black',.9+(i%2)*.5,1.48,Math.floor(i/2)*.44-.22);
 root.add(robot);
 const rotor=new T.Group();rotor.position.set(.7,1.41,1.5);
 for(let i=0;i<24;i++){const a=i*Math.PI/12;const c=new T.Mesh(new T.CylinderGeometry(.115,.115,.44,16),mats.blue);c.position.set(Math.cos(a)*1.43,.1,Math.sin(a)*1.43);c.castShadow=true;rotor.add(c);}
 root.add(rotor);
 return {root,robot,rotor,dispose:()=>{root.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose();});Object.values(mats).forEach(m=>m.dispose());}};
}

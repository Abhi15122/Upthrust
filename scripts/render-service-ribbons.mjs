import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { ribbonConfig } from "../src/components/services/ribbon-config.ts";
const root = fileURLToPath(new URL("../", import.meta.url));
const html = `<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script><script type="module">
import * as THREE from 'three';import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';import {createRibbonGeometry} from '/geometry.mjs';
const config=${JSON.stringify(ribbonConfig)};
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=config.exposure;
const scene=new THREE.Scene();const room=new RoomEnvironment();room.traverse(o=>{if(o.isMesh&&o.material.isMeshStandardMaterial)o.material.color.setScalar(config.roomShade)});const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
const material=new THREE.MeshPhysicalMaterial({...config.material,side:THREE.DoubleSide});const mesh=new THREE.Mesh(createRibbonGeometry(),material);mesh.name='Four service ribbon';scene.add(mesh);
const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(-1,3,4);scene.add(key);const fill=new THREE.DirectionalLight(0xffa276,1.5);fill.position.set(2,-2,3);scene.add(fill);
const camera=new THREE.OrthographicCamera(0,4,0,-.5625,.01,20);camera.position.z=5;
window.generate=async()=>{
 renderer.setSize(2048,288);renderer.render(scene,camera);const wide=renderer.domElement.toDataURL('image/png');
 const mobile=[];for(let i=0;i<4;i++){renderer.setSize(720,720);camera.left=i-.04;camera.right=i+.92;camera.top=.12;camera.bottom=-.84;camera.updateProjectionMatrix();renderer.render(scene,camera);mobile.push(renderer.domElement.toDataURL('image/webp',.9))}
 const glb=await new GLTFExporter().parseAsync(mesh,{binary:true});let binary='';const bytes=new Uint8Array(glb);for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return {glb:btoa(binary),wide,mobile};};window.ready=true;
</script>`;
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://localhost").pathname;
    let body;
    if (path === "/") body = html;
    else if (path === "/geometry.mjs")
      body = await readFile(resolve(root, "scripts/lib/ribbon-geometry.mjs"));
    else if (path.startsWith("/three/") && !path.includes(".."))
      body = await readFile(resolve(root, "node_modules/three", path.slice(7)));
    else {
      res.writeHead(404);
      res.end();
      return;
    }
    res.setHeader(
      "Content-Type",
      path === "/" ? "text/html" : "text/javascript",
    );
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  await page.waitForFunction(() => window.ready);
  const output = await page.evaluate(() => window.generate());
  await mkdir(resolve(root, "public/images/ribbons"), { recursive: true });
  await writeFile(
    resolve(root, "public/models/services-ribbon.glb"),
    Buffer.from(output.glb, "base64"),
  );
  await mkdir(resolve(root, ".qa"), { recursive: true });
  await writeFile(
    resolve(root, ".qa/ribbon-four-loop-wide.png"),
    Buffer.from(output.wide.split(",")[1], "base64"),
  );
  for (const [i, data] of output.mobile.entries())
    await writeFile(
      resolve(root, `public/images/ribbons/service-${i + 1}.webp`),
      Buffer.from(data.split(",")[1], "base64"),
    );
  console.log(
    "Generated four-loop GLB and four transparent mobile ribbon renders.",
  );
} finally {
  await browser.close();
  await new Promise((r) => server.close(r));
}

"use client";
import { useEffect, useRef, type RefObject } from "react";
import { ribbonConfig } from "./ribbon-config";

export function ServiceRibbon({
  source,
  count,
}: {
  source: RefObject<HTMLDivElement | null>;
  count: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current,
      showcase = source.current;
    if (!host || !showcase) return;
    let disposed = false;
    let cleanup = () => {};
    async function mount() {
      const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/environments/RoomEnvironment.js"),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = ribbonConfig.exposure;
      host!.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      room.traverse((object) => {
        if (
          object instanceof THREE.Mesh &&
          object.material instanceof THREE.MeshStandardMaterial
        )
          object.material.color.setScalar(ribbonConfig.roomShade);
      });
      const environment = pmrem.fromScene(room, 0.04);
      scene.environment = environment.texture;
      room.dispose();
      pmrem.dispose();
      const material = new THREE.MeshPhysicalMaterial({
        ...ribbonConfig.material,
        side: THREE.DoubleSide,
      });
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 20);
      camera.position.set(0, 0, 5);
      const key = new THREE.DirectionalLight(0xffffff, 3);
      key.position.set(-1, 3, 4);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xffa276, 1.5);
      fill.position.set(2, -2, 3);
      scene.add(fill);
      cleanup = () => {
        material.dispose();
        environment.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
      const gltf = await new GLTFLoader().loadAsync(ribbonConfig.model);
      if (disposed) {
        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material)
              ? object.material
              : [object.material];
            materials.forEach((m) => m.dispose());
          }
        });
        return;
      }
      const model = gltf.scene;
      // Each panel reveals the next part of the same four-loop model.
      model.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const old = Array.isArray(object.material)
          ? object.material
          : [object.material];
        old.forEach((m) => m.dispose());
        object.material = material;
      });
      scene.add(model);
      let progress = Number(showcase!.dataset.progress || 0);
      const render = () => {
        if (disposed || !host!.clientWidth || !host!.clientHeight) return;
        const width = ribbonConfig.panelWidth;
        const center = width / 2 + progress * (count - 1) * width;
        const halfHeight = (width * host!.clientHeight) / host!.clientWidth / 2;
        camera.left = center - width / 2;
        camera.right = center + width / 2;
        camera.top = ribbonConfig.centerY + halfHeight;
        camera.bottom = ribbonConfig.centerY - halfHeight;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const resize = () => {
        renderer.setSize(host!.clientWidth, host!.clientHeight, false);
        render();
      };
      const onProgress = (event: Event) => {
        progress = (event as CustomEvent<number>).detail;
        render();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host!);
      showcase!.addEventListener("services:progress", onProgress);
      resize();
      host!.dataset.ready = "true";
      const disposeRenderer = cleanup;
      cleanup = () => {
        observer.disconnect();
        showcase!.removeEventListener("services:progress", onProgress);
        model.traverse((object) => {
          if (object instanceof THREE.Mesh) object.geometry.dispose();
        });
        disposeRenderer();
      };
    }
    void mount().catch(() => {
      cleanup();
      host.dataset.ready = "error";
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [source, count]);
  return (
    <div
      ref={ref}
      data-service-ribbon
      className="pointer-events-none absolute inset-0 -z-10 [&>canvas]:block [&>canvas]:size-full"
      aria-hidden="true"
    />
  );
}

import * as THREE from "three";
import { OrbitControls } from "../vendor/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../vendor/three/examples/jsm/loaders/GLTFLoader.js";

function resolveModelUrl() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("model");
    if (!q) return "../013_Octogecko_Art.glb";
    if (q.startsWith("/") || q.includes("://")) return q;
    return q.startsWith("../") ? q : `../${q}`;
}

function frameModel(camera, controls, object, padding = 1.35) {
    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) {
        camera.position.set(2, 1.6, 4);
        camera.near = 0.01;
        camera.far = 100;
        camera.updateProjectionMatrix();
        camera.lookAt(0, 0.8, 0);
        controls.target.set(0, 0.8, 0);
        controls.update();
        return;
    }

    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const center = sphere.center;
    const radius = Math.max(sphere.radius, 1e-6);

    const vFov = (camera.fov * Math.PI) / 180;
    const dist = (radius / Math.sin(vFov / 2)) * padding;

    camera.position.set(center.x + dist * 0.35, center.y + dist * 0.25, center.z + dist);
    camera.near = Math.max(dist / 200, 0.001);
    camera.far = Math.min(dist * 200, 1e7);
    camera.updateProjectionMatrix();
    camera.lookAt(center);

    controls.target.copy(center);
    controls.update();
}

function boot() {
    const canvas = document.querySelector("#view");
    const stage = document.getElementById("stage");
    const loadingEl = document.getElementById("loading");
    const modelUrl = resolveModelUrl();

    if (window.location.protocol === "file:" && loadingEl) {
        loadingEl.textContent =
            "file:// では読み込めません。リポジトリで python -m http.server を実行し http://localhost:8080/octogecko/ を開いてください。";
        loadingEl.classList.remove("hidden");
        return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1222);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(4, 8, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb8c7ff, 0.45);
    rim.position.set(-6, 2, -4);
    scene.add(rim);

    let camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1e6);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.01;
    controls.maxDistance = 1e7;

    let mixer = null;

    function resize() {
        const w = Math.max(1, stage.clientWidth);
        const h = Math.max(320, Math.round(w * 0.72));
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener("resize", resize);

    const loader = new GLTFLoader();

    function hideLoading() {
        if (loadingEl) loadingEl.classList.add("hidden");
    }

    function showLoadError(message) {
        console.error(message);
        if (loadingEl) {
            loadingEl.textContent = message;
            loadingEl.classList.remove("hidden");
        }
    }

    loader.load(
        modelUrl,
        (gltf) => {
            try {
                const model = gltf.scene;
                scene.add(model);

                frameModel(camera, controls, model);

                if (gltf.animations?.length) {
                    mixer = new THREE.AnimationMixer(model);
                    const clip = gltf.animations[0];
                    const action = mixer.clipAction(clip);
                    action.loop = THREE.LoopRepeat;
                    action.reset().play();
                }
            } catch (e) {
                console.error(e);
                showLoadError(`表示エラー: ${e?.message || e}`);
                return;
            }
            hideLoading();
        },
        undefined,
        (err) => {
            showLoadError(
                `モデルを読めませんでした (${modelUrl})。404・CORS・未デプロイの可能性があります。詳細はコンソールを確認してください。`
            );
            console.error(err);
        }
    );

    const clock = new THREE.Clock();
    function tick() {
        const dt = clock.getDelta();
        controls.update();
        mixer?.update(dt);
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
    tick();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
} else {
    boot();
}

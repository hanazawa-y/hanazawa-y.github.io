import * as THREE from "three";
import { OrbitControls } from "../vendor/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../vendor/three/examples/jsm/loaders/GLTFLoader.js";

function resolveModelUrl() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("model");

    if (!q) {
        return "../013_Octogecko_Art.glb";
    }

    if (q.startsWith("/") || q.includes("://")) {
        return q;
    }

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

    camera.position.set(
        center.x + dist * 0.35,
        center.y + dist * 0.25,
        center.z + dist
    );

    camera.near = Math.max(dist / 200, 0.001);
    camera.far = Math.min(dist * 200, 1e7);

    camera.updateProjectionMatrix();

    camera.lookAt(center);

    controls.target.copy(center);
    controls.update();
}

function boot() {

    // =========================
    // DOM
    // =========================

    const canvas = document.getElementById("view");
    const stage = document.getElementById("stage");
    const loadingEl = document.getElementById("loading");

    const modelUrl = resolveModelUrl();

    // =========================
    // file:// 対策
    // =========================

    if (window.location.protocol === "file:") {

        loadingEl.textContent =
            "file:// では動作しません。httpサーバー経由で開いてください。";

        loadingEl.classList.remove("hidden");

        return;
    }

    // =========================
    // Renderer
    // =========================

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    // =========================
    // Scene
    // =========================

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x0c1222);

    // =========================
    // Camera
    // =========================

    const camera = new THREE.PerspectiveCamera(
        42,
        1,
        0.01,
        1000000
    );

    // =========================
    // Controls
    // =========================

    const controls = new OrbitControls(camera, canvas);

    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    controls.minDistance = 0.01;
    controls.maxDistance = 10000000;

    // =========================
    // Light
    // =========================

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        0.55
    );

    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
        0xffffff,
        1.2
    );

    keyLight.position.set(4, 8, 6);

    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
        0xb8c7ff,
        0.45
    );

    rimLight.position.set(-6, 2, -4);

    scene.add(rimLight);

    // =========================
    // Resize
    // =========================

    function resize() {

        const width = Math.max(1, stage.clientWidth);

        const height = Math.max(
            320,
            Math.round(width * 0.72)
        );

        renderer.setSize(width, height);

        camera.aspect = width / height;

        camera.updateProjectionMatrix();
    }

    resize();

    window.addEventListener("resize", resize);

    // =========================
    // Loader
    // =========================

    const loader = new GLTFLoader();

    let mixer = null;

    function hideLoading() {
        loadingEl.classList.add("hidden");
    }

    function showError(message) {

        console.error(message);

        loadingEl.textContent = message;

        loadingEl.classList.remove("hidden");
    }

    loader.load(

        modelUrl,

        // success
        (gltf) => {

            try {

                const model = gltf.scene;

                scene.add(model);

                frameModel(
                    camera,
                    controls,
                    model
                );

                // animation
                if (gltf.animations?.length) {

                    mixer = new THREE.AnimationMixer(model);

                    const clip = gltf.animations[0];

                    const action = mixer.clipAction(clip);

                    action.loop = THREE.LoopRepeat;

                    action.reset().play();
                }

                hideLoading();

            } catch (e) {

                console.error(e);

                showError(
                    `表示エラー: ${e?.message || e}`
                );
            }
        },

        // progress
        undefined,

        // error
        (err) => {

            console.error(err);

            showError(
                `モデルを読み込めませんでした: ${modelUrl}`
            );
        }
    );

    // =========================
    // Animation Loop
    // =========================

    const clock = new THREE.Clock();

    function tick() {

        requestAnimationFrame(tick);

        const delta = clock.getDelta();

        controls.update();

        mixer?.update(delta);

        renderer.render(scene, camera);
    }

    tick();
}

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        boot
    );

} else {

    boot();
}
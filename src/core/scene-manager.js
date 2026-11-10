// ============================================================================
// Module: src/core/scene-manager.js
// Manages Three.js Scene, PerspectiveCamera, WebGLRenderer, Studio Lights,
// OrbitControls, Clipping Plane, and Smooth Camera Flight Interpolation.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};

window.Starflex3D.SceneManager = {
  init(containerEl, state) {
    const cfg = window.Starflex3D.Config.scene;

    // 1. Scene & Atmospheric Studio Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(cfg.backgroundColor);
    scene.fog = new THREE.FogExp2(cfg.backgroundColor, cfg.fogDensity);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      cfg.fov,
      window.innerWidth / window.innerHeight,
      cfg.near,
      cfg.far
    );
    camera.position.set(...cfg.defaultCameraPos);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    containerEl.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(...cfg.defaultCameraTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = cfg.minDistance;
    controls.maxDistance = cfg.maxDistance;

    // 5. Studio Architectural Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xdbeafe, 0.82);
    hemiLight.position.set(0, 150, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.78);
    dirLight.position.set(85, 140, 95);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 20;
    dirLight.shadow.camera.far = 360;
    const d = 135;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const backRimLight = new THREE.DirectionalLight(0xe0f2fe, 0.35);
    backRimLight.position.set(-90, 80, -110);
    scene.add(backRimLight);

    // 6. Dynamic Clipping Plane for Interactive Cutaway Slicing
    const clipPlaneZ = new THREE.Plane(new THREE.Vector3(0, 0, -1), 90);

    // 7. Selection Highlight Box
    const highlightBox = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x2563eb,
        wireframe: true,
        transparent: true,
        opacity: 0.9
      })
    );
    highlightBox.visible = false;
    scene.add(highlightBox);

    // 8. Window Resize Listener
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    state.scene = scene;
    state.camera = camera;
    state.renderer = renderer;
    state.controls = controls;
    state.clipPlaneZ = clipPlaneZ;
    state.highlightBox = highlightBox;

    return { scene, camera, renderer, controls, clipPlaneZ, highlightBox };
  },

  flyTo(state, targetVec, posVec) {
    state.cameraTargetLerp = targetVec.clone();
    state.cameraPosLerp = posVec.clone();
  },

  updateCameraFlight(state) {
    if (state.cameraTargetLerp && state.cameraPosLerp) {
      state.controls.target.lerp(state.cameraTargetLerp, 0.08);
      state.camera.position.lerp(state.cameraPosLerp, 0.08);
      if (state.camera.position.distanceTo(state.cameraPosLerp) < 0.35) {
        state.cameraTargetLerp = null;
        state.cameraPosLerp = null;
      }
    }
  }
};

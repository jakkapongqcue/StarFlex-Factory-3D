// ============================================================================
// Module: src/builders/common/truck.builder.js
// Procedural 3D Builder for Starflex Logistics Trucks & Cargo Containers.
// Includes high-res Starflex logistics livery, articulated side doors,
// interior lighting, kraft cargo cartons, cab and chassis wheels.
// ============================================================================

window.Starflex3D = window.Starflex3D || {};
window.Starflex3D.Builders = window.Starflex3D.Builders || {};
window.Starflex3D.Builders.Common = window.Starflex3D.Builders.Common || {};

(function () {
  let _cachedStarflexTruckTexture = null;
  let _cachedBoxStarflexLabelTexture = null;
  let _cachedKraftBoxMat = null;
  let _cachedWhiteTapeMat = null;

  function getBoxStarflexLabelTexture() {
    if (_cachedBoxStarflexLabelTexture) return _cachedBoxStarflexLabelTexture;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 144;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0284c7";
    ctx.fillRect(0, 0, canvas.width, 36);
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 16px "Segoe UI", sans-serif';
    ctx.fillText("STARFLEX CO., LTD.", 14, 24);

    ctx.fillStyle = "#0f172a";
    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.fillText("HYGIENE POUCH CARTON", 14, 62);

    ctx.fillStyle = "#475569";
    ctx.font = '12px "Consolas", monospace';
    ctx.fillText("LOT: 2026-FG-9418", 14, 82);
    ctx.fillText("BATCH: SF-EXPORT-02", 14, 98);

    ctx.fillStyle = "#0f172a";
    let curBx = 14;
    const bPattern = [3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3];
    for (let b = 0; b < bPattern.length; b++) {
      if (b % 2 === 0) ctx.fillRect(curBx, 108, bPattern[b], 22);
      curBx += bPattern[b] + 1.8;
    }

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(190, 52, 50, 50);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(195, 57, 40, 40);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(200, 62, 12, 12);
    ctx.fillRect(218, 62, 12, 12);
    ctx.fillRect(200, 80, 12, 12);

    _cachedBoxStarflexLabelTexture = new THREE.CanvasTexture(canvas);
    return _cachedBoxStarflexLabelTexture;
  }

  function createKraftRackBox() {
    const w = 1.35, h = 0.90, d = 1.35;
    if (!_cachedKraftBoxMat) {
      _cachedKraftBoxMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
    }
    if (!_cachedWhiteTapeMat) {
      _cachedWhiteTapeMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    }
    const grp = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), _cachedKraftBoxMat);
    box.position.y = h / 2;
    box.castShadow = true;
    box.receiveShadow = true;
    grp.add(box);

    const tThickness = 0.015;
    const calcTapeW = Math.max(0.18, Math.min(0.38, w * 0.24));
    const tape = new THREE.Mesh(new THREE.BoxGeometry(calcTapeW, tThickness, d + 0.01), _cachedWhiteTapeMat);
    tape.position.set(0, h + tThickness / 2, 0);
    grp.add(tape);

    const lblTex = getBoxStarflexLabelTexture();
    if (lblTex) {
      const labelMat = new THREE.MeshBasicMaterial({ map: lblTex });
      const label = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.24), labelMat);
      label.position.set(0, h * 0.52, d / 2 + 0.003);
      grp.add(label);
    }
    return grp;
  }

  function getStarflexTruckLogoTexture() {
    if (_cachedStarflexTruckTexture) return _cachedStarflexTruckTexture;
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    function renderBaseTrailerWall() {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const stripeH = 50;
      ctx.fillStyle = "#1d4ed8";
      ctx.fillRect(0, canvas.height - stripeH, canvas.width, stripeH);

      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(0, canvas.height - stripeH - 3, canvas.width, 3);

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      for (let y = 52; y < canvas.height - stripeH - 12; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    renderBaseTrailerWall();

    function drawVectorStarflexFallback() {
      ctx.save();
      const icX = 145;
      const icY = 145;
      const r = 58;

      ctx.fillStyle = "#06b6d4";
      ctx.beginPath();
      ctx.moveTo(icX, icY - r);
      ctx.lineTo(icX + r * 0.86, icY - r * 0.5);
      ctx.lineTo(icX + r * 0.45, icY - r * 0.25);
      ctx.lineTo(icX, icY - r * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#0284c7";
      ctx.beginPath();
      ctx.moveTo(icX - r * 0.86, icY - r * 0.5);
      ctx.lineTo(icX, icY);
      ctx.lineTo(icX - r * 0.45, icY + r * 0.25);
      ctx.lineTo(icX - r * 0.86, icY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#1d4ed8";
      ctx.beginPath();
      ctx.moveTo(icX, icY + r);
      ctx.lineTo(icX + r * 0.86, icY + r * 0.5);
      ctx.lineTo(icX + r * 0.45, icY + r * 0.25);
      ctx.lineTo(icX, icY + r * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#334155";
      ctx.font = 'bold 84px "Montserrat", "Segoe UI", "Arial Black", sans-serif';
      ctx.textBaseline = "middle";
      ctx.fillText("STARFLEX", icX + 105, icY - 4);
      ctx.restore();
    }
    drawVectorStarflexFallback();

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    _cachedStarflexTruckTexture = texture;

    if (typeof Image !== "undefined") {
      const img = new Image();
      const logoSrc =
        window.STARFLEX_TEXTURES && window.STARFLEX_TEXTURES.starflexLogo
          ? window.STARFLEX_TEXTURES.starflexLogo
          : "assets/Starflex_logo.png";

      if (typeof logoSrc === "string" && logoSrc.startsWith("http")) {
        img.crossOrigin = "anonymous";
      }

      img.onload = function () {
        renderBaseTrailerWall();
        const stripeH = 50;
        const padX = 70;
        const maxW = canvas.width - padX * 2;
        const maxH = canvas.height - stripeH - 60;
        const aspect = img.width / img.height;
        let drawW = maxW;
        let drawH = drawW / aspect;
        if (drawH > maxH) {
          drawH = maxH;
          drawW = drawH * aspect;
        }
        const drawX = (canvas.width - drawW) / 2;
        const drawY = (canvas.height - stripeH - drawH) / 2 + 6;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        texture.needsUpdate = true;
        if (window.__triggerRender) window.__triggerRender();
      };
      img.onerror = function (e) {
        console.warn("Starflex logo failed to load via image, using vector fallback", e);
      };
      img.src = logoSrc;
    }

    return texture;
  }

  function createContainerTruckMesh() {
    const truck = new THREE.Group();

    const cabMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
    const bumperMat = new THREE.MeshLambertMaterial({ color: 0x111827 });
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const darkGlassMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const boxWhiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    const boxStripeMat = new THREE.MeshLambertMaterial({ color: 0x1d4ed8 });
    const chassisMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 });
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const hazardYellow = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
    const hazardBlack = new THREE.MeshLambertMaterial({ color: 0x0f172a });

    const logoTexture = getStarflexTruckLogoTexture();
    const logoSideMat = logoTexture
      ? new THREE.MeshLambertMaterial({
          map: logoTexture,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2
        })
      : boxWhiteMat;

    // 1. Cargo Floor / Bed Deck
    const bed = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.28, 13.6), floorMat);
    bed.position.set(0, 1.32, 1.1);
    truck.add(bed);

    // 2. Cargo Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.62, 0.24, 13.62), boxWhiteMat);
    roof.position.set(0, 6.18, 1.1);
    truck.add(roof);

    // 3. Cargo Front Wall (behind Cab at z = 7.8)
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.74, 0.22), boxWhiteMat);
    frontWall.position.set(0, 3.75, 7.8);
    truck.add(frontWall);

    // 4. Cargo Rear Wall (Tailgate at z = -5.6)
    const rearWall = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.74, 0.22), boxWhiteMat);
    rearWall.position.set(0, 3.75, -5.6);
    truck.add(rearWall);

    // Chrome vertical rear lock bars
    [-1.2, 1.2].forEach(function (rx) {
      const lockBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.5, 10), chromeMat);
      lockBar.position.set(rx, 3.75, -5.75);
      truck.add(lockBar);
    });

    // Rear tail lamp clusters (Red & Amber)
    [-2.1, 2.1].forEach(function (tx) {
      const tailRed = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 0.08), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      tailRed.position.set(tx, 1.25, -5.73);
      truck.add(tailRed);
      const tailAmber = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.20, 0.08), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
      tailAmber.position.set(tx + (tx > 0 ? 0.35 : -0.35), 1.25, -5.73);
      truck.add(tailAmber);
    });

    // 5. Container Right Wall (East Wall with High-Res STARFLEX Logo)
    const rightWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(13.56, 4.74), logoSideMat);
    rightWallMesh.position.set(2.82, 3.75, 1.1);
    rightWallMesh.rotation.y = Math.PI / 2;
    truck.add(rightWallMesh);

    const rightWallBacking = new THREE.Mesh(new THREE.BoxGeometry(0.14, 4.74, 13.56), boxWhiteMat);
    rightWallBacking.position.set(2.70, 3.75, 1.1);
    truck.add(rightWallBacking);

    // 6. Container Left Wall (West Wall with Side Opening & Folding Doors)
    const leftWallRear = new THREE.Mesh(new THREE.BoxGeometry(0.20, 4.74, 2.2), boxWhiteMat);
    leftWallRear.position.set(-2.81, 3.75, -4.5);
    truck.add(leftWallRear);

    const rearBlueSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 2.2), boxStripeMat);
    rearBlueSkirt.position.set(-2.81, 1.58, -4.5);
    truck.add(rearBlueSkirt);

    const leftWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.20, 4.74, 3.8), boxWhiteMat);
    leftWallFront.position.set(-2.81, 3.75, 5.9);
    truck.add(leftWallFront);

    const frontBlueSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.52, 3.8), boxStripeMat);
    frontBlueSkirt.position.set(-2.81, 1.58, 5.9);
    truck.add(frontBlueSkirt);

    const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.38, 7.44), boxWhiteMat);
    doorLintel.position.set(-2.81, 5.99, 0.3);
    truck.add(doorLintel);

    const doorSill = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.22, 7.44), chassisMat);
    doorSill.position.set(-2.81, 1.33, 0.3);
    truck.add(doorSill);

    for (let sIdx = 0; sIdx < 14; sIdx++) {
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.04, 0.44),
        sIdx % 2 === 0 ? hazardYellow : hazardBlack
      );
      stripe.position.set(-2.81, 1.45, -3.15 + sIdx * 0.53);
      truck.add(stripe);
    }

    // 7. Double Animated Side Doors
    const doorPivotRear = new THREE.Group();
    doorPivotRear.position.set(-2.91, 3.73, -3.4);
    truck.add(doorPivotRear);

    const doorLeafRear = new THREE.Group();
    const doorMeshRear = new THREE.Mesh(new THREE.BoxGeometry(0.10, 4.25, 3.7), boxWhiteMat);
    doorMeshRear.position.set(0, 0, 1.85);
    doorLeafRear.add(doorMeshRear);

    const doorSkirtRear = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.48, 3.7), boxStripeMat);
    doorSkirtRear.position.set(0, -1.88, 1.85);
    doorLeafRear.add(doorSkirtRear);

    const lockBarRear = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.0, 10), chromeMat);
    lockBarRear.position.set(-0.08, 0, 1.85);
    doorLeafRear.add(lockBarRear);
    doorPivotRear.add(doorLeafRear);

    const doorPivotFront = new THREE.Group();
    doorPivotFront.position.set(-2.91, 3.73, 4.0);
    truck.add(doorPivotFront);

    const doorLeafFront = new THREE.Group();
    const doorMeshFront = new THREE.Mesh(new THREE.BoxGeometry(0.10, 4.25, 3.7), boxWhiteMat);
    doorMeshFront.position.set(0, 0, -1.85);
    doorLeafFront.add(doorMeshFront);

    const doorSkirtFront = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.48, 3.7), boxStripeMat);
    doorSkirtFront.position.set(0, -1.88, -1.85);
    doorLeafFront.add(doorSkirtFront);

    const lockBarFront = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.0, 10), chromeMat);
    lockBarFront.position.set(-0.08, 0, -1.85);
    doorLeafFront.add(lockBarFront);
    doorPivotFront.add(doorLeafFront);

    function setDoorOpenRatio(ratio) {
      const maxAngle = Math.PI * 0.58;
      doorPivotRear.rotation.y = -ratio * maxAngle;
      doorPivotFront.rotation.y = ratio * maxAngle;
    }
    setDoorOpenRatio(1.0);

    truck.userData.doorPivotRear = doorPivotRear;
    truck.userData.doorPivotFront = doorPivotFront;
    truck.userData.setDoorOpenRatio = setDoorOpenRatio;

    // 8. Interior Cargo Bay Lamps & Staged Kraft Carton Boxes
    [-1.5, 1.5, 4.5].forEach(function (lz) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.8), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
      lamp.position.set(0, 6.05, lz);
      truck.add(lamp);
    });

    const deepCargo1 = createKraftRackBox();
    deepCargo1.position.set(1.3, 1.95, -2.5);
    truck.add(deepCargo1);

    const deepCargo2 = createKraftRackBox();
    deepCargo2.position.set(1.3, 1.95, 4.0);
    truck.add(deepCargo2);

    // 9. Modern Royal Blue Truck Cab
    const cabGroup = new THREE.Group();
    cabGroup.position.set(0, 0, 9.4);

    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(5.1, 3.8, 3.2), cabMat);
    cabBody.position.set(0, 2.70, 0);
    cabGroup.add(cabBody);

    const aeroRoof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.18, 2.4), cabMat);
    aeroRoof.position.set(0, 5.10, -0.2);
    cabGroup.add(aeroRoof);

    const bumper = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.72, 0.55), bumperMat);
    bumper.position.set(0, 0.65, 1.55);
    cabGroup.add(bumper);

    [-1.85, 1.85].forEach(function (hx) {
      const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.38, 0.08), headlightMat);
      headlight.position.set(hx, 1.25, 1.62);
      cabGroup.add(headlight);
    });

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.35, 0.12), darkGlassMat);
    windshield.position.set(0, 3.65, 1.62);
    cabGroup.add(windshield);

    [-2.57, 2.57].forEach(function (wx) {
      const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.25, 1.6), darkGlassMat);
      sideWindow.position.set(wx, 3.65, 0.2);
      cabGroup.add(sideWindow);
    });

    truck.add(cabGroup);

    // 10. Chassis & 6 Tandem Wheels (1 Front Steering Axle + 2 Tandem Rear Axles)
    const chassisBeams = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 18.4), chassisMat);
    chassisBeams.position.set(0, 1.05, 2.6);
    truck.add(chassisBeams);

    const fuelTank = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 2.6, 14), chromeMat);
    fuelTank.rotation.z = Math.PI / 2;
    fuelTank.position.set(2.35, 1.05, -0.6);
    truck.add(fuelTank);

    const battBox = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.65, 1.2), chassisMat);
    battBox.position.set(-2.25, 1.05, -0.6);
    truck.add(battBox);

    const wheels = [];
    [-4.5, -2.2, 9.4].forEach(function (zPos) {
      [-2.65, 2.65].forEach(function (xPos) {
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.58, 20), chassisMat);
        wh.rotation.z = Math.PI / 2;
        wh.position.set(xPos, 0.92, zPos);
        truck.add(wh);
        wheels.push(wh);
      });
    });
    truck.userData.wheels = wheels;

    return truck;
  }

  window.Starflex3D.Builders.Common.createContainerTruckMesh = createContainerTruckMesh;
  window.Starflex3D.Builders.Common.createKraftRackBox = createKraftRackBox;
})();

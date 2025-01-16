import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import circle from "../assets/textures/circle.png";
import px from "../assets/textures/background_textures/px.png";
import nx from "../assets/textures/background_textures/nx.png";
import py from "../assets/textures/background_textures/py.png";
import ny from "../assets/textures/background_textures/ny.png";
import pz from "../assets/textures/background_textures/pz.png";
import nz from "../assets/textures/background_textures/nz.png";
import starsJson from "../assets/stars.json";
import constellationsData from "../assets/constellations.json"; // stele si linii intre constelatii

const textureLoader = new THREE.TextureLoader();
const circleTexture = textureLoader.load(circle);

const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().load([px, nx, py, ny, pz, nz]);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const radius = 500;

function sphericalToCartesian(ra, dec, radius) {
  const phi = (90 - dec) * (Math.PI / 180);
  const theta = ra * (Math.PI / 180);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return { x, y, z };
}

const renderedStars = new Map();
const constellationObjects = [];
const constellationLabels = []; // label-urile constelatiei, pt toggle

// marime si opacitate in functie de magnitude
function calculateStarProperties(magnitude) {
  const maxRadius = 8;
  const minRadius = 5;
  const size =
    minRadius + (maxRadius - minRadius) * Math.pow(2.512, -magnitude);
  const opacity = 1 - magnitude / 6;
  return { size, opacity };
}

starsJson.forEach((star) => {
  const ra =
    (parseFloat(star.RA_hour) +
      parseFloat(star.RA_min) / 60 +
      parseFloat(star.RA_sec) / 3600) *
    15;

  const dec =
    parseFloat(star.dec_deg) +
    parseFloat(star.dec_min) / 60 +
    parseFloat(star.dec_sec) / 3600;

  const mag = parseFloat(star.magnitude);

  if (mag <= 6) {
    const { x, y, z } = sphericalToCartesian(ra, dec, radius);

    const key = `${x},${y},${z}`;
    if (!renderedStars.has(key)) {
      const { size, opacity } = calculateStarProperties(mag);

      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([x, y, z], 3)
      );

      const starMaterial = new THREE.PointsMaterial({
        map: circleTexture,
        transparent: true,
        color: 0xffffff,
        opacity: opacity,
        sizeAttenuation: true,
        size: size,
      });

      const starPoint = new THREE.Points(starGeometry, starMaterial);
      scene.add(starPoint);

      renderedStars.set(key, starPoint);
    }
  }
});

constellationsData.Constellations.forEach((constellation) => {
  constellation.stars.forEach((star) => {
    const { RAh, DEd } = star;

    const { x, y, z } = sphericalToCartesian(RAh * 15, DEd, radius);

    const key = `${x},${y},${z}`;
    if (!renderedStars.has(key)) {
      const mag = star.magnitude;
      const { size, opacity } = calculateStarProperties(mag);

      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([x, y, z], 3)
      );

      const starMaterial = new THREE.PointsMaterial({
        map: circleTexture,
        transparent: true,
        color: 0xffffff,
        opacity: opacity,
        sizeAttenuation: true,
        size: size,
      });

      const starPoint = new THREE.Points(starGeometry, starMaterial);
      scene.add(starPoint);

      renderedStars.set(key, starPoint);
    }
  });

  // deseneaza liniile constelatiilor
  constellation.lines.forEach((line) => {
    const star1 = constellation.stars[line[0]];
    const star2 = constellation.stars[line[1]];

    const pos1 = sphericalToCartesian(star1.RAh * 15, star1.DEd, radius);
    const pos2 = sphericalToCartesian(star2.RAh * 15, star2.DEd, radius);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z],
        3
      )
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
    });

    const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
    constellationObjects.push(lineMesh); // mentine linia pentru toggling
    scene.add(lineMesh);
  });

  // label cu numele constelatiiei
  const firstStar = constellation.stars[0];
  const { x, y, z } = sphericalToCartesian(
    firstStar.RAh * 15,
    firstStar.DEd,
    radius
  );

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "50px Arial";
  context.fillStyle = "white";
  context.fillText(constellation.Name, 0, 50);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);

  sprite.position.set(x, y, z);
  sprite.scale.set(100, 50, 1);
  constellationLabels.push(sprite);
  scene.add(sprite);
});

// toggle pentru constelatii
let constellationsVisible = true;
window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "t") {
    // test inital cu "t"
    constellationsVisible = !constellationsVisible;
    constellationObjects.forEach((object) => {
      object.visible = constellationsVisible;
    });
    constellationLabels.forEach((label) => {
      label.visible = constellationsVisible;
    });
  }
});

// am adaugat buton
const toggleButton = document.getElementById("toggle-constellations");

// toggle cu buton
toggleButton.addEventListener("click", () => {
  constellationsVisible = !constellationsVisible;
  constellationObjects.forEach((object) => {
    object.visible = constellationsVisible;
  });
  constellationLabels.forEach((label) => {
    label.visible = constellationsVisible;
  });
});

// sa fie mai responsive
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;

  // fov in functie de ecran --> ecran mai mic, fov mai mare (some sort of responsiveness)
  if (width < 768) {
    camera.fov = 95;
  } else {
    camera.fov = 60;
  }

  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

// loop randare
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

setTimeout(() => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.style.opacity = 0;
    setTimeout(() => {
      loadingScreen.style.display = "none"; // nu mai afisa loading screen
    }, 500);
  }
}, 1000);

document.addEventListener("DOMContentLoaded", () => {
  const toggleMenuButton = document.getElementById("toggle-menu");
  const menu = document.getElementById("menu");
  const toggleConstellationsButton = document.getElementById(
    "toggle-constellations"
  );
  const goToLandingButton = document.getElementById("go-to-landing");

  // toggle meniu
  toggleMenuButton.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  // buton landing page
  goToLandingButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });
});

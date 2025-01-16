document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("celestialSphere");
  const ctx = canvas.getContext("2d");

  // ajustezi canvas ca sa ai aspect ratio bun
  function resizeCanvas() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function resizeAndRedraw() {
    resizeCanvas();
    drawAll();
  }

  resizeCanvas();
  window.addEventListener("resize", resizeAndRedraw);

  // slider pt ascensiune si declinatie
  const raSlider = document.getElementById("raSlider");
  const decSlider = document.getElementById("decSlider");
  const raVal = document.getElementById("raValue");
  const decVal = document.getElementById("decValue");
  raSlider.addEventListener("input", drawAll);
  decSlider.addEventListener("input", drawAll);

  const R = 200; // raza sferei
  // camera spre +z
  const camera = { x: 0, y: 0, z: -600 };
  const focalLength = 400;

  function getCenter() {
    return {
      x: canvas.width / (2 * window.devicePixelRatio),
      y: canvas.height / (2 * window.devicePixelRatio),
    };
  }

  // grade in radiani
  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  function sphereCoord(raDeg, decDeg) {
    const ra = degToRad(raDeg);
    const dec = degToRad(decDeg);
    const x = R * Math.cos(dec) * Math.cos(ra);
    const y = R * Math.cos(dec) * Math.sin(ra);
    const z = R * Math.sin(dec);
    return { x, y, z };
  }

  function rotateX(point, angleDeg) {
    const angle = degToRad(angleDeg);
    const { x, y, z } = point;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return {
      x: x,
      y: y * cosA - z * sinA,
      z: y * sinA + z * cosA,
    };
  }

  function rotateY(point, angleDeg) {
    const angle = degToRad(angleDeg);
    const { x, y, z } = point;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return {
      x: x * cosA + z * sinA,
      y: y,
      z: -x * sinA + z * cosA,
    };
  }

  // vantage point
  function tiltForVantage(pt) {
    let out = rotateX(pt, 70); // valori random, ce arata mai bine
    out = rotateY(out, -20);
    return out;
  }

  function project3DTo2D(point) {
    const { x, y, z } = point;
    const dx = x - camera.x;
    const dy = y - camera.y;
    const dz = z - camera.z;

    const factor = focalLength / (dz > 1 ? dz : 1);

    const center = getCenter();
    const X = center.x + dx * factor;
    const Y = center.y - dy * factor;
    return { X, Y };
  }

  function drawLine3D(points, color, width = 1) {
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const p2d = project3DTo2D(points[i]);
      if (i === 0) {
        ctx.moveTo(p2d.X, p2d.Y);
      } else {
        ctx.lineTo(p2d.X, p2d.Y);
      }
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawCelestialGrid() {
    // linii de aceeasi declinatie
    for (let dec = -75; dec <= 75; dec += 15) {
      const linePoints = [];
      for (let ra = 0; ra <= 360; ra += 5) {
        linePoints.push(sphereCoord(ra, dec));
      }
      const rotatedLine = linePoints.map(tiltForVantage);
      drawLine3D(rotatedLine, "#888", 1);
    }

    // linii de aceeasi ascensie
    for (let ra = 0; ra < 360; ra += 15) {
      const linePoints = [];
      for (let dec = -90; dec <= 90; dec += 5) {
        linePoints.push(sphereCoord(ra, dec));
      }
      const rotatedLine = linePoints.map(tiltForVantage);
      drawLine3D(rotatedLine, "#888", 1);
    }
  }

  function drawEquator() {
    const eqPoints = [];
    for (let ra = 0; ra <= 360; ra += 5) {
      eqPoints.push(sphereCoord(ra, 0));
    }
    const rotated = eqPoints.map(tiltForVantage);
    drawLine3D(rotated, "green", 2);
  }

  // ecliptica
  function drawEcliptic() {
    const eclPoints = [];
    for (let ra = 0; ra <= 360; ra += 5) {
      const p = sphereCoord(ra, 0);
      const pEcl = rotateX(p, 23.4); // inclinatie de 23.4 deg fata de eq
      const pFinal = tiltForVantage(pEcl);
      eclPoints.push(pFinal);
    }
    drawLine3D(eclPoints, "red", 2);
  }

  // stea
  function drawStar() {
    const ra = parseFloat(raSlider.value);
    const dec = parseFloat(decSlider.value);
    raVal.textContent = ra + "°";
    decVal.textContent = dec + "°";

    let p = sphereCoord(ra, dec);
    p = tiltForVantage(p);

    // proiecteaza in 2d
    const star2D = project3DTo2D(p);
    ctx.beginPath();
    ctx.arc(star2D.X, star2D.Y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "gold";
    ctx.fill();
  }

  function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCelestialGrid();
    drawEquator();
    drawEcliptic();
    drawStar();
  }

  drawAll();
});

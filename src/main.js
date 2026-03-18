import * as THREE from 'three';

// 1. Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.015);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Start camera closer
camera.position.z = 10;
camera.position.x = 0;
camera.position.y = 0;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x050510);
// Make the canvas fixed in the background so you can scroll HTML over it
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1';
document.body.appendChild(renderer.domElement);

// Adding fancy lights
const ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xff0066, 300, 100);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ccff, 300, 100);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

// Objects to scroll past
// Mesh 1: The Torus Knot
const knoGeometry = new THREE.TorusKnotGeometry(4, 1.2, 100, 16);
const knotMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x222222,
  roughness: 0.1,
  metalness: 0.8,
  wireframe: true,
  emissive: 0x111111,
});
const knot = new THREE.Mesh(knoGeometry, knotMaterial);
scene.add(knot);

// Mesh 2: Icosahedron
const icosaGeometry = new THREE.IcosahedronGeometry(3, 0);
const icosaMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ccff,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true
});
const icosahedron = new THREE.Mesh(icosaGeometry, icosaMaterial);
scene.add(icosahedron);

// Mesh 3: Octahedron
const octaGeometry = new THREE.OctahedronGeometry(3, 0);
const octaMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0066,
    roughness: 0.2,
    metalness: 0.8,
    wireframe: true
});
const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
scene.add(octahedron);

// Position them vertically spacing them out
knot.position.y = -2;
knot.position.x = 4;

icosahedron.position.y = -18;
icosahedron.position.x = -4;

octahedron.position.y = -34;
octahedron.position.x = 4;

const meshes = [knot, icosahedron, octahedron];

// Add a floating particle system
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  posArray[i * 3 + 0] = (Math.random() - 0.5) * 50;
  posArray[i * 3 + 1] = 10 - (Math.random() * 50); // Spread downwards spanning the scroll height
  posArray[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10; // Push them slightly back
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  color: 0xffffff,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Mouse interaction tracking
let cursor = { x: 0, y: 0 };
document.addEventListener('mousemove', (event) => {
  cursor.x = (event.clientX / window.innerWidth) - 0.5;
  cursor.y = (event.clientY / window.innerHeight) - 0.5;
});

// Scroll interaction tracking
let scrollY = window.scrollY;
document.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
const clock = new THREE.Clock();
let currentIntersect = null;
let previousTime = 0;

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // ==== SCROLL INTERACTION LOGIC ====
  // The camera moves DOWN as we scroll DOWN (y becomes more negative)
  // And it moves UP when you scroll UP.
  const targetScrollY = -scrollY * 0.02;

  // Parallax / slight camera movement based on mouse
  const parallaxX = cursor.x * 2;
  const parallaxY = -cursor.y * 2;
  camera.position.x += (parallaxX - camera.position.x) * 0.05;
  
  // Notice we add the parallax effect to the scroll effect for Y
  const targetCameraY = targetScrollY + parallaxY;
  
  // Smoothly interpolate the camera's position towards the combined scroll + parallax target
  // This causes the camera to seemingly float to the correct height as you scroll up and down
  camera.position.y += (targetCameraY - camera.position.y) * 0.05;
  // ==================================

  // Rotate Meshes as the camera flies past them
  // We use scrollY to make them spin as you scroll!
  for (const mesh of meshes) {
      if (mesh === knot) {
        mesh.rotation.y = elapsedTime * 0.2 + (scrollY * 0.005);
        mesh.rotation.z = elapsedTime * 0.1;
      } else if (mesh === icosahedron) {
        mesh.rotation.x = elapsedTime * 0.3;
        mesh.rotation.y = elapsedTime * 0.1 + (scrollY * 0.005);
      } else if (mesh === octahedron) {
        mesh.rotation.x = elapsedTime * 0.2 + (scrollY * 0.005);
        mesh.rotation.z = elapsedTime * 0.3;
      }
  }

  // Animate particles slowly
  particlesMesh.rotation.y = elapsedTime * 0.02;

  // Pulsing lights
  pointLight1.intensity = 200 + Math.sin(elapsedTime * 2) * 100;
  pointLight2.intensity = 200 + Math.cos(elapsedTime * 3) * 100;

  renderer.render(scene, camera);
}

animate();

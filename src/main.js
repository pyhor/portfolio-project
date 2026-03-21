import './style.scss';
import * as THREE from 'three';
import { initI18n } from './i18n.js';
import './github.js';
import './projects.js';

// Initialize i18n engine before 3D loads natively
initI18n();

// 1. Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.015);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Start camera closer
camera.position.z = 10;
camera.position.x = 0;
camera.position.y = 0;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
// Make the canvas fixed in the background so you can scroll HTML over it
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1';
document.body.appendChild(renderer.domElement);

// Adding fancy lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Soft white ambient
scene.add(ambientLight);

// Pastel peach light
const pointLight1 = new THREE.PointLight(0xffdac4, 300, 100);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

// Pale lavender light
const pointLight2 = new THREE.PointLight(0xe5d1ff, 300, 100);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

// Objects to scroll past
// Objects to scroll past
// Premium Glass Material
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.15,
  transmission: 0.95, // clear glass effect
  ior: 1.5,
  thickness: 2.0,
  transparent: true,
  opacity: 1
});

// Helper to prepare organic morphing shapes
function createOrganicBlob(baseRadius, detail, scaleX, scaleY, scaleZ) {
    const geometry = new THREE.IcosahedronGeometry(baseRadius, detail);
    geometry.scale(scaleX, scaleY, scaleZ);
    
    const originalPositions = [];
    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
        originalPositions.push(new THREE.Vector3().fromBufferAttribute(posAttr, i));
    }
    
    const mesh = new THREE.Mesh(geometry, glassMaterial);
    return { mesh, originalPositions, geometry };
}

// 1: Hero Blob (Perfect sphere morphing into blob)
const blob1 = createOrganicBlob(4, 16, 1, 1, 1);
scene.add(blob1.mesh);

// 2: Oval Blob (Horizontal)
const blob2 = createOrganicBlob(3, 16, 1.5, 0.8, 1);
scene.add(blob2.mesh);

// 3: Vertical Pill Blob
const blob3 = createOrganicBlob(3, 16, 0.8, 1.5, 0.8);
scene.add(blob3.mesh);

// Position them vertically spacing them out
blob1.mesh.position.y = -2;
blob1.mesh.position.x = 4;

blob2.mesh.position.y = -18;
blob2.mesh.position.x = -4;

blob3.mesh.position.y = -34;
blob3.mesh.position.x = 4;

const morphables = [blob1, blob2, blob3];
const meshes = [blob1.mesh, blob2.mesh, blob3.mesh]; // for raycasting

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
  size: 0.05,
  color: 0xaaaaaa,
  transparent: true,
  opacity: 0.4,
  blending: THREE.NormalBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Mouse interaction tracking
let cursor = { x: 0, y: 0 };
const mouse = new THREE.Vector2(-2, -2); // Default offscreen
const raycaster = new THREE.Raycaster();

document.addEventListener('mousemove', (event) => {
  cursor.x = (event.clientX / window.innerWidth) - 0.5;
  cursor.y = (event.clientY / window.innerHeight) - 0.5;

  // For raycaster
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

document.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(meshes);
  if (intersects.length > 0) {
    const clickedObj = intersects[0].object;
    // Pop scale on click
    clickedObj.scale.set(1.5, 1.5, 1.5);
    
    // Story element interactions
    if (clickedObj === blob1.mesh) {
        clickedObj.material.transmission = clickedObj.material.transmission > 0.5 ? 0.0 : 0.95;
    } else if (clickedObj === blob2.mesh) {
        document.body.style.backgroundColor = document.body.style.backgroundColor === 'rgb(249, 246, 255)' ? 'transparent' : 'rgb(249, 246, 255)';
    } else if (clickedObj === blob3.mesh) {
        particlesMaterial.color.setHex(Math.random() * 0xffffff);
    }
  }
});

// Scroll interaction tracking
let scrollY = window.scrollY;
document.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Story Text Fade-in Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            const textElement = entry.target.querySelector('.story-text');
            if(textElement) textElement.classList.add('visible');
        } else {
            const textElement = entry.target.querySelector('.story-text');
            if(textElement) textElement.classList.remove('visible');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.story-section').forEach((section) => observer.observe(section));

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
const tempVertex = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // ==== SCROLL INTERACTION LOGIC ====
  const targetScrollY = -scrollY * 0.02;

  // Parallax / slight camera movement based on mouse
  const parallaxX = cursor.x * 2;
  const parallaxY = -cursor.y * 2;
  camera.position.x += (parallaxX - camera.position.x) * 0.05;
  
  const targetCameraY = targetScrollY + parallaxY;
  camera.position.y += (targetCameraY - camera.position.y) * 0.05;
  // ==================================

  // Rotate and MORPH organic blobs
  for (let b = 0; b < morphables.length; b++) {
      const morph = morphables[b];
      const mesh = morph.mesh;
      const originalPositions = morph.originalPositions;
      const posAttr = morph.geometry.attributes.position;
      
      // Rotations
      mesh.rotation.y = elapsedTime * (0.1 + b * 0.05) + (scrollY * 0.005);
      mesh.rotation.z = elapsedTime * (0.05 + b * 0.02);
      
      // Undulate (Liquid Morphing)
      const morphSpeed = elapsedTime * 0.5 + (b * 10);
      for (let i = 0; i < posAttr.count; i++) {
          tempVertex.copy(originalPositions[i]);
          
          // Noise-like organic displacement using combined sin/cos waves
          const waveX = Math.sin(tempVertex.x * 0.8 + morphSpeed);
          const waveY = Math.cos(tempVertex.y * 0.8 + morphSpeed);
          const waveZ = Math.sin(tempVertex.z * 0.8 + morphSpeed);
          
          const displacement = (waveX * waveY * waveZ) * 0.6; // Bump intensity
          
          const distance = tempVertex.length();
          tempVertex.normalize().multiplyScalar(distance + displacement);
          
          posAttr.setXYZ(i, tempVertex.x, tempVertex.y, tempVertex.z);
      }
      posAttr.needsUpdate = true;
      morph.geometry.computeVertexNormals(); // Crucial for glass reflections
      
      // Default reset scale and roughness (glassy)
      mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      mesh.material.roughness += (0.15 - mesh.material.roughness) * 0.1;
  }

  // Raycaster for Hover interaction
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(meshes);

  if (intersects.length > 0) {
      const hoveredObj = intersects[0].object;
      hoveredObj.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1);
      
      // Make the glass clearer on hover
      hoveredObj.material.roughness += (0.02 - hoveredObj.material.roughness) * 0.1;

      // Rotate a bit faster when hovered
      hoveredObj.rotation.x += 0.01;
      hoveredObj.rotation.y += 0.01;
  }

  // Animate particles slowly
  particlesMesh.rotation.y = elapsedTime * 0.02;

  // Pulsing lights
  pointLight1.intensity = 200 + Math.sin(elapsedTime * 2) * 100;
  pointLight2.intensity = 200 + Math.cos(elapsedTime * 3) * 100;

  renderer.render(scene, camera);
}

animate();

// --- Theme Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    // Check local storage for persistent theme
    let isDark = localStorage.getItem('theme') === 'dark';
    
    const applyTheme = () => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀' : '☾';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update 3D Scene
        const bgColor = isDark ? 0x050505 : 0xffffff;
        if (!scene.background) scene.background = new THREE.Color();
        scene.background.setHex(bgColor);
        scene.fog.color.setHex(bgColor);
        
        // Update Materials for better dark mode aesthetics
        glassMaterial.color.setHex(isDark ? 0x000000 : 0xffffff);
        particlesMaterial.color.setHex(isDark ? 0x222222 : 0xaaaaaa);
        
        // Shift lighting for an authentically dark, neon-lit 3D scene
        ambientLight.intensity = isDark ? 0.1 : 2.0;
        pointLight1.color.setHex(isDark ? 0x9900ff : 0xffdac4); // Deep Purple glowing through the black glass
        pointLight2.color.setHex(isDark ? 0x00aaff : 0xe5d1ff); // Deep Blue glowing through the black glass
    };

    // Apply immediately if saved as dark
    if (isDark) applyTheme();

    themeToggle.addEventListener('click', () => {
        isDark = !isDark;
        applyTheme();
    });
}

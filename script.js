// === SCHMONEY DIGITAL - SCRIPT.JS ===

'use strict';

// Import Three.js (Ensure this path/method works with your setup - using import map from v0.158.0)
import * as THREE from 'three';
// Remove or comment out unused loaders if they exist
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- Sticky Header --- (Optional: Change background on scroll)
    const header = document.querySelector('.site-header');
    if (header) {
        const stickyThreshold = 50; // Pixels scrolled before header changes
        window.addEventListener('scroll', () => {
            if (window.scrollY > stickyThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Scroll Reveal Animations --- (Intersection Observer)
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); // Optional: Stop observing once visible
                }
                // No 'else' needed if we only animate once
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers: just show all elements
        animatedElements.forEach(el => el.classList.add('is-visible'));
        console.warn('IntersectionObserver not supported, animations disabled.');
    }

    // --- Parallax Effect (Simple Example - Apply to specific backgrounds) ---
    // More robust parallax libraries exist, this is a basic concept
    // Add class 'parallax-bg' to sections where you want this effect
    const parallaxElements = document.querySelectorAll('.parallax-bg'); // Needs CSS for background-image
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', throttle(function() {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallaxSpeed) || 0.3; // Get speed from data-parallax-speed attribute or default
                const rect = el.getBoundingClientRect();
                // Calculate background position offset based on element's position in viewport
                const yOffset = -(window.scrollY * speed) % el.offsetHeight; // Simple vertical offset
                // Or adjust based on viewport intersection:
                // const windowHeight = window.innerHeight;
                // const elementTop = rect.top;
                // const elementHeight = rect.height;
                // if (elementTop < windowHeight && rect.bottom > 0) { // If element is in view
                //     const scrolledAmount = windowHeight - elementTop;
                //     const yOffset = -(scrolledAmount * speed);
                //     el.style.backgroundPositionY = `${yOffset}px`;
                // }
                // Simplified version using backgroundPositionY (ensure background-attachment is NOT fixed)
                 el.style.backgroundPositionY = `${yOffset}px`;
            });
        }, 10)); // Throttle scroll events for performance
    }

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- (Optional) Contact Form Handling Placeholder ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = contactForm.querySelector('.form-status');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default submission
            if (formStatus) formStatus.textContent = 'Sending...';
            // Simulate sending (Replace with actual fetch/AJAX later)
            setTimeout(() => {
                console.log('Form submitted (simulated)');
                if (formStatus) formStatus.textContent = 'Message sent successfully!';
                contactForm.reset();
                 setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 5000); // Clear status after 5s
            }, 1500);
        });
    }

    // --- (Optional) Portfolio Filter Placeholder ---
    const filterContainer = document.querySelector('.portfolio-filters');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (filterContainer && portfolioGrid) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Remove active class from all buttons
                filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');

                const filterValue = e.target.getAttribute('data-filter');
                const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item');

                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block'; // Or use animation classes
                    } else {
                        item.style.display = 'none'; // Or use animation classes
                    }
                });
            }
        });
    }

    // --- Animated Waves Parallax & Mouse Interaction ---
    const wavesContainer = document.querySelector('.animated-waves-background'); // Target the container
    const wave1 = document.getElementById('wave1'); // Select by ID
    const wave2 = document.getElementById('wave2'); // Select by ID
    const wave3 = document.getElementById('wave3'); // Select by ID
    let rAFActive = false; // Use a flag for requestAnimationFrame

    // Mouse position variables (normalized -1 to 1)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0; // For smoother lerping
    let targetMouseY = 0;
    const lerpFactor = 0.08; // Smoothing factor for mouse movement

    // Update target mouse coordinates on move
    window.addEventListener('mousemove', (event) => {
        // Normalize mouse position to range from -1 to 1 relative to window center
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = (event.clientY / window.innerHeight) * 2 - 1;
        // Request animation frame if not already active
        if (!rAFActive) {
            updateWaveTransforms();
        }
    });

    // Function to update transforms (called by scroll and potentially mousemove via rAF)
    function updateWaveTransforms() {
        rAFActive = true;

        const scrollY = window.scrollY;
        const swayFactor = 30; // INCREASED max pixels waves move with mouse
        const mouseYSwayFactor = 20; // Separate factor for Y sway

        // Smoothly interpolate current mouse position towards target
        mouseX += (targetMouseX - mouseX) * lerpFactor;
        mouseY += (targetMouseY - mouseY) * lerpFactor;

        // Calculate parallax offsets (INCREASED multipliers significantly)
        const parallaxOffset1 = scrollY * 0.2; // Back layer moves less
        const parallaxOffset2 = scrollY * 0.5;
        const parallaxOffset3 = scrollY * 0.7; // Front layer moves most

        // Calculate mouse offsets (INCREASED factors for more pronounced effect)
        const mouseOffsetX1 = mouseX * swayFactor * 0.5;
        const mouseOffsetY1 = mouseY * mouseYSwayFactor * 0.3;
        const mouseOffsetX2 = mouseX * swayFactor * 0.8;
        const mouseOffsetY2 = mouseY * mouseYSwayFactor * 0.6;
        const mouseOffsetX3 = mouseX * swayFactor * 1.2; // >1 for exaggerated front layer
        const mouseOffsetY3 = mouseY * mouseYSwayFactor * 0.9;

        // Apply combined transforms
        // We only apply translate via JS. The base animation (scale/skew) is handled by CSS.
        // We use requestAnimationFrame to prevent conflicting updates.
        if (wave1) wave1.style.transform = `translate(${mouseOffsetX1}px, ${parallaxOffset1 + mouseOffsetY1}px)`;
        if (wave2) wave2.style.transform = `translate(${mouseOffsetX2}px, ${parallaxOffset2 + mouseOffsetY2}px)`;
        if (wave3) wave3.style.transform = `translate(${mouseOffsetX3}px, ${parallaxOffset3 + mouseOffsetY3}px)`;

        // Keep requesting frames as long as mouse position is changing significantly
        if (Math.abs(targetMouseX - mouseX) > 0.01 || Math.abs(targetMouseY - mouseY) > 0.01) {
            window.requestAnimationFrame(updateWaveTransforms);
        } else {
            rAFActive = false; // Stop rAF when mouse is relatively still
        }
    }

    // Scroll handler - just triggers the rAF update function
    function handleScroll() {
        if (!rAFActive) {
            window.requestAnimationFrame(updateWaveTransforms);
        }
    }

    if (wave1 && wave2 && wave3 && wavesContainer) { // Check container too
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial call to set position
        updateWaveTransforms();

        // --- Intersection Observer for Calming Waves ---
        const servicesSection = document.querySelector('.services-overview');
        if (servicesSection) {
            const waveObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Section below hero is entering viewport, calm the waves
                        wavesContainer.classList.add('waves-calm-down');
                    } else {
                        // Section below hero is leaving viewport, resume waves
                        wavesContainer.classList.remove('waves-calm-down');
                    }
                });
            }, {
                threshold: 0.1 // Trigger when 10% visible
            });
            waveObserver.observe(servicesSection);
        }
    }

    /* === 3D Wave Scene Setup === */
    const canvas3D = document.getElementById('hero-3d-model-canvas');
    if (canvas3D) {
        setup3DScene(canvas3D);
    }

}); // End DOMContentLoaded

/* =========================
   3D Wave Scene Definition
   ========================= */

function setup3DScene(canvas) {
    import('three/examples/jsm/controls/OrbitControls.js').then(mod => {
        const { OrbitControls } = mod;
        const scene = new THREE.Scene();
        scene.background = null; // Transparent background

        // Renderer
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Camera
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 8, 30);

        // Lights
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        scene.add(directionalLight);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        // Controls (for debugging)
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enabled = false; // Disable for production

        // Wave material to apply
        const waveMaterial = new THREE.MeshPhongMaterial({ color: 0x0a7ea3, flatShading: true, side: THREE.DoubleSide });

        const objLoaderPromise = import('three/examples/jsm/loaders/OBJLoader.js');
        Promise.all([objLoaderPromise]).then(([objModule]) => {
            const { OBJLoader } = objModule;
            const objLoader = new OBJLoader();
            objLoader.load('wave.obj', (loadedObject) => {
                const waveModel = loadedObject;

                // Apply thematic material
                waveModel.traverse(child => {
                    if (child.isMesh) child.material = waveMaterial;
                });

                // --- Initial Transform for Crashing Wave ---
                const scale = 60;
                waveModel.scale.set(scale, scale, scale);
                waveModel.position.set(0, -15, -40);
                waveModel.rotation.x = -Math.PI / 7;
                waveModel.rotation.y = Math.PI / 9;
                // --- End Initial Transform ---

                scene.add(waveModel);

                // Animation loop
                function animate() {
                    requestAnimationFrame(animate);

                    const time = performance.now() * 0.0004;
                    const baseZ = -40;
                    const amplitudeZ = 25;
                    waveModel.position.z = baseZ + ((Math.cos(time) + 1) / 2) * amplitudeZ;

                    const baseY = -15;
                    const amplitudeY = 5;
                    waveModel.position.y = baseY + ((Math.sin(time + Math.PI / 4) + 1) / 2) * amplitudeY;

                    waveModel.rotation.y += 0.0003;
                    controls.update();
                    renderer.render(scene, camera);
                }
                animate();
            });
        });

        // Responsive resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    });
}

// --- Helper Functions ---

// Throttle function to limit how often a function is called
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// REMOVE Old Parallax Scrolling Effect Code
/*
const parallaxLayer1 = document.querySelector('.parallax-layer-1');
const parallaxLayer2 = document.querySelector('.parallax-layer-2');
const parallaxLayer3 = document.querySelector('.parallax-layer-3');

let ticking = false;

function handleParallaxScroll() { ... }
function requestTick() { ... }
window.addEventListener('scroll', requestTick, { passive: true });
handleParallaxScroll(); 
*/ 
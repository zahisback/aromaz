import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const GlbModel = () => {
  const mountRef = useRef(null);
  const controls = useRef(null);
  const camera = useRef(null);
  const renderer = useRef(null);

  useEffect(() => {
    let scene;

    const init = async () => {
      // Create scene
      scene = new THREE.Scene();

      // Create camera
      const newCamera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      newCamera.position.z = 5;
      camera.current = newCamera;

      // Create renderer
      const newRenderer = new THREE.WebGLRenderer({ antialias: true });
      newRenderer.setSize(window.innerWidth, window.innerHeight);
      renderer.current = newRenderer;
      mountRef.current.appendChild(newRenderer.domElement);

      // Load Blender scene
      const loader = new GLTFLoader();
      loader.load('CoCo.glb', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
      });

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light
      directionalLight.position.set(1, 1, 1).normalize(); // Set position
      scene.add(directionalLight);

      // Create controls
      controls.current = new OrbitControls(camera.current, renderer.current.domElement);
      controls.current.enableDamping = true;
      controls.current.dampingFactor = 0.1;
      controls.current.rotateSpeed = 0.5;
      controls.current.zoomSpeed = 1.2;

      // Animation/render loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.current.update();
        renderer.current.render(scene, camera.current);
      };

      animate();
    };

    init();

    // Clean up Three.js resources when component unmounts
    return () => {
      controls.current.dispose();
      renderer.current.dispose();
      // Dispose other Three.js resources as needed
    };
  }, []);

  return <div ref={mountRef} />;
};

export default GlbModel;

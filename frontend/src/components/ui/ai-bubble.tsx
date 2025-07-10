"use client";

const AMPLITUDE = 0.5;
const ROTATION_SPEED = 0.9;
const WOBBLE_SPEED = 2;
const GLOW_SCALE = 1.95;
const GLOW_STRENGTH = 5;
const ZOOM = 5;
const COLOR_PALETTE = ["#329DF7", "#D85E97", "#F7644D", "#FEB028"];

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AIBubble() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// Clear any existing canvas elements first
		while (containerRef.current.firstChild) {
			containerRef.current.removeChild(containerRef.current.firstChild);
		}

		const width = containerRef.current.clientWidth;
		const height = containerRef.current.clientHeight;

		// Scene, Camera, Renderer
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			50,
			width / height,
			0.1,
			1000,
		);
		camera.position.z = ZOOM;

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});
		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		containerRef.current.appendChild(renderer.domElement);

		// Icosahedron Geometry
		const geometry = new THREE.IcosahedronGeometry(1, 64);

		// Convert color palette to Three.Color
		const colorObjects = COLOR_PALETTE.map((hex) => new THREE.Color(hex));
		const paletteColors = colorObjects.map(
			(c) => new THREE.Vector3(c.r, c.g, c.b),
		);
		const paletteCount = paletteColors.length;

		// --- Main Mesh with ShaderMaterial (Bubble) ---
		const vertexShader = `
      uniform float uTime;
      uniform float uAmp;
      uniform float uWobbleSpeed;
      varying vec3 vPos;
      void main() {
          vPos = position;
          vec3 newPosition = position + normal * sin(uTime * uWobbleSpeed + position.x * 5.0 + position.y * 3.0) * 0.08 * uAmp;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

		const fragmentShader = `
      uniform float uTime;
      uniform vec3 uPalette[${paletteCount}];
      uniform int uPaletteCount;
      varying vec3 vPos;
      
      void main() {
          float angle = atan(vPos.y, vPos.x) + uTime * ${ROTATION_SPEED};
          float normalizedAngle = fract((angle + 3.14159) / 6.28318);
          
          float scaled = normalizedAngle * float(uPaletteCount);
          int idx1 = int(floor(scaled));
          int idx2 = (idx1 + 1) % uPaletteCount;
          float t = fract(scaled);
          vec3 paletteColor = mix(uPalette[idx1], uPalette[idx2], t);
          
          float dist = length(vPos.xy);
          float alpha = smoothstep(0.6, 1.0, dist);
          
          gl_FragColor = vec4(paletteColor, alpha);
      }
    `;

		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uAmp: { value: AMPLITUDE },
				uWobbleSpeed: { value: WOBBLE_SPEED },
				uPalette: { value: paletteColors },
				uPaletteCount: { value: paletteCount },
			},
			transparent: true,
		});

		const mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		// --- Glow Mesh with the same deformed form as the Bubble ---
		const glowVertexShader = `
      uniform float uTime;
      uniform float uAmp;
      uniform float uWobbleSpeed;
      uniform float uScale;
      varying vec3 vPos;
      void main() {
          vec3 newPosition = position + normal * sin(uTime * uWobbleSpeed + position.x * 5.0 + position.y * 3.0) * 0.08 * uAmp;
          newPosition *= uScale;
          vPos = newPosition;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;
		const glowFragmentShader = `
      uniform float uGlowStrength;
      uniform float uTime;
      uniform vec3 uPalette[${paletteCount}];
      uniform int uPaletteCount;
      varying vec3 vPos;
      
      void main(){
          float angle = atan(vPos.y, vPos.x) + uTime * ${ROTATION_SPEED};
          float normalizedAngle = fract((angle + 3.14159) / 6.28318);
          
          float scaled = normalizedAngle * float(uPaletteCount);
          int idx1 = int(floor(scaled));
          int idx2 = (idx1 + 1) % uPaletteCount;
          float t = fract(scaled);
          vec3 paletteColor = mix(uPalette[idx1], uPalette[idx2], t);
          
          float dist = length(vPos.xy);
          float alpha = smoothstep(2.0, 1.2, dist);
          gl_FragColor = vec4(paletteColor, alpha * uGlowStrength);
      }
    `;

		const glowMaterial = new THREE.ShaderMaterial({
			vertexShader: glowVertexShader,
			fragmentShader: glowFragmentShader,
			uniforms: {
				uTime: { value: 0 },
				uAmp: { value: AMPLITUDE },
				uWobbleSpeed: { value: WOBBLE_SPEED },
				uScale: { value: GLOW_SCALE },
				uGlowStrength: { value: GLOW_STRENGTH },
				uPalette: { value: paletteColors },
				uPaletteCount: { value: paletteCount },
			},
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false,
		});

		const glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
		scene.add(glowMesh);

		// --- Lighting ---
		const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambLight);
		const pointLight = new THREE.PointLight(0xffffff, 1);
		pointLight.position.set(5, 5, 5);
		scene.add(pointLight);

		// --- Animation
		let frameId: number;
		const clock = new THREE.Clock();
		const animate = () => {
			const elapsed = clock.getElapsedTime();
			material.uniforms.uTime.value = elapsed;
			glowMaterial.uniforms.uTime.value = elapsed;

			renderer.render(scene, camera);
			frameId = requestAnimationFrame(animate);
		};
		animate();

		// --- Responsive Canvas
		const handleResize = () => {
			if (!containerRef.current) return;
			const w = containerRef.current.clientWidth;
			const h = containerRef.current.clientHeight;
			renderer.setSize(w, h);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
		};
		window.addEventListener("resize", handleResize);

		// --- Cleanup
		return () => {
			cancelAnimationFrame(frameId);
			window.removeEventListener("resize", handleResize);

			// Dispose of Three.js resources
			renderer.dispose();
			geometry.dispose();
			material.dispose();
			glowMaterial.dispose();

			// Remove canvas element safely
			if (
				containerRef.current &&
				renderer.domElement &&
				containerRef.current.contains(renderer.domElement)
			) {
				containerRef.current.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<div
			ref={containerRef}
			style={{ width: "256px", height: "256px" }}
		/>
	);
}

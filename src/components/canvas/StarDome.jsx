import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';

const StarDome = () => {
    // useRef ne ajuta sa legam canvasul lui Three.js de divul din React
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#030308');
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 0.1);

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // aducerea datelor si conversia
        fetch('data/stars.json')
            .then(response => response.json())
            .then(stars => {
                const radius = 500; // raza domului imaginar
                const vertices = [];

                stars.forEach(star => {
                    const raRad = star.ra * (Math.PI / 12);
                    const decRad = star.dec * (Math.PI / 180);
                    const x = radius * Math.cos(decRad) * Math.cos(raRad);
                    const y = radius * Math.sin(decRad);
                    const z = radius * Math.cos(decRad) * Math.sin(raRad);

                    vertices.push(x,y,z);
                });

                // crearea stelelor
                const geometry = new THREE.BufferGeometry();
                // BufferAttribute trimite toate coordonatele dintr-odata catre placa video
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                const material = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 1.2,
                    sizeAttenuation: true, // stelele mentin proportia in functie de distanta
                    transparent: true,
                    opacity: 0.8
                });

                const starPoints = new THREE.Points(geometry, material);
                scene.add(starPoints);
            });

        // bucla de animatie (render loop)
        const animate = () => {
            requestAnimationFrame(animate);

            // rotim scena f incet ca sa simulam miscarea boltei ceresti
            scene.rotation.y += 0.0003;
            renderer.render(scene, camera);
        };
        animate();

        // responsiveness
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        //cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []); // [] inseamna ca efectul ruleaza o sg data, la incarcarea paginii

    return <div ref={mountRef} className="absolute top-0 left-0 w-screen h-screen -z-10" />;
};

export default StarDome;
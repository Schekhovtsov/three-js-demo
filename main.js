import * as THREE from 'three';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let container;

let camera, cameraTarget, scene, renderer;

let font;

const cursor = {
    x: 0,
    y: 0,
};

const cameraDefaultCoordinates = {
    x: 0,
    y: 0,
    z: 1000,
};

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

init();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        1500
    );

    camera.position.set(
        cameraDefaultCoordinates.x,
        cameraDefaultCoordinates.y,
        cameraDefaultCoordinates.z
    );

    cameraTarget = new THREE.Vector3(0, 0, 0);

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff');

    createText();

    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
    dirLight.position.set( 0, 0, 1 ).normalize();
    scene.add( dirLight );

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setAnimationLoop(animate);
    container.appendChild(renderer.domElement);

    // EVENTS

    container.addEventListener('mousemove', onMouseMoveHandler);
}

function createText() {
    const loader = new FontLoader();
    loader.load('src/assets/fonts/helvetiker.json', function (response) {
        font = response;

        const textGeo = new TextGeometry('SCHEKHOVTSOV', {
            font: font,
            size: 72,
            depth: 20,
            curveSegments: 10,
        });

        textGeo.computeBoundingBox();

        const centerOffset =
            -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

        const textMesh = new THREE.Mesh(
            textGeo,
            new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true })
        );

        textMesh.position.x = centerOffset;
        textMesh.position.y = 0;
        textMesh.position.z = 0;

        scene.add(textMesh);
    });
}

function animate() {
    camera.lookAt(cameraTarget);

    renderer.clear();
    renderer.render(scene, camera);
}

function onMouseMoveHandler (event) {
    cursor.x = -(event.clientX / sizes.width - 0.5);
    cursor.y = event.clientY / sizes.height - 0.5;

    camera.position.set(
        cameraDefaultCoordinates.x + cursor.x * 300,
        cameraDefaultCoordinates.y + cursor.y * 300,
        cameraDefaultCoordinates.z
    );
};
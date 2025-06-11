import "https://assets.babylonjs.com/generated/Assets.js";
import "https://cdn.babylonjs.com/recast.js";
import "https://cdn.babylonjs.com/ammo.js";
import "https://cdn.babylonjs.com/cannon.js";
import "https://cdn.babylonjs.com/Oimo.js";
import "https://cdn.babylonjs.com/earcut.min.js";
import "https://cdn.babylonjs.com/babylon.js";
import "https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js";
import "https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js";
import "https://cdn.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js";
import "https://cdn.babylonjs.com/loaders/babylonjs.loaders.js";
import "https://cdn.babylonjs.com/serializers/babylonjs.serializers.min.js";    
import "https://cdn.babylonjs.com/gui/babylon.gui.min.js";  
import "https://cdn.babylonjs.com/addons/babylonjs.addons.min.js";
import "https://cdn.babylonjs.com/inspector/babylon.inspector.bundle.js";

var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
};

var engine = null;
var scene = null;
var sceneToRender = null;

var createDefaultEngine = function() { 
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); 
};

var delayCreateScene = async function () {

    scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 4, Math.atan(Math.sqrt(2)), 25, new BABYLON.Vector3(-15, 0, 0), scene);

    scene.activeCamera.panningInertia = 200;
    scene.activeCamera.wheelDeltaPercentage = 0.035;
    scene.activeCamera.upperRadiusLimit = 100;
    scene.activeCamera.allowUpsideDown = false;
    scene.activeCamera.lowerRadiusLimit = 1;
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const env = scene.createDefaultEnvironment({
        groundSize: 100,
        createSkybox: false,
        enableGroundShadow: true
    });

    const xr = await scene.createDefaultXRExperienceAsync({
        floorMeshes: [env.ground],
        uiOptions: {
            sessionMode: 'immersive-ar'
        }
    });

    var showAxis = function(size) {
        var makeTextPlane = function(text, color, size) {
            var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
            var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
            plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            plane.material.backFaceCulling = false;
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
            plane.material.diffuseTexture = dynamicTexture;
            return plane;
        };
    
        var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], scene);
        axisX.color = new BABYLON.Color3(1, 0, 0);

        var xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

        var axisY = BABYLON.Mesh.CreateLines("axisY", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0), 
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ], scene);
        axisY.color = new BABYLON.Color3(0, 1, 0);

        var yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

        var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ], scene);
        axisZ.color = new BABYLON.Color3(0, 0, 1);

        var zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    };

    showAxis(5);

    const importedMeshes = {};

    const models = [
        { url: "assets/DMC_small.glb", name: "DMC_small" },
        { url: "assets/AGV_small.glb", name: "AGV_small" },
        { url: "assets/Beam_small.glb", name: "Beam_small" },
        { url: "assets/DMU_small.glb", name: "DMU_small" },
        { url: "assets/E500_small.glb", name: "E500_small" },
        { url: "assets/FZ12_small.glb", name: "FZ12_small", position: new BABYLON.Vector3(21, 0, 0) },
        { url: "assets/G350_small.glb", name: "G350_small" },
        { url: "assets/GR300C_small.glb", name: "GR300C_small" },
        { url: "assets/Roboter_small.glb", name: "Roboter_small" }
    ];

    const importModel = (model) => {
        return BABYLON.SceneLoader.ImportMeshAsync("", model.url, model.name, scene)
            .then((result) => {
                const meshes = result.meshes;
                if (meshes.length > 0) {
                    importedMeshes[model.name] = meshes;

                    const firstMesh = meshes[0];
                    firstMesh.bakeCurrentTransformIntoVertices();
                    
                    if (model.position) {
                        firstMesh.position = model.position;
                    }
                }
            }).catch((error) => {
                console.error(`Error importing ${model.name}:`, error);
            });
    };

    models.forEach(importModel);

    const toggleVisibility = (name) => {
        const modelMeshes = importedMeshes[name];
        if (modelMeshes) {
            modelMeshes.forEach(mesh => {
                mesh.isVisible = !mesh.isVisible;
            });
        } else {
            console.warn(`Model ${name} not found.`);
        }
    };

    const setEnabled = (name, enabled) => {
        const modelMeshes = importedMeshes[name];
        if (modelMeshes) {
            modelMeshes.forEach(mesh => {
                mesh.setEnabled(enabled);
            });
        } else {
            console.warn(`Model ${name} not found.`);
        }
    };

    return scene;
};

window.initFunction = async function() {
    var asyncEngineCreation = async function() {
        try {
            return createDefaultEngine();
        } catch(e) {
            console.log("The available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }
    
    engine = await asyncEngineCreation();
    window.engine = engine;

    if (!engine) throw 'Engine should not be null.';
    startRenderLoop(engine, canvas);
    scene = delayCreateScene();
    window.scene = scene;
    scene.then(returnedScene => { sceneToRender = returnedScene; });
};

window.addEventListener("DOMContentLoaded", () => {
    initFunction();
});

window.addEventListener("resize", function () {
    if (engine) {
        engine.resize();
    }
});
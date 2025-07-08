import path from "path";
import { existsSync } from "fs";

/**
 * Find the project root directory by looking for package.json
 */
export function findProjectRoot(startPath = process.cwd()): string {
  try {
    let currentPath = startPath;
    let count = 0;

    while (currentPath !== path.parse(currentPath).root && count < 20) {
      if (existsSync(path.join(currentPath, "package.json"))) {
        return currentPath;
      }
      currentPath = path.dirname(currentPath);
      count++;
    }

    return process.cwd();
  } catch (error) {
    console.error("Error finding project root:", error);
    return process.cwd();
  }
}

/**
 * Three.js Fiber elements that should not be tagged
 */
const threeFiberElems = [
  "object3D",
  "audioListener",
  "positionalAudio",
  "mesh",
  "batchedMesh",
  "instancedMesh",
  "scene",
  "sprite",
  "lOD",
  "skinnedMesh",
  "skeleton",
  "bone",
  "lineSegments",
  "lineLoop",
  "points",
  "group",
  "camera",
  "perspectiveCamera",
  "orthographicCamera",
  "cubeCamera",
  "arrayCamera",
  "instancedBufferGeometry",
  "bufferGeometry",
  "boxBufferGeometry",
  "circleBufferGeometry",
  "coneBufferGeometry",
  "cylinderBufferGeometry",
  "dodecahedronBufferGeometry",
  "extrudeBufferGeometry",
  "icosahedronBufferGeometry",
  "latheBufferGeometry",
  "octahedronBufferGeometry",
  "planeBufferGeometry",
  "polyhedronBufferGeometry",
  "ringBufferGeometry",
  "shapeBufferGeometry",
  "sphereBufferGeometry",
  "tetrahedronBufferGeometry",
  "torusBufferGeometry",
  "torusKnotBufferGeometry",
  "tubeBufferGeometry",
  "wireframeGeometry",
  "tetrahedronGeometry",
  "octahedronGeometry",
  "icosahedronGeometry",
  "dodecahedronGeometry",
  "polyhedronGeometry",
  "tubeGeometry",
  "torusKnotGeometry",
  "torusGeometry",
  "sphereGeometry",
  "ringGeometry",
  "planeGeometry",
  "latheGeometry",
  "shapeGeometry",
  "extrudeGeometry",
  "edgesGeometry",
  "coneGeometry",
  "cylinderGeometry",
  "circleGeometry",
  "boxGeometry",
  "capsuleGeometry",
  "material",
  "shadowMaterial",
  "spriteMaterial",
  "rawShaderMaterial",
  "shaderMaterial",
  "pointsMaterial",
  "meshPhysicalMaterial",
  "meshStandardMaterial",
  "meshPhongMaterial",
  "meshToonMaterial",
  "meshNormalMaterial",
  "meshLambertMaterial",
  "meshDepthMaterial",
  "meshDistanceMaterial",
  "meshBasicMaterial",
  "meshMatcapMaterial",
  "lineDashedMaterial",
  "lineBasicMaterial",
  "primitive",
  "light",
  "spotLightShadow",
  "spotLight",
  "pointLight",
  "rectAreaLight",
  "hemisphereLight",
  "directionalLightShadow",
  "directionalLight",
  "ambientLight",
  "lightShadow",
  "ambientLightProbe",
  "hemisphereLightProbe",
  "lightProbe",
  "spotLightHelper",
  "skeletonHelper",
  "pointLightHelper",
  "hemisphereLightHelper",
  "gridHelper",
  "polarGridHelper",
  "directionalLightHelper",
  "cameraHelper",
  "boxHelper",
  "box3Helper",
  "planeHelper",
  "arrowHelper",
  "axesHelper",
  "texture",
  "videoTexture",
  "dataTexture",
  "dataTexture3D",
  "compressedTexture",
  "cubeTexture",
  "canvasTexture",
  "depthTexture",
  "raycaster",
  "vector2",
  "vector3",
  "vector4",
  "euler",
  "matrix3",
  "matrix4",
  "quaternion",
  "bufferAttribute",
  "float16BufferAttribute",
  "float32BufferAttribute",
  "float64BufferAttribute",
  "int8BufferAttribute",
  "int16BufferAttribute",
  "int32BufferAttribute",
  "uint8BufferAttribute",
  "uint16BufferAttribute",
  "uint32BufferAttribute",
  "instancedBufferAttribute",
  "color",
  "fog",
  "fogExp2",
  "shape",
  "colorShiftMaterial",
];

/**
 * Drei (React Three Fiber helpers) elements that should not be tagged
 */
const dreiElems = [
  "AsciiRenderer",
  "Billboard",
  "Clone",
  "ComputedAttribute",
  "Decal",
  "Edges",
  "Effects",
  "GradientTexture",
  "Image",
  "MarchingCubes",
  "Outlines",
  "PositionalAudio",
  "Sampler",
  "ScreenSizer",
  "ScreenSpace",
  "Splat",
  "Svg",
  "Text",
  "Text3D",
  "Trail",
  "CubeCamera",
  "OrthographicCamera",
  "PerspectiveCamera",
  "CameraControls",
  "FaceControls",
  "KeyboardControls",
  "MotionPathControls",
  "PresentationControls",
  "ScrollControls",
  "DragControls",
  "GizmoHelper",
  "Grid",
  "Helper",
  "PivotControls",
  "TransformControls",
  "CubeTexture",
  "Fbx",
  "Gltf",
  "Ktx2",
  "Loader",
  "Progress",
  "ScreenVideoTexture",
  "Texture",
  "TrailTexture",
  "VideoTexture",
  "WebcamVideoTexture",
  "CycleRaycast",
  "DetectGPU",
  "Example",
  "FaceLandmarker",
  "Fbo",
  "Html",
  "Select",
  "SpriteAnimator",
  "StatsGl",
  "Stats",
  "Trail",
  "Wireframe",
  "CurveModifier",
  "AdaptiveDpr",
  "AdaptiveEvents",
  "BakeShadows",
  "Bvh",
  "Detailed",
  "Instances",
  "Merged",
  "meshBounds",
  "PerformanceMonitor",
  "Points",
  "Preload",
  "Segments",
  "Fisheye",
  "Hud",
  "Mask",
  "MeshPortalMaterial",
  "RenderCubeTexture",
  "RenderTexture",
  "View",
  "MeshDiscardMaterial",
  "MeshDistortMaterial",
  "MeshReflectorMaterial",
  "MeshRefractionMaterial",
  "MeshTransmissionMaterial",
  "MeshWobbleMaterial",
  "PointMaterial",
  "shaderMaterial",
  "SoftShadows",
  "CatmullRomLine",
  "CubicBezierLine",
  "Facemesh",
  "Line",
  "Mesh",
  "QuadraticBezierLine",
  "RoundedBox",
  "ScreenQuad",
  "AccumulativeShadows",
  "Backdrop",
  "BBAnchor",
  "Bounds",
  "CameraShake",
  "Caustics",
  "Center",
  "Cloud",
  "ContactShadows",
  "Environment",
  "Float",
  "Lightformer",
  "MatcapTexture",
  "NormalTexture",
  "RandomizedLight",
  "Resize",
  "ShadowAlpha",
  "Shadow",
  "Sky",
  "Sparkles",
  "SpotLightShadow",
  "SpotLight",
  "Stage",
  "Stars",
  "OrbitControls",
];

/**
 * Check if an element should be tagged based on exclusion lists
 */
export function shouldTagElement(
  elementName: string,
  customExcludes: string[] = []
): boolean {
  return (
    !threeFiberElems.includes(elementName) &&
    !dreiElems.includes(elementName) &&
    !customExcludes.includes(elementName)
  );
}

/**
 * Generate a unique component ID for tagging
 */
export function generateComponentId(
  relativePath: string,
  line: number,
  column: number
): string {
  return `${relativePath}:${line}:${column}`;
}

/**
 * Check if a file should be processed based on its extension
 */
export function shouldProcessFile(
  filePath: string,
  extensions: string[]
): boolean {
  return (
    extensions.some(ext => filePath.endsWith(ext)) &&
    !filePath.includes("node_modules")
  );
}

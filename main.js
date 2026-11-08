import * as THREE from 'three'
import './style.css'

// ==================================
// LOST KINGDOM - PRINCE HEAD V1
// CLEAN ANIME OUTLINE
// ==================================

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xe8e3dc)

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)

camera.position.set(0, 0, 6)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2

document.body.appendChild(renderer.domElement)

// LIGHTS
scene.add(new THREE.HemisphereLight(0xffffff, 0x8c796c, 2))

const light = new THREE.DirectionalLight(0xffffff, 3)
light.position.set(-3, 5, 6)
scene.add(light)

// CHARACTER GROUP
const prince = new THREE.Group()
scene.add(prince)

// MATERIALS
const skin = new THREE.MeshToonMaterial({ color: 0xf2c6a8 })
const hair = new THREE.MeshToonMaterial({ color: 0x17131d })
const white = new THREE.MeshToonMaterial({ color: 0xffffff })
const iris = new THREE.MeshToonMaterial({ color: 0x49314c })
const dark = new THREE.MeshToonMaterial({ color: 0x39232a })

const outlineMaterial = new THREE.MeshBasicMaterial({
  color: 0x17131a,
  side: THREE.BackSide
})

// OUTLINE MESH
function part(geometry, material, position, scale, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material)

  mesh.position.set(...position)
  mesh.scale.set(...scale)
  mesh.rotation.set(...rotation)

  prince.add(mesh)

  const outline = new THREE.Mesh(geometry, outlineMaterial)
  outline.position.copy(mesh.position)
  outline.rotation.copy(mesh.rotation)
  outline.scale.copy(mesh.scale).multiplyScalar(1.025)

  prince.add(outline)

  return mesh
}

// NECK
part(
  new THREE.CylinderGeometry(0.19, 0.21, 0.5, 16),
  skin,
  [0, -0.9, 0],
  [1, 1, 1]
)

// FACE
part(
  new THREE.SphereGeometry(1, 32, 24),
  skin,
  [0, 0, 0],
  [0.82, 1.05, 0.72]
)

// EARS
for (const side of [-1, 1]) {
  part(
    new THREE.SphereGeometry(0.16, 16, 12),
    skin,
    [side * 0.78, -0.05, 0],
    [0.65, 1, 0.6]
  )
}

// EYES
for (const side of [-1, 1]) {
  // Eye white
  part(
    new THREE.SphereGeometry(0.15, 20, 16),
    white,
    [side * 0.31, 0.12, 0.61],
    [0.85, 1.25, 0.45]
  )

  // Iris
  part(
    new THREE.SphereGeometry(0.095, 20, 16),
    iris,
    [side * 0.31, 0.10, 0.70],
    [0.8, 1.15, 0.4]
  )

  // Pupil
  part(
    new THREE.SphereGeometry(0.043, 16, 12),
    dark,
    [side * 0.31, 0.10, 0.735],
    [0.8, 1.2, 0.4]
  )

  // Eye highlight
  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(0.025, 12, 12),
    white
  )
  highlight.position.set(side * 0.29, 0.15, 0.76)
  prince.add(highlight)

  // Eyebrow
  part(
    new THREE.BoxGeometry(0.25, 0.035, 0.035),
    hair,
    [side * 0.31, 0.35, 0.65],
    [1, 1, 1],
    [0, 0, side * -0.08]
  )
}

// NOSE
part(
  new THREE.SphereGeometry(0.055, 12, 12),
  skin,
  [0, -0.12, 0.70],
  [0.7, 1.1, 0.6]
)

// MOUTH
part(
  new THREE.BoxGeometry(0.15, 0.018, 0.025),
  dark,
  [0, -0.39, 0.67],
  [1, 1, 1]
)

// HAIR CAP
part(
  new THREE.SphereGeometry(0.88, 24, 20),
  hair,
  [0, 0.62, -0.08],
  [1, 0.72, 0.9]
)

// FRONT HAIR - ANIME FRINGE
for (let i = 0; i < 5; i++) {
  const x = (i - 2) * 0.25

  const bang = part(
    new THREE.ConeGeometry(0.19, 0.58, 8),
    hair,
    [x, 0.38, 0.55],
    [1, 1, 0.65],
    [0, 0, -x * 0.45]
  )
}

// SIDE HAIR
for (const side of [-1, 1]) {
  part(
    new THREE.ConeGeometry(0.18, 0.65, 8),
    hair,
    [side * 0.67, -0.15, 0.08],
    [1, 1, 0.8],
    [0, 0, side * -0.12]
  )
}

// BACK HAIR
part(
  new THREE.SphereGeometry(0.75, 20, 16),
  hair,
  [0, 0.3, -0.48],
  [1, 0.9, 0.5]
)

// CAMERA ROTATION
let dragging = false
let previousX = 0
let previousY = 0

renderer.domElement.addEventListener('pointerdown', (e) => {
  dragging = true
  previousX = e.clientX
  previousY = e.clientY
})

window.addEventListener('pointerup', () => {
  dragging = false
})

window.addEventListener('pointermove', (e) => {
  if (!dragging) return

  prince.rotation.y += (e.clientX - previousX) * 0.008
  prince.rotation.x += (e.clientY - previousY) * 0.004

  prince.rotation.x = THREE.MathUtils.clamp(
    prince.rotation.x,
    -0.35,
    0.35
  )

  previousX = e.clientX
  previousY = e.clientY
})

// ANIMATION
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

// RESPONSIVE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

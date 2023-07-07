import './style.css'

import * as THREE from 'three'
import * as YUKA from 'yuka'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  4000
)
camera.position.set(0, 0, 20)

document.getElementById('root').appendChild(renderer.domElement)

window.addEventListener('resize', e => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth / window.innerHeight)
})

const orbit = new OrbitControls(camera, renderer.domElement)

// code start

const coneGeo = new THREE.ConeGeometry(1, 4)
coneGeo.rotateX(Math.PI / 2)
const coneMat = new THREE.MeshNormalMaterial()
const coneMesh = new THREE.Mesh(coneGeo, coneMat)
scene.add(coneMesh)
coneMesh.matrixAutoUpdate = false

const vehicle = new YUKA.Vehicle()
vehicle.setRenderComponent(coneMesh, sync)
vehicle.maxSpeed = 4

const entityManager = new YUKA.EntityManager()
entityManager.add(vehicle)

const targetGeo = new THREE.SphereGeometry(1)
const targetMat = new THREE.MeshNormalMaterial()
const targetMesh = new THREE.Mesh(targetGeo, targetMat)
targetMesh.matrixAutoUpdate = false
scene.add(targetMesh)

const target = new YUKA.GameEntity()
target.setRenderComponent(targetMesh, sync)
entityManager.add(target)

const randomize = (scalar = 1) => {
  const coefficient = -(Math.floor(Math.random() * 100) % 2)
  return coefficient * scalar
}

target.position.set(randomize(20), randomize(20), randomize(20))

function sync (entity, renderComponent) {
  renderComponent.matrix.copy(entity.worldMatrix)
}

const seekingBehavior = new YUKA.ArriveBehavior(target.position,1,1)
vehicle.steering.add(seekingBehavior)

const time = new YUKA.Time()


setInterval(() => {
  target.position.copy(
    new THREE.Vector3(randomize(), randomize(), randomize()).multiplyScalar(20)
  )
}, 5000)

// code end

function animate () {
  const delta = time.update().getDelta()
  entityManager.update(delta)

  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

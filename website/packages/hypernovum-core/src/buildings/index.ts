import * as THREE from 'three'
import type { BuildingType, CityTheme } from '../types'

const BASE_HEIGHT = 1.5
const MAX_EXTRA_HEIGHT = 4

/**
 * Create building geometry based on type.
 * Each type has a distinct silhouette.
 */
export function createBuilding(
  type: BuildingType,
  heightFactor: number,
  statusColor: string,
  theme: CityTheme,
): THREE.Group {
  const height = BASE_HEIGHT + heightFactor * MAX_EXTRA_HEIGHT
  const group = new THREE.Group()
  const color = new THREE.Color(statusColor)
  const glowColor = new THREE.Color(theme.glow)

  switch (type) {
    case 'helix-tower':
      group.add(buildHelixTower(height, color, glowColor))
      break
    case 'data-shard':
      group.add(buildDataShard(height, color, glowColor))
      break
    case 'quant-blade':
      group.add(buildQuantBlade(height, color, glowColor))
      break
    case 'hex-hive':
      group.add(buildHexHive(height, color, glowColor))
      break
    case 'memory-core':
      group.add(buildMemoryCore(height, color, glowColor))
      break
  }

  return group
}

function buildHelixTower(height: number, color: THREE.Color, glow: THREE.Color): THREE.Group {
  const group = new THREE.Group()

  // Main cylinder
  const geo = new THREE.CylinderGeometry(0.3, 0.4, height, 8)
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: glow,
    emissiveIntensity: 0.15,
    metalness: 0.8,
    roughness: 0.3,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.y = height / 2
  group.add(mesh)

  // Helix rings
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(0.5, 0.03, 8, 16)
    const ringMat = new THREE.MeshStandardMaterial({
      color: glow,
      emissive: glow,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.6,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.y = (height * (i + 1)) / 4
    ring.rotation.x = Math.PI / 2
    ring.rotation.z = (i * Math.PI) / 3
    group.add(ring)
  }

  return group
}

function buildDataShard(height: number, color: THREE.Color, glow: THREE.Color): THREE.Group {
  const group = new THREE.Group()

  // Octahedron (crystal shard)
  const geo = new THREE.OctahedronGeometry(0.4, 0)
  geo.scale(1, height / 1.5, 1)
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: glow,
    emissiveIntensity: 0.2,
    metalness: 0.6,
    roughness: 0.2,
    transparent: true,
    opacity: 0.85,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.y = height / 2
  group.add(mesh)

  // Edge glow
  const edgeGeo = new THREE.EdgesGeometry(geo)
  const edgeMat = new THREE.LineBasicMaterial({ color: glow, transparent: true, opacity: 0.4 })
  const edges = new THREE.LineSegments(edgeGeo, edgeMat)
  edges.position.y = height / 2
  group.add(edges)

  return group
}

function buildQuantBlade(height: number, color: THREE.Color, glow: THREE.Color): THREE.Group {
  const group = new THREE.Group()

  // Thin tall box (blade shape)
  const geo = new THREE.BoxGeometry(0.15, height, 0.6)
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: glow,
    emissiveIntensity: 0.2,
    metalness: 0.9,
    roughness: 0.2,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.y = height / 2
  group.add(mesh)

  // Top accent
  const tipGeo = new THREE.ConeGeometry(0.3, 0.4, 4)
  const tipMat = new THREE.MeshStandardMaterial({
    color: glow,
    emissive: glow,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.7,
  })
  const tip = new THREE.Mesh(tipGeo, tipMat)
  tip.position.y = height + 0.2
  group.add(tip)

  return group
}

function buildHexHive(height: number, color: THREE.Color, glow: THREE.Color): THREE.Group {
  const group = new THREE.Group()

  // Hexagonal prism
  const geo = new THREE.CylinderGeometry(0.4, 0.4, height, 6)
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: glow,
    emissiveIntensity: 0.15,
    metalness: 0.7,
    roughness: 0.3,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.y = height / 2
  group.add(mesh)

  // Hex edge wireframe
  const edgeGeo = new THREE.EdgesGeometry(geo)
  const edgeMat = new THREE.LineBasicMaterial({ color: glow, transparent: true, opacity: 0.5 })
  const edges = new THREE.LineSegments(edgeGeo, edgeMat)
  edges.position.y = height / 2
  group.add(edges)

  return group
}

function buildMemoryCore(height: number, color: THREE.Color, glow: THREE.Color): THREE.Group {
  const group = new THREE.Group()

  // Sphere core
  const geo = new THREE.SphereGeometry(0.5, 16, 16)
  geo.scale(1, height / 1.5, 1)
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: glow,
    emissiveIntensity: 0.3,
    metalness: 0.5,
    roughness: 0.3,
    transparent: true,
    opacity: 0.8,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.y = height / 2
  group.add(mesh)

  // Orbiting ring
  const ringGeo = new THREE.TorusGeometry(0.7, 0.02, 8, 32)
  const ringMat = new THREE.MeshStandardMaterial({
    color: glow,
    emissive: glow,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.5,
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.position.y = height / 2
  ring.rotation.x = Math.PI / 4
  group.add(ring)

  return group
}

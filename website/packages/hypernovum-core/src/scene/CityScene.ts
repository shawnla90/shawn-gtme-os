import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { ProjectData, CityTheme, HeartbeatStatus } from '../types'
import { TERMINAL_GREEN_THEME } from '../types'
import { createBuilding } from '../buildings'

interface CitySceneOptions {
  canvas: HTMLCanvasElement
  theme?: CityTheme
  onBuildingClick?: (project: ProjectData) => void
  onBuildingHover?: (id: string | null) => void
}

/** Grid layout constants */
const GRID_SPACING = 2.5
const GRID_COLS = 5

export class CityScene {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private theme: CityTheme
  private raycaster = new THREE.Raycaster()
  private mouse = new THREE.Vector2()
  private buildingMap = new Map<THREE.Object3D, ProjectData>()
  private buildingGroups = new Map<string, THREE.Group>()
  private animationId: number | null = null
  private clock = new THREE.Clock()
  private onBuildingClick?: (project: ProjectData) => void
  private onBuildingHover?: (id: string | null) => void
  private heartbeat: HeartbeatStatus = { active: false }
  private hoveredObject: THREE.Object3D | null = null

  constructor(options: CitySceneOptions) {
    this.theme = options.theme ?? TERMINAL_GREEN_THEME
    this.onBuildingClick = options.onBuildingClick
    this.onBuildingHover = options.onBuildingHover

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: options.canvas,
      antialias: true,
      alpha: false,
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.8

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(this.theme.background)
    this.scene.fog = new THREE.FogExp2(this.theme.fog, 0.04)

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    this.camera.position.set(8, 10, 12)
    this.camera.lookAt(0, 0, 0)

    // Controls
    this.controls = new OrbitControls(this.camera, options.canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.maxPolarAngle = Math.PI / 2.2
    this.controls.minDistance = 5
    this.controls.maxDistance = 30
    this.controls.target.set(0, 1, 0)

    this.setupLights()
    this.setupGrid()
    this.setupEventListeners(options.canvas)
  }

  private setupLights() {
    // Ambient
    const ambient = new THREE.AmbientLight(this.theme.glow, 0.15)
    this.scene.add(ambient)

    // Main directional
    const dirLight = new THREE.DirectionalLight(this.theme.glow, 0.4)
    dirLight.position.set(5, 10, 5)
    this.scene.add(dirLight)

    // Accent point light (center glow)
    const pointLight = new THREE.PointLight(this.theme.glow, 0.6, 20)
    pointLight.position.set(0, 5, 0)
    this.scene.add(pointLight)

    // Rim light for depth
    const rimLight = new THREE.DirectionalLight('#1a4a1a', 0.2)
    rimLight.position.set(-5, 3, -5)
    this.scene.add(rimLight)
  }

  private setupGrid() {
    // Ground plane
    const planeGeo = new THREE.PlaneGeometry(40, 40)
    const planeMat = new THREE.MeshStandardMaterial({
      color: '#050505',
      metalness: 0.9,
      roughness: 0.8,
    })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.01
    this.scene.add(plane)

    // Grid lines
    const gridHelper = new THREE.GridHelper(30, 30, this.theme.grid, this.theme.grid)
    const gridMat = gridHelper.material as THREE.Material
    if ('opacity' in gridMat) {
      gridMat.transparent = true
      gridMat.opacity = 0.3
    }
    this.scene.add(gridHelper)
  }

  private setupEventListeners(canvas: HTMLCanvasElement) {
    canvas.addEventListener('click', (e) => this.handleClick(e))
    canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e))
  }

  private getIntersectedBuilding(event: MouseEvent): { object: THREE.Object3D; project: ProjectData } | null {
    const rect = this.renderer.domElement.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children, true)

    for (const hit of intersects) {
      // Walk up to find the building group
      let obj: THREE.Object3D | null = hit.object
      while (obj) {
        const project = this.buildingMap.get(obj)
        if (project) return { object: obj, project }
        obj = obj.parent
      }
    }
    return null
  }

  private handleClick(event: MouseEvent) {
    const result = this.getIntersectedBuilding(event)
    if (result && this.onBuildingClick) {
      this.onBuildingClick(result.project)
    }
  }

  private handleMouseMove(event: MouseEvent) {
    const result = this.getIntersectedBuilding(event)
    const newHoveredId = result?.project.id ?? null

    if (this.hoveredObject !== (result?.object ?? null)) {
      // Reset cursor
      this.renderer.domElement.style.cursor = result ? 'pointer' : 'default'
      this.hoveredObject = result?.object ?? null
      if (this.onBuildingHover) {
        this.onBuildingHover(newHoveredId)
      }
    }
  }

  setProjects(projects: ProjectData[]) {
    // Remove old buildings
    this.buildingGroups.forEach((group) => {
      this.scene.remove(group)
    })
    this.buildingMap.clear()
    this.buildingGroups.clear()

    // Layout in a grid
    projects.forEach((project, i) => {
      const col = i % GRID_COLS
      const row = Math.floor(i / GRID_COLS)
      const x = (col - (GRID_COLS - 1) / 2) * GRID_SPACING
      const z = (row - Math.floor(projects.length / GRID_COLS) / 2) * GRID_SPACING

      const statusColor = this.theme.statusColors[project.status] ?? this.theme.glow
      const group = createBuilding(project.type, project.heightFactor, statusColor, this.theme)
      group.position.set(x, 0, z)

      // Store references for raycasting and animation
      this.buildingMap.set(group, project)
      group.traverse((child) => {
        this.buildingMap.set(child, project)
      })
      this.buildingGroups.set(project.id, group)

      this.scene.add(group)
    })
  }

  setHeartbeat(status: HeartbeatStatus) {
    this.heartbeat = status
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate)
    const elapsed = this.clock.getElapsedTime()

    // Animate buildings
    this.buildingGroups.forEach((group) => {
      // Gentle float
      group.position.y = Math.sin(elapsed * 0.5 + group.position.x) * 0.05

      // Active buildings pulse when heartbeat is active
      if (this.heartbeat.active) {
        const project = this.buildingMap.get(group)
        if (project?.status === 'active') {
          const pulse = 1 + Math.sin(elapsed * 3) * 0.03
          group.scale.set(pulse, pulse, pulse)
        }
      }

      // Rotate memory core ring
      const project = this.buildingMap.get(group)
      if (project?.type === 'memory-core') {
        group.children.forEach((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
            child.rotation.z = elapsed * 0.5
          }
        })
      }
    })

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  start() {
    this.clock.start()
    this.animate()
  }

  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  dispose() {
    this.stop()
    this.controls.dispose()
    this.renderer.dispose()
    this.scene.clear()
  }
}

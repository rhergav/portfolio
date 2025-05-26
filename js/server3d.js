document.addEventListener("DOMContentLoaded", () => {
  // Import Three.js
  const THREE = window.THREE

  if (!THREE) {
    console.error("Three.js is not loaded.")
    return
  }

  // Inicializar Three.js
  const container = document.getElementById("server-3d-container")
  if (!container) return

  // Configuración básica
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  // Controles de órbita para interacción
  const controls = new THREE.OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 3
  controls.maxDistance = 10
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.0

  // Iluminación
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  const pointLight = new THREE.PointLight(0x0f62fe, 1, 10)
  pointLight.position.set(0, 2, 2)
  scene.add(pointLight)

  // Crear el rack de servidor
  function createServerRack() {
    const rackGroup = new THREE.Group()

    // Estructura del rack
    const rackGeometry = new THREE.BoxGeometry(2, 4, 1)
    const rackMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      flatShading: true,
    })
    const rack = new THREE.Mesh(rackGeometry, rackMaterial)
    rackGroup.add(rack)

    // Crear servidores para el rack
    const serverCount = 8
    const serverHeight = 0.3
    const serverGeometry = new THREE.BoxGeometry(1.8, serverHeight, 0.9)

    for (let i = 0; i < serverCount; i++) {
      // Alternar colores para los servidores
      const serverMaterial = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0x1a1a2e : 0x16213e,
        flatShading: true,
      })

      const server = new THREE.Mesh(serverGeometry, serverMaterial)

      // Posicionar los servidores en el rack
      server.position.y = -1.8 + i * (serverHeight + 0.1)

      // Añadir luces LED a los servidores
      const ledGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05)

      // LED verde (encendido)
      const greenLedMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const greenLed = new THREE.Mesh(ledGeometry, greenLedMaterial)
      greenLed.position.set(0.8, 0, 0.46)
      server.add(greenLed)

      // LED azul (actividad)
      const blueLedMaterial = new THREE.MeshBasicMaterial({ color: 0x0f62fe })
      const blueLed = new THREE.Mesh(ledGeometry, blueLedMaterial)
      blueLed.position.set(0.7, 0, 0.46)
      server.add(blueLed)

      // Añadir detalles al servidor
      const detailGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1)
      const detailMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 })
      const detail = new THREE.Mesh(detailGeometry, detailMaterial)
      detail.position.set(-0.6, 0, 0.46)
      server.add(detail)

      rackGroup.add(server)
    }

    // Añadir cables
    const cableCount = 12
    const cableGeometry = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.1, -1.5, 0.5),
        new THREE.Vector3(1.3, -1.3, 0.7),
        new THREE.Vector3(1.2, -1.0, 0.6),
      ]),
      20,
      0.02,
      8,
      false,
    )

    for (let i = 0; i < cableCount; i++) {
      const cableMaterial = new THREE.MeshPhongMaterial({
        color: [0x0f62fe, 0xff3366, 0x00cc66, 0xffcc00][i % 4],
        shininess: 100,
      })

      const cable = new THREE.Mesh(cableGeometry, cableMaterial)
      cable.position.y = Math.random() * 3 - 1.5
      cable.position.x = Math.random() * 0.2 - 0.1
      cable.rotation.z = Math.random() * 0.2 - 0.1
      rackGroup.add(cable)
    }

    return rackGroup
  }

  const serverRack = createServerRack()
  scene.add(serverRack)

  // Posicionar la cámara
  camera.position.set(0, 0, 5)
  camera.lookAt(0, 0, 0)

  // Función para animar las luces LED
  function animateLEDs() {
    serverRack.traverse((child) => {
      if (child.material && child.material.color && child.material.color.getHex() === 0x0f62fe) {
        // Parpadear las luces azules (actividad)
        if (Math.random() > 0.7) {
          child.material.color.setHex(0x0088ff)
          setTimeout(() => {
            if (child.material) {
              child.material.color.setHex(0x0f62fe)
            }
          }, 100)
        }
      }
    })
  }

  // Función para manejar el redimensionamiento de la ventana
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }

  window.addEventListener("resize", onWindowResize)

  // Detectar tema oscuro/claro
  function updateSceneColors() {
    const isDarkTheme = document.body.getAttribute("data-theme") === "dark"
    scene.background = isDarkTheme ? new THREE.Color(0x121212) : new THREE.Color(0xf8f9fa)
  }

  // Observar cambios en el tema
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "data-theme") {
        updateSceneColors()
      }
    })
  })

  observer.observe(document.body, { attributes: true })
  updateSceneColors()

  // Animación
  function animate() {
    requestAnimationFrame(animate)

    // Animar las luces LED ocasionalmente
    if (Math.random() > 0.9) {
      animateLEDs()
    }

    controls.update()
    renderer.render(scene, camera)
  }

  animate()
})

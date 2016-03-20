/*global THREE*/
// import THREE from 'three'
import TWEEN from 'tween.js'
// import THREEcss from './three_modules/CSS3DRenderer_module.js'
// var addScript = document.createElement('script')
// addScript.type = 'text/javascript'
// addScript.src = 'node_modules/three/examples/js/renderers/CSS3DRenderer.js'
// document.body.appendChild(addScript)

export default {
  cubeExample: function () {
    var scene, camera, renderer
    var geometry, material, mesh, sphereMaterial, sphere
    var elem = document.querySelector('.cosmos-main')
    init()
    animate()
    function init () {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
      camera.position.z = 300
      geometry = new THREE.BoxGeometry(200, 200, 200)
      material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
      mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      // sphere :
      sphereMaterial = new THREE.MeshLambertMaterial({
          color: 0x576271
      })
      sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), sphereMaterial)
      scene.add(sphere)
      // point light
      var pointLight = new THREE.PointLight(0xFFFFFF)
      pointLight.position.x = 100
      pointLight.position.y = 100
      pointLight.position.z = 100
      scene.add(pointLight)
      renderer = new THREE.WebGLRenderer()
      renderer.setSize(window.innerWidth, window.innerHeight)
      // renderer.setClearColorHex(0x292929, 1)
      elem.appendChild(renderer.domElement)
    }
    function animate () {
      requestAnimationFrame(animate)
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.02
      renderer.render(scene, camera)
    }
  },
  starsExample: function () {
    var camera, scene, renderer
    var scene2, renderer2
    var particleSystem, line
    var elem = document.querySelector('.cosmos-main')
    var animating = false
    var labels = []
    init()
    function init () {
      scene = new THREE.Scene()
      scene2 = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000)
      camera.lookAt(new THREE.Vector3(0, 0, 1))
      scene.fog = new THREE.Fog(0x282828, 0, 2000)
      particleSystem = makeParticles()
      line = makeLine()
      scene.add(camera)
      scene.add(particleSystem)
      scene.add(line)
      addText()
      // WebGL Renderer for line & particules
      renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
      renderer.setSize(window.innerWidth, window.innerHeight)
      elem.appendChild(renderer.domElement)
      // CSS Renderer for labels
      renderer2 = new THREE.CSS3DRenderer()
      renderer2.setSize(window.innerWidth, window.innerHeight)
      renderer2.domElement.style.position = 'absolute'
      renderer2.domElement.style.top = 0
      elem.appendChild(renderer2.domElement)
      // Launch
      window.addEventListener('click', switchCamera)
      window.addEventListener('keydown', tickCamera)
      update()
    }
    function update (time) {
      window.requestAnimationFrame(update)
      updateLabels()
      TWEEN.update(time)
      renderer.render(scene, camera)
      renderer2.render(scene2, camera)
    }
    function switchCamera () {
      if (animating === false) {
        animating = true
        new TWEEN.Tween(camera.position).to({z: Math.floor(Math.random() * 6000)}, 1000).onComplete(function () {animating = false}).start()
      }
    }
    function tickCamera (event) {
      if (animating === false && (event.keyCode === 38 || event.keyCode === 40)) {
        event.preventDefault()
        if (event.keyCode === 38 && camera.position.z < 6000) {camera.position.z += 50} else if (event.keyCode === 40 && camera.position.z > 0) {camera.position.z -= 50}
      }
    }
    function makeParticles () {
      var geometry = new THREE.Geometry()
      var material = new THREE.PointsMaterial({color: 0xffffff, size: 30})
      for (var zpos = 0; zpos < 9000; zpos += 20) {
        geometry.vertices.push(new THREE.Vector3(Math.random() * 4000 - 2000, Math.random() * 4000 - 2000, zpos))
      }
      return new THREE.Points(geometry, material)
    }
    function makeLine () {
      var tab = []
      var curve, geometry, material
      for (var zpos = 0; zpos < 7000; zpos += 300) {
        tab.push(new THREE.Vector3(Math.random() * 600 - 300, Math.random() * 600 - 300, zpos))
      }
      curve = new THREE.CatmullRomCurve3(tab)
      geometry = new THREE.Geometry()
      geometry.vertices = curve.getPoints(6000)
      geometry.computeLineDistances()
      material = new THREE.LineDashedMaterial({color: 0xA493C6, linewidth: 3, dashSize: 10, gapSize: 8, fog: true})
      return new THREE.Line(geometry, material)
    }
    function addText () {
      var textElem = document.createElement('span')
      textElem.innerHTML = 'Septembre 2013'
      textElem.style.fontSize = '80px'
      textElem.style.color = '#ffffff'
      var object = new THREE.CSS3DObject(textElem)
      object.position.x = -400
      object.position.y = 350
      object.position.z = 1000
      scene2.add(object)
      object.rotation.y = Math.PI
      // object.lookAt(camera.position)
      // object.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(new THREE.Vector3(Math.PI / 2, Math.PI, 0)))
      // labels.push({'elem': textElem, 'pos3D': pos3D})
      // updateLabels()
    }
    function updateLabels () {
      for (var ii = 0; ii < labels.length; ii++) {
        var pos2D = toScreenXY(labels[ii].pos3D)
        labels[ii].elem.style.top = pos2D.y
        labels[ii].elem.style.left = pos2D.x
      }
    }
    function toScreenXY (pos3D) {
      // var pos = pos3D.clone()
      // var projScreenMat = new THREE.Matrix4()
      // projScreenMat.multiply(camera.projectionMatrix, camera.matrixWorldInverse)
      // projScreenMat.multiply(pos)
      // var left = ((pos.x + 1) / 2) * window.innerWidth
      // var top = ((1 - pos.y) / 2) * window.innerHeight
      // return new THREE.Vector2(left, top)
      // var projector = new THREE.Projector()
      // var vec = projector.projectVector(pos3D, camera)
      var vec = pos3D.clone()
      vec.applyMatrix4(camera.projectionMatrix)
      var left = ((vec.x + 1) / 2) * window.innerWidth
      var top = ((vec.y + 1) / 2) * window.innerHeight
      return new THREE.Vector2(left, top)
    }
    // function testProj () {
    //   var initVec = new THREE.Vector3(-100, 0, 300)
    //   console.log(toScreenXY(initVec))
    // }
    // function getCartesianVec (vecS) {
    //   var x = vecS.radius * Math.sin(vecS.teta) * Math.cos(vecS.phi)
    //   var y = vecS.radius * Math.sin(vecS.teta) * Math.sin(vecS.phi)
    //   var z = vecS.radius * Math.cos(vecS.teta)
    //   return new THREE.Vector3(x, y, z)
    // }
    // function getSphericalVec (vec3) {
    //   return {
    //     radius: Math.sqrt(Math.pow(vec3.x, 2) + Math.pow(vec3.y, 2) + Math.pow(vec3.z, 2)),
    //     teta: Math.acos(vec3.z / vec3.length()),
    //     phi: Math.atan2(vec3.y, vec3.x)
    //   }
    // }
  }
}

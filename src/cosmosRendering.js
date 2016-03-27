/*global THREE*/
// import THREE from 'three'
import TWEEN from 'tween.js'

export default function (elemQuery) {
    // Initialisation :
    var that = this
    this.elem = document.querySelector(elemQuery)
    this.animating = false
    this.init = function () {
        // Create cosmos elements
        that.labels = []
        that.scene = new THREE.Scene()
        that.scene.fog = new THREE.Fog(0x282828, 0, 2000)
        that.scene2 = new THREE.Scene()
        that.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000)
        that.particleSystem = makeParticles()
        that.line = makeLine()
        that.sampleText = makeText('September 2013', 80, -400, 350, 1000)
        // Add elems to the scene
        that.scene.add(that.camera)
        that.scene.add(that.particleSystem)
        that.scene.add(that.line)
        that.scene2.add(that.sampleText)
        // WebGL Renderer for line & particules
        that.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
        that.renderer.setSize(window.innerWidth, window.innerHeight)
        that.elem.appendChild(that.renderer.domElement)
        // CSS Renderer for labels
        that.renderer2 = new THREE.CSS3DRenderer()
        that.renderer2.setSize(window.innerWidth, window.innerHeight)
        that.renderer2.domElement.style.position = 'absolute'
        that.renderer2.domElement.style.top = 0
        that.renderer2.domElement.style.left = 0
        that.elem.appendChild(that.renderer2.domElement)
        // Param a few tweaks
        that.camera.lookAt(new THREE.Vector3(0, 0, 1))
        window.addEventListener('click', that.switchCamera)
        window.addEventListener('keydown', that.tickCamera)
        update()
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
    function makeText (text, fontSize, x, y, z) {
        var textElem = document.createElement('span')
        textElem.innerHTML = text
        textElem.style.fontSize = fontSize + 'px'
        textElem.style.color = '#ffffff'
        textElem.style.fontFamily = 'Roboto, Helvetica, sans-serif'
        var object = new THREE.CSS3DObject(textElem)
        object.position.x = x
        object.position.y = y
        object.position.z = z
        object.rotation.y = Math.PI
        return object
    }
    function update (time) {
        window.requestAnimationFrame(update)
        TWEEN.update(time)
        that.renderer.render(that.scene, that.camera)
        that.renderer2.render(that.scene2, that.camera)
    }
    this.switchCamera = function () {
        if (that.animating === false) {
            that.animating = true
            new TWEEN.Tween(that.camera.position).to({z: Math.floor(Math.random() * 6000)}, 1000).onComplete(function () {that.animating = false}).start()
        }
    }
    this.tickCamera = function (event) {
        if (that.animating === false && (event.keyCode === 38 || event.keyCode === 40)) {
            event.preventDefault()
            if (event.keyCode === 38 && that.camera.position.z < 6000) {that.camera.position.z += 50} else if (event.keyCode === 40 && that.camera.position.z > 0) {that.camera.position.z -= 50}
        }
    }
}

/*global THREE*/
// import THREE from 'three'
import TWEEN from 'tween.js'

export default function (elemQuery) {
    // Initialisation :
    var that = this
    this.elem = document.querySelector(elemQuery)
    this.animating = false
    this.init = function (depth) {
        // Create cosmos elements
        that.labels = []
        that.grids = []
        that.scene = new THREE.Scene()
        that.scene.fog = new THREE.Fog(0x282828, 0, 2000)
        that.scene2 = new THREE.Scene()
        that.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000)
        that.particleSystem = makeParticles(depth)
        that.line = makeLine(depth)
        // Add elems to the scene
        that.scene.add(that.camera)
        that.scene.add(that.particleSystem)
        that.scene.add(that.line)
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
        window.addEventListener('keydown', function (ev) {return that.tickCamera(ev, depth)})
        update()
    }
    function makeParticles (depth) {
        var geometry = new THREE.Geometry()
        var material = new THREE.PointsMaterial({color: 0xffffff, size: 30})
        for (var zpos = 0; zpos < depth + 3000; zpos += 20) {
            geometry.vertices.push(new THREE.Vector3(Math.random() * 4000 - 2000, Math.random() * 4000 - 2000, zpos))
        }
        return new THREE.Points(geometry, material)
    }
    function makeLine (depth) {
        var tab = []
        var curve, geometry, material
        for (var zpos = 0; zpos < depth + 1000; zpos += 300) {
            tab.push(new THREE.Vector3(Math.random() * 600 - 300, Math.random() * 600 - 300, zpos))
        }
        curve = new THREE.CatmullRomCurve3(tab)
        geometry = new THREE.Geometry()
        geometry.vertices = curve.getPoints(depth)
        geometry.computeLineDistances()
        material = new THREE.LineDashedMaterial({color: 0xA493C6, linewidth: 3, dashSize: 10, gapSize: 8, fog: true})
        return new THREE.Line(geometry, material)
    }
    this.addGrids = function (grids) {
        var ii, gridObject, div
        return new Promise(function (resolve) {
            that.grids = []
            for (ii = 0; ii < grids.length; ii++) {
                div = document.querySelector('#event-grid-' + ii)
                gridObject = new THREE.CSS3DObject(div)
                gridObject.position.x = 0
                gridObject.position.y = 0
                gridObject.position.z = grids[ii].zpos
                gridObject.rotation.y = Math.PI
                that.scene2.add(gridObject)
                that.grids.push(gridObject)
            }
            resolve()
        })
    }
    function getGrid (zpos) {
        for (var ii = 0; ii < that.grids.length; ii++) {
            if (that.grids[ii].position.z === zpos) {
                return that.grids[ii]
            }
        }
        return null
    }
    this.addMonthLabels = function (labels) {
        var ii, labelObj, div
        return new Promise(function (resolve) {
            for (ii = 0; ii < labels.length; ii++) {
                div = document.querySelector('#month-label-' + ii)
                labelObj = new THREE.CSS3DObject(div)
                labelObj.position.x = -400
                labelObj.position.y = 350
                labelObj.position.z = labels[ii].zpos
                labelObj.rotation.y = Math.PI
                that.scene2.add(labelObj)
                that.labels.push(labelObj)
            }
            updateLabelsOpacity()
            resolve()
        })
    }
    function update (time) {
        window.requestAnimationFrame(update)
        TWEEN.update(time)
        that.renderer.render(that.scene, that.camera)
        that.renderer2.render(that.scene2, that.camera)
    }
    function updateLabelsOpacity () {
        for (var ii = 0; ii < that.labels.length; ii++) {
            if (that.labels[ii].position.z > that.camera.position.z + 3000) {
                that.labels[ii].element.style.opacity = 0
            } else if (that.labels[ii].position.z < that.camera.position.z + 2000) {
                that.labels[ii].element.style.opacity = 1
            } else {
                that.labels[ii].element.style.opacity = (3000 - (that.labels[ii].position.z - that.camera.position.z)) / 1000
            }
        }
    }
    function hideLabels () {
        for (var ii = 0; ii < that.labels.length; ii++) {
            if (that.labels[ii].element.style.opacity > 0) {
                new TWEEN.Tween(that.labels[ii].element.style).to({opacity: 0}, 300).easing(TWEEN.Easing.Cubic.InOut).start()
            }
        }
    }
    function hideGrids () {
        for (var ii = 0; ii < that.grids.length; ii++) {
            if (that.grids[ii].element.style.opacity > 0) {
                new TWEEN.Tween(that.grids[ii].element.style).to({opacity: 0}, 300).easing(TWEEN.Easing.Cubic.InOut).start()
            }
        }
    }
    this.moveTo = function (zpos) {
        if (that.animating === false) {
            var duration = 1000 + Math.floor(Math.abs(that.camera.position.z - zpos) / 10)
            that.animating = true
            hideGrids()
            new TWEEN.Tween(that.camera.position).to({z: zpos - 520}, duration).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function () {
                updateLabelsOpacity()
            }).onComplete(function () {
                that.animating = false
            }).start()
            window.setTimeout(hideLabels, duration - 290)
            new TWEEN.Tween(getGrid(zpos).element.style).delay(duration - 1000).to({opacity: 1}, 1000).easing(TWEEN.Easing.Cubic.InOut).start()
        }
    }
    this.addElem = function (selector) {
        var elemObj = new THREE.CSS3DObject(document.querySelector(selector))
        elemObj.position.x = 0
        elemObj.position.y = 0
        elemObj.position.z = that.camera.position.z + 2000
        elemObj.rotation.y = Math.PI
        that.scene2.add(elemObj)
    }
    this.tickCamera = function (event, depth) {
        if (that.animating === false && (event.keyCode === 38 || event.keyCode === 40)) {
            event.preventDefault()
            if (event.keyCode === 38 && that.camera.position.z < depth) {that.camera.position.z += 50} else if (event.keyCode === 40 && that.camera.position.z > 0) {that.camera.position.z -= 50}
        }
    }
}

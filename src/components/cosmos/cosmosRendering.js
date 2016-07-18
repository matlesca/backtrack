/*global THREE*/
// import THREE from 'three'
import TWEEN from 'tween.js'
import StarSystem from './starSystem.js'
import CloudSystem from './cloudSystem.js'
export default function (elemQuery, bckCol, randKey) {
    // Initialisation :
    var that = this
    this.elem = document.querySelector(elemQuery)
    this.bckColor = bckCol
    this.randKey = randKey
    this.labels = []
    this.grids = []
    this.isAnim = false
    this.moveTween = false
    // Setup scene, fog, camera & renderer :
    setupScene()
    // Gradient in the background :
    makeBackground()
    function setupScene () {
        that.scene = new THREE.Scene()
        that.scene.fog = new THREE.Fog(that.bckColor, 0, 3000)
        that.scene2 = new THREE.Scene()
        that.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 3000)
        that.scene.add(that.camera)
        // WebGL Renderer for line & particules
        that.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
        that.renderer.setSize(window.innerWidth, window.innerHeight)
        that.renderer.setClearColor(0x282828, 0)
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
    }
    this.init = function (depth, isLine, nPart) {
        // Create cosmos elements
        that.depth = depth
        that.nPart = nPart
        if (isLine) {
            that.line = makeLine(depth)
            that.scene.add(that.line)
        }
        that.particleSystems = makeParticles(depth, nPart, 5)
        that.particleSystems.forEach(sys => that.scene.add(sys))
        that.cloudSystems = makeClouds(depth, Math.round(nPart * 2.5), 4)
        that.cloudSystems.forEach(sys => that.scene.add(sys))
        update()
    }
    function update (time) {
        window.requestAnimationFrame(update)
        TWEEN.update(time)
        if (that.isAnim) {
            that.moveParticles(10)
        }
        that.renderer.render(that.scene, that.camera)
        that.renderer2.render(that.scene2, that.camera)
    }
    function makeParticles (depth, nPart, nSys) {
        var tab = []
        for (var ss = 0; ss < nSys; ss++) {
            tab.push(new StarSystem(ss, nSys, depth + 3000, Math.floor(nPart / nSys)))
        }
        return tab
    }
    function makeClouds (depth, nPart, nSys) {
        var tab = []
        for (var ss = 0; ss < nSys; ss++) {
            tab.push(new CloudSystem(that.scene, ss, nSys, depth + 3000, Math.floor(nPart / nSys)))
        }
        return tab
    }
    function makeBackground () {
        var canvas = document.createElement('canvas')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        var context = canvas.getContext('2d')
        var gradient = context.createLinearGradient(canvas.width / 2, 0, Math.floor((0.35 + 0.3 * that.randKey) * canvas.width), canvas.height)
        gradient.addColorStop(0.2, '#282828')
        gradient.addColorStop(1, that.bckColor)
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)

        that.elem.style.background = 'url(' + canvas.toDataURL('image/png') + ')'
        that.elem.style.backgroundSize = '100% 100%'
    }
    this.moveParticles = function (zz) {
        var positions
        if (that.isAnim) {
            that.particleSystems.forEach(sys => {
                if (sys.geometry) {
                    positions = sys.geometry.attributes.position.array
                    for (var ii = 0; ii < positions.length; ii += 3) {
                        if (positions[ii + 2] < zz) {
                            positions[ii + 2] = that.depth + 3000
                            positions[ii + 0] = Math.random() * 4000 - 2000
                            positions[ii + 1] = Math.random() * 4000 - 2000
                        } else {
                            positions[ii + 2] -= zz
                        }
                        if (positions[ii + 2] > 2500) {
                            sys.geometry.attributes.alpha.array[Math.floor(ii / 3)] = 0.9 * (3000 - positions[ii + 2]) / 500
                        } else {
                            sys.geometry.attributes.alpha.array[Math.floor(ii / 3)] = 0.9
                        }
                    }
                    sys.geometry.attributes.position.needsUpdate = true
                    sys.geometry.attributes.alpha.needsUpdate = true
                }
            })
            that.cloudSystems.forEach(sys => {
                if (sys.geometry) {
                    positions = sys.geometry.attributes.position.array
                    for (var ii = 0; ii < positions.length; ii += 3) {
                        if (positions[ii + 2] < 0) {
                            positions[ii + 2] = that.depth + 3000
                            positions[ii + 0] = Math.random() * 8000 - 4000
                            positions[ii + 1] = -Math.random() * Math.random() * 800 - 800
                        } else {
                            positions[ii + 2] -= zz
                        }
                        if (positions[ii + 2] > 2500) {
                            sys.geometry.attributes.alpha.array[Math.floor(ii / 3)] = 0.9 * (3000 - positions[ii + 2]) / 500
                        } else {
                            var factor
                            if (Math.abs(positions[ii + 0]) > 3000) {
                                factor = (positions[ii + 2] - 2000) / 500
                            } else if (Math.abs(positions[ii + 0]) > 2000) {
                                factor = (Math.min(2000, positions[ii + 2]) - 1100) / 900
                            } else {
                                factor = (Math.min(1800, positions[ii + 2]) - 200) / 1600
                            }
                            sys.geometry.attributes.alpha.array[Math.floor(ii / 3)] = Math.max(0.9 * factor, 0)
                        }
                    }
                    sys.geometry.attributes.position.needsUpdate = true
                    sys.geometry.attributes.alpha.needsUpdate = true
                }
            })
        }
    }
    function makeLine (depth) {
        var tab = []
        var curve, geometry, material
        for (var zpos = 0; zpos < depth + 1000; zpos += 600) {
            tab.push(new THREE.Vector3(Math.random() * 400 - 200, Math.random() * 400 - 200, zpos))
        }
        curve = new THREE.CatmullRomCurve3(tab)
        geometry = new THREE.Geometry()
        geometry.vertices = curve.getPoints(depth)
        geometry.computeLineDistances()
        material = new THREE.LineDashedMaterial({color: 0xA493C6, linewidth: 3, dashSize: 10, gapSize: 8, fog: true})
        return new THREE.Line(geometry, material)
    }
    this.addGrid = function (grid) {
        var gridObject, div
        return new Promise(function (resolve) {
            div = document.querySelector('#' + grid.elemId)
            gridObject = new THREE.CSS3DObject(div)
            gridObject.position.x = 0
            gridObject.position.y = 0
            gridObject.position.z = grid.zpos
            gridObject.rotation.y = Math.PI
            that.scene2.add(gridObject)
            that.grids.push(gridObject)
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
    this.addLabels = function (labels) {
        var ii, labelObj, div
        return new Promise(function (resolve) {
            for (ii = 0; ii < labels.length; ii++) {
                div = document.querySelector('#' + labels[ii].elemId)
                labelObj = new THREE.CSS3DObject(div)
                labelObj.position.x = labels[ii].xpos
                labelObj.position.y = labels[ii].ypos
                labelObj.position.z = labels[ii].zpos
                labelObj.rotation.y = Math.PI
                that.scene2.add(labelObj)
                that.labels.push(labelObj)
            }
            resolve()
        })
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
                new TWEEN.Tween(that.labels[ii].element.style, {override: true}).to({opacity: 0}, 300).easing(TWEEN.Easing.Cubic.InOut).start()
            }
        }
    }
    function hideGrids () {
        for (var ii = 0; ii < that.grids.length; ii++) {
            if (that.grids[ii].element.style.opacity > 0) {
                new TWEEN.Tween(that.grids[ii].element.style, {override: true}).to({opacity: 0}, 300).easing(TWEEN.Easing.Cubic.InOut).start()
            }
        }
    }
    this.moveTo = function (zpos) {
        return new Promise((resolve, reject) => {
            if (getGrid(zpos)) {
                var duration = 1000 + Math.floor(Math.abs(that.camera.position.z - zpos) / 10)
                hideGrids()
                TWEEN.remove(that.moveTween)
                that.moveTween = new TWEEN.Tween(that.camera.position, {override: true})
                    .to({z: zpos - 520}, duration).easing(TWEEN.Easing.Cubic.InOut)
                    .onUpdate(function () {
                        updateLabelsOpacity()
                    }).onComplete(function () {
                        resolve()
                    }).start()
                window.setTimeout(hideLabels, duration - 290)
                new TWEEN.Tween(getGrid(zpos).element.style, {override: true}).delay(duration - 1000).to({opacity: 1}, 1000).easing(TWEEN.Easing.Cubic.InOut).start()
            } else {
                reject({message: 'No grid was added at this position yet'})
            }
        })
    }
}

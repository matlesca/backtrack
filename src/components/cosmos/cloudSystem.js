/*global THREE*/

import part1 from '../../img/cloud0.png'
import part2 from '../../img/cloud1.png'
import part3 from '../../img/cloud2.png'
import part4 from '../../img/cloud3.png'
// import textureFlare0 from '../../img/lensflare0.png'
// import textureFlare1 from '../../img/lensflare1.png'
// import textureFlare2 from '../../img/lensflare2.png'

export default function (myScene, index, nSys, totalDepth, nPartSys) {
    function chooseImg (imgIndex) {
        var imgPart
        if (imgIndex > 3) {
            imgIndex = Math.floor(Math.random() * 5)
        }
        switch (imgIndex) {
            case 0: imgPart = part1; break
            case 1: imgPart = part2; break
            case 2: imgPart = part3; break
            case 3: imgPart = part4
        }
        return imgPart
    }
    function makeVertexShader () {
        return [
            'attribute float size;',
            'attribute float alpha;',
            'attribute vec3 customColor;',
            'varying vec3 vColor;',
            'varying float vAlpha;',
            'void main() {',
                'vColor = customColor;',
                'vAlpha = alpha;',
                'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
                'gl_PointSize = size * ( 300.0 / -mvPosition.z );',
                'gl_Position = projectionMatrix * mvPosition;',
            '}'
        ].join('\n')
    }
    function makeFragmentShader () {
        return [
            THREE.ShaderChunk['common'],
            'uniform vec3 color;',
			'uniform sampler2D texture;',
            'uniform vec3 fogColor;',
			'uniform float fogNear;',
			'uniform float fogFar;',
			'varying vec3 vColor;',
            'varying float vAlpha;',
			'void main() {',
                'float depth = gl_FragCoord.z / gl_FragCoord.w;',
                'float fogFactor = smoothstep( fogNear, fogFar, depth );',
				'gl_FragColor = vec4( color * vColor, vAlpha );',
				'gl_FragColor = gl_FragColor * vAlpha * texture2D( texture, gl_PointCoord );',
                'gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );',
			'}'
        ].join('\n')
    }
    function makeCloudCol () {
        var tCol = new THREE.Color(myScene.fog.color)
        return {
            r: Math.min(tCol.r + 100 + 100 * Math.random(), 255) / 255,
            g: Math.min(tCol.g + 100 + 100 * Math.random(), 255) / 255,
            b: Math.min(tCol.b + 100 + 100 * Math.random(), 255) / 255
        }
    }
    function makeGeometry (totalDepth, index, nPartSys, nSys) {
        var geometry = new THREE.BufferGeometry()
        var positions = new Float32Array(nPartSys * 3)
        var sizes = new Float32Array(nPartSys)
        var alpha = new Float32Array(nPartSys)
        var colors = new Float32Array(nPartSys * 3)
        for (var i = 0, i3 = 0; i < nPartSys; i++, i3 += 3) {
            var col = makeCloudCol()
            positions[i3 + 0] = Math.random() * 8000 - 4000
            positions[i3 + 1] = -Math.random() * Math.random() * 800 - 1100
            positions[i3 + 2] = Math.floor(i * totalDepth / nPartSys) * (1 + index / nSys)
            sizes[i] = 2500 + Math.floor(Math.random() * 1500)
            alpha[i] = 0.5 + Math.round(Math.random() * 40) / 100
            colors[i3 + 0] = col.r
            colors[i3 + 1] = col.g
            colors[i3 + 2] = col.b
            // that.lensFlareTab.push(addLensFlare(positions[i3 + 0], positions[i3 + 1], positions[i3 + 2], sizes[i] * 2))
        }
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
		geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3))
        geometry.addAttribute('alpha', new THREE.BufferAttribute(alpha, 1))
		geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1))
        return geometry
    }
    var uniforms = {
        color: {type: 'c', value: new THREE.Color(0xffffff)},
        texture: {type: 't', value: new THREE.TextureLoader().load(chooseImg(index))},
        fogColor: { type: 'c', value: myScene.fog.color},
        fogNear: { type: 'f', value: myScene.fog.near},
        fogFar: { type: 'f', value: myScene.fog.far}
    }
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: makeVertexShader(),
        fragmentShader: makeFragmentShader(),
        blending: THREE.AdditiveBlending,
        fog: true,
        depthTest: false,
        transparent: true
    })
    var geometry = makeGeometry(totalDepth, index, nPartSys, nSys)
    return new THREE.Points(geometry, material)
}

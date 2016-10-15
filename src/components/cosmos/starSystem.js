/*global THREE*/

import part1 from '../../img/starPart1.png'
import part2 from '../../img/starPart2.png'
import part3 from '../../img/starPart3.png'
import part4 from '../../img/starPart4.png'
import part5 from '../../img/starPart5.png'

export default function (index, nSys, totalDepth, nPartSys) {
    function chooseImg (imgIndex) {
        var imgPart
        if (imgIndex > 4) {
            imgIndex = Math.floor(Math.random() * 5)
        }
        switch (imgIndex) {
            case 0: imgPart = part1; break
            case 1: imgPart = part2; break
            case 2: imgPart = part3; break
            case 3: imgPart = part4; break
            case 4: imgPart = part5
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
			'varying vec3 vColor;',
            'varying float vAlpha;',
			'void main() {',
				'gl_FragColor = vec4( color * vColor, vAlpha );',
				'gl_FragColor = gl_FragColor * vAlpha * texture2D( texture, gl_PointCoord );',
			'}'
        ].join('\n')
    }
    function makeGeometry (totalDepth, index, nPartSys, nSys) {
        var geometry = new THREE.BufferGeometry()
        var positions = new Float32Array(nPartSys * 3)
        var sizes = new Float32Array(nPartSys)
        var alpha = new Float32Array(nPartSys)
        var colors = new Float32Array(nPartSys * 3)
        for (var i = 0, i3 = 0; i < nPartSys; i++, i3 += 3) {
            positions[i3 + 0] = Math.random() * 4000 - 2000
            positions[i3 + 1] = Math.random() * 4000 - 2000
            positions[i3 + 2] = Math.floor(i * totalDepth / nPartSys) * (1 + index / nSys)
            sizes[i] = 150 + Math.floor(Math.random() * 100)
            alpha[i] = 0.7 + Math.round(Math.random() * 30) / 100
            colors[i3 + 0] = 1 - Math.floor(Math.random() * 30) / 100
            colors[i3 + 1] = 1 - Math.floor(Math.random() * 30) / 100
            colors[i3 + 2] = 1 - Math.floor(Math.random() * 30) / 100
        }
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
		geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3))
        geometry.addAttribute('alpha', new THREE.BufferAttribute(alpha, 1))
		geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1))
        return geometry
    }
    var uniforms = {
        color: {type: 'c', value: new THREE.Color(0xffffff)},
        texture: {type: 't', value: new THREE.TextureLoader().load(chooseImg(index))}
    }
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: makeVertexShader(),
        fragmentShader: makeFragmentShader(),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    })
    var geometry = makeGeometry(totalDepth, index, nPartSys, nSys)
    return new THREE.Points(geometry, material)
}

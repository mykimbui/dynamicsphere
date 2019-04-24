var path = "textures/";
var format = '.jpg';
var urls = [
path + 'sky' + format, path + 'sky' + format,
path + 'sky' + format, path + 'sky' + format,
path + 'sky' + format, path + 'sky' + format
];

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var textureCube = new THREE.CubeTextureLoader().load( urls );
textureCube.format = THREE.RGBFormat;
scene = new THREE.Scene();
scene.background = textureCube;

// var scene = new THREE.Scene();
  // scene.background = new THREE.CubeTextureLoader()
  //       .setPath( 'textures' )
  //       .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

  var camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.z = 3200;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var sphere_geometry = new THREE.SphereGeometry(1, 128, 128);
// var material = new THREE.MeshLambertMaterial({color: 0xee8866});
// var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: scene.background, refractionRatio: 0.95 } );
//         material.envMap.mapping = THREE.CubeRefractionMapping;

var shader = THREE.FresnelShader;
var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

uniforms[ "tCube" ].value = textureCube;

var material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: shader.vertexShader,
  fragmentShader: shader.fragmentShader
} );

// var material = new THREE.MeshNormalMaterial();

var sphere = new THREE.Mesh(sphere_geometry, material);
scene.add(sphere);

camera.position.z = 5;

var animate = function () {
  requestAnimationFrame( animate );

  var time = performance.now() * 0.001;
  var update = function() {
    //go through vertices here and reposition them
    var k = 2;
    for (var i = 0; i < sphere.geometry.vertices.length; i++) {
      var p = sphere.geometry.vertices[i];
      p.normalize().multiplyScalar(1 + 0.3 * noise.perlin3(p.x * k + time, p.y * k, p.z * k));
    }
// for (var i = 0; i < sphere.geometry.faces.length; i++) {
//     var uv = sphere.geometry.faceVertexUvs[0][i]; //faceVertexUvs is a huge arrayed stored inside of another array
//     var f = sphere.geometry.faces[i];
//     var p = sphere.geometry.vertices[f.a];//take the first vertex from each face
//     p.add(p.clone().normalize().multiplyScalar(0.1 * noise.perlin3(p.x * k, p.y * k, p.z * k)));
//   }
sphere.geometry.computeVertexNormals();
sphere.geometry.normalsNeedUpdate = true;
sphere.geometry.verticesNeedUpdate = true;
}


function onWindowResize(){
 windowHalfX = window.innerWidth / 2;
 windowHalfY = window.innerHeight / 2;

 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();

 renderer.setSize( window.innerWidth, window.innerHeight );
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX ) * 10;
  mouseY = ( event.clientY - windowHalfY ) * 10;

}


onWindowResize();
update();

sphere.rotation.x += 0.01;
sphere.rotation.y += 0.01;


renderer.render( scene, camera );
};

animate();

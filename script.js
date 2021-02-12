const console={
	dom(){
		return document.getElementById("console");
	},
	raw(c,e){
		let message=document.createElement("p").cloneNode();
		message.innerHTML=e.toString();
		message.style.fontColor=c;
		this.dom().appendChild(message);
	},
	clear(){
		this.dom().innerHTML="";
	},
	log(e){
		this.raw("black",e);
	},
	warn(e){
		this.raw("yellow",e);
	},
	error(e){
		this.raw("red",e);
	}
};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = 'YXZ';
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
/*const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/
(function loadImgTexture(){
    var loader = new THREE.TextureLoader();
    loader.load("textures/double_plant_grass_top.png",function(texture){
        var geometry = new THREE.BoxGeometry();
        var material = new THREE.MeshBasicMaterial({color:0x739783,map:texture});
        mesh = new THREE.Mesh(geometry,material);
        scene.add(mesh);
    })
})()
camera.position.z = 5;

function move(k,x,y,z){
	return addEventListener("keydown",(e)=>{
		let c=Math.cos,s=Math.sin,Y=camera.rotation.x,P=camera.rotation.y;
		(e.key===k)&&(camera.position.add(new THREE.Vector3(
			c(P)*z-s(P)*x,
			c(Y)*c(P)*x-s(Y)*y+c(Y)*s(P)*z,
			s(Y)*c(P)*x+c(Y)*y+s(Y)*s(P)*z
		)));
	});
}
function rotate(k,x,y){
	return addEventListener("keydown",(e)=>{
		(e.key===k)&&(camera.rotation.x += y,
camera.rotation.y -= x);
	});
}
move("w",1,0,0);
move("s",-1,0,0);
move("d",0,0,1);
move("a",0,0,-1);
move(" ",0,1,0);
move("Shift",0,-1,0);
rotate("ArrowUp",0,Math.PI/180);
rotate("ArrowDown",0,-Math.PI/180);
rotate("ArrowLeft",-Math.PI/180,0);
rotate("ArrowRight",Math.PI/180,0);
(function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	console.clear();
	console.log([camera.position.x,camera.position.y,camera.position.z,camera.rotation.x,camera.rotation.y]);
})();

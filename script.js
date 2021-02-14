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
function blockTex(t){
	if(!BTEX[t]){return alert("A block's type is not defined.Having an error with your level?Wrong block:"+t)}
	let a;
	switch(BTEX[t][0]){
		case 0:
			a=[BTEX[t][1][0]+".png",BTEX[t][1][0]+".png",BTEX[t][1][0]+".png",BTEX[t][1][0]+".png",BTEX[t][1][0]+".png",BTEX[t][1][0]+".png"];
			break;
		case 1:
			a=[BTEX[t][1][2]+".png",BTEX[t][1][2]+".png",BTEX[t][1][0]+".png",BTEX[t][1][1]+".png",BTEX[t][1][2]+".png",BTEX[t][1][2]+".png"];
			break;
		case 2:
			a=[BTEX[t][1][2]+".png",BTEX[t][1][2]+".png",BTEX[t][1][0]+".png",BTEX[t][1][1]+".png",BTEX[t][1][3]+".png",BTEX[t][1][3]+".png"];
			break;
		case 3:
			a=[BTEX[t][1][2]+".png",BTEX[t][1][3]+".png",BTEX[t][1][0]+".png",BTEX[t][1][1]+".png",BTEX[t][1][4]+".png",BTEX[t][1][5]+".png"];
			break;
	}
	return a.map((e)=>{return new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("textures/"+e)});});
}
function block(x,y,z,tex){
	let g=new THREE.BoxGeometry(16,16,16);
	g.position=new THREE.Vector3(x*16,y*16,z*16);
	return new THREE.Mesh(g,blockTex(tex))
}
class BlockUpdateEvent{
	constructor(type,pos,data){
		this.type=type;
		this.data=data;
		this.pos=pos;
	}
	process(){
		switch(this.type){
			case "place":
				scene.add(block(this.pos.x,this.pos.y,this.pos.z,this.data));
				break;
			case "break":
				for(let i=0;i<scene.children.length;i++){
					if(THREE.Vector3.div(scene.children[i].position,16).equals(this.pos)){
						scene.children.splice(i,1);
						break;
					}
				}
				break;
		}
	}
}
const BUQ=[];
function processBU(){
	Array(BUQ.length).forEach((e)=>{BUQ.shift().process();});
}
camera.position.z = 70;
const tiles=Array(16).fill(Array(16).fill(Array(12).concat([["grass",{}],["stone",{}],["stone",{}],["bedrock",{}]])));//lag Lag LaG lAg LAg LAGgy!
for(let i in tiles){
	for(let j in tiles[i]){
		for(let k in tiles[i][j]){
			if(tiles[i][j][k]){
				BUQ.push(new BlockUpdateEvent("place",new THREE.Vector3(i,j,k),tiles[i][j][k][0]));
			}
		}
	}
}
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
move("w",10,0,0);
move("s",-10,0,0);
move("d",0,0,10);
move("a",0,0,-10);
move(" ",0,10,0);
move("Shift",0,-10,0);
rotate("ArrowUp",0,Math.PI/18);
rotate("ArrowDown",0,-Math.PI/18);
rotate("ArrowLeft",-Math.PI/18,0);
rotate("ArrowRight",Math.PI/18,0);
(function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	console.clear();
	console.log([camera.position.x,camera.position.y,camera.position.z,camera.rotation.x,camera.rotation.y]);
	processBU();
})();

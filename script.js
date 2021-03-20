let settings = {
	debug: 0
};
import VoxelWorld from 'https://sortacraft2.sortagames.repl.co/modules/VoxelEngine.js';
{
	VoxelWorld.prototype.myInit = function () {
		this.voxelNBT = new /*Uint8*/Array(16 ** 3);
	}
	VoxelWorld.prototype.setBlock = function (x, y, z, NBT) {
		this.voxelNBT[this.computeVoxelOffset(x, y, z)] = NBT;
		this.setVoxel(x, y, z, NBT.name);
		//console.log(x,y,z,NBT);
	}
	VoxelWorld.prototype.getBlock = function (x, y, z) {
		return this.voxelNBT[this.computeVoxelOffset(x, y, z)];
	}
	VoxelWorld.prototype.showBlock = function (x, y, z) {
		const {
			positions,
			normals,
			uvs,
			indices
		} = this.generateGeometryDataForCell(x, y, z);
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute(
			'position',
			new THREE.BufferAttribute(
				new Float32Array(positions),
				3
			)
		);
		geometry.setAttribute(
			'normal',
			new THREE.BufferAttribute(
				new Float32Array(normals),
				3
			)
		);
		geometry.setAttribute(
			'uv',
			new THREE.BufferAttribute(
				new Float32Array(uvs),
				2
			)
		);
		geometry.setIndex(indices);
		geometry.computeBoundingSphere(); // This is how you calculate intersections.
		// Now you can make a mesh with it
		let tex = new THREE.TextureLoader().load("textures.png")
		tex.minFilter = THREE.NearestFilter;
		tex.magFilter = THREE.NearestFilter;
		let g = new THREE.Mesh(geometry,
			new THREE.MeshBasicMaterial({ map: tex })
		);
		g.position.set(x, y, z);
		scene.add(g);
		//console.log(g);
	}
}

const console2 = {
	dom() {
		return document.getElementById("console");
	},
	raw(c, e) {
		let message = document.createElement("p").cloneNode();
		message.innerHTML = e.toString();
		message.style.fontColor = c;
		this.dom().appendChild(message);
	},
	clear() {
		this.dom().innerHTML = "";
	},
	log(e) {
		this.raw("black", e);
	},
	warn(e) {
		this.raw("yellow", e);
	},
	error(e) {
		this.raw("red", e);
	}
};
window.scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
const raycaster = new THREE.Raycaster();
document.body.appendChild(renderer.domElement);
function rrCol(x1, y1, z1, w1, h1, d1, x2, y2, z2, w2, h2, d2) {
	var maxX, maxY, minX, minY;
	maxX = x1 + w1 >= x2 + w2 ? x1 + w1 : x2 + w2;
	maxY = y1 + h1 >= y2 + h2 ? y1 + h1 : y2 + h2;
	maxZ = z1 + d1 >= z2 + d2 ? z1 + d1 : z2 + d2;
	minX = x1 <= x2 ? x1 : x2;
	minY = y1 <= y2 ? y1 : y2;
	minZ = z1 <= z2 ? z1 : z2;
	if (maxX - minX <= w1 + w2 && maxY - minY <= h1 + h2 && maxZ - minZ <= d1 + d2) {
		return true;
	} else {
		return false;
	}
}

/*class Entity {
  constructor(pos, shape, type) {
    this.pos = pos;
    this.shape = shape;
    this.vel = new THREE.Vector3(0, 0, 0);
  }
  force(f) {
    this.vel.add(f.clone().divideScalar(this.shape.x * this.shape.y * this.shape.z));
  }
  hit(pos) {
    return getBlock(pos.x, pos.y, pos.z) && rrCol(pos.x, pos.y, pos.z, 16, 16, 16, this.pos.x, this.pos.y, this.pos.z, this.shape.x, this.shape.y, this.shape.z);
  }
  update() {
    this.pos.add(this.vel);
  }
  display() {
    //add your code,tussiez
    let g = new THREE.Mesh(new THREE.BoxGeometry(16, 16, 16), ETEX[type].head.map((e) => { return new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/" + e + ".png") }); }););
    g.position.set(x, y , z );
    return g;
  }
}*///not ready yet
function block(x, y, z, tex) {
	let g = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({}));
	g.position.set(x, y, z);
	return g;
}
class BlockUpdateEvent {
	constructor(type, pos, data) {
		this.type = type;
		this.data = data;
		this.pos = pos;
	}
	process() {
		if (settings.debug) {
			console.log(this.type, this.pos, this.data);
		}
		switch (this.type) {
			case "place":
				chunk.showBlock(this.pos.x, this.pos.y, this.pos.z)
				//scene.add(block(this.pos.x, this.pos.y, this.pos.z, this.data));
				break;
			case "break":
				for (let i = 0; i < scene.children.length; i++) {
					if (scene.children[i].position.clone().sub(this.pos).length() <= Math.pow(3, 1 / 3)) {
						scene.children.splice(i, 1);
						break;
					}
				}
				//scene.children = [];
				chunk.setBlock(this.pos.x, this.pos.y, this.pos.z, { name: 0 })
				for (let i = -1; i < 1; i++) {
					for (let j = -1; j < 1; j++) {
						for (let k = -1; k < 1; k++) {
							chunk.showBlock(this.pos.x + i, this.pos.y + j, this.pos.z + k);
						}
					}
				}
				break;
		}
	}
}
const BUQ = [];
function processBU() {
	for (let i of BUQ) {
		BUQ.pop().process();
	}
}
//camera.position.z = -16;
camera.rotation.y = Math.PI;
window.chunk = new VoxelWorld({
	// parameters.
	cellSize: 16, // How big chunks should be (cells) x,y,z? or only x,y
	tileTextureWidth: 768, // could do [THREEJS]Texture.image.width after loading
	tileTextureHeight: 48, // height - this is used to calculate UV coords for you
	tileSize: 16, // block size (on texture)
});
chunk.myInit();
function genChunk(x, y, z) {
	let b = (e) => { return (e ? (Array(16).fill(0).map(() => { return { name: e } })) : (Array(16).fill(0).map(() => { return { name: 0 } }))); }
	let a = () => { return [b(1), b(1), b(1), b(2)].concat(Array(12).fill(0).map(b)) }//where went bedrock
	let c = () => { return Array(16).fill(0).map(a) }
	var tiles = c();//lag Lag LaG lAg LAg LAGgy!
	for (let i = 0; i < tiles.length; i++) {
		for (let j = 0; j < tiles[i].length; j++) {
			for (let k = 0; k < tiles[i][j].length; k++) {
				if (tiles[i][j][k]) {
					//BUQ.push(new BlockUpdateEvent("gen", new THREE.Vector3(i, j, k), tiles[i][j][k][0]));
					chunk.setBlock(x * 16 + i, x * 16 + j, x * 16 + k, tiles[i][j][k])
				}
			}
		}
	}
	for (let i = 0; i < tiles.length; i++) {
		for (let j = 0; j < tiles[i].length; j++) {
			for (let k = 0; k < tiles[i][j].length; k++) {
				if (tiles[i][j][k]) {
					chunk.showBlock(i, j, k);
				}
			}
		}
	}
	return chunk;
}
genChunk(0, 0, 0);

let camVec = new THREE.Vector3();
let euler = new THREE.Euler(0, 0, 0, 'YXZ');

// movement functions
const keys = new Set();
document.body.addEventListener('keydown', (e) => keys.add(e.key.toLowerCase()));
document.body.addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase())); // Press down and up
const getDir = () => {
	return new THREE.Vector3().copy(new THREE.Vector3(0, 0, -1)).applyQuaternion(camera.quaternion);
}

let speed = 0.1;
const move = (dir) => {
	//console.log('[DEBUG]', 'direction: ', dir, 'speed: ', speed, 'keys: ', keys);
	const oldPos = new THREE.Vector3();
	oldPos.copy(camera.position);
	if (keys.has('w')) {
		camera.position.addScaledVector(dir, speed);
	}
	if (keys.has('s')) {
		camera.position.addScaledVector(dir, -speed);
	}
	if (keys.has('d')) {
		camVec.setFromMatrixColumn(camera.matrix, 0);
		camera.position.addScaledVector(camVec, speed);
	}
	if (keys.has('a')) {
		camVec.setFromMatrixColumn(camera.matrix, 0);
		camera.position.addScaledVector(camVec, -speed);
	}
	if (keys.has(' ')) {
		//console.log('[DEBUG] fly up');
		camera.position.y += speed;
	}
	if (keys.has('shift')) {
		//console.log('[DEBUG] fly down')
		camera.position.y -= speed;
	}
	let { x, y, z } = camera.position;
	x = Math.ceil(x), y = Math.ceil(y), z = Math.ceil(z);
	//console.log('[DEBUG]', chunk.getBlock(x, y, z));
	//console.log('[DEBUG]', chunk.getVoxel(x, y, z));
	if (chunk.getVoxel(x, y, z) !== 0) {
		console.log('[DEBUG] blocked move from', oldPos, 'to', camera.position);
		camera.position.copy(oldPos);
	}
}

window.addEventListener("mousemove", (e) => {
	let moveX = e.movementX || 0; // compatibility wdym
	let moveY = e.movementY || 0;
	euler.setFromQuaternion(camera.quaternion);
	euler.y -= moveX * 0.002;
	euler.x -= moveY * 0.002;
	euler.x = Math.max(
		Math.PI / 2 - Math.PI,
		Math.min(
			Math.PI / 2,
			euler.x
		)
	);

	camera.quaternion.setFromEuler(euler);
});
window.oncontextmenu = (e) => {
	e.preventDefault();
}
const myCanvas = document.getElementById("ui"), ctx2 = myCanvas.getContext("2d");
addEventListener("mouseup", (e) => {
	event.preventDefault()
	document.body.requestPointerLock()
	document.body.requestFullscreen()
	raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
	const inter = raycaster.intersectObjects(scene.children);
	if (!inter[0]) { return; }
	let m = inter[0].object.position.clone();
	if (e.button === 0) {
		BUQ.push(new BlockUpdateEvent("break", m));
		chunk.setBlock(m.x, m.y, m.z, { name: 0 });
	} else if (e.button === 2) {
		let mhs = [block(m.x + 1, m.y, m.z, "grass"), block(m.x - 1, m.y, m.z, "grass"), block(m.x, m.y + 1, m.z, "grass"), block(m.x, m.y - 1, m.z, "grass"), block(m.x, m.y, m.z + 1, "grass"), block(m.x, m.y, m.z - 1, "grass")];
		let mh = [];
		for (let i of mhs) {
			var y = i.position.clone();
			try {
				if (!(chunk.getBlock(y.x, y.y, y.z))) {
					mh.push(i)
				}
			} catch (e) { }
		}
		const inter = raycaster.intersectObjects(mh);
		if (!inter[0]) { return; }
		m = inter[0].object.position.clone();
		BUQ.push(new BlockUpdateEvent("place", m, 2));
		chunk.setBlock(m.x, m.y, m.z, { name: 2 });//inventory[item];
	}
});
window.onload = function () {
	document.getElementById("mouse").style.top = (innerHeight - document.getElementById("mouse").style.width) / 2 + "px";
	document.getElementById("mouse").style.left = (innerWidth - document.getElementById("mouse").style.height) / 2 + "px";
	myCanvas.width = window.innerWidth;
	myCanvas.height = window.innerHeight;
};
renderer.domElement.style.display = "none";
function animate() {
	requestAnimationFrame(animate);
	console2.clear();
	console2.log([camera.position.x, camera.position.y, camera.position.z, camera.rotation.x, camera.rotation.y]);
	let dir = getDir();
	move(dir); //move
	processBU();
	renderer.render(scene, camera);
	ctx2.drawImage(renderer.domElement, 0, 0, window.innerWidth, window.innerHeight);
	Doc.update();
};
animate();

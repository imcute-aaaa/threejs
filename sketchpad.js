//just a plain old boring scratchpad for fancy things in three.js.
//if good,will be throwed to script.js
/*
class EntSeg {
	constructor(n, t1, t2) {
		if (!ETEX[t1]) { return alert("An entity's type is not defined.Having an error with your level?Wrong entity:" + t1); }
		if (!ETEX[t1][t2]) { return alert("An entity's type is not defined.Having an error with your level?Wrong entity:" + t1 + "." + t2); }
		this.obj = new Mesh(new THREE.BoxGeometry(ETEX[t1][t2][6].x, ETEX[t1][t2][6].y, ETEX[t1][t2][6].z), ETEX[t1][t2].slice(0, 6).map((e) => { return new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("textures/" + e + ".png") }); });)
		this.obj.rotation = new THREE.Vector3(0, 0, 0);
		this.rv = new THREE.Vector3(0, 0, 0);
		this.r = this.obj.rotation.clone();
		this.l = ETEX[t1][t2][6].y;
		this.n = ETEX[t1][t2][7];
		if (this.n instanceof this.constructor) {
			this.obj.rotation.add(this.n.obj.rotation);
		}
		scene.add(this.obj);
	}
	rot() {
		return this.r.clone().add(this.n.rot());
	}
	pos() {
		let m = ((this.n instanceof this.constructor) ? (this.n.pos()) : (this.n)).clone();
		let k = new THREE.Vector3(
			0,
			this.shape.y,
			0
		);
		let r = this.r;
		k = new THREE.Vector3(
			Math.cos(r.z) * k.x + Math.sin(r.z) * k.y,
			-Math.sin(r.z) * k.x, Math.cos(r.z) * k.y,
			z
		);
		k = new THREE.Vector3(
			Math.cos(r.y) * k.x + Math.sin(r.y) * k.z,
			y,
			-Math.sin(r.y) * k.x, Math.cos(r.y) * k.z
		);
		k = new THREE.Vector3(
			x,
			Math.cos(r.x) * k.y + Math.sin(r.x) * k.z,
			-Math.sin(r.x) * k.y, Math.cos(r.x) * k.z,
		);
		return m.add(k)
	}
	run() {
		if (this.n instanceof this.constructor) {
			this.obj.position = this.n.pos()
		} else {
			this.obj.position = this.pos()
		}
		this.obj.rotation = this.rot()

	}
	kill() {
		for (let i = 0; i < scene.children.length; i++) {
			if (scene.children[i] === this.obj) {
				scene.children.splice(i, 1);
				break;
			}
		}
	}
}
*///eliminated code
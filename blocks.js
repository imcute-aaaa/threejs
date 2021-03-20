//0:[sides]
//1:[top,bottom,sides]
//2:[top,bottom,x,y]
//3:[top,bottom,px,nx,py,ny]
var BTEX = {
	"grass": [1, ["grass_top", "dirt", "grass_side"]],
	"bedrock": [0, ["bedrock"]],
	"stone": [0, ["stone"]]
}
var ETEX = {
	"stone": { "head": ["stone", "stone", "stone", "stone", "stone", "stone", new THREE.Vector3(16, 16, 16), new THREE.Vector3(0, 0, 0)] }
}
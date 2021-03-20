// https://webassembly.studio/?f=uq5mijal7qj 
export let noise_2D, noise_3D, noise_4D;
// promise to wait for before calling anything 
export default (
	async function init() {
		const { instance } = await WebAssembly.instantiateStreaming(
			fetch("https://PerlinNoise.18001767679.repl.co/perlin3.wasm")
		);
		({ noise_2D, noise_3D, noise_4D } = instance.exports);
	}
)()
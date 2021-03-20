
class Widget{
	constructor(x,y,w,h,d){
		this.x=x;
		this.y=y;
		this.w=w;
		this.h=h;
		this.pressed=false;
		this.draggable=d;
		this.parent=Doc;
		this.children=[];
		this.onclick=()=>{};
	}
	appendChild(c){
		if(c.parent){
			let ch=[]
			for(let i=0;i<c.parent.children.length;i++){
				if(c.parent.children[i]!==c){
					ch.push(c.parent.children[i]);
				}
			}
			c.parent.children=ch;
		}
		c.parent=this;
		this.children.push(c);
		return this;
	}
	pos(){
		return this.parent.pos().addScalar(this.x,this.y);
	}
	display(){
		ctx2.fillRect(this.x,this.y,this.w,this.h);
	}
	handleClick(){
		if(mouse.x>this.x&&mouse.y>this.y&&mouse.x<this.x+this.w&&mouse.y<this.y+this.h){
			this.onclick();
		}
		for(let i in this.children){
			i.handleClick();
		}
	}
	handlePress(){
		if(mouse.x>this.x&&mouse.y>this.y&&mouse.x<this.x+this.w&&mouse.y<this.y+this.h){
			this.pressed=true;
			if(!HAND&&this.draggable){
				HAND=this;
			}
		}
		for(let i in this.children){
			i.handlePress();
		}
	}
	handleRelease(){
		if(mouse.x>this.x&&mouse.y>this.y&&mouse.x<this.x+this.w&&mouse.y<this.y+this.h){
			this.pressed=false;
			if(HAND===this&&this.draggable){
				HAND=null;
				this.x=mouse.x;
				this.y=mouse.y;
			}
		}
		for(let i in this.children){
			i.handleRelease();
		}
	}
	update(){
		if(HAND===this){
			this.x=mouse.x;
			this.y=mouse.y;
		}
		for(let i in this.children){
			i.update();
			i.display();
		}
	}
}
class ItemWidget extends Widget{
	constructor(x,y,w,h,i){
		this.item=i.map((e)=>{return e});
		super(x,y,w,h,true);
	}
}
var mouse=new THREE.Vector2(0,0),pressed=false,HAND=null,Doc=new Widget(0,0,innerWidth,innerHeight);
Doc.pos=()=>{return new THREE.Vector2(0,0);};

addEventListener("mousemove",(e)=>{
	mouse.x=e.clientX;
	mouse.y=e.clientY;
});
addEventListener("mousedown",(e)=>{
	Doc.handleClick();
	Doc.handlePress();
});
addEventListener("mouseup",(e)=>{
	Doc.handleRelease();
});

function getMousePos(e) {
	let posx = 0
	let posy = 0;
	if (!e) { e = window.event };
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return { x : posx, y : posy }
}
let Ob = function(elNode, {direction, radius}) {
	this.x = 0;
	this.y = 0;
	this.z = 0;
	this.rotateX = 0;
	this.rotateY = 0;
	this.rotateZ = 0;
	this.origin = {x: 0, y: 0, z: 0};
	this.rotation = {x: 30, y: 25, z: 0}
	this.speed = 0x3f;
	this.radius = radius || 75;
	this.direction = direction || 1;
	this.el = elNode;
}

Ob.prototype.update = function(affectVector) {
	this.x = this.direction * affectVector.x * this.radius * affectVector.percentage;
	this.y = this.direction * affectVector.y * this.radius * affectVector.percentage;
	this.z = this.direction * this.radius * affectVector.percentage;

	this.rotateX = this.rotation.x * this.direction * affectVector.percentage;
	this.rotateY = this.rotation.y * this.direction * affectVector.percentage;
	console.log(this.rotateX, this.rotateY)
	this._updatePosition();
}

Ob.prototype._updatePosition = function() {

	this.el.style.WebkitTransform = 
	this.el.style.transform = `
		translate3d(${this.x}px, ${this.y}px, ${this.z}px)
	`;

}

let FxWrap = function(el) {
	this.el = document.querySelector(el);
	this.unitVector = {x: 0, y: 0};
	this.bound = this.el.getBoundingClientRect();
	this.radius = this.bound.width;
	this.objects = [];
	this._getObjects();
	this._initEvent();
}
FxWrap.prototype._getObjects = function() {
	let self = this;

	self.objects = [...self.el.querySelectorAll('.object-wrap')].map(function(item) {
		let radius = item.getAttribute('radius') ;
		let direction = item.getAttribute('direction') == 0 ? -1 : 1;
		let ob = item.querySelector('.effect-wrap');
		return new Ob(ob, {direction, radius});
	});
}

FxWrap.prototype._initEvent = function() {

	let self = this;

	self.mouseenterFn = function(e) {
		let mousePos = getMousePos(e);
		
		// calculating affect vector
		let affectVector = {x: 0, y: 0, percentage: 0}; // unit vector and affect percentage
		let vector = {
			x: mousePos.x - (self.bound.width/2),
			y: mousePos.y - (self.bound.height/2)
		}

		// find length of "vector"
		let length = Math.sqrt(vector.x*vector.x + vector.y*vector.y)

		// calculating unit vector
		affectVector.x = vector.x / length;
		affectVector.y = vector.y / length;

		// find percentage, max is 1
		affectVector.percentage = Math.min(1, length / self.radius)


		// updateObject
		self.objects.map(function(ob) {
			ob.update(affectVector);
		})

	}

	self.el.addEventListener('mousemove', self.mouseenterFn);
}





new FxWrap('.wrap-box');
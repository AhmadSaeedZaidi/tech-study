# important things in section 10 (classes and OOP):

## what is OOP?

OOP stands for object-oriented programming. the main idea is to organize code around objects instead of around functions.

an object is a collection of properties (variables) and methods (functions).

```javascript
const user = {
	username: "hitesh",
	loginCount: 8,
	signedIn: true,

	getUserDetails: function () {
		console.log(`Username: ${this.username}`)
	},
}
```

this is an object literal, the basic unit in javascript.

### the 4 pillars of OOP:

- abstraction: hide the complex details, show only what is needed.
- encapsulation: keep data and the code that works on it together.
- inheritance: let one thing reuse the properties of another.
- polymorphism: one interface, many forms.

these are the same 4 pillars you see in cpp and python OOP.

### comparison to cpp and python:

in cpp, an object is an instance of a class, and the class is a compile-time blueprint. in python, everything is also an object, and you define classes with `class User:`. javascript is different, it is a prototype-based language. the `class` syntax exists, but it is syntactic sugar over prototypes, which we will get to.

## the `this` keyword:

`this` refers to the current execution context. as the video says, "this means jisne bhi bulaya", whoever called the function.

```javascript
const user = {
	username: "hitesh",
	loginCount: 8,

	getUserDetails: function () {
		console.log(this)
		console.log(`Username: ${this.username}`)
	},
}

user.getUserDetails()
```

inside the method, `this` is the user object itself. that is how the method knows to print "hitesh" and not some other username.

in the global scope of a browser, `this` refers to the `window` object. in node.js, top-level `this` is usually an empty object or the module exports.

### comparison to cpp:

this is exactly the `this` pointer in c++. a member function gets a hidden pointer to the object it was called on. `this->username` in cpp is `this.username` in javascript.

### arrow functions have no own this:

arrow functions do not have their own `this`. they inherit it from the surrounding scope.

```javascript
const user = {
	username: "hitesh",
	getUserDetails: () => {
		console.log(this.username) // probably undefined
	},
}
```

inside the arrow function, `this` is not the user object, it is whatever `this` was in the outer scope. that is why regular functions are used for object methods.

## constructor functions:

a constructor function is a function used with the `new` keyword to create multiple instances.

```javascript
function User(username, loginCount, isLoggedIn) {
	this.username = username
	this.loginCount = loginCount
	this.isLoggedIn = isLoggedIn

	this.greeting = function () {
		console.log(`Welcome ${this.username}`)
	}

	return this
}

const userOne = new User("hitesh", 12, true)
const userTwo = new User("ChaiAurCode", 11, false)
console.log(userOne.constructor)
```

without `new`, you would overwrite data. if you call `User(...)` as a plain function, `this` becomes the global object, and userOne and userTwo would point to the same thing, the second call overwriting the first.

`new` fixes this by creating a fresh object each time.

### the `new` keyword workflow:

when you call `new User(...)`, four steps happen internally:

1. a new empty object is created.
2. the new object's prototype is linked to the constructor's prototype.
3. the constructor is called, and `this` is bound to the new object.
4. the new object is returned automatically.

returning `this` is implied in a constructor, so you do not need to write `return this`.

### comparison to cpp and python:

in cpp, `new User(...)` allocates on the heap and calls the constructor. in python, `User(...)` calls `__new__` then `__init__`. javascript's `new` is closest to cpp's `new`, minus the memory management, javascript handles garbage collection for you.

## functions are objects:

an important fact: functions in javascript are objects.

```javascript
function multipleBy5(num) {
	return num * 5
}

multipleBy5.power = 2

console.log(multipleBy5(5)) // 25
console.log(multipleBy5.power) // 2
console.log(multipleBy5.prototype) // {}
```

because a function is an object, you can attach properties to it with dot notation. `multipleBy5.power = 2` works fine.

every function has a `prototype` property. it is an object that will be linked to instances created with `new`.

### comparison to python:

in python, functions are also objects. you can attach attributes to a function too, `def f(): pass` then `f.power = 2`. this is one of the few places where javascript and python feel similar, both treat functions as first-class objects.

## the prototype chain:

javascript uses prototypal inheritance. when you access a property on an object and it is not there, javascript walks up the prototype chain to the parent, then the grandparent, until it reaches `null`.

```javascript
function createUser(username, score) {
	this.username = username
	this.score = score
}

createUser.prototype.increment = function () {
	this.score++
}
createUser.prototype.printMe = function () {
	console.log(`price is ${this.score}`)
}

const chai = new createUser("chai", 25)
chai.printMe() // price is 25
chai.increment()
```

`printMe` and `increment` are not on the chai object itself. they live on `createUser.prototype`. when you call `chai.printMe()`, javascript does not find `printMe` on chai, so it checks the prototype, finds it there, and runs it with `this` bound to chai.

### edge cases:

- the chain ends at `null`. the prototype of `Object.prototype` is `null`.
- giving a method to one constructor's prototype does not automatically give it to siblings. only objects inheriting from that prototype see the change.

### comparison to cpp and python:

in cpp, method lookup is like a vtable, an object walks its class and base classes. in python, attribute lookup follows the MRO (method resolution order), if not on the object, check the class, then its parents. javascript's prototype chain is the same idea, just more exposed and dynamic.

## modifying built-in prototypes:

you can add methods to global prototypes like Array, String, or Object.

```javascript
Object.prototype.hitesh = function () {
	console.log("hitesh is present in all objects")
}

Array.prototype.heyHitesh = function () {
	console.log("Hitesh says hello")
}
```

now every array can call `myHeros.heyHitesh()`, because arrays inherit from Array.prototype, which inherits from Object.prototype.

```javascript
let myHeros = ["thor", "spiderman"]
myHeros.heyHitesh() // Hitesh says hello
```

### edge case:

`heroPower.heyHitesh()` would fail for a plain object, because `heyHitesh` is on Array.prototype, not Object.prototype. the inheritance direction matters. children inherit from parents, not the other way around.

### from my research:

extending built-in prototypes is generally considered a bad idea in real projects, because it is global and can collide with other libraries. there was even a famous incident called SmooshGate about it. but it is great for understanding how prototypes work. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain

## prototypal inheritance:

before classes, you could link objects together manually.

```javascript
const User = {
	name: "chai",
	email: "chai@google.com",
}

const Teacher = {
	makeVideo: true,
}

Teacher.__proto__ = User
```

now Teacher inherits from User. `Teacher.name` returns "chai".

the old way used `__proto__`. the modern way is `Object.setPrototypeOf`.

```javascript
Object.setPrototypeOf(Teacher, User)
```

### trueLength example:

```javascript
let anotherUsername = "ChaiAurCode     "

String.prototype.trueLength = function () {
	console.log(this.trim().length)
}

anotherUsername.trueLength() // 11
"hitesh".trueLength() // 6
"iceTea".trueLength() // 5
```

we add a `trueLength` method to every string, which trims whitespace and counts the real length. calling it on a plain string literal works because even literals get boxed into String objects when you call a method on them.

### from my research:

`__proto__` is deprecated, prefer `Object.setPrototypeOf`. there is also `Object.create(proto)`, which makes a new object with a given prototype. and mutating prototypes with setPrototypeOf is slow, the engine de-optimizes it, so set the prototype at creation time when possible. references: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

## the .call() method:

`.call()` lets you run a function with a specific `this` value.

```javascript
function SetUsername(username) {
	this.username = username
	console.log("Called")
}

function createUser(username, email, password) {
	SetUsername.call(this, username)

	this.email = email
	this.password = password
}

const chai = new createUser("chai", "chai@fb.com", "123")
console.log(chai)
```

without `.call(this, ...)`, calling `SetUsername(username)` inside createUser would run it in its own context. the `this.username = username` line would set the property on the global object, and it would vanish once the function finished.

with `.call(this, username)`, SetUsername runs with `this` pointing to the new createUser instance, so `this.username` lands on chai.

### key difference:

- `SetUsername(username)` just references and calls the function in its own context, the properties vanish.
- `SetUsername.call(this, username)` forces the function to use the outer context, saving the properties into the chai object.

### from my research:

`.call(thisArg, ...args)` invokes immediately. `.apply(thisArg, argsArray)` is the same but takes an array of args. `.bind(thisArg)` returns a new function with this permanently attached, and does not invoke. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call

### comparison to cpp and python:

in cpp there is no direct equivalent, member functions are bound to their object. in python, `obj.method` gives you a bound method automatically. the closest python idea is explicitly passing self. javascript's `.call()` is a manual way to say "use this object as the receiver".

## the .bind() method:

`.bind()` solves the problem of a method losing its `this` when passed as a callback.

```javascript
class React {
	constructor() {
		this.library = "React"
		this.server = "https://localhost:300"

		document
			.querySelector("button")
			.addEventListener("click", this.handleClick.bind(this))
	}

	handleClick() {
		console.log("button clicked")
		console.log(this.server)
	}
}
```

if you pass `this.handleClick` to addEventListener without binding, when the click happens, `this` inside handleClick is the button element, not the React instance. so `this.server` would be undefined.

`.bind(this)` returns a new function with `this` permanently set to the instance, so the method keeps access to the class properties.

### from my research:

`.bind()` is the only one of the three that returns a new function. `.call()` and `.apply()` invoke immediately. in early React this was a very common bug, which is why the video mentions it. modern code tends to use arrow functions or class properties instead, but bind is still everywhere in legacy code. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

## classes:

classes are the modern way to create objects. they are syntactic sugar over the prototype system we just looked at.

```javascript
class User {
	constructor(username, email, password) {
		this.username = username
		this.email = email
		this.password = password
	}

	encryptPassword() {
		return `${this.password}abc`
	}
}

const chai = new User("chai", "chai@gmail.com", "123")
console.log(chai.encryptPassword()) // 123abc
```

the `constructor` method runs automatically when you use `new`. methods like `encryptPassword` go on the class's prototype automatically.

### the rule:

`new` is mandatory. you cannot call a class constructor without `new`, it throws a TypeError.

### what it looks like behind the scenes:

the class version is sugar for a constructor function with methods on its prototype:

```javascript
function User(username, email, password) {
	this.username = username
	this.email = email
	this.password = password
}

User.prototype.encryptPassword = function () {
	return `${this.password}abc`
}

const tea = new User("tea", "tea@gmail.com", "123")
console.log(tea.encryptPassword()) // 123abc
```

same behavior, older syntax. classes just make it cleaner.

### comparison to cpp and python:

this class syntax looks like cpp and python classes, but remember the engine still does prototypes under the hood. in python, methods go on the class, and instances look them up, which is the same mental model.

## inheritance with extends and super:

a class can inherit from another using `extends`.

```javascript
class User {
	constructor(username) {
		this.username = username
	}

	logMe() {
		console.log(`USERNAME is ${this.username}`)
	}
}

class Teacher extends User {
	constructor(username, email, password) {
		super(username)
		this.email = email
		this.password = password
	}

	addCourse() {
		console.log(`A new course was added by ${this.username}`)
	}
}

const chai = new Teacher("chai", "chai@teacher.com", "123")
chai.logMe() // USERNAME is chai
```

`extends` makes Teacher inherit from User. `super(username)` calls the parent class constructor, passing username. then Teacher adds its own fields.

### edge case:

you must call `super()` before accessing `this` in a derived class constructor. if you use `this` before super, you get a ReferenceError.

```javascript
const masalaChai = new User("masalaChai")
console.log(chai instanceof User) // true
```

`instanceof` checks whether User.prototype is in chai's prototype chain. since Teacher extends User, chai is an instance of both.

### comparison to python:

this is exactly python's `class Teacher(User)` and `super().__init__(username)`. the rule about super coming first is similar to python requiring you to set up the parent before adding child state, though python is more lenient.

### from my research:

`static` members belong to the class itself, not instances. `new User().createId()` fails, but `User.createId()` works. static members are inherited by subclasses though, so `Teacher.createId()` works. reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static

```javascript
class User {
	static createId() {
		return "123"
	}
}

const hitesh = new User("hitesh")
// hitesh.createId() // TypeError: hitesh.createId is not a function
console.log(User.createId()) // 123
```

## property descriptors:

every object property has hidden flags controlling how it behaves. you can inspect them with `Object.getOwnPropertyDescriptor`.

```javascript
const descripter = Object.getOwnPropertyDescriptor(Math, "PI")
console.log(descripter)
// { value: 3.14..., writable: false, enumerable: false, configurable: false }
```

Math.PI is not writable, not enumerable, and not configurable. that is why you can never change it.

```javascript
Math.PI = 5
console.log(Math.PI) // still 3.14159...
```

### the flags:

- `writable`: can the value be changed. if false, reassignment silently fails (or throws in strict mode).
- `enumerable`: does it show up in `for...in`, `Object.keys`, and spread. if false, loops ignore it.
- `configurable`: can the descriptor be changed or the property deleted.

you can set these flags with `Object.defineProperty`.

```javascript
const chai = {
	name: "ginger chai",
	price: 250,
	isAvailable: true,

	orderChai: function () {
		console.log("chai nhi bni")
	},
}

Object.defineProperty(chai, "name", {
	enumerable: false,
})

for (let [key, value] of Object.entries(chai)) {
	if (typeof value !== "function") {
		console.log(`${key} : ${value}`)
	}
}
// price : 250
// isAvailable : true
```

once `enumerable` is false, "name" disappears from the loop. this is a common debugging point, data from an api or backend seems missing from a UI iteration because its property is non-enumerable.

### the typeof check:

when iterating over an object with `Object.entries`, methods show up too. the check `typeof value !== "function"` skips them so only plain data is printed.

### from my research:

assigning `obj.a = 1` creates a property with all flags true, but `Object.defineProperty` defaults them all to false. there is also `Object.getOwnPropertyDescriptors(obj)` (plural) to inspect all properties at once. references: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

### comparison to python:

python has a similar idea with the descriptor protocol and `__getattr__`/`__setattr__`. but python's @property is the cleaner everyday way to intercept access, which matches the next section.

## getters and setters:

getters and setters let you run code when a property is read or written, while keeping the property interface clean.

### 1. class syntax:

```javascript
class User {
	constructor(email, password) {
		this.email = email
		this.password = password
	}

	get email() {
		return this._email.toUpperCase()
	}

	set email(value) {
		this._email = value
	}

	get password() {
		return `${this._password}hitesh`
	}

	set password(value) {
		this._password = value
	}
}

const hitesh = new User("h@hitesh.ai", "abc")
console.log(hitesh.email) // H@HITESH.AI
```

the getter transforms the value on read, the setter stores it on write. the user of the class still just reads `hitesh.email` like a normal property.

### the infinite recursion trap:

here is the critical edge case. if you name the getter or setter the same as the property it assigns to, you get infinite recursion.

```javascript
class User {
	set password(value) {
		this.password = value // BUG: calls the setter again, forever
	}
}
```

the setter assigns to `this.password`, which triggers the setter again, which assigns again, and so on until the stack overflows with "Maximum call stack size exceeded".

the fix is to store the real value in a differently named field, conventionally with an underscore:

```javascript
class User {
	set password(value) {
		this._password = value // no recursion, stores in _password
	}
}
```

### why `_` convention:

the underscore is just a convention meaning "internal, do not touch". `this._password` is a normal public property, nothing enforces the underscore.

### 2. old syntax with Object.defineProperty:

before classes, people used Object.defineProperty.

```javascript
function User(email, password) {
	this._email = email
	this._password = password

	Object.defineProperty(this, "email", {
		get: function () {
			return this._email.toUpperCase()
		},
		set: function (value) {
			this._email = value
		},
	})
}

const chai = new User("chai@chai.com", "chai")
console.log(chai.email) // CHAI@CHAI.COM
```

same idea, more verbose.

### 3. object literal syntax:

getters and setters also work directly in object literals.

```javascript
const User = {
	_email: "h@hc.com",
	_password: "abc",

	get email() {
		return this._email.toUpperCase()
	},

	set email(value) {
		this._email = value
	},
}

const tea = Object.create(User)
console.log(tea.email) // H@HC.COM
```

### private fields with #:

the future trend is real private fields using the `#` prefix. this is actual language-level enforcement, not just a convention.

```javascript
class User {
	#password // real private field

	get password() {
		return this.#password
	}

	set password(value) {
		this.#password = value
	}
}
```

a `#` field is inaccessible outside the class. referencing it from outside is a syntax error, and reading it on an object that does not have it throws a TypeError. it is not inherited by subclasses.

### comparison to python:

this maps directly to python's `@property` and `@name.setter`. the difference is python has no way to make an attribute truly private, underscore is also just convention there. javascript's `#` is stronger, it is actual enforcement, more like cpp's `private:`.

## key takeaways:

- javascript is a prototype-based language, classes are syntactic sugar.
- `this` refers to whoever called the function, "jisne bhi bulaya".
- arrow functions have no own this, they inherit it.
- `new` creates a fresh object, links the prototype, binds this, and returns the object.
- functions are objects, you can attach properties to them.
- the prototype chain walks from an object up to Object.prototype, ending at null.
- you can add methods to built-in prototypes, but it is global and discouraged in real projects.
- `.call()` and `.apply()` invoke immediately with a chosen this, `.bind()` returns a new bound function.
- `extends` and `super` give class inheritance, call super before using this.
- `static` members live on the class, not instances.
- property descriptors control writable, enumerable, and configurable, which is why Math.PI is immutable.
- getters and setters run code on property access, never name them the same as the stored property.
- `_` is a convention, `#` is real privacy.
- the same OOP pillars exist in cpp and python, but javascript's prototype system is more dynamic and exposed.

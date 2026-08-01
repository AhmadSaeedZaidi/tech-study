# important things in section 03 (basics 3):

## functions in JS

functions are reusable blocks of code.
they help keep code modular, readable, and easier to debug.

## function syntax and execution:

functions are defined with the `function` keyword, followed by a name, parentheses `()`, and curly braces `{}` for the body.

```javascript
function sayMyName() {
	console.log("H")
	console.log("i")
}

sayMyName()
// H
// i
```

important difference:

```javascript
sayMyName   // reference only, no execution
sayMyName() // function executes
// H
// i
```

## parameters and arguments:

parameters are the variables written in the function definition.
arguments are the actual values passed when calling the function.

```javascript
function addTwoNumbers(num1, num2) {
	console.log(num1 + num2)
}

addTwoNumbers(3, 5)
// 8
```

`num1` and `num2` are parameters.
`3` and `5` are arguments.

## return values:

`console.log()` prints something, but it does not give a value back to the caller.
to store or reuse a result, you must use `return`.

```javascript
function addTwoNumbers(n1, n2) {
	return n1 + n2
}

const result = addTwoNumbers(3, 5)
result // 8
```

anything written after `return` will not run.

```javascript
function test() {
	return "done"
	console.log("this will never run")
}

// no output, because test() is not called
```

## missing inputs and edge cases:

if you call a function without required arguments, the missing parameter becomes `undefined`.

```javascript
function loginUser(username) {
	if (username === undefined) {
		console.log("Please enter a username")
		return
	}

	return `${username} just logged in`
}

loginUser()
// Please enter a username
```

you can also use falsy checks to simplify this.
`undefined` is a falsy value, so `!username` works for the common case.

```javascript
function loginUser(username) {
	if (!username) {
		console.log("Please enter a username")
		return
	}

	return `${username} just logged in`
}

loginUser()
// Please enter a username
```

another option is to give the parameter a default value.
that avoids `undefined` issues entirely.

```javascript
function loginUser(username = "Guest") {
	return `${username} just logged in`
}

loginUser() // "Guest just logged in"
```

## key takeaway:

use `return` when the function result needs to be reused.
use `console.log()` only when you want to print something for debugging or display.
always think about what happens if the user passes no arguments or unexpected data.

## advanced parameters:

this section covers a few useful ways to handle multiple values, objects, and arrays in function parameters.

### 1) rest operator

when a function needs to accept an unknown number of arguments, the rest operator collects them into a single array.

```javascript
function calculateCartPrice(...num1) {
	return num1
}

console.log(calculateCartPrice(200, 400, 500)) // [200, 400, 500]
```

if you use named parameters before the rest operator, those parameters take the first arguments and the rest collects everything else.

```javascript
function example(val1, val2, ...rest) {
	console.log(rest)
}

example(100, 200, 300, 400) // [300, 400]
```

### 2) passing objects to functions

functions can accept objects as inputs, which is helpful when you want to pass structured data like user profiles.

```javascript
const user = { username: "Hitesh", price: 199 }

function handleObject(anyObject) {
	console.log(`Username is ${anyObject.username} and price is ${anyObject.price}`)
}

handleObject(user)
handleObject({ username: "Sam", price: 399 })
// Username is Hitesh and price is 199
// Username is Sam and price is 399
```

if you access a property that does not exist, JavaScript returns `undefined`.
in real code, it is a good idea to use checks or type validation before relying on the values.

### 3) passing arrays to functions

functions can also take arrays as parameters and use index-based access inside the function.

```javascript
const myNewArray = [200, 400, 100, 600]

function returnSecondValue(getArray) {
	return getArray[1]
}

console.log(returnSecondValue(myNewArray)) // 400
```

the parameter name is just a local placeholder for the value that is passed in, so use the generic parameter name inside the function to keep it reusable.

### summary table

| Concept | Goal | Key Syntax |
| :--- | :--- | :--- |
| Rest Operator | Collect multiple args into an array | `(...args)` |
| Object Parameter | Access data by key name | `(obj) => obj.key` |
| Array Parameter | Access data by index | `(arr) => arr[index]` |

## scope in javascript:

scope controls where variables can be accessed in a program.
it is basically the set of rules that decides which part of the code can see a variable.
the main keywords to understand here are `let`, `const`, and `var`.

### 1) the three keywords

`let` and `const` are block-scoped.
that means they only exist inside the nearest set of curly braces `{}`.

`var` is function-scoped or globally scoped.
it ignores block boundaries like `if` statements and loops.

### 2) block scope vs global scope

block scope is defined by curly braces, like in an `if` statement or a function.
variables declared with `let` or `const` inside a block cannot be accessed outside it.

the global scope is the outermost scope of the program.
variables declared there can be accessed from nested scopes, but the exact behavior depends on the environment, such as a browser script, a browser module, or node.js.

### 3) code breakdown and edge cases

the main problem with `var` is that it does not respect block scope.
this can cause variables to leak out of blocks and overwrite other values.

```javascript
if (true) {
	let a = 10
	const b = 20
	var c = 30
}

// console.log(a) // Error: a is not defined
// console.log(b) // Error: b is not defined
console.log(c) // 30
```

variables in an outer scope are accessible inside nested blocks, but variables inside blocks stay protected from the outside.

```javascript
let a = 300

if (true) {
	let a = 10
	console.log('Inner:', a)
}

console.log('Outer:', a)
// Inner: 10
// Outer: 300
```

### 4) key takeaways

avoid `var` because it can create unpredictable behavior in larger applications.
keep variables as local as possible so you do not pollute the global namespace.
also remember that global scope can behave differently depending on the environment, such as a browser console versus node.js.

## this keyword and arrow functions:

the `this` keyword refers to the current execution context.
in practice, that usually means the object currently running the code.

### 1) the `this` keyword

inside an object method, `this` refers to the object itself.
that makes it useful for reading the object's properties.

```javascript
const user = {
	username: "Hitesh",
	welcomeMessage: function () {
		console.log(`${this.username}, welcome to the website`)
	}
}

user.welcomeMessage()
// Hitesh, welcome to the website
```

at the top level, `this` behaves differently depending on the environment.
in a classic browser script, it refers to the `window` object.
in a node.js commonjs module, top-level `this` is usually the module's exported object.
in an es module, top-level `this` is `undefined`.

inside a regular function, `this` refers to the global object in the non-strict case.
in strict mode, `this` is `undefined` when the function is called without an object.
that is why regular functions can behave differently depending on how they are called.

### 2) arrow functions

arrow functions were introduced in es6 and provide a shorter syntax for writing functions.

```javascript
const chai = () => {
	let username = "Hitesh"
	console.log(this.username)
}

chai()
// undefined in most module contexts
```

arrow functions do not have their own `this`.
instead, they inherit `this` from the surrounding scope, which makes them behave differently from regular functions when you try to access object properties.

### 3) arrow function return rules

if you use curly braces in an arrow function, you must use the `return` keyword explicitly.

```javascript
const add = (n1, n2) => {
	return n1 + n2
}

add(3, 5) // 8
```

if you use parentheses, you can return a value implicitly without writing `return`.
this is useful for short one-line functions.

```javascript
const add = (n1, n2) => (n1 + n2)

add(3, 5) // 8
```

when returning an object implicitly, wrap the object in parentheses.
otherwise, the curly braces will be treated as the function body.

```javascript
const getObject = () => ({ username: "Hitesh" })

getObject() // { username: "Hitesh" }
```

### key takeaways

use regular functions when you need object-aware `this` behavior.
use arrow functions for compact syntax when you do not need their own `this`.
remember that implicit object returns require parentheses.

## iife:

an iife is an immediately invoked function expression.
it runs as soon as it is defined.

### why use an iife

an iife is useful when you want immediate execution, such as initializing a database connection when the app starts.
it also helps avoid global scope pollution, because variables inside the iife stay isolated.

### syntax breakdown

to create an iife, wrap the function in parentheses so javascript treats it as an expression, then call it immediately with another set of parentheses.

```javascript
(function chai() {
	console.log("DB Connected")
})()
// DB Connected
```

### variations and rules

you can make an iife named or anonymous.
you can also use arrow functions for cleaner syntax.

```javascript
(() => {
	console.log("DB Connected Two")
})()
// DB Connected Two
```

you can pass arguments into an iife just like any other function.

```javascript
((name) => {
	console.log(`DB Connected to ${name}`)
})("Hitesh")
// DB Connected to Hitesh
```

### important edge case

when writing multiple iifes in the same file, always end the first one with a semicolon.
without the semicolon, javascript may try to treat the second function expression as part of the first statement.

```javascript
(function one() {
	console.log("One")
})()

(function two() {
	console.log("Two")
})()
```

// One
// TypeError
// Two does not run

the safer version is:

```javascript
(function one() {
	console.log("One")
})();

(function two() {
	console.log("Two")
})()
// One
// Two
```

### key takeaways

use an iife when you want code to run immediately and stay out of the global scope.
remember the semicolon rule when chaining or stacking iifes in one file.

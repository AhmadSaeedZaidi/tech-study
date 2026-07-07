# important things in section 02 (basics 2):


## array in JS

arrays are used to store multiple values in a single variable.
they are ordered, mutable, and can hold mixed data types.

## Array basics:

### declaration
arrays are created using square brackets `[]`.

```javascript
let myArr = [0, 1, 2, 3, 4]
let myHeroes = ["zoro", "luffy"]
let myMix = [1, "two", true, [3, 4]]
```

### accessing elements
arrays use zero-based indexing, so the first element is at index `0`.

```javascript
myArr[0] // 0
myHeroes[1] // "luffy"
```

### length property
every array has a `.length` property that tells you how many elements are in it.
it is a property, not a method.

```javascript
myArr.length // 5
myMix.length // 4
```

## array methods:

### push()
adds one or more elements to the end of the array.
it returns the new length of the array.

```javascript
let arr = [1, 2, 3]
arr.push(4)
arr // [1, 2, 3, 4]
```

### pop()
removes the last element from the array.
it does not need any arguments.
it returns the removed element.

```javascript
let arr = [1, 2, 3]
arr.pop() // 3
arr // [1, 2]
```

### unshift()
adds one or more elements to the beginning of the array.
this is slower than `push()` because every element has to be re-indexed.

```javascript
let arr = [2, 3]
arr.unshift(1)
arr // [1, 2, 3]
```

### shift()
removes the first element from the array.
it returns the removed element.

```javascript
let arr = [1, 2, 3]
arr.shift() // 1
arr // [2, 3]
```

### includes()
checks whether an element exists in the array.
returns `true` or `false`.

```javascript
let arr = [1, 2, 3]
arr.includes(2) // true
arr.includes(5) // false
```

### indexOf()
returns the index of the first matching element.
if the element is not found, it returns `-1`.

```javascript
let arr = [1, 2, 3, 2]
arr.indexOf(2) // 1
arr.indexOf(5) // -1
```

### join()
combines array elements into a string.
by default, elements are separated by commas.

```javascript
let arr = ["h", "i", "t", "e", "s", "h"]
arr.join() // "h,i,t,e,s,h"
arr.join("-") // "h-i-t-e-s-h"
```

## slice vs splice:

### slice(start, end)
returns a copy of a portion of the array.
the original array does not change.
the end index is not included.

```javascript
let arr = [0, 1, 2, 3, 4]
let sliced = arr.slice(1, 4)
sliced // [1, 2, 3]
arr // [0, 1, 2, 3, 4]
```

### splice(start, deleteCount)
removes elements from the original array.
this mutates the array directly.
the second argument is the number of elements to remove.

```javascript
let arr = [0, 1, 2, 3, 4]
let removed = arr.splice(1, 3)
removed // [1, 2, 3]
arr // [0, 4]
```

the key difference is simple:
`slice()` copies a part of the array, while `splice()` changes the original array.

### my own discoveries:

smaller difference is that, in slice end is exclusive upper bound, while in splice, the second argument is the number of elements to remove.
also, splice can take a third argument to add new elements in place of the removed ones.

```javascript
let arr = [0, 1, 2, 3, 4]
// remove 2 elements starting from index 1, and add "a" and "b"
arr.splice(1, 2, "a", "b") // [1, 2]
arr // [0, "a", "b", 3, 4]
```
if `"a","b"` was in an array, it would have been added as a single element, not two separate elements.

```javascript
let arr = [0, 1, 2, 3, 4]
// remove 2 elements starting from index 1, and add ["a", "b"]
arr.splice(1, 2, ["a", "b"]) // [1, 2]
arr // [0, ["a", "b"], 3, 4]
```
we can fix this by using the spread operator `...` to spread the elements of the array.

```javascript
let arr = [0, 1, 2, 3, 4]
// remove 2 elements starting from index 1, and add "a" and "b" using spread operator
arr.splice(1, 2, ..."ab") // [1, 2]
arr // [0, "a", "b", 3, 4]
``` 
## array lesson 2:

in this part, main focus is merging arrays, flattening nested arrays, and creating arrays from other values.

### 1) array merging methods

#### push()
you can push a whole array into another array, but it becomes a nested array (array inside array).

```javascript
let marvelHeroes = ["thor", "ironman"]
let dcHeroes = ["superman", "flash"]

marvelHeroes.push(dcHeroes)
marvelHeroes // ["thor", "ironman", ["superman", "flash"]]
```

so `push()` is great for adding elements, but not ideal for merging arrays into one flat list.

#### concat()
combines arrays and returns a new array.
original arrays stay unchanged.

```javascript
let marvelHeroes = ["thor", "ironman"]
let dcHeroes = ["superman", "flash"]

let allHeroes = marvelHeroes.concat(dcHeroes)
allHeroes // ["thor", "ironman", "superman", "flash"]
```

#### spread operator (...)
modern and cleaner way to merge arrays.
you spread elements into a new array. i've already mentioned this before in the notes, but since it was covered in the video, i will include it here as well.

```javascript
let marvelHeroes = ["thor", "ironman"]
let dcHeroes = ["superman", "flash"]

let allNewHeroes = [...marvelHeroes, ...dcHeroes]
allNewHeroes // ["thor", "ironman", "superman", "flash"]
```

### 2) flattening methods

#### flat(depth)
flattens nested arrays into a single-level array.
you can pass depth like `1`, `2`, etc, or use `Infinity` for unknown nesting depth.

```javascript
let nestedArray = [1, 2, [3, 4], [5, [6, 7]]]

nestedArray.flat(1) // [1, 2, 3, 4, 5, [6, 7]]
nestedArray.flat(Infinity) // [1, 2, 3, 4, 5, 6, 7]
```

### 3) array creation methods

#### Array.isArray(value)
checks if value is an array.
returns true/false.

```javascript
Array.isArray("Hitesh") // false
Array.isArray([1, 2, 3]) // true
```

#### Array.from(value)
creates a new array from iterable or array-like values.
very common with strings.

```javascript
Array.from("Hitesh") // ["H", "i", "t", "e", "s", "h"]
```

interesting edge case:
if object does not have iterable behavior (or proper length/key mapping), result can be empty.

```javascript
Array.from({ name: "hitesh" }) // []
```

consulting MDN:

```javascript
Array.from(items)
Array.from(items, mapFn)
Array.from(items, mapFn, thisArg)
```

ok so

```javascript
Array.from({ name: "hitesh", length: 1 }); 
// Result: [undefined]

// Add a length AND an indexed key. Now it's truly "array-like".
Array.from({ 0: "hitesh", length: 1 }); 
// Result: ["hitesh"]
```
to explain this a bit, you can sort of trick `Array.from` into thinking an object is array-like by giving it a `length` property and indexed keys. If you just give it a `length`, it will create an array of that length filled with `undefined`. But if you also provide indexed keys, it will use those values in the resulting array.

furthermore, you can also use `Array.from` with a mapping function to transform the elements as they are added to the new array.

```javascript
Array.from({ length: 5 }, (_, index) => index * 2);
// Result: [0, 2, 4, 6, 8]
```

apparently, this is a memory efficient way to create arrays, especially when you want to generate a sequence of numbers or transform data on the fly. I'll circle back to this some day-

the third argument um...
i'm gonna leave it till here for now. future me please read this later: [MDN link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)



#### Array.of(...elements)
creates an array from given arguments.
useful when you want explicit element list.

```javascript
let score1 = 100
let score2 = 200
let score3 = 300

Array.of(score1, score2, score3) // [100, 200, 300]
```

quick rule:
use `concat` or spread for merging, `flat` for nested arrays, and `Array.from`/`Array.of` for array creation.

## objects in JS

objects are key-value collections used to group related data and behavior.
very common for representing users, products, configs, etc.

### 1) defining objects

most common way is object literal syntax.

```javascript
const jsUser = {
	name: "Hitesh",
	age: 18,
	location: "Jaipur"
}
```

there is also constructor-based style (`new Object()`), which can be useful in some patterns, but literal syntax is cleaner for most cases.

### 2) accessing properties

#### dot notation
simple and readable when key is a normal identifier.

```javascript
jsUser.name // "Hitesh"
```

#### bracket notation
needed when key has spaces/special chars, or when key is dynamic.

```javascript
const user = {
	"full name": "Hitesh Choudhary"
}

user["full name"] // "Hitesh Choudhary"
```

dynamic key access:

```javascript
let key = "name"
jsUser[key] // "Hitesh"
```

### 3) symbol as object key

symbols are unique and useful when you want keys that won't clash.
important: when defining symbol keys in object literals, use square brackets.

```javascript
const mySym = Symbol("key1")

const obj = {
	[mySym]: "mykey1"
}

obj[mySym] // "mykey1"
```

if you write `mySym: "value"`, that becomes a normal string key, not a symbol key.

### 4) modifying and freezing objects

object values can be overwritten directly.

```javascript
jsUser.email = "hitesh@chatgpt.com"
```

to prevent further edits, freeze the object.

```javascript
Object.freeze(jsUser)
```

after freeze, changes are ignored (or can throw in strict mode).

### 5) functions inside objects (methods)

functions can be stored inside objects as methods.

```javascript
jsUser.greeting = function () {
	console.log("Hello JS user")
}
```

use `this` to refer to properties of the same object.

```javascript
jsUser.greetingTwo = function () {
	console.log(`Hello JS user, ${this.name}`)
}
```

note:
for object methods, regular function syntax is usually safer than arrow functions when you need `this`.


### NOTE:
so, from some research into MDN,
```javascript
const obj = {
    "uwu-rawr": "uwu",
}
obj["uwu-rawr"] // "uwu"
obj.uwu-rawr // undefined
```

the only reason we needed `""` is because our key has special characters. We can use `""` syntax for any key, but it's REQUIRED when our key has a name that would be illegal for a variable to have (starting the key with a number, having spaces, or having special characters like `-` etc).

furthermore, the `[keyVar] : "value"` syntax is used when we want to use a variable as the key name. If we just wrote `keyVar: "value"`, it would literally create a key named `"keyVar"`. Due to this default behaviour, the syntax for sort of "dynamic" keys uses the `[]` syntax discussed above.

## object lesson 2:

this part is about object creation patterns, nested objects, merging, and some useful inspection methods.

### 1) declaring objects

#### singleton / constructor style
`new Object()` creates an object using the constructor pattern.
for most everyday code, it behaves the same as a normal object literal.

```javascript
const tinderUser = new Object()
```

#### object literal style
this is the common and cleaner way to create objects.

```javascript
const tinderUser = {}
```

### 2) nested objects and optional chaining

objects can contain other objects inside them.
this is very common when data is deeply structured.

```javascript
const user = {
	email: "user@example.com",
	fullName: {
		userFullName: {
			firstName: "Hitesh",
			lastName: "Choudhary"
		}
	}
}

user.fullName.userFullName.firstName // "Hitesh"
```

if a nested property might not exist, use optional chaining to avoid crashes.

```javascript
user.fullName?.userFullName?.firstName
```

that way, if one step in the chain is missing, JavaScript returns `undefined` instead of throwing an error.

### 3) merging objects

#### object in object trap
if you place objects inside another object without merging, you get nested objects instead of a combined object.

```javascript
const obj1 = { a: 1, b: 2 }
const obj2 = { c: 3, d: 4 }

const obj3 = { obj1, obj2 }
obj3 // { obj1: { a: 1, b: 2 }, obj2: { c: 3, d: 4 } }
```

#### Object.assign()
copies properties from source objects into a target object.
best practice is to use an empty object as the target so you get a new reference.

```javascript
const obj1 = { a: 1, b: 2 }
const obj2 = { c: 3, d: 4 }

const obj3 = Object.assign({}, obj1, obj2)
obj3 // { a: 1, b: 2, c: 3, d: 4 }
```

#### spread operator
modern and preferred way to merge objects.

```javascript
const obj1 = { a: 1, b: 2 }
const obj2 = { c: 3, d: 4 }

const obj3 = { ...obj1, ...obj2 }
obj3 // { a: 1, b: 2, c: 3, d: 4 }
```

### 4) extracting keys, values, and entries

these are very useful when data comes back from a database or an API.

```javascript
const user = {
	name: "Hitesh",
	age: 18,
	location: "Jaipur"
}

Object.keys(user) // ["name", "age", "location"]
Object.values(user) // ["Hitesh", 18, "Jaipur"]
Object.entries(user) // [["name", "Hitesh"], ["age", 18], ["location", "Jaipur"]]
```

### 5) checking for properties

`hasOwnProperty()` checks whether the object itself has a property.
it does not check the prototype chain.

```javascript
tinderUser.hasOwnProperty("isLoggedIn")
```

this is useful when you want to check for a field safely before using it.

### edge cases and notes

database responses are often arrays of objects, so you may need to access the array first and then the object.

```javascript
const users = [
	{ email: "a@example.com" },
	{ email: "b@example.com" }
]

users[0].email // "a@example.com"
```

also, methods like `hasOwnProperty` come from the object prototype, so they are available on normal objects even though you do not define them yourself.

## object lesson 3:

this part is about destructuring objects and understanding JSON / API data.

### 1) object destructuring

destructuring is a clean way to extract values from an object into variables.
instead of writing `object.property` again and again, you pull the values out once.

```javascript
const course = {
	courseName: "JS in Hindi",
	price: 999,
	instructor: "Hitesh"
}

const { instructor } = course
instructor // "Hitesh"
```

you can also rename the variable while destructuring.

```javascript
const { instructor: teacher } = course
teacher // "Hitesh"
```

this is used a lot in react when handling props, because it keeps the code short and readable.

### array destructuring note

the video also notes that arrays can be destructured too, although that is a different pattern and less common in this specific lesson.

```javascript
const arr = [1, 2, 3]
const [first, second] = arr
```

### 2) json and apis

api is basically a bridge between frontend and backend.
json is the common format used to send data through that bridge.

important detail:
json looks like a JavaScript object, but it is actually a string format.

### json rules

json keys must be written in double quotes.
regular JavaScript objects do not require quotes unless the key has special characters.

```javascript
// JavaScript object
const user = {
	name: "Hitesh",
	age: 18
}

// JSON-style data
{
	"name": "Hitesh",
	"age": 18
}
```

also, json does not have a variable name attached to it the way a JavaScript object assignment does.

### api response shapes

apis commonly return either a single object or an array of objects.
you need to check which one you got before accessing properties.

```javascript
const apiResponse = {
	name: "Hitesh",
	age: 18
}

apiResponse.name // "Hitesh"
```

```javascript
const apiUsers = [
	{ name: "A" },
	{ name: "B" }
]

apiUsers[0].name // "A"
```

if the response is an array, you usually loop through it to work with each object.

### api data inspection

when the api response is complex, it helps to format it first using a json formatter.
that makes it easier to see whether you are dealing with an object or an array of objects.

### important note

the main difference is simple:
javascript objects are code structures, while json is a data exchange format.
that is why json is stricter and more uniform.


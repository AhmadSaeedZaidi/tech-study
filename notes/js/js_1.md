# important things in section 01 (basics 1):

## variables:
use `const` and `let`, `var` is an outdated way of declaring variables, and should be avoided. It is only here because it is legacy code, and is not recommended for use in modern JavaScript.

## print to console:

of course, 
```javascript
console.log("Hello World")
```

## data types:
Js is implicitly typed, like python. it has standard datatypes, that can be accessed using the `typeof` function.
```
typeof "value"
typeof undefined // returns undefined, as it is a special type
typeof null // returns object
```
- `undefined` is a special type that represents the absence of a value. it is the default value of uninitialized variables, and the return value of functions that do not return anything.
- `null` is a special value that represents the intentional absence of any object value.
other types are 

## conversion
you can convert numbers from one data type to another
for example
```javascript
let num = "33"
let numValue = Number(num) // converts string to number
```

but there are some interesting edge cases.
- if string is alphanumeric, `NaN` is assigned
- NULL causes 0 to be assigned
- bool is casted into 0 and 1
- undefined is `NaN` as well.

## operators:
simple dimple, `*, -, +, / `
same python syntax for `**` and `%` for power and modulus respectively.
two strings can be added using `+`

interesting:
```javascript
console.log("1" + 2)
```
returns 12, converts 1 to string

but

```javascript
console.log(1 + 1 + "2")
```
returns 22, performs int operation on first 2 numbers, THEN converts to string for 3rd operation. 
reads from left to right, and performs operations in order of precedence.

simply avoid this kind of programming, use explicit types, and parenthesis with explicit order of operations.

### prefix and postfix operators:
```javascript
let a = 1
console.log(++a) // 2, increments a, then returns a
console.log(a++) // 2, returns a, then increments a
```
simple concept, exists in cpp as well

### comparison operators:
`==` and `===` are different, the first one is a loose comparison, and the second one is a strict comparison.
loose comparison will convert types of operands and then compare
but it can lead to unexpected results, so it is recommended to use strict comparison.

# Special datatypes lesson:

two types:
## primitive:
7 types: String, Number, BigInt, Boolean, undefined, Symbol, null

these are all intuitive except symbol. symbol is weird... basically it's a unique id, that doesn't depend on the value of the variable. Something interesting is that, it's not enumerable. From my research, it seems symbols are needed because the scope in JS is not as strict as in other languages, and symbols are a way to create unique identifiers that won't collide with other identifiers in the same scope.

also adding a `n` at the end of a number makes it BigInt. Self explanatory, like `long long` in cpp.

## references (basically pointers):

array: `[]`
just like a python list, but with some differences. Arrays are objects in JS, and have some special properties and methods. For example, the length property returns the number of elements in the array, and the push method adds an element to the end of the array.

object: `{}`
just like a python dictionary, but with some differences.
the keys MUST be strings or symbols, or are casted to string. 
furthermore, it can have methods.
for a parallel to cpp, the object is like a function, but you can add new properties (fields) as well as methods, and change the datatypes and values of the fields, at runtime. because everything in JS is basically in the heap.

## stack vs heap concept
very simple, references are pointers to heap. You explicitly need to make a deep copy or else you will just make 2 pointers to same object.
In stack, deep copy is the default, but in heap, it is not. This is because stack is used for primitive types, which are small and can be copied easily, while heap is used for reference types, which can be large and complex.

## Strings:
use interpolation with backticks, and `${}` to insert variables into strings. This is called template literals.

```javascript
let name = "John"
console.log(`Hello ${name}`) // Hello John
```

strings are objects in JS. They have .__proto, which is a reference to the String prototype object, which has methods like .length, .toUpperCase(), .toLowerCase(), .includes(), .indexOf(), .slice(), .substring(), .replace(), .split(), .trim(), etc.

## Common string methods (quick notes):

let's use one sample string for all examples:

```javascript
let gameName = "hitesh-js"
```

### .length
returns total number of characters in the string.
includes symbols like `-` and also spaces.
it is a property, not a function, so no `()`.

```javascript
gameName.length // 9
```

### .toUpperCase()
returns a new string in uppercase (does not modify original string).
original variable remains unchanged unless you store the result.

```javascript
gameName.toUpperCase() // "HITESH-JS"
```

### .charAt(index)
returns the character at a specific index.
index starts from 0.
if index is out of range, it returns empty string.

```javascript
gameName.charAt(2) // "t"
```

### .indexOf(char)
returns index of first occurrence of a character (or substring).
if not found, returns -1.
search is case-sensitive.

```javascript
gameName.indexOf("t") // 2
```

### .substring(start, end)
returns part of a string from start to end-1.
end index is not included.
if end is omitted, it goes till the end of string.
negative values are treated as 0.

```javascript
gameName.substring(0, 3) // "hit"
```

### .slice(start, end)
similar to substring, but supports negative indexing.
negative index starts from end of string.
if end is omitted, it slices till the end.
very useful when you want last N characters.

```javascript
gameName.slice(-2) // "js"
gameName.slice(0, 6) // "hitesh"
```

### .trim()
removes spaces from start and end of a string.
does not remove spaces in the middle.
also returns a new string, original stays same.

```javascript
let newString = "   hitesh   "
newString.trim() // "hitesh"
```

### .replace(searchValue, replaceValue)
replaces matched text with new text.
by default, replaces only first match.
for all matches, use regex with global flag `/.../g`.

```javascript
let url = "https://hitesh.com/hitesh%20choudhary"
url.replace("%20", "-") // "https://hitesh.com/hitesh-choudhary"
```

### .includes(string)
checks whether given text exists in the string.
returns true or false.
this is case-sensitive and often cleaner than `indexOf(...) !== -1`.

```javascript
url.includes("hitesh") // true
```

### .split(separator)
splits string into array based on separator.
super useful for csv-like text, urls, tags, etc.
if separator is not found, result is array with original full string.

```javascript
gameName.split("-") // ["hitesh", "js"]
```

## Numbers:
numbers can be defined directly, or wrapped with the `Number` constructor.
most of the time you will use normal number literals.

```javascript
const score = 400
const balance = new Number(100)
```

the wrapped version behaves like a number object, but it is usually not needed in everyday code.

### .toString()
converts a number into a string.
useful when you want string methods like `.length` on a number value.

```javascript
let scoreValue = 400
scoreValue.toString() // "400"
scoreValue.toString().length // 3
```

### .toFixed(digits)
formats a number with a fixed number of digits after the decimal point.
it returns a string, which makes it useful for prices and financial display.

```javascript
let price = 99.8966
price.toFixed(2) // "99.90"
```

### .toPrecision(digits)
returns a string with the number rounded to a given precision.
it counts significant digits, so large or small values can switch to exponential form.

```javascript
let value = 123.8966
value.toPrecision(3) // "124"
value.toPrecision(2) // "1.2e+2"
```

### .toLocaleString()
formats a number in a readable locale-based style.
commonly used for commas and other regional number separators.

```javascript
let amount = 1000000
amount.toLocaleString() // "1,000,000"
amount.toLocaleString("en-IN") // "10,00,000"
```

## Number constants:
javascript gives some useful static properties on the `Number` object.
these help with safe ranges and number limits.

```javascript
Number.MAX_VALUE
Number.MIN_VALUE
Number.MAX_SAFE_INTEGER
```

`Number.MAX_SAFE_INTEGER` is especially important because numbers beyond that can lose precision.


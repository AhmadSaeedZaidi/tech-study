# important things in section 09 (bonus): es modules (esm)

## what is esm?

esm stands for es modules, the official module system of javascript. it lets you split code into separate files and share values between them with `export` and `import`.

```javascript
// utils.js
export const gameName = "hitesh-js"

export function logName(name) {
	console.log(name)
}
```

```javascript
// main.js
import { gameName, logName } from "./utils.js"

logName(gameName)
```

### in the browser vs node:

in the browser, a file is a module only when you load it with `<script type="module">`.

```html
<script type="module" src="main.js"></script>
```

in node, a file is treated as esm if it has the `.mjs` extension, or if the package.json has `"type": "module"`. commonjs (`require` / `module.exports`, the `.cjs` extension) is the older node system, it is not part of the javascript spec.

### comparison to python and cpp:

python is the closest. `import` in python and `import` in javascript are basically the same idea, top-level code runs on import and cycles mostly work. cpp has no built-in module system until c++20, traditionally it is headers plus translation units plus a linker. esm is closer to c++20 modules than to classic cpp.

## the import/export forms:

### named exports:

```javascript
export const x = 1
export function foo() {}
```

```javascript
import { x, foo } from "./a.js"
```

### default export:

each module can have one default export.

```javascript
export default function bar() {}
```

```javascript
import bar from "./a.js"
```

### namespace import:

grabs everything as one object.

```javascript
import * as ns from "./a.js"
ns.x
ns.foo()
```

### rules and gotchas:

- imports must be at the top level, not inside functions or if blocks, and the module specifier must be a string literal. otherwise it is a SyntaxError.
- imported bindings are read-only, like `const`. reassigning them throws.
- relative paths must include the extension. `./utils` does not work in browsers or node esm, you need `./utils.js`.

## static vs dynamic import:

the regular `import` is static. it is hoisted, meaning the imported module's code runs before the rest of the importing module's code. this rigidity is what lets engines do tree-shaking, removing unused exports at build time.

there is also a dynamic form, `import()`, which returns a promise. this ties directly into the promises section.

```javascript
const m = await import("./a.js")
m.foo()
```

```javascript
import("./a.js").then((m) => m.foo())
```

dynamic import is useful for lazy loading, you only fetch and run a module when it is actually needed.

## top-level await:

`await` is allowed at the top level of a module, but not in a classic script.

```javascript
export const data = await fetch("/api/data")
```

this is another promise tie-in. modules basically act like big async functions, top-level await blocks the importing module until it settles.

## module quirks:

- modules run in strict mode automatically.
- modules are deferred in the browser, they execute after html parsing.
- a module runs once and is cached, even if imported by multiple files.
- module top-level variables are scoped to the module, not global.
- top-level `this` in a module is `undefined`. in a classic script it is `window`. remember this from the `this` notes in section 03.
- exports are live bindings, not copies. if the exporting module updates a value, the importing module sees the new value. commonjs instead copies the value at require time, so it can go stale.

### from my research:

modules over `file://` fail with cors errors in the browser, you have to serve them over http. and cycles are possible but risky, if a cycle reads a binding before it is initialized you get a ReferenceError. references: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

## key takeaways:

- esm is the official module system, commonjs is the old node one.
- named exports use braces, default exports do not.
- static import is hoisted and enables tree-shaking.
- dynamic `import()` returns a promise, use it for lazy loading.
- top-level await works in modules.
- modules are strict, deferred, cached, and scoped.
- top-level `this` is undefined in a module.
- exports are live bindings, not copies.
- python's import is the closest analogy, cpp has no standard equivalent until c++20.

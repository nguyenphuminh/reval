## Get started

There are many ways to add Reval into your project.

### From browsers

The easiest option is to pull it from a CDN:
```html
<script src="https://unpkg.com/revaljs"></script>
```

Or for better load time, consider downloading the library from [our releases page](https://github.com/nguyenphuminh/reval/releases/).

And then get the necessary functions:
```js
const { el, mount, unmount, setState } = Reval;
```

### From npm

You can also just install it through `npm`:
```
npm i revaljs
```

And then get the required functions like this:
```js
const { el, mount, unmount, setState } = require("revaljs");
```

## Creating HTML elements in Reval

There is a handy dandy function called `el` to create HTML elements:

Syntax: `el(tagName, props, childNodes)`

Example:
```js
const hello = el("p", { id: "Hello" }, [
	"Hello, World!", // You can use normal text
	el("br")
]);
```

HTML equivalent:
```html
<p id="Hello">
	Hello, World!
	<br/>
</p>
```

Note that in `props`, you can also assign event handlers, for example:
```js
const hello = el("p", { id: "Hello": onclick: () => alert("You clicked me!") }, el("br"));
```


## Mount and unmount

You can mount an HTML element or a Reval component to another HTML element (container):
```js
mount(document.body, hello);
```

It will mount `hello` to `document.body`, so you will see `Hello, World!` rendered on the browser.

You can also unmount that element:
```js
unmount(document.body, hello);
```

You can mount the element before a specified element:
```js
mount(parent, child, before);
```

To re-render an element, pass in `true` as the fourth argument.
```js
mount(parent, child, before, true);
```


## Components

Reval components all have a basic form like this:
```js
class ComponentName {
	// this.render() returns an HTML element
	render() {
		return /* code goes here */;
	}
}

const componentName = new ComponentName();

// mount the component
mount(parent, componentName);
// unmount the component
unmount(parent, componentName);
```


## State

You can manage components' states using the `states` prop:
```js
this.states = {}
```

and change the state with `setState`:
```js
setState(component, { state: value });
```

The HTML element got re-rendered every time states are changed.

### Scope

Be careful when you pass in handlers for events, because if you use arrow functions, the scope will be inside the component's class, but if you use normal functions, the scope will be the HTML element itself with `this` pointed to the element.


## Component lifecycle

There are three lifecycle events in a Reval's component - `onmount` - when the component is mounted to a container, `onunmount` - when the component is unmounted from a container, and `onupdate` - when a component is updated.

You can pass in handlers for each events as methods of the component's class:

```js
	onmount() {
		// Gets triggered when component is mounted
	}

	onunmount() {
		// Gets triggered when component is unmounted
	}

	onupdate() {
		// Gets triggered every time the component is updated (when the state is changed)
	}
```

## Creating a counter example!

Basically, we will create a `Counter` component, set the `counter` state to `1`. `render()` should return an HTML element with a list of child nodes consists of the current value of the counter, a button for incrementing the counter, a button for decrementing the counter. We will use `setState` to change the value of `counter` and re-render the element. Finally, we will create an instance of `Counter` called `counter` and mount it to `document.body`.

```js
class Counter {
	constructor() {
		this.states = {
			counter: 1
		};
	}

	render() {
		return el("h1", {}, [
			this.states.counter,
			
			el("br"),

			el("button", { 
				onclick: () => setState(this, { counter: this.states.counter + 1 })
			}, "Increment"),

			el("button", { 
				onclick: () => setState(this, { counter: this.states.counter - 1 })
			}, "Decrement")
		]);
	}
}
const counter = new Counter();

mount(document.body, counter);
```

## More on Reval

### Conditional rendering

You can just use the ternary operator to do conditional rendering:
```js
	render() {
		return 1 === 1 ? el("p", {}, "I'm fine") : el("p", {}, "I'm crazy");
	}
```

### Lists

Rendering a list of elements can be done easily with `map` and the spread operator.

```js
	render() {
		return el("ul", {}, [
			...[1, 2, 3].map(item => el("li", {}, item))
		]);
	}
```

This would generate:

```html
<ul>
	<li>1</li>
	<li>2</li>
	<li>3</li>
</ul>
```

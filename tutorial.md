## Install
Add a `script` tag right into your HTML file:
```
<script src="https://unpkg.com/revaljs"></script>
```

Or install it through npm:

```
npm i revaljs
```

## Creating HTML elements in Reval
There is a handy dandy function called `el` to create HTML elements:

Syntax: `el(tagName, props, childNodes)`

Example:
```js
const hello = el("p", { id: "Hello" }, [
	"Hello, World!" // You can use normal text
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
You can mount an HTML element or a Reval component to another HTML element:
```js
mount(document.body, hello);
```

It will mount `hello` to `document.body`, so you will se `Hello, World!` rendered on the browser.

You can also unmount that element:
```js
unmount(document.body, hello);
```

You can mount the element before and element:
```js
mount(parent, child, before)
```

If you pass in `true` as the fourth argument, you can replace an element with an element in the parent node:
```
mount(parent, child, before, true)
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
mount(parent, componentName)
// unmount the component
unmount(parent, componentName)
```

## States
You can create states using the `states` prop:
```js
this.states = {}
```

and change the state with `setState`:
```js
setState(component, { state: value })
```

If you don't know what states are, basically, the HTML element got re-rendered every time states are changed.

## Component lifecycle
There are 2 special methods in a component:

```js
	onmount() {
		// Gets triggered when component is mounted
	}

	onunmount() {
		// Gets triggered when component is unmounted
	}
```

## Utilities
Assign attributes to an HTML element:
```js
attr(element, attributes<Object>)
```

Assign CSS styles to an HTML element:
```js
style(element, styles<Object>)
```

Check if a parent node contains a child node (or a component):
```js
contains(parent, child)
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

// Utility to check if one is a function
// It is named "a" to reduce size because a minifier would keep the name of a global variable
let a = item => typeof item == "function";

// Utility to check if one is a component
let c = item => item && a(item.render);

// Utility to get the html element of a component/element
let e = item => c(item) ? item.e : item;

// Utility to remove child el from parent el
let r = (parent, child) => parent.removeChild(child);

// Utility to mount a component/element to another component/element
let m = (target, child, before, replace) => {
	// Check if target is a component, we would have to use target.e
	let newTarget = e(target);
	// Check if before is a component, we would have to use before.e
	let newBefore = e(before);
	// This will be used as a lifecycle event handler
	let handler;

	// A handy dandy closure to mount child to target
	let mount = (newChild) =>
		newBefore ?
		(
			replace ?
			newTarget.replaceChild(newChild, newBefore) :
			newTarget.insertBefore(newChild, newBefore)
		) :
		newTarget.append(newChild);

	// If child is a component
	c(child) ?
	(
		// Get appropriate handler and remove element from old parent if the parent exists
		(handler = child.m ? (r(child.m, child.e), child.onremount) : child.onmount),
	
		// Re-render
		mount(child.e = child.render()),

		// Update parent
		child.m = newTarget,

		// Call handler
		a(handler) && handler()
	)
	// If not, just mount directly regardless whatever the value is
	: mount(child);
}

// The main lib
let Reval = {
	// Mounts an element/component to another element/component
	mount: m,

	unmount(target, child) {
		// Get the HTML element from the component/element
		let newTarget = e(target);

		// Unmount based on whether child is a component or an element
		(c(child)) ? (r(newTarget, child.e), delete child.m, a(child.onunmount) && child.onunmount()) : r(newTarget, child);
	},

	// Utility to re-render component with new state
	setState(component, state) {
		// Update state
		Object.assign(component.state, state);
		// Get old element
		let oldEl = component.e;
		// Compute the new element and replace with the old one
		component.m.replaceChild((component.e = component.render()), oldEl);
	},

	// Utility to create an html element
	el(tag, attr = {}, body) {
		let newEl = document.createElement(tag);

		// Mount child components and child elements onto newEl
		[].concat(body).map(child => m(newEl, child));

		// Set attributes or event handlers for our new element
		Object.entries(attr).map(([attrName, attrVal]) => a(attrVal) ? (newEl[attrName] = attrVal) : newEl.setAttribute(attrName, attrVal));

		return newEl;
	}
}

// Export for use in Node
typeof module == "object" && (module.exports = Reval);

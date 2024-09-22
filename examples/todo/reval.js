// Utility to check if one is a function
// It is named "a" to reduce size because a minifier would keep the name of a global variable
let a = item => typeof item == "function";

// Utility to check if one is a component
let c = item => item && a(item.render);

// Utility to get the html element of a component/element
let e = item => c(item) ? item.e : item;

// Utility to mount a component/element to another component/element
let m = (target, child, before, replace) => {
	// Check if target is a component, we would have to use target.e
	let newTarget = e(target);
	// Check if before is a component, we would have to use before.e
	let newBefore = e(before);

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
	if (c(child)) {
		// If component is already mounted, remove from old parent
		child.m && child.m.removeChild(child.e);
		
		// Re-render
		child.e = child.render();

		// Mount the computed element
		mount(child.e);

		// Update parent
		child.m = newTarget;

		// Call onremount if there is any
		a(child.onremount) && child.onremount();
		// Call onmount event handler if there is any
		a(child.onmount) && child.onmount();
	}
	// If not, just mount directly regardless whatever the value is
	else {
		mount(child);
	}
}

// The main lib
let Reval = {
	// Mounts an element/component to another element/component
	mount: m,

	unmount(target, child) {
		// Get the HTML element from the component/element
		let newTarget = e(target);

		// If child is a component
		if (c(child)) {
			newTarget.removeChild(child.e);

			delete child.m;
			
			a(child.onunmount) && child.onunmount();
		} else {
			newTarget.removeChild(child);
		}
	},

	// Utility to update from 
	setState(component, states) {
		Object.assign(component.states, states);

		let oldEl = component.e;
		let newEl = component.render();

		component.m.replaceChild(newEl, oldEl);
		component.e = newEl;
	},

	// Utility to create an html element
	el(tag, attr, body) {
		let newEl = document.createElement(tag);
		let newBody = Array.isArray(body) ? body : [body];

		for (const child of newBody) {
			m(newEl, child);
		}

		// Set attributes for our new element
		if (typeof attr == "object") {
			for (let attrName in attr) {
				if (a(attr[attrName])) {
					newEl[attrName] = attr[attrName];
				} else {
					newEl.setAttribute(attrName, attr[attrName]);
				}
			}
		}

		return newEl;
	}
}

if (typeof module == "object") {
	module.exports = Reval;
}

"use strict";

function el(tag, attr, body) {
	const newEl = document.createElement(tag);
		
	Array.isArray(body) ? body.forEach(item => newEl.append(item)) : newEl.append(body);
	
	if (typeof attr === "object" && attr !== null) {
		Object.keys(attr).forEach(attrName => {
			if (typeof attr[attrName] === "function") {
				newEl[attrName] = attr[attrName];
			} else {
				newEl.setAttribute(attrName, attr[attrName])
			}
		});
	}

	return newEl;
}

function mount(target, child, before, replace) {
	if (typeof child.render !== "function") {
		(!(typeof before === "undefined" || before === null)) ? 
		(replace ? target.replaceChild(child, before) : target.insertBefore(child, before)) :
		target.append(child);
	} else {
		child.el = child.render();
		(!(typeof before === "undefined" || before === null)) ?
		(replace ? target.replaceChild(child.el, before) : target.insertBefore(child.el, before)) :
		target.append(child.el);
		child.mountedTo = target;
		typeof child.onmount === "function" && child.onmount();
	}
}

function unmount(target, child) {
	if (typeof child.render !== "function") {
		target.removeChild(child);
	} else {
		target.removeChild(child.el);
		child.mountedTo = null;
		typeof child.onunmount === "function" && child.onunmount();
	}
}

function setState(component, states) {
	Object.keys(states).forEach(key => {
		if (typeof states[key] === "object" || typeof states[key] === "function") {
			Object.keys(states[key]).forEach(stateKey => {
				component.states[key][stateKey] = states[key][stateKey];
			});
		} else {
			component.states[key] = states[key];
		}
	})
	component.mountedTo.removeChild(component.el);
	component.el = component.render();
	component.mountedTo.appendChild(component.el);
}

function attr(el, attrs) {
	Object.keys(attrs).forEach(attrName => el.setAttribute(attrName, attrs[attrName]));
}

function style(el, styles) {
	Object.keys(styles).forEach(styleName => el.setAttribute(styleName, styles[styleName]));
}

function contains(parent, child) {
	if (child.render && !child.el) {
		child.el = child.render();
	}
	return parent !== child && parent.contains(child.el || child);
}

if (typeof module === "object" && typeof module.exports === "object") {
	module.exports = { el, mount, unmount, attr, style, contains, setState };
}

"use strict";

function el(tag, attr, body) {
	const newEl = document.createElement(tag);
		
	if (Array.isArray(body)) {
		body.forEach(item => newEl.append(item));
	} else {
		newEl.append(body);
	}
	
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
	if (typeof child.el === "undefined" || child.el === null) {
		if (!(typeof before === "undefined" || before === null)) {
			replace ? target.replaceChild(child, before) : target.insertBefore(child, before);
		} else {
			target.append(child);
		}
	} else {
		if (!(typeof before === "undefined" || before === null)) {
			replace ? target.replaceChild(child.el, before) : target.insertBefore(child.el, before);
		} else {
			target.append(child.el);
		}
		child.mountedTo = target;
		typeof child.onmount === "function" && child.onmount();
	}
}

function unmount(target, child) {
	if (typeof child.el === "undefined" || child.el === null) {
		target.removeChild(child);
	} else {
		target.removeChild(child.el);
		child.mountedTo = null;
		typeof child.onunmount === "function" && child.onunmount();
	}
}

function bind(component) {
	const metadata = {};

	Object.keys(component.states).forEach(key => {
		metadata[key] = component.states[key];

		Object.defineProperty(component.states, key, {
			get() {
				return metadata[key];
			},

			set(newKeyValue) {
				metadata[key] = newKeyValue;
				component.mountedTo.removeChild(component.el);
				component.el = component.render();
				component.mountedTo.appendChild(component.el);
			}
		});
	});
}

function attr(el, attrs) {
	Object.keys(attrs).forEach(attrName => el.setAttribute(attrName, attrs[attrName]));
}

function style(el, styles) {
	Object.keys(styles).forEach(styleName => el.setAttribute(styleName, styles[styleName]));
}

function contains(parent, child) {
	return parent !== child && parent.contains(child.el || child);
}

if (typeof module === "object" && typeof module.exports === "object") {
	module.exports = { el, mount, unmount, attr, style, contains, changeState };
}

"use strict";

let Reval = {
	el(tag, attr, body) {
		let newEl = document.createElement(tag);
			
		Array.isArray(body) ? body.forEach(item => newEl.append(item)) : newEl.append(body);
		
		if (typeof attr === "object" && attr !== null) {
			for (let attrName in attr) {
				if (typeof attr[attrName] === "function") {
					newEl[attrName] = attr[attrName];
				} else {
					newEl.setAttribute(attrName, attr[attrName]);
				}
			}
		}

		return newEl;
	},

	mount(target, child, before, replace) {
		if (typeof child.render !== "function") {
			before ? 
			(replace ? target.replaceChild(child, before) : target.insertBefore(child, before)) :
			target.append(child);
		} else {
			child.el = child.render();
			before ?
			(replace ? target.replaceChild(child.el, before) : target.insertBefore(child.el, before)) :
			target.append(child.el);

			child.mountedTo = target;

			typeof child.onmount === "function" && child.onmount();
		}
	},

	unmount(target, child) {
		if (typeof child.render !== "function") {
			target.removeChild(child);
		} else {
			target.removeChild(child.el);

			child.mountedTo = null;
			
			typeof child.onunmount === "function" && child.onunmount();
		}
	},

	setState(component, states) {
		for (let key in states) {
			component.states[key] = states[key];
		}

		component.mountedTo.removeChild(component.el);
		component.el = component.render();
		component.mountedTo.appendChild(component.el);

		typeof component.onupdate === "function" && component.onupdate();
	}
};

if (typeof module === "object" && typeof module.exports === "object") {
	module.exports = Reval;
}

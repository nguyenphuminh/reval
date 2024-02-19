let a = item => typeof item == "function";

let Reval = {
	el(tag, attr, body) {
		let newEl = document.createElement(tag);

		Array.isArray(body) ? newEl.append(...body) : newEl.append(body);
		
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
	},

	mount(target, child, before, replace) {
		if (a(child.render)) {
			child.e = child.render();
			before ?
			(replace ? target.replaceChild(child.e, before) : target.insertBefore(child.e, before)) :
			target.append(child.e);

			child.m = target;

			a(child.onmount) && child.onmount();
		} else {
			before ? 
			(replace ? target.replaceChild(child, before) : target.insertBefore(child, before)) :
			target.append(child);
		}
	},

	unmount(target, child) {
		if (a(child.render)) {
			target.removeChild(child.e);

			child.m = null;
			
			a(child.onunmount) && child.onunmount();
		} else {
			target.removeChild(child);
		}
	},

	setState(component, states) {
		Object.assign(component.states, states);

		component.m.removeChild(component.e);
		component.e = component.render();
		component.m.append(component.e);

		a(component.onupdate) && component.onupdate();
	}
};

if (typeof module == "object") {
	module.exports = Reval;
}

export default class Tabs {
	constructor(container_selector, config){
		this.container_selector = container_selector;
		this.config = config;
		
		// validate parent element
		let html = document.querySelector(container_selector);
		if (html){
			this.html = html;
		} else {
			this.print_error(`No element found with matching selector: ${container_selector}`);
			return false;
		}

		// validate child element
		let controls = html.firstElementChild;
		if (controls){
			this.controls = controls;
		} else {
			this.print_error(`Missing first child element for tab controls for element matching selector: ${container_selector}`);
			return false;
		}

		// validate sibling element
		let content = html.lastElementChild;
		if (content){
			this.content = content;
		} else {
			this.print_error(`Missing last child element for tab content for element matching selector: ${container_selector}`);
			return false;
		}

		// validation
		if (this.controls.children.length !== this.content.children.length){
			this.print_error('Tabs and Content do not have equal amount of children');
			return false;
		}

		// setup
		this.default_tab = config && config.default_tab || 0;
		if (
			this.default_tab < 0 || 
			this.default_tab > (this.controls.children.length - 1) ||
			this.default_tab > (this.content.children.length - 1)
		){
			print_error('Default tab is set out of bounds, defaulting to 0');
			this.default_tab = 0;
		}

		// initialize
		this.initializePart(content, null, config.content_tab_class);
		this.initializePart(controls, this.activateTab, config.control_tab_class);
	}

	initializePart(part, handler, element_class){
		let index = 0;
		for (let element of part.children){
			element.setAttribute('data-index', index);
			if (element_class){
				element.classList.add(element_class);
			}
			if (index === this.default_tab){
				element.classList.add('active');
			}
			if (handler){
				let self = this;
				element.addEventListener('click', function(){
					handler(self, element);
				});
			}
			index++;
		}
	}

	activateTab(tabs_obj, part){
		let index = part.getAttribute('data-index');
		let i = 0;
		let children = tabs_obj.controls.children;
		for (let element of children){
			let content = tabs_obj.getContentTab(i);
			if (element.getAttribute('data-index') === index){
				element.classList.add('active');
				content.classList.add('active');
			} else {
				element.classList.remove('active');
				content.classList.remove('active');
			}
			i++;
		}
	}

	getContentTab(index){
		return this.content.querySelector('[data-index="'+ index + '"');
	}

	print_error(error){
		const errorPrefix = '%cTAB ERROR:\t';
		const errorStyle = 'padding:10px;color:#c53030;background-color: #fff5f5;border: 2px solid #fc8181;border-radius: 3px;';
		let msg = errorPrefix + error;
		console.log(msg, errorStyle);
	}
	
	print_example_html(){
		console.log(`
			<div id="example">
				<div>
					<div>tab 1</div>
					<div>tab 2</div>
					<div>tab 3</div>
				</div>
				<div>
					<div>Tab 1 content</div>
					<div>tab 2 content</div>
					<div>tab 3 content</div>
				</div>
			</div>
		`);
	}
}
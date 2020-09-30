function Tabs(container_id, config){
	let self = this;

	function print_error(error){
		const errorPrefix = '%cTAB ERROR: ';
		const errorStyle = 'padding:10px;color:#c53030;background-color: #fff5f5;border: 2px solid #fc8181;border-radius: 3px;';
		let msg = errorPrefix + error;
		console.log(msg, errorStyle);
	}

	let html = document.querySelector(container_id);
	if (html){
		self.html = html;
	} else {
		print_error(`No element found with id: ${container_id}`);
		return false;
	}

	let controls = html.firstElementChild;
	if (controls){
		self.controls = controls;
	} else {
		print_error(`Missing first child element for tab controls: ${container_id}`);
		return false;
	}

	let content = html.lastElementChild;
	if (content){
		self.content = content;
	} else {
		print_error(`Missing last child element for tab content: ${container_id}`);
		return false;
	}

	if (self.controls.children.length !== self.content.children.length){
		print_error('Tabs and Content do not have equal amount of children');
		return false;
	}

	self.default_tab = config && config.default_tab || 0;
	if (
		self.default_tab < 0 || 
		self.default_tab > (self.controls.children.length - 1) ||
		self.default_tab > (self.content.children.length - 1)
	){
		print_error('Default tab is set out of bounds, defaulting to 0');
		self.default_tab = 0;
	}

	function activateTab(){
		let index = this.getAttribute('data-index');
		let i = 0;
		for (element of controls.children){
			let content = getContentTab(i);
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

	function getContentTab(index){
		return self.content.querySelector('[data-index="'+ index + '"');
	}

	
	function initializePart(part, handler, element_class){
		let index = 0;
		for (element of part.children){
			element.setAttribute('data-index', index);
			if (element_class){
				element.classList.add(element_class);
			}
			if (index == self.default_tab){
				element.classList.add('active');
			}
			if (handler){
				element.addEventListener('click', handler);
			}
			index++;
		}
	}

	initializePart(content, null, config.content_tab_class);
	initializePart(controls, activateTab, config.control_tab_class);
}
Tabs.prototype.print_example_html = function(){
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
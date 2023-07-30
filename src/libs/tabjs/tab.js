var tabjs = {
	rootPath: '',
	initTabOnLoad(rootPath = '') {
		var buttons = document.createElement('div');
		buttons.classList.add('tab');
		document.body.appendChild(buttons);
		this.rootPath = rootPath;
	},
	loadTabs(iJSONUrl, onTabLoaded, onTabsLoaded) {
		return this._loadJSON(iJSONUrl)
			.then(response => {
				return new Promise(resolve => {
					for (let tab of response) {
						this.loadTab(tab, onTabLoaded);
					}
					if (onTabsLoaded) {
						onTabsLoaded();
					}
					document.querySelector('#defaultOpened').click();
				});
			});
	},
	loadTab(iTabData, iCallback) {
		var me = this;
		var buttons = document.querySelector('.tab');
		// Create button
		var button = document.createElement('button');
		button.classList.add('tablinks');
		button.addEventListener('click', (function(e) {
			me.openTab(e, iTabData.id);
		}), false);
		button.innerHTML = iTabData.name;
		if (iTabData.defaultOpened) {
			button.id = "defaultOpened";
		}
		buttons.appendChild(button);
		
		// Create tab content
		var tabContent = document.createElement('div');
		tabContent.id = iTabData.id;
		tabContent.classList.add('tabcontent');
		document.body.appendChild(tabContent);
		
		if (iTabData.type === "iframe") {
			var iframe = document.createElement('iframe');
			iframe.src = `${this.rootPath}/${iTabData.filepath}`;
			tabContent.appendChild(iframe);
			
			if (iCallback) {
				iCallback(iframe);
			}
		} else {
			var pre = document.createElement('pre');
			var code = document.createElement('code');
			code.classList.add('hljs');
			code.classList.add(iTabData.type);
			pre.appendChild(code);
			tabContent.appendChild(pre);
			
			this.loadFileInTabContent(iTabData.filepath, code)
				.then(iElement => {
					if (iCallback) {
						iCallback(iElement);
					}
				});
		}
	},
	loadFileInTabContent(iURL, iElement) {
		var extension = iURL.substring(iURL.lastIndexOf('.') + 1);
		return this._loadText(iURL)
			.then(response => {
				return new Promise(resolve => {
					if (extension === "html") {
						response = response.replace(/</g, "&lt;");
						response = response.replace(/>/g, "&gt;");
					}
					iElement.innerHTML = response;
					resolve(iElement);
				});
			});
	},
	openTab(evt, tabName) {
		// Declare all variables
		var i, tabcontent, tablinks;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		document.getElementById(tabName).style.display = "block";
		evt.currentTarget.className += " active";
	},
	
	_loadText(iURL) {
		return fetch(`${this.rootPath}/${iURL}`)
			.then(response => response.text());
	},
	
	_loadJSON(iURL) {
		return fetch(`${this.rootPath}/${iURL}`)
			.then(response => response.json());
	}
};
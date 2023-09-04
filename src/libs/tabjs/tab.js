var tabjs = {
	rootPath: '',
	initTabOnLoad(rootPath = '') {
		var tabs = document.createElement('div');
		tabs.classList.add('tabs');

		var buttons = document.createElement('div');
		buttons.classList.add('tabs-buttons');
		tabs.appendChild(buttons);

		var contents = document.createElement('div');
		contents.classList.add('tabs-contents');
		tabs.appendChild(contents);

		document.body.appendChild(tabs);

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
		var buttons = document.querySelector('.tabs-buttons');
		var contents = document.querySelector('.tabs-contents');
		// Create button
		var button = document.createElement('button');
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
		contents.appendChild(tabContent);
		
		if (iTabData.type === "iframe") {
			var iframe = document.createElement('iframe');
			iframe.src = `${this.rootPath}/${iTabData.filepath}`;
			tabContent.appendChild(iframe);

			iframe.onload = function () {
				let mutationObserver = new MutationObserver(records => {
					iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px';
				});
				mutationObserver.observe(iframe.contentWindow.document.body, { childList: true, subtree: true });
			};
			
			if (iCallback) {
				iCallback(iframe);
			}
		} else {
			var pre = document.createElement('pre');
			var code = document.createElement('code');
			code.classList.add('hljs');
			code.classList.add(iTabData.type);
			code.setAttribute('data-trim', '');
			var script = document.createElement('script');
			script.setAttribute('type', 'text/template');
			pre.appendChild(code);
			code.appendChild(script);
			tabContent.appendChild(pre);
			
			this.loadFileInTabContent(iTabData.filepath, script)
				.then(() => {
					if (iCallback) {
						iCallback(code);
					}
				});
		}
	},
	loadFileInTabContent(iURL, iElement) {
		return this._loadText(iURL)
			.then(response => {
				return new Promise(resolve => {
					iElement.innerHTML = response;
					resolve(iElement);
				});
			});
	},
	openTab(evt, tabName) {
		// Declare all variables
		var i, tabcontent, tablinks;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.querySelectorAll('.tabs-contents div');
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.querySelectorAll('.tabs-buttons button');
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
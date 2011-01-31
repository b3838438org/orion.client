/*******************************************************************************
 * Copyright (c) 2011 IBM Corporation and others. All rights reserved. This
 * program and the accompanying materials are made available under the terms of
 * the Eclipse Public License v1.0 which accompanies this distribution, and is
 * available at http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors: IBM Corporation - initial API and implementation
 ******************************************************************************/
/* global dojo dijit */
/* jslint browser:true */
dojo.provide("profile.widgets.NewUserDialog");

dojo.require("dijit.Dialog");

/**
 * @param func
 */
dojo.declare("profile.widgets.NewUserDialog", [ dijit.Dialog ], {
	widgetsInTemplate : true,
	templateString : dojo.cache("widgets",
			"/profile/widgets/templates/NewUserDialog.html"),
	title : "Create New User",

	constructor : function() {
		this.inherited(arguments);
		this.func = arguments[0] || function() {
		};
	},
	onHide : function() {
		// This assumes we don't reuse the dialog
		this.inherited(arguments);
		setTimeout(dojo.hitch(this, function() {
			this.destroyRecursive(); // TODO make sure this removes DOM
			// elements
		}), this.duration);
	},
	postCreate : function() {
		this.inherited(arguments);
		dojo.connect(this, "onKeyPress", dojo.hitch(this, function(evt) {
			if (evt.keyCode === dojo.keys.ENTER) {
				this.domNode.focus(); // FF throws DOM error if textfield is
										// focused after dialog closes
				this._onSubmit();
			}
		}));
	},
	execute : function() {

		if (this.userName.value === "") {
			alert("Provide user login!");
			return;
		}

		if (this.password.value !== this.passwordRetype.value) {
			alert("Passwords don't match!");
			return;
		}

		dojo.xhrPost({
			url : "/users",
			headers : {
				"Orion-Version" : "1"
			},
			content : {
				login : this.userName.value,
				password : this.password.value
			},
			handleAs : "text",
			timeout : 15000,
			load: this.func,
			error : function(response, ioArgs) {
				if (ioArgs.xhr.responseText) {

					var tempDiv = document.createElement('div');
					tempDiv.innerHTML = ioArgs.xhr.responseText;
					tempDiv.childNodes;
					var error = tempDiv.getElementsByTagName("title")[0];
					if (error)
						alert(error.text);
					else
						alert("User could not be created.");
				} else {
					alert("User could not be created.");
				}
			}
		});
	}
});
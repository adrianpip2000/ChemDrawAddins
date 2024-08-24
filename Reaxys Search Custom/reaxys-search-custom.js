//
// reaxys-search-custom.js
//

// ESLint configuration
/* global ChemDrawAPI */

function showSelection() {
	var messageBox = document.getElementById("message-box");
	if (ChemDrawAPI.activeDocument.selection.isEmpty()) {
		messageBox.innerHTML = "Please select a structure!!";
	} else {
	messageBox.innerHTML = ChemDrawAPI.activeDocument.selection.getSVG({
		transparent: true,
		scalePercent: 100,
		borderSizeInPixels: 5,
	});
	}
}

function doSearch(contextTypeStr,queryTypeStr) {
	if (!ChemDrawAPI.activeDocument.selection.isEmpty()) {
		if (queryTypeStr === "SMILES") {
			var strucStr = ChemDrawAPI.activeDocument.selection.getSMILES();
		}
		if ((queryTypeStr === "MOLFILE") && (contextTypeStr === "S")) {
			var strucStr = ChemDrawAPI.activeDocument.selection.getMolV3000();
		}
		if ((queryTypeStr === "MOLFILE") && (contextTypeStr === "R")) {
			//var strucStr = ChemDrawAPI.activeDocument.selection.getRXNV3000();
				//API apparently doesn't allow for getting RXN from selection, so default to SMILES
			var strucStr = ChemDrawAPI.activeDocument.selection.getSMILES();
		}
		//var smilesStrEncoded = encodeURIComponent(smilesStr);
		var finalURL =  insertIntoURL(strucStr,contextTypeStr,queryTypeStr);
		ChemDrawAPI.openURLInDefaultBrowser(finalURL);
		//ChemDrawAPI.window.close();
	};
}

function insertIntoURL(inStr,ctx,queryTypeStr) {
	var inStrEncoded = encodeURIComponent(inStr);
	var startURL = "https://www-reaxys-com.ep.fjernadgang.kb.dk/reaxys/secured/hopinto.do?";
	var contextURL = "context=" + ctx;
	var queryURL = "&query=" + queryTypeStr + "='" + inStrEncoded + "'";
	var endURL = "&ln=";
	return startURL + contextURL + queryURL + endURL;
}

function onLoadBody() {
	ChemDrawAPI.window.resizeTo(400, 400);
	showSelection();
}

ChemDrawAPI.activeDocument.selection.onChange(function () {
	showSelection();
});
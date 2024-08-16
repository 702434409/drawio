/**
 * Flow plugin.
 */
Draw.loadPlugin(function(ui)
{
	// Adds resource for action
	mxResources.parse('toggleFlow=Toggle Flow...');
	
	// Max number of edges per page
	var pageSize = 20;

	// var uiCreatePopupMenu = ui.menus.createPopupMenu;
	// ui.menus.createPopupMenu = function(menu, cell, evt)
	// {
	// 	uiCreatePopupMenu.apply(this, arguments);
	//
	// 	var graph = ui.editor.graph;
	//
	// 	if (graph.model.isEdge(graph.getSelectionCell()))
	// 	{
	// 		this.addMenuItems(menu, ['-', 'toggleFlow'], null, evt);
	// 	}
	// };

	// var cellAdded = ui.editor.graph.model.prototype.cellAdded;
	//
	// ui.editor.graph.model.prototype.cellAdded = function()
	// {
	// 	var exp = cellAdded.apply(this, arguments);
	// 	return exp;
	// }




	// const updateCellStyles = ui.editor.graph.updateCellStyles;
	//
	// ui.editor.graph.updateCellStyles = function(style,cells) {
	// 	updateCellStyles.call(this,style, cell);
	//
	// 	// 检查自定义属性或进行其他修改
	// 	if (cell.getAttribute('abc') === '1') {
	// 		newCell.setStyle('strokeColor=#ff0000;strokeWidth=2;');
	// 	}
	//
	// };

	// mxEvent.UPDATE
	function updateLine(cells){
		for (var i in cells) {
			// ui.editor.graph.model.getCells();
			if (ui.editor.graph.model.isEdge(cells[i])) {
				var state = ui.editor.graph.view.getState(cells[i]);

				if (state && state.shape != null) {
					var paths = state.shape.node.getElementsByTagName('path');
					var style = ui.editor.graph.getModel().getStyle(cells[i]);
					if (paths.length > 1) {
						if(style&& style.indexOf("mxEdgeFlow")>=0){
							paths[1].setAttribute('stroke-dasharray', '8');
							if(style.indexOf("reverse")>=0){
								paths[1].setAttribute('class', 'mxEdgeFlow-reverse');
							}else{
								paths[1].setAttribute('class', 'mxEdgeFlow');
							}

						}


					}
				}
			}else{
				var state = ui.editor.graph.view.getState(cells[i]);
				if (state && state.shape != null) {
					var paths = state.shape.node.children;
					var style = ui.editor.graph.getModel().getStyle(cells[i]);
					if (paths.length > 0) {
						if(style&& style.indexOf("mxRotate")>=0){
							//paths[0].setAttribute('stroke-dasharray', '8');
							// paths[0].setAttribute('class', 'mxRotate');
							if(style.indexOf("reverse")>=0){
								paths[0].setAttribute('class', 'mxRotate-reverse');
							}else{
								paths[0].setAttribute('class', 'mxRotate');
							}
						}
						if(style&& style.indexOf("mxMoveLeftRight")>=0){
							var classStr = paths[0].getAttribute("class");
							classStr = addClass(classStr||"","mxMoveLeftRight");
							paths[0].setAttribute('class', classStr);

						}
						if(style&& style.indexOf("mxMoveUpDown")>=0){
							var classStr = paths[0].getAttribute("class");
							classStr = addClass(classStr||"","mxMoveUpDown");
							paths[0].setAttribute('class', classStr);

						}


					}
				}
			}
		}
	}

	ui.editor.graph.getView().addListener( mxEvent.UPDATE, function(sender, evt) {
		updateLine(ui.editor.graph.model.getCells());
	});
	ui.editor.graph.getModel().addListener( mxEvent.UPDATE, function(sender, evt) {
		var cells = sender.cells;
		updateLine(cells);
	});

	function removeStyle(style,name){
		if(!style){
			return "";
		}
		var styles = style.split(";");
		var ret = [];
		for(var i = 0; i < styles.length; i ++){
			var styleKV = styles[i].split("=");

			if(styleKV[0]!==name){
				ret.push(styles[i]);
			}
		}
		return ret.join(";");

	}
	function removeClass(classStr,name){
		if(!classStr){
			return "";
		}
		var classes = classStr.split(" ");
		var ret = [];
		for(var i = 0; i < classes.length; i ++){

			if(classes[0]!==name){
				ret.push(classes[i]);
			}
		}
		return ret.join(" ");
	}
	function addClass(classStr,name){
		if(!classStr){
			classStr = "";
		}
		return classStr +" "+name;
	}



	//
	// Main function
	//
	// function toggleFlow(cells)
	// {
	// 	for (var i = 0; i < cells.length; i++)
	// 	{
	// 		if (ui.editor.graph.model.isEdge(cells[i]))
	// 		{
	// 			var state = ui.editor.graph.view.getState(cells[i]);
	//
	// 			if (state.shape != null)
	// 			{
	// 				var paths = state.shape.node.getElementsByTagName('path');
	// 				var style = ui.editor.graph.getModel().getStyle(cells[i]);
	// 				if (paths.length > 1)
	// 				{
	// 					if (paths[1].getAttribute('class') == 'mxEdgeFlow')
	// 					{
	// 						paths[1].removeAttribute('class');
	// 						style = removeStyle(style, "mxEdgeFlow");
	// 						if (mxUtils.getValue(state.style, mxConstants.STYLE_DASHED, '0') != '1')
	// 						{
	// 							paths[1].removeAttribute('stroke-dasharray');
	// 						}
	// 					}
	// 					else
	// 					{
	//
	// 						paths[1].setAttribute('class', 'mxEdgeFlow');
	// 						style = mxUtils.setStyle(style, "mxEdgeFlow", "1");
	// 						if (mxUtils.getValue(state.style, mxConstants.STYLE_DASHED, '0') != '1')
	// 						{
	// 							paths[1].setAttribute('stroke-dasharray', '8');
	// 						}
	// 					}
	// 					ui.editor.graph.getModel().setStyle(cells[i], style);
	// 				}
	// 			}
	// 		}
	// 	}
	// };


	var styleFormatPanelInit = StyleFormatPanel.prototype.init;

	StyleFormatPanel.prototype.init = function() {
		//var state = this.editorUi.getSelectionState();
		var cells = ui.editor.graph.getSelectionCells();
		if(cells.length==1){
			var cell = cells[0];
			var state = ui.editor.graph.view.getState(cell);
			var paths = state.shape.node.getElementsByTagName('path');

			if(ui.editor.graph.model.isEdge(cell)){
				var panel = this.createPanel();
				var htmlArr = [];
				htmlArr.push('<div style="padding: 10px 0px 6px 0px; white-space: nowrap; overflow: hidden;  font-weight: bold;">动画</div>')
				htmlArr.push('<table style="width: 210px; font-weight: bold; table-layout: fixed;"><tbody><tr style="padding: 0px;"><td valign="top" style="padding: 0px; width: 50%;"><div style="display: flex; align-items: center; padding: 3px 0px; height: 18px; width: 100%;"><input type="checkbox" id="animation" style="margin: 1px 6px 0px 0px; vertical-align: top;"><div title="Animation" style="display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; max-width: 160px; user-select: none;">流动</div></div></td><td valign="top" style="padding: 0px 0px 0px 8px; width: 50%;"><div style="display: flex; align-items: center; padding: 3px 0px; height: 18px; width: 100%;"><input type="checkbox" id="reverse" style="margin: 1px 6px 0px 0px; vertical-align: top;"><div title="reverse" style="display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; max-width: 160px; user-select: none;">反向</div></div></td></tr></tbody></table>');
				panel.innerHTML = htmlArr.join("");
				var animationDom = panel.querySelector("#animation");
				var reverseDom = panel.querySelector("#reverse");

				var paths = state.shape.node.getElementsByTagName('path');
				var style = ui.editor.graph.getModel().getStyle(cell);
				if(style && style.indexOf("mxEdgeFlow")>=0){
					animationDom.checked = true;
				}
				animationDom.onchange = function(){
					console.info("ssssssssssss");
					if(animationDom.checked == true){
						paths[1].setAttribute('class', 'mxEdgeFlow');
						style = mxUtils.setStyle(style, "mxEdgeFlow", "1");
					}else{
						paths[1].removeAttribute('class');
						style = removeStyle(style, "mxEdgeFlow");
					}
					ui.editor.graph.getModel().setStyle(cell, style);
				}

				//正反向
				if(style && style.indexOf("reverse")>=0){
					reverseDom.checked = true;
				}
				reverseDom.onchange = function(){
					if(reverseDom.checked == true){
						paths[1].setAttribute('class', 'mxEdgeFlow-reverse');
						style = mxUtils.setStyle(style, "reverse", "1");
					}else{
						paths[1].removeAttribute('class');
						style = removeStyle(style, "reverse");
					}
					ui.editor.graph.getModel().setStyle(cell, style);
				}


				this.container.appendChild(panel);
			}else{
				var panel = this.createPanel();
				var htmlArr = [];
				htmlArr.push('<div style="padding: 10px 0px 6px 0px; white-space: nowrap; overflow: hidden;  font-weight: bold;">动画</div>')
				htmlArr.push('<table style="width: 210px; font-weight: bold; table-layout: fixed;"><tbody><tr style="padding: 0px;"><td valign="top" style="padding: 0px; width: 50%;"><div style="display: flex; align-items: center; padding: 3px 0px; height: 18px; width: 100%;"><input type="checkbox" id="mxrotate" style="margin: 1px 6px 0px 0px; vertical-align: top;"><div title="旋转" style="display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; max-width: 160px; user-select: none;">旋转</div></div></td><td valign="top" style="padding: 0px 0px 0px 8px; width: 50%;"><div style="display: flex; align-items: center; padding: 3px 0px; height: 18px; width: 100%;"><input type="checkbox" id="reverse" style="margin: 1px 6px 0px 0px; vertical-align: top;"><div title="reverse" style="display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; max-width: 160px; user-select: none;">反向</div></div></td></tr><tr style="padding: 0px;"><td valign="top" style="padding: 0px; width: 50%;"><div style="display: flex; align-items: center; padding: 3px 0px; height: 18px; width: 100%;"><input type="checkbox" id="moveleftright" style="margin: 1px 6px 0px 0px; vertical-align: top;"><div title="左右摆动" style="display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; max-width: 160px; user-select: none;">左右摆动</div></div></td><td valign="top" style="padding: 0px 0px 0px 8px; width: 50%;"><div style="display: flex; align-items: center; padding: 3px 0px; height: 18px; width: 100%;"><input type="checkbox" id="moveupdown" style="margin: 1px 6px 0px 0px; vertical-align: top;"><div title="moveupdown" style="display: inline-block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; max-width: 160px; user-select: none;">上下摆动</div></div></td></tr></tbody></table>');
				panel.innerHTML = htmlArr.join("");
				var mxrotateDom = panel.querySelector("#mxrotate");
				var reverseDom = panel.querySelector("#reverse");
				var moveleftrightDom = panel.querySelector("#moveleftright");
				var moveupdownDom = panel.querySelector("#moveupdown");

				// var paths = [state.shape.node];
				var paths = state.shape.node.children;
				var style = ui.editor.graph.getModel().getStyle(cell);
				if(style && style.indexOf("mxRotate")>=0){
					mxrotateDom.checked = true;
				}
				mxrotateDom.onchange = function(){
					console.info("ssssssssssss");
					if(mxrotateDom.checked == true){
						var classStr = paths[0].getAttribute("class");
						classStr = addClass(classStr||"","mxRotate");
						paths[0].setAttribute('class', classStr);
						style = mxUtils.setStyle(style, "mxRotate", "1");
					}else{
						var classStr = paths[0].getAttribute("class");
						classStr = removeClass(classStr||"","mxRotate");
						paths[0].setAttribute('class', classStr);
						style = removeStyle(style, "mxRotate");
					}
					ui.editor.graph.getModel().setStyle(cell, style);
				}
				//正反向
				if(style && style.indexOf("reverse")>=0){
					reverseDom.checked = true;
				}
				reverseDom.onchange = function(){
					if(reverseDom.checked == true){
						var classStr = paths[0].getAttribute("class");
						classStr = addClass(classStr||"","mxRotate-reverse");
						paths[0].setAttribute('class', classStr);
						style = mxUtils.setStyle(style, "reverse", "1");
					}else{
						var classStr = paths[0].getAttribute("class");
						classStr = removeClass(classStr||"","mxRotate-reverse");
						paths[0].setAttribute('class', classStr);
						style = removeStyle(style, "reverse");
					}
					ui.editor.graph.getModel().setStyle(cell, style);
				}

				//左右摆动
				if(style && style.indexOf("mxMoveLeftRight")>=0){
					moveleftrightDom.checked = true;
				}
				moveleftrightDom.onchange = function(){
					if(moveleftrightDom.checked == true){
						var classStr = paths[0].getAttribute("class");
						classStr = addClass(classStr||"","mxMoveLeftRight");
						paths[0].setAttribute('class', classStr);
						style = mxUtils.setStyle(style, "mxMoveLeftRight", "1");
					}else{
						var classStr = paths[0].getAttribute("class");
						classStr = removeClass(classStr||"","mxMoveLeftRight");
						paths[0].setAttribute('class', classStr);
						style = removeStyle(style, "mxMoveLeftRight");
					}
					ui.editor.graph.getModel().setStyle(cell, style);
				}

				//上下摆动
				if(style && style.indexOf("mxMoveUpDown")>=0){
					moveupdownDom.checked = true;
				}
				moveupdownDom.onchange = function(){
					if(moveupdownDom.checked == true){
						var classStr = paths[0].getAttribute("class");
						classStr = addClass(classStr||"","mxMoveUpDown");
						paths[0].setAttribute('class', classStr);
						style = mxUtils.setStyle(style, "mxMoveUpDown", "1");
					}else{
						var classStr = paths[0].getAttribute("class");
						classStr = removeClass(classStr||"","mxMoveUpDown");
						paths[0].setAttribute('class', classStr);
						style = removeStyle(style, "mxMoveUpDown");
					}
					ui.editor.graph.getModel().setStyle(cell, style);
				}
				this.container.appendChild(panel);
			}


		}


		styleFormatPanelInit.apply(this, arguments);
	}
	
	// Adds action
	// ui.actions.addAction('toggleFlow', function()
	// {
	// 	var cell = ui.editor.graph.getSelectionCell();
	//
	// 	if (ui.editor.graph.model.isEdge(cell))
	// 	{
	// 		toggleFlow(ui.editor.graph.getSelectionCells());
	// 	}
	// });
	// ui.editor.graph.click = function(me)
	// {
	// 	if (ui.editor.graph.model.isEdge(me.getCell()))
	// 	{
	// 		alert("ss");
	// 		//toggleFlow([me.getCell()]);
	// 		ui.format.panels[0].addStyles("aaa");
	// 	}
	// };
	// Adds custom sidebar entry

	// Click handler for chromeless mode
	if (ui.editor.isChromelessView())
	{
		ui.editor.graph.click = function(me)
		{
			if (ui.editor.graph.model.isEdge(me.getCell()))
			{
				toggleFlow([me.getCell()]);
			}
		};
	}
	
	try
	{
		debugger;
		var style = document.createElement('style')
		style.type = 'text/css';
		style.innerHTML = [
			'.mxEdgeFlow {',
			'animation: mxEdgeFlow 0.5s linear;',
			'animation-iteration-count: infinite;',
			'}',
			'@keyframes mxEdgeFlow {',
			'to {',
			'stroke-dashoffset: -16;',
			'}',
			'}',
			'.mxEdgeFlow-reverse {',
			'animation: mxEdgeFlow-reverse 0.5s linear;',
			'animation-iteration-count: infinite;',
			'}',
			'@keyframes mxEdgeFlow-reverse {',
			'to {',
			'stroke-dashoffset: 16;',
			'}',
			'}',
			'.mxRotate {',
			'animation: mxRotate 2s linear;',
			'animation-iteration-count: infinite;',
			// 'animation-direction: alternate;',//来回动画
			'transform-origin: center;',
			'transform-box: content-box;',
			'}',
			'@keyframes mxRotate {',
			'0% { -webkit-transform: rotate(0deg); }',
			'50% { -webkit-transform: rotate(180deg); }',
			'100% { -webkit-transform: rotate(360deg); }',
			'}',
			'.mxRotate-reverse {',
			'animation: mxRotate-reverse 2s linear;',
			'animation-iteration-count: infinite;',
			// 'animation-direction: alternate;',//来回动画
			'transform-origin: center;',
			'transform-box: content-box;',
			'}',
			'@keyframes mxRotate-reverse {',
			'0% { -webkit-transform: rotate(0deg); }',
			'50% { -webkit-transform: rotate(-180deg); }',
			'100% { -webkit-transform: rotate(-360deg); }',
			'}',
			'.mxMoveUpDown {',
			'animation: mxMoveUpDown 2s linear;',
			'animation-iteration-count: infinite;',
			// 'animation-direction: alternate;',//来回动画
			'transform-origin: center;',
			'transform-box: content-box;',
			'}',
			'@keyframes mxMoveUpDown {',
			'0% { transform: translateY(0px); }',
			'25% { transform: translateY(-10px); }',
			'50% { transform: translateY( 0px); }',
			'75% { transform: translateY( 10px); }',
			'100% { transform: translateY( 0px); }',
			'}',
			'.mxMoveLeftRight {',
			'animation: mxMoveLeftRight 2s linear;',
			'animation-iteration-count: infinite;',
			// 'animation-direction: alternate;',//来回动画
			'transform-origin: center;',
			'transform-box: content-box;',
			'}',
			'@keyframes mxMoveLeftRight {',
			'0% { transform: translateX(0px); }',
			'25% { transform: translateX(-10px); }',
			'50% { transform: translateX(0px); }',
			'75% { transform: translateX(10px); }',
			'100% { transform: translateX(0px); }',
			'}'
		].join('\n');
		document.getElementsByTagName('head')[0].appendChild(style);
	}
	catch (e)
	{
		// ignore
	}
});

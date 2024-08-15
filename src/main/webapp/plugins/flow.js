/**
 * Flow plugin.
 */
Draw.loadPlugin(function(ui)
{
	// Adds resource for action
	mxResources.parse('toggleFlow=Toggle Flow...');
	
	// Max number of edges per page
	var pageSize = 20;

	var uiCreatePopupMenu = ui.menus.createPopupMenu;
	ui.menus.createPopupMenu = function(menu, cell, evt)
	{
		uiCreatePopupMenu.apply(this, arguments);
		
		var graph = ui.editor.graph;
		
		if (graph.model.isEdge(graph.getSelectionCell()))
		{
			this.addMenuItems(menu, ['-', 'toggleFlow'], null, evt);
		}
	};

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
							paths[1].setAttribute('class', 'mxEdgeFlow');
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



	//
	// Main function
	//
	function toggleFlow(cells)
	{
		for (var i = 0; i < cells.length; i++)
		{
			if (ui.editor.graph.model.isEdge(cells[i]))
			{
				var state = ui.editor.graph.view.getState(cells[i]);
				
				if (state.shape != null)
				{
					var paths = state.shape.node.getElementsByTagName('path');
					var style = ui.editor.graph.getModel().getStyle(cells[i]);
					if (paths.length > 1)
					{
						if (paths[1].getAttribute('class') == 'mxEdgeFlow')
						{
							paths[1].removeAttribute('class');
							style = removeStyle(style, "mxEdgeFlow");
							if (mxUtils.getValue(state.style, mxConstants.STYLE_DASHED, '0') != '1')
							{
								paths[1].removeAttribute('stroke-dasharray');
							}
						}
						else
						{

							paths[1].setAttribute('class', 'mxEdgeFlow');
							style = mxUtils.setStyle(style, "mxEdgeFlow", "1");
							if (mxUtils.getValue(state.style, mxConstants.STYLE_DASHED, '0') != '1')
							{
								paths[1].setAttribute('stroke-dasharray', '8');
							}
						}
						ui.editor.graph.getModel().setStyle(cells[i], style);
					}
				}
			}
		}
	};
	
	// Adds action
	ui.actions.addAction('toggleFlow', function()
	{
		var cell = ui.editor.graph.getSelectionCell();
		
		if (ui.editor.graph.model.isEdge(cell))
		{
			toggleFlow(ui.editor.graph.getSelectionCells());
		}
	});
	
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
		style.innerHTML = ['.mxEdgeFlow {',
			  'animation: mxEdgeFlow 0.5s linear;',
			  'animation-iteration-count: infinite;',
			'}',
			'@keyframes mxEdgeFlow {',
			  'to {',
			    'stroke-dashoffset: -16;',
			  '}',
			'}'].join('\n');
		document.getElementsByTagName('head')[0].appendChild(style);
	}
	catch (e)
	{
		// ignore
	}
});

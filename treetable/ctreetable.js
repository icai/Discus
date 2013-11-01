/**
 * cTreeTable v2.04 | colinlin1982@hotmail.com
 * Copyright (c) 2006 Nicholas Lin @ XHDZ
 * This script can be use freely as long as all copyright message are intact
 * Updated: 18.07.2006
 *
 * Base on:
 * dTree 2.05 | www.destroydrop.com/javascript/tree/
 * Copyright (c) 2002-2003 Geir Landr?               
 * This script can be used freely as long as all copyright message are intact
 * Updated: 17.04.2003
 */

/**
 * treetable component with checks
 * Base on version 2.03
 * Add dynamic onClick and onCheck event handler to each row
 * Add method getCheckedIdsByStr
 * NOTE: methods start with '_' are not supposed to use outside
 * NOTE: no field is supposed to use outside, try getting its value by other way
 * for they may not exist in future version
 */

// modify 2013/09/09  by cai

// Node object
function Node(id, pid, name, array, checked, open) {
	this.id = id;
	this.pid = pid;
	this.name = name;
	this.array = array;
	this.checked = checked || false;
	this._io = open || false;			//is open
	this._lockid = -1;					//nearest close ancestor
	this._is = false;					//is single selected
	this._ls = false;					//is last sibling
	this._hc = false;					//has child?
	this._fcp = -1;						//first child position
	this._lcp = -2;						//last child position
	this._ai = -1;						//position in list
	this._layer = -1;					//layer number
	this._p;							//parent node
	this._csc = 0;						//checked sub count, for check only
	this._ancestor;						//ancestor node, for filtrate only
	this._completed = false;			//child added?
};

// TreeTable Object
function cTreeTable(objName, colNum, onClick, onCheck) {
	this.config = {
		useCookies			: true,
		useSelection		: true,
		rowSelection		: true,
		useChecks			: true,
		validLevel			: 0,		// useChecks or useSelection must be true
		stepDepth			: 0,		// 0 if needn't, else depth each step
		checkSubs			: true,		// useChecks must be true
		folderChecks		: false,	// useChecks must be true
		allowEmpty			: true,		// allow input empty value in comps
		showBadNodes		: true,		// whether show parent not in tree
		closeSameLevel		: false,
		useLines			: true,		// link nodes with lines
		useIcons			: true,
		valign				: 'bottom',
		iconPath			: '/public/images/tree'
	};

	this.icon = {
		root		: '/base.gif',
		folder		: '/folder.gif',
		folderOpen	: '/folderopen.gif',
		node		: '/page.gif',
		empty		: '/empty.gif',
		line		: '/line.gif',
		join		: '/join.gif',
		joinBottom	: '/joinbottom.gif',
		plus		: '/plus.gif',
		plusBottom	: '/plusbottom.gif',
		minus		: '/minus.gif',
		minusBottom	: '/minusbottom.gif',
		nlPlus		: '/nolines_plus.gif',
		nlMinus		: '/nolines_minus.gif'
	};

	this.obj = objName;
	this.SPLITOR = ',';
	this.colNum = colNum-1;
	this.aNodes = [];
	this.aIndent = [];
	this.root = new Node(-1);		//root
	this.indexSel = null;
	this.selectedFound = false;
	this._strArray = new Array();			//for output
	this._lastAncestor = -1;
	// add from 2.03
	this._eTempDiv = document.createElement('DIV');
	this.onRowClick = onClick;
	this.onRowCheck = onCheck;
	this.containerFrame = null;
};

// get element from document, from 2.03
cTreeTable.prototype._getElementById = function(id) {
	var elem = document.getElementById(id);
	if(!elem && this.containerFrame) {
		with(this.containerFrame) {
			elem = eval('document.all.' + id);
		}
	}
	return elem;
}

// Adds a new node to the node array
cTreeTable.prototype.add = function(id, pid, name, array, checked, open) {
	this.aNodes[this.aNodes.length] = new Node(id, pid, name, array, checked, open);
};

// Open/close all nodes
cTreeTable.prototype.openAll = function(){
	this._oAll(true);
};

cTreeTable.prototype.closeAll = function() {
	this._oAll(false);
};

// Outputs the treetable to the page
cTreeTable.prototype.toString = function() {
	// update selection configs
	this.config.rowSelection = this.config.useSelection && this.config.rowSelection;
	if (this.config.stepDepth < 0) {
	    this.config.stepDepth = 0;
	}
	// table rows
	var str = null;
	if (document.getElementById) {
		if (this.config.useCookies && !this.selectedFound) {
		    this.indexSel = this.getSelected();
		}
		this._initialize();
		// test
		this._addChildren(this.root, 0);
		str = this._strArray.join('');
		// clear buffer
		this._strArray.length = 0;
	} else str = 'Browser not supported.';

	if (!this.selectedFound) this.indexSel = null;
	if (this.config.useCookies) this._updateCookie();

	return str;
};

// dynamic load children
cTreeTable.prototype._dynamicLoad = function(index) {
    var pNode = this.aNodes[index];
	if(!pNode._p._completed) {
	    this._dynamicLoad(pNode._p._ai);
	}
	if(pNode._completed) return;
    // build indent list
	while(pNode.pid != this.root.id) {
	    this.aIndent[pNode._layer - 1] = (pNode._ls) ? 0 : 1;
		pNode = pNode._p;
	}
	this._addChildren(this.aNodes[index], 0);
	var str = this._strArray.join('');
	// clear buffer
	this._strArray.length = 0;
	eRow = this._getElementById('r' + this.obj + index);
	this._eTempDiv.innerHTML = '<table>' + str + '</table>';
	var rowList = this._eTempDiv.childNodes[0].tBodies[0].rows;
	while(rowList.length > 0) {
	    eRow.insertAdjacentElement("afterEnd", rowList[rowList.length - 1]);
	}
	// clear aIndent
	this.aIndent.length = 0;
	if (this.config.useCookies) this._updateCookie();
}

// Create the tree structure
cTreeTable.prototype._addChildren = function(pNode, currentDepth) {


	var str = null;
	var canAddChild = this.config.stepDepth == 0 || currentDepth < this.config.stepDepth;
	
	for(var n=pNode._fcp; n<=pNode._lcp; n++) {
	    // find pNode's child
		if(this.aNodes[n].pid == pNode.id) {
		    var cn = this.aNodes[n];
			cn._layer = pNode._layer + 1;
			// row start
			str = '<tr class="' + (cn._is ? 'cttRowSel '+ 'nodeDpt' + currentDepth : 'cttRow '+ 'nodeDpt' + currentDepth) + 
			      '" id="r' + this.obj + n + '" valign="' + this.config.valign + '" style="';
			// hand
			if(this.config.rowSelection) {
			    if(cn._layer >= this.config.validLevel) {
				    str += 'cursor:hand;';
				}
			}
			// hide row script
			if(this.root.id == pNode.id || this.root.id == pNode.pid) {
				cn._lockid = -1;
				str += '">';
			} else {
				cn._lockid = (pNode._io) ? pNode._lockid : pNode.id;
				str += ((cn._lockid < 0) ? '">' : 'display:none;">');
			}
			cn._io = cn._io && canAddChild;
			str += this._addRow(cn, n ,currentDepth) + '</tr>';
		    this._strArray[this._strArray.length] = str;
			// get node
			if(cn._hc && canAddChild) {
				// add child
				this._addChildren(cn, currentDepth + 1);
			}
			this.aIndent.pop();
		}
	}
	pNode._completed = true;
}

// Creates the node icon, url and text
cTreeTable.prototype._addRow = function(node, nodeId , currentDepth) { // modify by cai
    //test
	var mouseEvent = '';
	if(this.config.rowSelection) {
		if(node._layer >= this.config.validLevel) {
			mouseEvent = ' onclick = "javascript: ' + this.obj + '.s(' + nodeId + ');"';
		}
	}
	// indent
	var str = '<td class="' + (node._is ? 'nodeSel' : 'node') + '" id="d' + this.obj + nodeId +
              '" nowrap align="left"' + mouseEvent + '>' + this._indent(node, nodeId);
	
	// add check box
	//if(this.config.useChecks) {
	//	str += '<input type="checkbox" name="check" style="height:16px;width:18px;" value="'+ nodeId + '" id="k' + this.obj + nodeId;
	//	// may be error
	//	if(node.checked) {
	//		str += '" checked ';
	//	} else {
	//		str += '" ';
	//	}
	//	str += 'onclick="javascript: ' + this.obj + '.checkRow(' + nodeId + ');">';
	//}
	//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	// span
	if(this.config.useSelection && !this.config.rowSelection && node._layer >= this.config.validLevel) {
	    str += '<span style="cursor:hand" onclick="javascript: ' + this.obj + '.s(' + nodeId + ');">';
	} else if((!this.config.rowSelection || node._layer < this.config.validLevel) && node._hc && node.pid != this.root.id) {
	    str += '<span style="cursor:hand" onclick="javascript: ' + this.obj + '.o(' + nodeId + ');">';
	} else {
	    str += '<span>';
	}

	// icon
	if (this.config.useIcons) {
		// use default
		// root
		if (this.root.id == node.pid) {
			node.icon = this.icon.root;
			node.iconOpen = this.icon.root;
		} else {
			if(this.icon.layerIco && this.icon.layerIco.length){
				if(currentDepth >= 1){
					if(currentDepth < this.icon.layerIco.length){ // not out of depth
						 	node.icon = (node._hc) ? this.icon.layerIco[currentDepth -1].close : this.icon.layerIco[currentDepth -1].close;
							node.iconOpen = (node._hc) ? this.icon.layerIco[currentDepth -1].open : this.icon.layerIco[currentDepth -1].close;
					}else{
					 	node.icon = (node._hc) ? this.icon.layerIco[this.icon.layerIco.length -1].close : this.icon.layerIco[this.icon.layerIco.length -1].close ;
						node.iconOpen = (node._hc) ? this.icon.layerIco[this.icon.layerIco.length -1].open : this.icon.layerIco[this.icon.layerIco.length -1].close;
					}
				}
			}else{
			 	node.icon = (node._hc) ? this.icon.folder : this.icon.node;
				node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;
			}
		}
		// icon complete
		str += '<img id="i' + this.obj + nodeId + '" src="' + this.config.iconPath + ((node._io) ? node.iconOpen : node.icon) + '" alt="" />';
	}
	str += node.name + '</span></td>';
	// array
	var col = 0;
	for(col; col<this.colNum; col++) {
		str += '<td nowrap' + mouseEvent + '>';
		if(!node.array || node.array.length <= col || node.array[col].length==0) {
			//test
			str += '&nbsp;</td>';
		} else {
			str += node.array[col] + '</td>';
		}
	}
	// release array
	node.array = null;
	return str;
};



// Adds the empty and line icons
cTreeTable.prototype._indent = function(node, nodeId) {
	var str = '';
	if (this.root.id != node.pid) {
		// vertical link lines
		for (var n=0; n<this.aIndent.length; n++) {
			str += '<img src="' + this.config.iconPath + 
			        ( (this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty ) +
					'" alt="" />';
		}
		(node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);

		// open child
		if (node._hc) {
			// herf
			str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" src="' + this.config.iconPath;
			// link to child
			if (this.config.useLines) {
				str += ( (node._io) ?
						  ((node._ls) ? this.icon.minusBottom : this.icon.minus) :
						  ((node._ls) ? this.icon.plusBottom : this.icon.plus ));
			} else {
				str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
			}
			str += '" alt="" /></a>';
		} else {
			str += '<img src="' + this.config.iconPath + 
			       ( (this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join ) : this.icon.empty) +
				   '" alt="" />';
		}
	}
	return str;
};

// Checks if a node has any children and if it is the last sibling
cTreeTable.prototype._initialize = function() {
	if(this.root._hc) {
		this.root._completed = false;
		for(var n=0; n<this.aNodes.length; n++) {
			this.aNodes[n]._completed = false;
			// is selected?
			if(this.config.useSelection && !this.selectedFound && this.aNodes[n].id == this.indexSel) {
				this.aNodes[n]._is = true;
				this.indexSel = n;
				this.selectedFound = true;
			}
		}
		return;
	}
	// get all open node id
	var aOpen = null;
	if(this.config.useCookies) {
	    aOpen = this._getCookie('co' + this.obj).split('.');
	}
	
	var node, pNode;
    for(var n=0; n<this.aNodes.length; n++) {
	    pNode = null;
	    node = this.aNodes[n];
		node._ai = n;
		// is selected?
		if(this.config.useSelection && !this.selectedFound && node.id == this.indexSel) {
			node._is = true;
			this.indexSel = n;
			this.selectedFound = true;
		}
		// find parent
		if(node.pid == this.root.id) {
		    pNode = this.root;
		} else {
		    // find in front
		    for(var m=n-1; m>=0; m--) {
			    if(this.aNodes[m].id == node.pid) {
				    pNode = this.aNodes[m];
					break;
				} else if(this.aNodes[m].pid == node.pid) {
				    pNode = this.aNodes[m]._p;
					break;
				}
			}
			if(!pNode) {
			    // find in behind
				for(var k=n+1; k<this.aNodes.length; k++) {
				    if(this.aNodes[k].id == node.pid) {
					    pNode = this.aNodes[k];
						break;
					}
				}
			}
		}
		// pNode not find, assign node to root
		if(!pNode && this.config.showBadNodes) {
			node.pid = this.root.id;
			pNode = this.root;
		}
		// update parent status
		if(pNode) {
			if(pNode._hc) {
			    this.aNodes[pNode._lcp]._ls = false;
			} else {
			    pNode._hc = true;
				pNode._fcp = n;
	            // check if parent is open
		        if(pNode.id != this.root.id && this.config.useCookies && !pNode._io) {
		            for(var i=0; i<aOpen.length; i++) {
			            if(aOpen[i] == pNode.id) pNode._io = true;
			        }
		        }
			}
		    node._p = pNode;
			node._ls = true;
			pNode._lcp = n;
			if(node.checked) {
			    pNode._csc++;
			}
		}
	}
};


// ??????id????????id??????????????
cTreeTable.prototype._filtrate = function(id) {
    if(this._lastAncestor == id) return;
	// ????????????_ancestor????????????
	for(var n=0; n<this.aNodes.length; n++) {
		this.aNodes[n]._ancestor = this.aNodes[n]._p;
	}
	var index;
	var ancestor;
	var alist = [];
	for(var n=0; n<this.aNodes.length; n++) {
		index = n;
		ancestor = this.aNodes[index]._ancestor;
		var i = 0;
		while(ancestor && ancestor.id!=this.root.id && ancestor.id!=id) {
			alist[i] = index;
			i++;
			index = ancestor._ai;
			ancestor = ancestor._ancestor;
		}
		for(var j=0; j<i; j++) {
			this.aNodes[alist[j]]._ancestor = ancestor;
		}
	}
	this._lastAncestor = id;
}

//get node by id
cTreeTable.prototype._getNodeById = function(id) {
    for(var n=0; n<this.aNodes.length; n++) {
	    var node = this.aNodes[n];
	    if(node.pid == id) {
		    return node._p;
		} else if(node.id == id) {
		    return node;
		}
	}
	return null;
}

//checks if a node of specified id has child, not found=false
cTreeTable.prototype.isLeaf = function(id) {
    var node = this._getNodeById(id);
	if(!node || node._hc) {
	    return false;
	}
    return true;
}

//get layer of node
cTreeTable.prototype.getLayer = function(id) {
	var node = this._getNodeById(id);
	if(!node) {
	    return -1;
	}
	return node._layer;
}

// Returns the parentId of node
cTreeTable.prototype.getParentId = function(id) {
    var node = this._getNodeById(id);
    if(!node) {
        return -1;
    }
    return node.pid;
}

// Returns the selected node
cTreeTable.prototype.getSelected = function() {
	var sn = this._getCookie('cs' + this.obj);
	return (sn) ? sn : null;
};

// return selected name, from 2.03
cTreeTable.prototype.getSelectedByName = function() {
	if(this.getSelected()) {
		var node = this._getNodeById(this.getSelected());
		if(node) {
			return node.name;
		}
	}
	return '';
}

// modify by cai
cTreeTable.prototype.addClass = function(el,cls){
    var arrCls=cls.split(/ +/);
    if(el.className){
        for(var i=0;i<arrCls.length;i++){
            if(this.hasClass(el,cls)){
                cls=cls.replace(new RegExp('(^| +)'+arrCls[i]+'( +|$)'),' ');
            }
        }
        el.className=[el.className].concat(cls).join(' ');
    }
    else{
        el.className=cls;
    }
}

cTreeTable.prototype.removeClass = function (el,cls){
    if(!cls){
        el.className='';
    }else if(this.hasClass(el,cls)){
        el.className=el.className.replace(new RegExp('(^| +)'+cls+'( +|$)','g'),' ');
    }
}


cTreeTable.prototype.toggleClass = function (el,cls){
    if(!this.hasClass(el,cls)){
        this.addClass(el,cls);
        return true;
    }else{
        this.removeClass(el,cls);
        return false;
    }
}

cTreeTable.prototype.replaceClass = function(el,cla,clb){
    if(this.hasClass(el,cla)){
        this.removeClass(el,cla);
        this.addClass(el,clb);
    }else if(this.hasClass(el,clb)){
        this.removeClass(el,clb);
        this.addClass(el,cla);
    }
}

cTreeTable.prototype.hasClass = function (el,cls){
    var className = typeof(el) == 'string' && el || el.className;
    if(!className||!cls)
        return false;
    var cls=cls.split(/[\. ]+/);
    var re;
    for(var i=cls.length-1;i>=0;i--){
        re=new RegExp('(^| +)'+cls[i]+'( +|$)');
        if(!re.test(className))
            return false;
    }
    return true;
}

// Highlights the selected node
cTreeTable.prototype.s = function(id) {
	if (!this.config.useSelection) return;
	var cn = this.aNodes[id];
	if (cn._hc && cn._layer < this.config.validLevel) return;
	if (this.indexSel != id) {
	    // old select node
		if (this.indexSel || this.indexSel == 0) {
		    if (this.aNodes[this.indexSel]._p._completed) {
			    // row
			    if(this.config.rowSelection) {
			        eOldRow = this._getElementById("r" + this.obj + this.indexSel);
			        //eOldRow.className = "cttRow";
			        this.replaceClass(eOldRow,'cttRowSel','cttRow');
			    }
			    eOld = this._getElementById("d" + this.obj + this.indexSel);
			    eOld.className = "node";
			}
		    this.aNodes[this.indexSel]._is = false;
		}
		// new select node
		if(cn._p._completed) {
		    // row
		    if(this.config.rowSelection) {
		        eNewRow = this._getElementById("r" + this.obj + id);
		        //eNewRow.className = "cttRowSel";
		        this.replaceClass(eNewRow,'cttRow','cttRowSel');
		        //eNewRow.className = "aaa";
		    }
		    // Node
		    eNew = this._getElementById("d" + this.obj + id);
		    eNew.className = "nodeSel";
		}
		cn._is = true;
		// update treetable and cookie
		this.indexSel = id;
		if (this.config.useCookies) this._setCookie('cs' + this.obj, cn.id);
	}
	// do onclick
	if(this.onRowClick) {
		this.onRowClick();
	}
};

// Toggle Open or close
cTreeTable.prototype.o = function(id) {
	this.beforeOpen();

	var cn = this.aNodes[id];
	if (!cn._p._completed) return;
	this._nodeStatus(!cn._io, id, cn._ls);
	if (this.config.closeSameLevel) this._closeLevel(cn);
	if (this.config.useCookies) this._updateCookie();
	
	this.afterOpen();
};

// Open or close all nodes, only open those current shown
cTreeTable.prototype._oAll = function(status) {
	for (var n=0; n<this.aNodes.length; n++) {
		var node = this.aNodes[n];
		if(node.pid != this.root.id ) {//&& node._p._completed
			// folders
			if(node._hc && node._io != status ) {//&& node._completed
				this._updateLinkAndIcon(status, n, node._ls);
			}
			// locks
			if(node._p && node._p.pid != this.root.id) {
				node._lockid = (status) ? -1 : node.pid;
				eRow = this._getElementById('r' + this.obj + n);
				if(eRow!=null)
					eRow.style.display = (status) ? '': 'none';
			}
		}
	}
	if (this.config.useCookies) this._updateCookie();
};

// Opens the tree to a specific node
cTreeTable.prototype.openTo = function(id, bSelect) {
    if(this.root.id == id) return;
    var cn = this._getNodeById(id);
	if(!cn) return;
	// if parent not complete, complete parent
	if(!cn._p._completed) {
	    this._dynamicLoad(cn._p._ai);
	}
	if(bSelect) {
	    this.s(cn._ai);
	}
	if(this.config.closeSameLevel) {
		this._nodeStatus(false, cn._ai, cn._ls);
		this._closeLevel(cn);
	}
	var pNode = cn._p;
	while(pNode && pNode._p && pNode.pid != this.root.id) {
		pNode._is = false;
		this._nodeStatus(true, pNode._ai, pNode._ls);
		if(this.config.closeSameLevel) this._closeLevel(pNode);
		pNode = pNode._p;
	}
	if (this.config.useCookies) this._updateCookie();
};

// Closes all nodes on the same level as certain node
cTreeTable.prototype._closeLevel = function(node) {
    var pNode = node._p;
	for (var n=pNode._fcp; n<=pNode._lcp; n++) {
		// if node._io==true, node._hc==true too
		if (this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._io) {
			this._nodeStatus(false, n, this.aNodes[n]._ls);
		}
	}
};

// clear all values
cTreeTable.prototype.clearAllValues = function(prefices) {
	this.checkAll(false);
	if(prefices!=null && prefices.length!=0) {
		for(var n=0; n<this.aNodes.length; n++) {
		    if(!this.aNodes[n]._p._completed) continue;
			for(var i=0; i<prefices.length; i++) {
				elem = this._getElementById(prefices[i] + this.aNodes[n].id);
				elem.value = null;
			}
		}
	}
};

// select all
cTreeTable.prototype.checkAll = function(value) {
	if(!this.config.useChecks) return;
    if(value==null) {
        value = true;
    }
	// change checked status
	for(var n=0; n<this.aNodes.length; n++) {
	    // if status equals
	    if(this.aNodes[n].checked==value) continue;
		// update parent checked sub count
		if(this.config.checkSubs) {
		    if(value) {
			    this.aNodes[n]._p._csc++;
			} else {
			    this.aNodes[n]._p._csc--;
			}
		}
		this.aNodes[n].checked = value;
		// update view
		if(this.aNodes[n]._p._completed) {
		    eBox =  this._getElementById('k' + this.obj + n);
		    eBox.status = this.aNodes[n].checked;
		}
	}
	if(this.onRowCheck) {
		this.onRowCheck();
	}
};

// check node
cTreeTable.prototype.checkRow = function(index, inherit) {
	if(!this.config.useChecks) return;
	// default span is true
	if(inherit==null) {
	    inherit = true;
	}
	// change checked status
	var node = this.aNodes[index];
	node.checked = !node.checked;
	if(node._p._completed) {
	    eBox = this._getElementById('k' + this.obj + index);
	    eBox.status = node.checked;
	}
	// if needn't check sub, return
	if(this.config.checkSubs) {
	    if(node._hc && inherit) {
	        this._checkSpring(node);
		}
	    this._checkAncestor(node);
	}
	// do oncheck
	if(inherit && this.onRowCheck) {
		this.onRowCheck();
	}
}

// for this.config.checkSubs=true only, never use this function outside
cTreeTable.prototype._checkSpring = function(node) {
	this._filtrate(node.id);
	for(var n=0; n<this.aNodes.length; n++) {
		if(this.aNodes[n]._ancestor && this.aNodes[n]._ancestor.id==node.id) {
		    // if status equals
		    if(node.checked==this.aNodes[n].checked) continue;
		    // update parent's checked sub count
		    if(node.checked) {
			    this.aNodes[n]._p._csc++;
			} else {
			    this.aNodes[n]._p._csc--;
			}
			this.aNodes[n].checked = node.checked;
			// update view
			if(this.aNodes[n]._p._completed) {
			    eBox =  this._getElementById('k' + this.obj + n);
			    eBox.status = node.checked;
			}
		}
	}
}

// for this.config.checkSubs=true only, never use this function outside
cTreeTable.prototype._checkAncestor = function(node) {
	// ancestor node status
	var ancestor = node._p;
	if(node.checked) {
	    while(ancestor.id != this.root.id) {
		    // add one to ancestor's checked sub count
			ancestor._csc++;
			if(ancestor.checked) {
		        // if ancestor is checked already, break
			    break;
			} else {
			    ancestor.checked = node.checked;
				if(ancestor._p._completed) {
				    eBox = this._getElementById('k' + this.obj + ancestor._ai);
				    eBox.status = node.checked;
				}
				ancestor = ancestor._p;
			}
		}
	} else {
	    while(ancestor.id != this.root.id) {
		    // reduce ancestor's checked sub count by one
			ancestor._csc--;
		    // ancestor must be checked now
			if(ancestor._csc==0) {
			    if(!this.config.folderChecks) {
			        ancestor.checked = node.checked;
					if(ancestor._p._completed) {
				        eBox = this._getElementById('k' + this.obj + ancestor._ai);
				        eBox.status = node.checked;
					}
				    ancestor = ancestor._p;
				}
			} else {
			    // need not change ancestors's status
				break;
			}
		}
	}
}

// for outer embedded elements
cTreeTable.prototype.spanToSpring = function(id, prefix) {
	var node = this._getNodeById(id);
	if(node && node._hc && node._completed) {
	    element = this._getElementById(prefix + id);
		var isCheckBox = (element.type=='checkbox') ? true : false;
	    this._filtrate(id);
	    // change spring values
	    for(var n=0; n<this.aNodes.length; n++) {
		    if(this.aNodes[n]._ancestor && this.aNodes[n]._ancestor.id!=this.root.id && this.aNodes[n]._p._completed) {
			    // get element
			    eSpring = this._getElementById(prefix + this.aNodes[n].id);
				if(isCheckBox) {
					eSpring.checked = element.checked;
				} else {
					eSpring.value = element.value;
				}
			}
		}
	}
}

// get nodes on leaf checked include outer elements
cTreeTable.prototype.getCheckedIds = function() {
	var selects = [];
	if(!this.config.useChecks) return selects;
	for(var n=0; n<this.aNodes.length; n++) {
		var node = this.aNodes[n];
		if(node.checked && ((this.config.folderChecks && node._layer >= this.config.validLevel) || !node._hc)) {
			selects[selects.length] = node.id;
		}
	}
	return selects;
}

// get nodes on leaf checked include outer elements
// in style: {'id1,id2,id3','value1,value2,value3'}
cTreeTable.prototype.getCheckedValues = function(prefices, splitor) {
	if(splitor==null || splitor.length==0) {
		splitor = this.SPLITOR;
	}
	var selects = [];
	if(prefices==null) {
		selects[0] = [];
	} else {
        // both prefices and its length is not null
		for(var p=0; p<=prefices.length; p++) {
			selects[p] = [];
		}
	}
	if(!this.config.useChecks) return selects;
	for(var n=0; n<this.aNodes.length; n++) {
		var node = this.aNodes[n];
		if(node.checked && node._p._completed && ((this.config.folderChecks && node._layer >= this.config.validLevel) || !node._hc)) {
			//ids
			selects[0][selects[0].length] = node.id;
			// values
			if(prefices!=null && prefices.length!=0) {
				for(var k=0; k<prefices.length; k++) {
					elem = this._getElementById(prefices[k] + node.id);
					if(elem.type=='checkbox') {
						selects[k+1][selects[k+1].length] = elem.checked ? 1 : 0;
					} else {
						// get value from text/selector
						if(!this.config.allowEmpty && (elem.value==null||elem.value=="")) {
							this.s(n);
							return null;
						}
						selects[k+1][selects[k+1].length] = elem.value;
					}
				}
			}
		}
	}
	if(prefices==null) {
		selects[0] = selects[0].join(splitor);
	} else {
        // both prefices and its length is not null
		for(var p=0; p<=prefices.length; p++) {
			selects[p] = selects[p].join(splitor);
		}
	}
	return selects;
}

// add a check row
cTreeTable.prototype.addCheckedId = function(id) {
	if(!this.config.useChecks) return;
	if(id != null) {
		for(var n=0; n<this.aNodes.length; n++) {
            if(this.aNodes[n].id==id) {
			    if(!this.aNodes[n].checked && (this.config.folderChecks || !this.aNodes[n]._hc)) {
				    this.checkRow(n, false);
				}
                break;
            }
		}
		// do oncheck
		if(this.onRowCheck) {
			this.onRowCheck();
		}
	}
}

// set checked ids
cTreeTable.prototype.setCheckedIds = function(ids) {
	if(!this.config.useChecks) return;
	if(ids==null || ids.length==0) {
		this.checkAll(false);
	} else {
	    var idList = [];
		for(var n=0; n<this.aNodes.length; n++) {
			var flag = false;
			// may node be checked?
			if(this.config.folderChecks || !this.aNodes[n]._hc) {
				for(var i=0; i<ids.length; i++) {
					if(ids[i].length!=0 && ids[i]==this.aNodes[n].id) {
						flag = true;
						break;
					}
				}
			}
			// not found but is checked now, or found but not checked now
			if(flag) {
			    idList[idList.length] = n;
			} else if(this.aNodes[n].checked) {
			    this.checkRow(n, false);
			}
		}
		for(var i=0; i<idList.length; i++) {
		    if(!this.aNodes[idList[i]].checked) {
			    this.checkRow(idList[i], false);
			}
		}
		// do oncheck
		if(this.onRowCheck) {
			this.onRowCheck();
		}
	}
}

// must ensure node is shown
cTreeTable.prototype._updateLinkAndIcon = function(status, index, bottom) {
    // if children is not shown before, show this time
    if(!this.aNodes[index]._completed) {
	    this._dynamicLoad(index);
	}
	eJoin = this._getElementById('j' + this.obj + index);

	if (this.config.useIcons) {
		eIcon = this._getElementById('i' + this.obj + index);
		eIcon.src =  this.config.iconPath + ((status) ? this.aNodes[index].iconOpen : this.aNodes[index].icon);
	}

	eJoin.src = this.config.iconPath + ((this.config.useLines) ? 
	((status)?((bottom)?this.icon.minusBottom:this.icon.minus):((bottom)?this.icon.plusBottom:this.icon.plus)):
	((status)?this.icon.nlMinus:this.icon.nlPlus));
	
	this.aNodes[index]._io = status;
}

// Change the status of a node(open or closed), must ensure node is shown
cTreeTable.prototype._nodeStatus = function(status, index, bottom) {
	if(this.aNodes[index]._hc && this.aNodes[index]._io != status) {
	    this._updateLinkAndIcon(status, index, bottom);
		this._springRowStatus(index, status);
	}
};

// a node open or close, it's spring's row will change
cTreeTable.prototype._springRowStatus = function(index, status) {
	var pNode = this.aNodes[index];
	if(!status) {
		this._filtrate(pNode.id);
	}
	// ????????????
	for (var n=0; n<this.aNodes.length; n++) {
		var cn = this.aNodes[n];
		// find pNode's spring
		if(status) {
			if(cn._lockid==pNode.id && cn._p._completed) {
				cn._lockid = pNode._lockid;
				eRow = this._getElementById('r' + this.obj + n);
				if(eRow!=null)
					eRow.style.display = '';
			}
		} else {
			if (cn._ancestor && cn._ancestor.id==pNode.id && cn._lockid==-1 && cn._p._completed) {
				cn._lockid = pNode.id;
				eRow = this._getElementById('r' + this.obj + n);
				if(eRow!=null)
					eRow.style.display = 'none';
			}
		}
	}
};

// [Cookie] Clears a cookie
cTreeTable.prototype.clearCookie = function() {
	var now = new Date();
	var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
	this._setCookie('co'+this.obj, 'cookieValue', yesterday);
	this._setCookie('cs'+this.obj, 'cookieValue', yesterday);
};


// [Cookie] Sets value in a cookie
cTreeTable.prototype._setCookie = function(cookieName, cookieValue, expires, path, domain, secure) {
	document.cookie =
		escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
};

// [Cookie] Gets a value from a cookie
cTreeTable.prototype._getCookie = function(cookieName) {
	var cookieValue = '';
	var posName = document.cookie.indexOf(escape(cookieName) + '=');

	if (posName != -1) {
		var posValue = posName + (escape(cookieName) + '=').length;
		var endPos = document.cookie.indexOf(';', posValue);

		if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
		else cookieValue = unescape(document.cookie.substring(posValue));
	}

	return (cookieValue);
};

// [Cookie] Returns ids of open nodes as a string
cTreeTable.prototype._updateCookie = function() {
	var str = '';
	for (var n=0; n<this.aNodes.length; n++) {
		if (this.aNodes[n]._io && this.aNodes[n].pid != this.root.id) {
			if (str) str += '.';
			str += this.aNodes[n].id;
		}
	}
	this._setCookie('co' + this.obj, str);
};

// [Cookie] Checks if a node id is in a cookie
cTreeTable.prototype.isOpen = function(id) {
	var aOpen = this._getCookie('co' + this.obj).split('.');
	for (var n=0; n<aOpen.length; n++) {
		if (aOpen[n] == id) return true;
	}

	return false;
};

// interface
cTreeTable.prototype.beforeOpen = function() {
}

cTreeTable.prototype.afterOpen = function() {
}

// If Push and pop is not implemented by the browser
if (!Array.prototype.push) {

	Array.prototype.push = function array_push() {

		for(var i=0;i<arguments.length;i++)

			this[this.length]=arguments[i];

		return this.length;

	}

};

if (!Array.prototype.pop) {

	Array.prototype.pop = function array_pop() {

		lastElement = this[this.length-1];

		this.length = Math.max(this.length-1,0);

		return lastElement;

	}

};

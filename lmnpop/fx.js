function lmnpop(element){
  if(element) return openDialog(
    'chrome://lmnpop/content', '_blank',
    'resizable,dialog=0'+ (lmnpop.pget('raised') ? ',alwaysRaised' : ''),
    lmnpop.pget('clone') ? element.cloneNode(true) : element);
  var lpo = openDialog('chrome://lmnpop/content/lpo.xul', 'lpo');
  lpo.focus();
  return lpo;
}
lmnpop.fill = function lp_fill(mp){
  var bsp = lmnpop.pget('blink.speed');
  var bst = bsp > 0 && lmnpop.pget('blink.style');
  function blink(){
    var {lmn} = this, stl = lmn.style, i = 6;
    setTimeout(function loop(on){
      stl.outline = on ? 'none' : bst;
      if(--i) setTimeout(loop, bsp, !on);
    }, 0, false);
    lmn.scrollIntoView(false);
  }
  function menuitem(atrs){
    var mi = document.createElement('menuitem');
    for(var k in atrs) mi.setAttribute(k, atrs[k]);
    return mp.appendChild(mi);
  }
  var lmns = [], fmt = lmnpop.pget('format');
  lmnpop.lmnumerate(lmnpop.pget('selector'), function(lmn){
    var mi = menuitem({
      label: lmnpop.format(lmn, fmt), crop: 'center',
      oncommand: 'lmnpop(this.lmn)',
    });
    lmns.push(mi.lmn = lmn);
    bst && mi.addEventListener('DOMMenuItemActive', blink, false);
  });
  if(lmns.length){
    mp.appendChild(document.createElement('menuseparator'));
    menuitem({
      label: 'Pop All', accesskey: 'A', oncommand: 'this.lmns.forEach(lmnpop)',
    }).lmns = lmns;
    let url =
      gContextMenu ? document.popupNode.baseURI : content.location.href;
    menuitem({
      label: 'Pop Window <'+ lmnpop.trim(url) +'>', accesskey: 'W',
      oncommand: 'lmnpop(this.url)', crop: 'center',
    }).url = url;
  }
  if(gContextMenu){
    if(gContextMenu.onLink) menuitem({
      label: 'Pop Link Location', accesskey: 'L',
      oncommand: 'lmnpop(gContextMenu.linkURL)',
    });
    menuitem({
      label: 'Pop This '+ document.popupNode.tagName, accesskey: 'T',
      oncommand: 'lmnpop(document.popupNode)',
    });
  }
  menuitem({label: 'Options', accesskey: 'O', oncommand: 'lmnpop()'});
};
lmnpop.lmnumerate = function lp_lmnumerate(slc, fun){
  var win = document.commandDispatcher.focusedWindow;
  run(win && win != self ? win : win = content);
  Array.forEach(win, run);
  function run(win){
    var ls = win.document.querySelectorAll(slc), s = win.getSelection();
    if(s && !s.isCollapsed) ls = Array.filter(ls, function(l){
      for(var i = s.rangeCount; i--;)
        if(s.getRangeAt(i).isPointInRange(l, 0)) return true;
      return false;
    });
    Array.forEach(ls, fun);
  }
};
lmnpop.pget = function lp_pget(key){
  const PS = gPrefService;
  switch(PS.getPrefType(key = 'extensions.lmnpop.'+ key)){
    case PS.PREF_STRING:
    return PS.getComplexValue(key, Ci.nsISupportsString).data;
    case PS.PREF_BOOL: return PS.getBoolPref(key);
    case PS.PREF_INT : return PS.getIntPref(key);
  }
};
lmnpop.format = function lp_format(lmn, str)
(str || lmnpop.pget('format')).replace(/{.+?}/g, function($){
  for(let [, k] in new Iterator($.slice(1, -1).split('|'))){
    let v = lmn[k];
    if(v) return lmnpop.trim(String(v));
  }
  return '';
}).trim();
lmnpop.trim = function lp_trim(u) u.replace(/^http:\/+([^/]+)(?:\/$)?/, '$1');

addEventListener('load', function(){
  var ep = document.getElementById('menu_EditPopup');
  ep.appendChild(document.createElement('menuseparator'));
  ep.appendChild(document.querySelector('.lmnpop').cloneNode(true));
}, false);

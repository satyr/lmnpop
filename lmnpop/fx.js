function lmnpop(lmn, vnt){
  if(!lmn){
    let lpo = openDialog('chrome://lmnpop/content/lpo.xul', 'lpo');
    lpo.focus();
    return lpo;
  }
  vnt = vnt || {__proto__: null};
  var cln = lmnpop.pget( 'clone') ^ vnt. ctrlKey;
  var rsd = lmnpop.pget('raised') ^ vnt.shiftKey;
  if(lmn instanceof Window){
    let {href} = lmn.location;
    cln || lmn.close();
    lmn = href;
  } else if(cln && lmn instanceof Node) lmn = lmn.cloneNode(true);
  return openDialog(
    'chrome://lmnpop/content', '_blank',
    'resizable,dialog=0'+ (rsd ? ',alwaysRaised' : ''), lmn);
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
  var lms = lmnpop.pick(lmnpop.pget('selector')), fmt = lmnpop.pget('format');
  lms.forEach(function(lmn){
    var mi = menuitem({
      label: lmnpop.format(lmn, fmt), crop: 'center',
      oncommand: 'lmnpop(this.lmn, event)',
    });
    mi.lmn = lmn;
    bst && mi.addEventListener('DOMMenuItemActive', blink, false);
  });
  if(lms.length){
    mp.appendChild(document.createElement('menuseparator'));
    menuitem({
      label: 'Pop All', accesskey: 'A',
      oncommand: 'this.lms.forEach(function(lm) lmnpop(lm, event))',
    }).lms = lms;
    let win = gContextMenu?
      document.commandDispatcher.focusedWindow : content;
    menuitem({
      label: 'Pop Window <'+ lmnpop.trim(win.location.href) +'>',
      accesskey: 'W', crop: 'center', oncommand: 'lmnpop(this.win, event)',
    }).win = win;
  }
  if(gContextMenu){
    if(gContextMenu.onLink) menuitem({
      label: 'Pop Link Location', accesskey: 'L',
      oncommand: 'lmnpop(gContextMenu.linkURL, event)',
    });
    let pn = gContextMenu.target, mi = menuitem({
      label: 'Pop This '+ pn.tagName, accesskey: 'T',
      oncommand: 'lmnpop(this.lmn, event)',
    });
    mi.lmn = pn;
    bst && mi.addEventListener('DOMMenuItemActive', blink, false);
  }
  menuitem({label: 'Options', accesskey: 'O', oncommand: 'lmnpop()'});
};
lmnpop.pick = function lp_pick(slc){
  var lms = [], win = document.commandDispatcher.focusedWindow;
  run(win && win != self ? win : win = content);
  Array.forEach(win, run);
  function run(win){
    var ls = Array.slice(win.document.querySelectorAll(slc));
    var sl = win.getSelection();
    if(sl && !sl.isCollapsed) ls = ls.filter(function(l){
      for(var i = sl.rangeCount; i--;)
        if(sl.getRangeAt(i).isPointInRange(l, 0)) return true;
    });
    lms.push.apply(lms, ls);
  }
  return lms;
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
  for(let k of $.slice(1, -1).split('|')){
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

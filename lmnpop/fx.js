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
  var fcss = lmnpop.pget('flash');
  function flash(){
    var {lmn} = this, stl = lmn.style, ocss = stl.outline, i = 6;
    setTimeout(function loop(on){
      if(--i){
        stl.outline = on ? 'none' : fcss;
        setTimeout(loop, 333, !on);
      } else stl.outline = ocss;
    }, 0, false);
    lmn.scrollIntoView();
  }
  lmnpop.each(function(lmn){
    var mi = document.createElement('menuitem');
    mi.setAttribute('label', lmnpop.frmt(this, lmn));
    mi.setAttribute('crop', 'center');
    fcss && mi.addEventListener('DOMMenuItemActive', flash, false);
    mp.appendChild(mi).lmn = lmn;
  }, lmnpop.pget('format'));
  if(mp.hasChildNodes()){
    mp.appendChild(document.createElement('menuseparator'));
    let mi = mp.appendChild(document.createElement('menuitem'));
    mi.setAttribute('label', 'Pop All');
    mi.setAttribute('accesskey', 'P');
    mi.setAttribute('oncommand', <![CDATA[
      Array.forEach(parentNode.querySelectorAll('menuitem[crop]'),
                    function(mi) lmnpop(mi.lmn));
      event.stopPropagation();
      ]]>);
  }
  var mi = mp.appendChild(document.createElement('menuitem'));
  mi.setAttribute('label', 'Options');
  mi.setAttribute('accesskey', 'O');
};
lmnpop.each = function lp_each(fn, it){
  var slc = lmnpop.pget('selector');
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
    Array.forEach(ls, fn, it);
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
lmnpop.frmt = function lp_frmt(str, lmn) str.replace(/{.+?}/g, function($){
  for(let [, k] in new Iterator($.slice(1, -1).split('|'))){
    let v = lmn[k];
    if(v) return String.replace(v, /^http:\/+/, '');
  }
  return '';
}).trim();

addEventListener('load', function(){
  var ep = document.getElementById('menu_EditPopup');
  ep.appendChild(document.createElement('menuseparator'));
  ep.appendChild(document.querySelector('.lmnpop').cloneNode(true));
}, false);

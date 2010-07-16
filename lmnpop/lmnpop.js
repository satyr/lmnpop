var {lmnpop} = opener;
var [lmn] = this.arguments;
if(!(lmn instanceof Element)){
  var [url, slc] = typeof lmn == 'string' ? [lmn] : lmn;
  slc = slc || lmnpop.pget('selector');
}
var brw = document.getElementById('browser');
brw.setAttribute('src', url || (
  'data:text/html,<!--lmnpop--><style>html,body{height:100%;margin:0}</style>'+
  encodeURI(<base href={lmn.baseURI}/>.toXMLString())));
brw.addEventListener('DOMContentLoaded', function lmnset(ev){
  var doc = content.document;
  if(slc){
    lmn = doc.querySelector(slc);
    if(!lmn) return;
    let htm = doc.documentElement;
    while(htm.hasChildNodes()) htm.removeChild(htm.lastChild);
    htm.setAttribute('style', 'height:100%');
    htm.appendChild(lmn);
  } else {
    lmn = doc.body.appendChild(doc.adoptNode(lmn));
    slc = lmn.id ? '#'+ lmn.id : (
      lmn.tagName + [''].concat(Array.slice(lmn.classList)).join('.'));
  }
  lmn.setAttribute(
    'style', 'width:100%;height:100%;display:block;overflow:auto');
  document.title = lmnpop.format(lmn);
}, true);

var {lmnpop} = opener;
var [lmn] = this.arguments || 0;
if(!(lmn instanceof Element)) var [url, slc] = lmn;
var brw = document.getElementById('browser');
brw.setAttribute('src', url || (
  'data:text/html,<!--lmnpop--><style>html,body{height:100%;margin:0}</style>'+
  encodeURI(<base href={lmn.baseURI}/>.toXMLString())));
brw.addEventListener('load', function lmnset(){
  var doc = this.contentDocument;
  if(url){
    lmn = doc.querySelector(slc || lmnpop.pget('selector'));
    let htm = doc.documentElement;
    while(htm.hasChildNodes()) htm.removeChild(htm.lastChild);
    htm.setAttribute('style', 'height:100%');
    htm.appendChild(lmn);
  } else lmn = doc.body.appendChild(doc.adoptNode(lmn));
  lmn.setAttribute('style', 'width:100%;height:100%;display:block');
  document.title = lmnpop.frmt(lmnpop.pget('format'), lmn);
}, true);

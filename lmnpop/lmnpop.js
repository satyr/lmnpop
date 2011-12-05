var {lmnpop} = opener
  , [lmn] = this.arguments
if(!(lmn instanceof Element)){
  var [url, slc] = typeof lmn == 'string' ? [lmn] : lmn
  slc = slc || lmnpop.pget('selector')
  document.title = lmnpop.trim(url)
}
this.onload = function onload(){
  var brw = document.getElementById('browser')
  brw.setAttribute('src', url ||
    'data:text/html,<!--lmnpop-->'+
    encodeURIComponent(<base href={lmn.baseURI}/>.toXMLString()))
  brw.addEventListener('DOMContentLoaded', function lmnset(ev){
    var doc = content.document
      , htm = doc.documentElement
    if(slc){
      if(!(lmn = doc.querySelector(slc))) return
      while(htm.hasChildNodes()) htm.removeChild(htm.lastChild)
      htm.appendChild(lmn)
    } else {
      let {body} = doc
      body.setAttribute('style', 'margin:0')
      lmn = body.appendChild(doc.adoptNode(lmn))
      slc = lmn.id
          ? '#'+ lmn.id
          : lmn.tagName + [''].concat(Array.slice(lmn.classList)).join('.')
    }
    htm.setAttribute(
      'style', 'height:100%')
    lmn.setAttribute(
      'style', 'width:100%;height:100%;display:block;overflow:auto')
    document.title = lmnpop.format(lmn)
  }, true)
}

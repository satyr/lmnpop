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
    htm.setAttribute('style', 'height:100%')
    if(slc){
      if(!(lmn = doc.querySelector(slc))) return
      set(htm)
    } else {
      let {body} = doc
      body.setAttribute('style', 'margin:0')
      set(body)
      slc = lmn.id
          ? '#'+ lmn.id
          : lmn.tagName + [''].concat(Array.slice(lmn.classList)).join('.')
    }
    function set(target){
      document.title = lmnpop.format(lmn)
      if(lmn.parentNode) lmn.parentNode.removeChild(lmn)
      lmn.setAttribute(
        'style', 'width:100%;height:100%;display:block;overflow:auto')
      target.innerHTML = lmn.outerHTML
    }
  }, true)
}

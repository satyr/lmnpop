var [L, T] = this.arguments || 0;
if(T) document.title = T;

var B = document.getElementById('browser');
B.setAttribute('src', (
  'data:text/html,<!--lmnpop--><style>html,body{height:100%;margin:0}</style>'+
  encodeURI(<base href={L.baseURI}/>.toXMLString())));
B.addEventListener('load', function lmnset(){
  with(this.contentDocument)
    body.appendChild(adoptNode(L))
      .setAttribute('style', 'width:100%;height:100%;display:block');
}, true);

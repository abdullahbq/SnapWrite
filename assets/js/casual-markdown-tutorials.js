/*****************************************************************************
 * casual-markdown-page - view markdown as web page
 * last updated on 2022/12/28, v0.62. 
 *
 * Copyright (c) 2022, Casualwriter (MIT Licensed)
 * https://github.com/casualwriter/casual-markdown
*****************************************************************************/

//=== apply dark mode style
function darkmode() {
    document.body.className = (document.body.className==='dark'? md.yaml.theme || '' : 'dark' )
  }
  
  //=== load and parser markdown file. 
  md.load = function (fname) { 
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onload = function (e) {
    
      document.getElementById('right-panel').innerHTML = md.html(md.text=this.responseText) + '<br>'
      document.getElementById('right-panel').scrollTop = 0
      md.toc( 'right-panel', 'left-panel', { title:'', scrollspy:'right-panel'} )
      
       // apply style/title/subtitle
      document.title = document.getElementById('title').innerText = md.yaml.title || 'InkredibleDoc'
      document.getElementById('subtitle').innerText = md.yaml.subtitle || 'Documentation' 
      
      // top menu
      var i, html=''
      for (i in md.yaml.menu)  html += '<a href="' + md.yaml.menu[i] + '">' + i + '</a>' 
      document.getElementById('menu').innerHTML = html
    }
    
    xmlhttp.open("GET", fname , true)
    xmlhttp.send();
  }
  
  //=== touch event for mobile (swipe to show/hide left-panel)
  if (window.innerWidth<900) {
  
    function toggleTOC(show) {
      var disp = document.getElementById('left-panel').style.display
      document.getElementById('left-panel').style.display = show||(disp=='none')? 'block' : 'none'
      document.getElementById('right-panel').style.display = show||(disp=='none')? 'none' : 'block' 
    }
    
    window.addEventListener( 'touchstart', function(e) { document.touch=e.changedTouches[0] } )
    
    window.addEventListener( 'touchend', function(e) { 
         var distX = e.changedTouches[0].clientX - document.touch.clientX
         var distY = e.changedTouches[0].clientY - document.touch.clientY
         if ( Math.abs(distY) < 15 && distX > 90 ) {
                e.preventDefault(); 
          toggleTOC(true)
         } else if ( Math.abs(distY) < 15 && distX < -30 ) {
                e.preventDefault(); 
          toggleTOC(false) 
         }
      } );
      
      document.getElementById('left-panel').onclick = function() {toggleTOC(false)}
      document.getElementById('title').onclick = function() {toggleTOC()} 
  }
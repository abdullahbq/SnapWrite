/*****************************************************************************
 * casual-markdown-page - markdown as blog
 * last updated on 2022/08/24, v0.60, supprot nav, home, theme and customized style 
 *
 * Copyright (c) 2022, Casualwriter (MIT Licensed)
 * https://github.com/casualwriter/casual-markdown-blog
*****************************************************************************/

//=== apply dark mode style
function darkmode() {
    document.body.className = (document.body.className==='dark'? md.yaml.theme || '' : 'dark' )
  }
  
  //=== load post from markdown file. 
  md.load = function (mdfile) { 
    var txt, xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function (e) {
      if (this.status == '404' ) {
        alert('Oops..., Page not found!' )
      } else {
        txt =  this.responseText.replace(/\[(.*?)\]\((.*?\.md)\)/gm, '<a href=# onclick="md.load(this.title)" title="$2">$1</a>')
        document.getElementById('md-post').innerHTML = md.html(txt) + '<br>'
        document.getElementById('right-panel').scrollTop = 0
        md.showTags(mdfile)
      }
    }
    xmlhttp.open("GET", mdfile, true)
    xmlhttp.send();
  }
  
  //=== show tags for md post
  md.showTags = function (file) {
    var post = md.posts.find( function(p){return p.file===file} )
    var title = document.getElementById('md-post').querySelector('h1,h2,h3,h4')
  
    if (post && title) {
      var node = document.createElement("p");
      var html = '<span class="post-date">Date: ' + post.date.toISOString().substr(0,10)
      html += '</span>&nbsp; <span class="post-tags">Tags: ' 
      for (var i=0; i<post.tags.length; i++) {
        html += '<a href="?tag=' + post.tags[i] + '"><span class="badge bg-success rounded-pill">#' + post.tags[i] + '</span></a> '
      }
      node.innerHTML = html + '</span>'
      title.parentNode.insertBefore(node, title.nextSibling);
    }
  }
  
  //=== get blog list from "* yyyy/mm/dd: [post-title](md-file) { #tags }"
  md.getPosts = function (match, date, title, file, tags) {
    // compose post list, list by tags, and list by month
    var post = { date: new Date(date), title: title, file: file, tags: tags.trim().split(/\s*,\s*/) };
    md.posts.push(post);
  
    // post list by tags
    var tagsHtml = post.tags.map(tag => `<span class="badge bg-success rounded-pill post-tag">${tag}</span>`).join(' ');
    
    for (var i = 0; i < post.tags.length; i++) {
      if (post.tags[i][0] == '#') post.tags[i] = post.tags[i].substr(1);
      if (!md.tags[post.tags[i]]) md.tags[post.tags[i]] = [];
      md.tags[post.tags[i]].push(post);
    }
  
    // post list by month
    var mth = post.date.toISOString().substr(0, 7);
    if (!md.months[mth]) md.months[mth] = [];
    md.months[mth].push(post);
  
    // return html
    return '* <span class="post-date">' + date + '</span>: <a class="fw-bold post-title" style="font-size: 18px;" href="?' + md.home
          + 'post=' + file + '">' + title + '</a> <span class="post-tags">' + tagsHtml + '</span>';
  };
  
  
  //=== generate nav content by options := featured | new-? | tags | month
  md.nav = function (options) {
    var navOpt = (options||'featured, latest, tags, months').split(',')
    var navDiv = '<nav>'
    
    for (var i=0; i<navOpt.length; i++) {
    
      // generate featured posts list
      if (navOpt[i].trim() === 'featured') {
        navDiv += '<p class="nav-title">Featured</p>'  
        for (var x=0; md.tags.featured&&x<md.tags.featured.length; x++) {
          navDiv += '<li class="nav-post"><a href="?' + md.home + 'post=' 
          navDiv += md.tags.featured[x].file + '">' + md.tags.featured[x].title + '</a></li>'
        }
        
      // generate new posts list
      } else if (navOpt[i].trim().substr(0,4) === 'new-') {
        var max = 0 + navOpt[i].trim().substr(4)
        navDiv += '<p class="nav-title">Documents</p>'
        for (var x=0; x<max && x<md.posts.length; x++) {
          navDiv += '<li class="nav-post"><a href="?' + md.home + 'post=' 
          navDiv += md.posts[x].file + '">' + md.posts[x].title + '</a></li>'
        }
        
      // generate tag list
      } else if (navOpt[i].trim() === 'tags') {
        navDiv += '<p class="nav-title">Tags</p>'  
        for (var tag in  md.tags) {
          navDiv += '<li class="nav-tag"><a href="?' + md.home + 'tag=' + tag + '">' + tag + '</a>'
          navDiv += ' <sup>(' + md.tags[tag].length + ')</sup></li>'
        }
         
      // generate monthly post list
      } else if (navOpt[i].trim() === 'months') {
        navDiv += '<p class="nav-title">Archive</p>'  
        for (var mth in  md.months) {
          navDiv += '<li class="nav-month"><a href="?' + md.home + 'month=' + mth + '">' + mth + '</a>'
          navDiv += ' <sup>(' + md.months[mth].length + ')</sup></li>'
        }
      }
    }
    
    document.getElementById('left-panel').innerHTML = navDiv + '</nav>'
  }
  
  //=== create html for a post (in post list)
  md.listPost = function (post) {
    // Add the following lines to format tags as separate badges
    var tagsHtml = post.tags.map(tag => '<span class="badge bg-success rounded-pill post-tag">#' + tag + '</span>').join(' ');
  
    return '<li>' + post.date.toISOString().substr(0, 10) + ': <a class="fw-bold post-title" style="font-size: 18px;" href="?' + md.home
          + 'post=' + post.file + '">' + post.title + '</a> <span class="post-tags">' + tagsHtml + '</span></li>\n';
  };
  
  //=== show post list for tag
  md.showTag = function (tag) {
    var html = '\n<h1>Tagged by <code>#' + tag + '</code></h1>\n<ul>\n';
    
    if (md.tags[tag]) {
      for (var i = 0; i < md.tags[tag].length; i++) {
        html += md.listPost(md.tags[tag][i]);
      }
    }
  
    document.getElementById('md-post').innerHTML = html + '\n</ul><br>';
  };
  
  //=== massage md link before parse markdown        
  md.before = function (text) {
   return text.replace(/\[(.*?)\]\((.*?\.md)\)/gm, '<a href="?' + md.home + 'post=$2">$1</a>')
  } 
  
  //=== parse url parameters, init blog objects
  md.params = {} 
  window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { md.params[key] = value; } );
  md.posts  = []
  md.tags   = {}
  md.months = {}
  md.home = (md.params.home? 'home=' + md.params.home + '&' : '')
  md.home += (md.params.theme? 'theme=' + md.params.theme + '&' : '' )
  
  //=== init blog page.
  window.onload = function () { 
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onload = function (e) {
    
      // load post list, and render markdown content, and create nav panel
      md.text = this.responseText.replace( /^\*\s*(.+?)\:\s*\[(.*?)\]\((.*?)\)\s+\{(.+)\}\s*$/gm, md.getPosts )
      document.getElementById('right-panel').innerHTML = md.html(md.text) + '<br>'
      md.nav( md.yaml['nav-group'] )
      
      // apply style/title/subtitle
      document.title = document.getElementById('title').innerText = md.yaml.title || 'InkredibleDoc'
      document.getElementById('subtitle').innerText = md.yaml.subtitle || 'Blog' 
      
      // top menu
      var i, html=''
      for (i in md.yaml.menu)  html += '<a href="' + md.yaml.menu[i] + '">' + i + '</a>' 
      document.getElementById('menu').innerHTML = html
      
      // handle url parm. ?page=, ?tag=, ?month= ?blog=
      if (md.params.page) { 
         md.load(md.params.page)
      } else if (md.params.post) { 
         md.load(md.params.post)
      } else if (md.params.tag) { 
         md.showTag(md.params.tag)
      } else if (md.params.month) { 
         var html = '\n<h1>Blogs posted on <code>#' + md.params.month + '</code></h1>\n<ul>\n'
         for (var i=0; md.months[md.params.month]&&i<md.months[md.params.month].length; i++) 
            html+=md.listPost(md.months[md.params.month][i])
         document.getElementById('md-post').innerHTML = html + '\n</ul><br>'
      }
      
      document.getElementById('right-panel').style.display = 'block'
    }
    
    xmlhttp.open("GET", md.params.home||'docs.md' , true)
    xmlhttp.send();
  }
  
  //=== for mobile (touch title to show/hide left-panel)
  if (window.innerWidth<900) {
    function toggleTOC(show) {
      var disp = document.getElementById('left-panel').style.display
      document.getElementById('left-panel').style.display = show||(disp=='none')? 'block' : 'none'
      document.getElementById('right-panel').style.display = show||(disp=='none')? 'none' : 'block' 
    }
    
    document.getElementById('left-panel').onclick = function() { toggleTOC(false) }
    document.getElementById('title').onclick = function() { toggleTOC() } 
  }
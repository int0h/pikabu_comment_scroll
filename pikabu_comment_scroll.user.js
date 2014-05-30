// ==UserScript==
// @name pikabuScroll
// @description userscript for comment navigation 
// @author Interface
// @license MIT
// @version 1.0
// @include *pikabu.ru*
// ==/UserScript==
(function (window, undefined) {

    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    };
    if (w.self != w.top) {
        return;
    };

    if (!/pikabu.ru/.test(w.location.href)) {
       return;
    };    

    function getElmPos(elm){
        return elm.getBoundingClientRect();
    };

    function nodeListToArray(nodeList){
        return Array.prototype.slice.call(nodeList);
    };

    function scroll(y){
        var i = 1;
        var pc = 10;
        var spos = w.scrollY;
        var step = (y - spos) / pc;

        function move(){
            w.scrollTo(0, spos + step * i);
            i++;
            if (i <= pc){
                setTimeout(move, 20);
                };
            };

        move();
        };

    function scrollToNext(id, depth){
        for (var i = id + 1; i < ctObjs.length; i++){
             if (ctObjs[i].depth < depth){
                break;
            };
            if (ctObjs[i].depth == depth){
                scroll(w.scrollY + getElmPos(ctObjs[i].elm).top);
                break;
            };
        };
    };

    function scrollToPrev(id, depth){
        for (var i = id - 1; i >= 0; i--){
             if (ctObjs[i].depth < depth){
                break;
            };
            if (ctObjs[i].depth == depth){
                scroll(w.scrollY + getElmPos(ctObjs[i].elm).top);
                break;
            };
        };
    }; 

    var selCom; //selected comment
    var commentsDiv = document.getElementById('commentsDiv');
    if (!commentsDiv){
        return;
        };
    var cdOffsetX = getElmPos(commentsDiv).left + 21; // comment div 
    var cbsClick; // btn click events
    var dcbsClick;

    //create css:
    var style = document.createElement('style');    
    style.innerHTML = '.csb{    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAcCAYAAAFg5x19AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDYzNzQ1RkFFODE4MTFFMzhBQUM5QzJCQ0RBQTdGOEYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDYzNzQ1RjlFODE4MTFFMzhBQUM5QzJCQ0RBQTdGOEYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmRpZDo2REU1MEYxMjE2RThFMzExQkRGMkRCNjRCOTA5NTk4QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2REU1MEYxMjE2RThFMzExQkRGMkRCNjRCOTA5NTk4QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ptr+o+UAAAeKSURBVHjaYvj//z/7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);  width: 14px;    height: 14px;   position: absolute;     cursor: pointer;    display: none;  }  .csb:hover{  background-position-x: 28px;        }     .csb:active{  background-position-x: 14px;        }         .csb-down{    background-position-y: 14px;        } ';
    document.body.appendChild(style);

    //create scroll buttons
    var cbs = document.createElement('div');
    cbs.classList.add('csb');
    var dcbs = document.createElement('div');
    dcbs.classList.add('csb', 'csb-down');
    document.body.appendChild(cbs);
    document.body.appendChild(dcbs);

    function showCbs(x, y){
        cbs.style.left = x - 7 + 'px';
        cbs.style.top = y - 20 + 'px';
        cbs.style.display = 'block';
        dcbs.style.left = x - 7 + 'px';
        dcbs.style.top = y + 'px';        
        dcbs.style.display = 'block';
        cbs.onmousedown = function(){cbsClick()};
        dcbs.onmousedown = function(){dcbsClick()};
    };

    function setEvents(id, depth){
        cbsClick = function(){
            scrollToPrev(id, depth);
            };
        dcbsClick = function(){
            scrollToNext(id, depth);
            };    
        };

    //getting comment tags:
    var rawCTables = commentsDiv.getElementsByTagName('table'); // get comment tables
    var rctArr = Array.prototype.slice.call(rawCTables); // to Array
    var cTables = rctArr.filter(function(i){return !i.classList.contains('comm_wrap_counter')}); // remove table.comm_wrap_counter
    //composing dom elm with depth value
    var ctObjs = cTables.map(function(i){return {elm: i, depth: i.children[0].children[0].children.length-1}}); // calc depth
    //binding events
    ctObjs.forEach(function(c, i){
        c.elm.onmousemove = function(e){        
            if (e.target.innerHTML.trim() != '&nbsp;' || (c.depth > 1 && e.target.nextElementSibling.innerHTML.trim() != '&nbsp;')){
                return;
                };
            var depth = Math.round((e.x - cdOffsetX) / 31);
            var y = getElmPos(e.target).height / 2 + getElmPos(e.target).top + w.scrollY;//position in the middle of comment
            if ( ((e.x - cdOffsetX) % 31 < 5) || ((e.x - cdOffsetX) % 31 > 25) ){ // is the pointer on a line
                showCbs(depth * 31 + cdOffsetX, y);
                setEvents(i, depth);
            };
        };
    });

    //document.body.onmousemove = function(e){showCbs(e.x, e.y)};
    //cTables.forEach(function(i){i.style.background='#'+getc()})

    // [4] дополнительная проверка наряду с @include
    //if (/http:\/\/pikabu.ru/.test(w.location.href)) {
        //Ниже идёт непосредственно код скрипта
    //   $('#commentsDiv table').not('.comm_wrap_counter').each(function(){this.style.background = '#333'})
   // }
})(window);
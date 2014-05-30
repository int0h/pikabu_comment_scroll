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
    style.innerHTML = '.csb{    background: url(http://storage7.static.itmages.ru/i/14/0530/h_1401468038_1585431_49f12f457e.png);   width: 14px;    height: 14px;   position: absolute;     cursor: pointer;    }  .csb:hover{  background-position-x: 28px;        }     .csb:active{  background-position-x: 14px;        }         .csb-down{    background-position-y: 14px;        } ';
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
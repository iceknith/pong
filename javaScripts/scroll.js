function customScrollTo(position, duration) {
    // cancel if already at position
    if (document.scrollingElement.scrollTop === position) return;
    const startPos = document.scrollingElement.scrollTop;
    const cosParameter = (position - startPos) / 2;
    let scrollCount = 0,
        oldTimestamp = null;

    function step(newTimestamp) {
        if (oldTimestamp !== null) {
            scrollCount += (Math.PI * (newTimestamp - oldTimestamp)) / duration;
            if (scrollCount >= Math.PI) 
                return (document.scrollingElement.scrollTop = position);
            document.scrollingElement.scrollTop =                      
                (1 - Math.cos(scrollCount)) * cosParameter + startPos; 
        }
        oldTimestamp = newTimestamp; 
        window.requestAnimationFrame(step); 
    }
    window.requestAnimationFrame(step);
}
var page = 0;
const maxPages = 3;
var freeze = false;
const delay = 1000;

function clamp(num, min, max) { return Math.min(Math.max(num, min), max); }

function nextPage(e) { 
    e.preventDefault();
    if (freeze) return; 
    page += Math.sign(e.deltaY);
    page = clamp(page, 0, maxPages);
    const position = window.innerHeight * 1.5 * page; 
    if (document.scrollingElement.scrollTop == position)    
        return;    
    freeze = true;  
    customScrollTo(position, delay); 
    setTimeout(() => {
        freeze = false; 
    }, delay);
}
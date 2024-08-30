
/**
 * replaces document.querySelector
 * @param {string} selector - Javascript selector
 *   
 */

function qs(selector){

return document.querySelector(selector);

}

/**
 * replaces addEventListener
 */
function ael(ele, event, fun){

return ele.addEventListener(event, fun);

}

function qsa(selector){

    return Array.from(document.querySelectorAll(selector));
    
    }

    
/**
 * creates an html-element
 * @param {string} element - type of html element 
 */


function ce(element){

    return document.createElement(element);

}


export {qs,qsa,ce, ael}


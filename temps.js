"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};module.exports=function(){function t(t){var n=[];return"object"===("undefined"==typeof t?"undefined":_typeof(t))&&Object.keys(t).forEach(function(r){if(e(t[r])){if(!t[r].length)return console.error("empty array for "+r+" event");var o=t[r].shift(),u=t[r].length?","+t[r].map(function(t){return"string"==typeof t?"'"+t+"'":"object"===("undefined"==typeof t?"undefined":_typeof(t))?JSON.stringify(t).replace(/"/g,"&quot;"):t}).join(","):"";n.push("on"+r+"=\"(function(){temps.emit('"+o+"'"+u+')})()" ')}else"string"==typeof t[r]?n.push("on"+r+"=\"(function(){temps.emit('"+t[r]+"')})()\" "):console.error("could not parse value for "+r)}),n}function n(n,r){var e=t(r),o=e.join("").trim();if(o.length){var u=n.match(/^<\w+(-\w+)?(\s|>)/);if(!u||!u.length)return console.error("no match for "+n),n;var c=u[0],i=c.slice(0,-1),f=c.slice(-1);return n.replace(c,i+" "+o+" "+f)}return n}function r(t,r){var e={current:"",temp:""},o={current:null,temp:null},c=function(){return n(t(u()).trim(),r)};return{render:function(){if(e.temp=c(),o.current&&e.temp===e.current)return o.current;var t=document.createElement("div");t.innerHTML=e.temp,o.temp=t.firstChild;var n=e.temp;return o.temp.toString=function(){return n},o.current||(o.current=o.temp),o.current&&o.current.parentNode&&o.current.parentNode.replaceChild(o.temp,o.current),e.current=e.temp,o.current=o.temp,e.temp=o.temp=null,o.current},toString:function(){return c()},attachStateEvent:function(){for(var t=this,n=arguments.length,r=Array(n),e=0;n>e;e++)r[e]=arguments[e];r.forEach(function(n){"undefined"==typeof s[n]&&(s[n]=[]),s[n].push(t)})}}}var e=function(t){return"object"===("undefined"==typeof t?"undefined":_typeof(t))&&(Array.isArray&&Array.isArray(t)||t.constructor===Array||t instanceof Array)},o=[],u=function(){return o[o.length-1]},c=function y(t){o.length>1&&o.pop(),"number"==typeof t&&t>1?y(t-1):l("STATE_REVERTED")},i=function(){o.splice(1),l("STATE_RESET")},f=function(t){return o[0]=t},a=function(t){return o.push(t)},p={},s={},m=function(t,n){e(p[t])||(p[t]=[]),p[t].push(n)},l=function(t){for(var n=arguments.length,r=Array(n>1?n-1:0),e=1;n>e;e++)r[e-1]=arguments[e];p[t]&&("STATE_RESET"===t||"STATE_REVERTED"===t?p[t].forEach(function(t){return t.apply(void 0,[u()].concat(r))}):!function(){var n=Object.assign({},u());p[t].forEach(function(t){return t.apply(void 0,[n].concat(r))}),a(n)}()),s[t]&&s[t].forEach(function(t){t.render()})};return r.getState=function(){return u()},r.resetState=function(){return i()},r.setInitialState=function(t){return f(t)},r.stateHistory=function(){return o.map(function(t){return t})},r.revertState=function(t){return c(t)},r.on=function(t,n){return m(t,n)},r.emit=function(t){for(var n=arguments.length,r=Array(n>1?n-1:0),e=1;n>e;e++)r[e-1]=arguments[e];return l.apply(void 0,[t].concat(r))},r}();
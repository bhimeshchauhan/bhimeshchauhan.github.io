(self.webpackChunkpersonal_website_reach=self.webpackChunkpersonal_website_reach||[]).push([[711],{2505:function(e,t,r){e.exports=r(8015)},5592:function(e,t,r){"use strict";var n=r(9516),o=r(7522),a=r(3948),i=r(9106),s=r(9615),c=r(2012),u=r(4202),l=r(7763);e.exports=function(e){return new Promise((function(t,r){var f=e.data,p=e.headers,d=e.responseType;n.isFormData(f)&&delete p["Content-Type"];var h=new XMLHttpRequest;if(e.auth){var m=e.auth.username||"",g=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";p.Authorization="Basic "+btoa(m+":"+g)}var v=s(e.baseURL,e.url);function b(){if(h){var n="getAllResponseHeaders"in h?c(h.getAllResponseHeaders()):null,a={data:d&&"text"!==d&&"json"!==d?h.response:h.responseText,status:h.status,statusText:h.statusText,headers:n,config:e,request:h};o(t,r,a),h=null}}if(h.open(e.method.toUpperCase(),i(v,e.params,e.paramsSerializer),!0),h.timeout=e.timeout,"onloadend"in h?h.onloadend=b:h.onreadystatechange=function(){h&&4===h.readyState&&(0!==h.status||h.responseURL&&0===h.responseURL.indexOf("file:"))&&setTimeout(b)},h.onabort=function(){h&&(r(l("Request aborted",e,"ECONNABORTED",h)),h=null)},h.onerror=function(){r(l("Network Error",e,null,h)),h=null},h.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),r(l(t,e,e.transitional&&e.transitional.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",h)),h=null},n.isStandardBrowserEnv()){var y=(e.withCredentials||u(v))&&e.xsrfCookieName?a.read(e.xsrfCookieName):void 0;y&&(p[e.xsrfHeaderName]=y)}"setRequestHeader"in h&&n.forEach(p,(function(e,t){void 0===f&&"content-type"===t.toLowerCase()?delete p[t]:h.setRequestHeader(t,e)})),n.isUndefined(e.withCredentials)||(h.withCredentials=!!e.withCredentials),d&&"json"!==d&&(h.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&h.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&h.upload&&h.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){h&&(h.abort(),r(e),h=null)})),f||(f=null),h.send(f)}))}},8015:function(e,t,r){"use strict";var n=r(9516),o=r(9012),a=r(5155),i=r(5343);function s(e){var t=new a(e),r=o(a.prototype.request,t);return n.extend(r,a.prototype,t),n.extend(r,t),r}var c=s(r(6987));c.Axios=a,c.create=function(e){return s(i(c.defaults,e))},c.Cancel=r(1928),c.CancelToken=r(3191),c.isCancel=r(3864),c.all=function(e){return Promise.all(e)},c.spread=r(7980),c.isAxiosError=r(5019),e.exports=c,e.exports.default=c},1928:function(e){"use strict";function t(e){this.message=e}t.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},t.prototype.__CANCEL__=!0,e.exports=t},3191:function(e,t,r){"use strict";var n=r(1928);function o(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var r=this;e((function(e){r.reason||(r.reason=new n(e),t(r.reason))}))}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var e;return{token:new o((function(t){e=t})),cancel:e}},e.exports=o},3864:function(e){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},5155:function(e,t,r){"use strict";var n=r(9516),o=r(9106),a=r(3471),i=r(4490),s=r(5343),c=r(4841),u=c.validators;function l(e){this.defaults=e,this.interceptors={request:new a,response:new a}}l.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=s(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=e.transitional;void 0!==t&&c.assertOptions(t,{silentJSONParsing:u.transitional(u.boolean,"1.0.0"),forcedJSONParsing:u.transitional(u.boolean,"1.0.0"),clarifyTimeoutError:u.transitional(u.boolean,"1.0.0")},!1);var r=[],n=!0;this.interceptors.request.forEach((function(t){"function"==typeof t.runWhen&&!1===t.runWhen(e)||(n=n&&t.synchronous,r.unshift(t.fulfilled,t.rejected))}));var o,a=[];if(this.interceptors.response.forEach((function(e){a.push(e.fulfilled,e.rejected)})),!n){var l=[i,void 0];for(Array.prototype.unshift.apply(l,r),l=l.concat(a),o=Promise.resolve(e);l.length;)o=o.then(l.shift(),l.shift());return o}for(var f=e;r.length;){var p=r.shift(),d=r.shift();try{f=p(f)}catch(h){d(h);break}}try{o=i(f)}catch(h){return Promise.reject(h)}for(;a.length;)o=o.then(a.shift(),a.shift());return o},l.prototype.getUri=function(e){return e=s(this.defaults,e),o(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},n.forEach(["delete","get","head","options"],(function(e){l.prototype[e]=function(t,r){return this.request(s(r||{},{method:e,url:t,data:(r||{}).data}))}})),n.forEach(["post","put","patch"],(function(e){l.prototype[e]=function(t,r,n){return this.request(s(n||{},{method:e,url:t,data:r}))}})),e.exports=l},3471:function(e,t,r){"use strict";var n=r(9516);function o(){this.handlers=[]}o.prototype.use=function(e,t,r){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!r&&r.synchronous,runWhen:r?r.runWhen:null}),this.handlers.length-1},o.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},o.prototype.forEach=function(e){n.forEach(this.handlers,(function(t){null!==t&&e(t)}))},e.exports=o},9615:function(e,t,r){"use strict";var n=r(9137),o=r(4680);e.exports=function(e,t){return e&&!n(t)?o(e,t):t}},7763:function(e,t,r){"use strict";var n=r(5449);e.exports=function(e,t,r,o,a){var i=new Error(e);return n(i,t,r,o,a)}},4490:function(e,t,r){"use strict";var n=r(9516),o=r(2881),a=r(3864),i=r(6987);function s(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return s(e),e.headers=e.headers||{},e.data=o.call(e,e.data,e.headers,e.transformRequest),e.headers=n.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),n.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||i.adapter)(e).then((function(t){return s(e),t.data=o.call(e,t.data,t.headers,e.transformResponse),t}),(function(t){return a(t)||(s(e),t&&t.response&&(t.response.data=o.call(e,t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},5449:function(e){"use strict";e.exports=function(e,t,r,n,o){return e.config=t,r&&(e.code=r),e.request=n,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},5343:function(e,t,r){"use strict";var n=r(9516);e.exports=function(e,t){t=t||{};var r={},o=["url","method","data"],a=["headers","auth","proxy","params"],i=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],s=["validateStatus"];function c(e,t){return n.isPlainObject(e)&&n.isPlainObject(t)?n.merge(e,t):n.isPlainObject(t)?n.merge({},t):n.isArray(t)?t.slice():t}function u(o){n.isUndefined(t[o])?n.isUndefined(e[o])||(r[o]=c(void 0,e[o])):r[o]=c(e[o],t[o])}n.forEach(o,(function(e){n.isUndefined(t[e])||(r[e]=c(void 0,t[e]))})),n.forEach(a,u),n.forEach(i,(function(o){n.isUndefined(t[o])?n.isUndefined(e[o])||(r[o]=c(void 0,e[o])):r[o]=c(void 0,t[o])})),n.forEach(s,(function(n){n in t?r[n]=c(e[n],t[n]):n in e&&(r[n]=c(void 0,e[n]))}));var l=o.concat(a).concat(i).concat(s),f=Object.keys(e).concat(Object.keys(t)).filter((function(e){return-1===l.indexOf(e)}));return n.forEach(f,u),r}},7522:function(e,t,r){"use strict";var n=r(7763);e.exports=function(e,t,r){var o=r.config.validateStatus;r.status&&o&&!o(r.status)?t(n("Request failed with status code "+r.status,r.config,null,r.request,r)):e(r)}},2881:function(e,t,r){"use strict";var n=r(9516),o=r(6987);e.exports=function(e,t,r){var a=this||o;return n.forEach(r,(function(r){e=r.call(a,e,t)})),e}},6987:function(e,t,r){"use strict";var n=r(9516),o=r(7018),a=r(5449),i={"Content-Type":"application/x-www-form-urlencoded"};function s(e,t){!n.isUndefined(e)&&n.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var c,u={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:(("undefined"!=typeof XMLHttpRequest||"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(c=r(5592)),c),transformRequest:[function(e,t){return o(t,"Accept"),o(t,"Content-Type"),n.isFormData(e)||n.isArrayBuffer(e)||n.isBuffer(e)||n.isStream(e)||n.isFile(e)||n.isBlob(e)?e:n.isArrayBufferView(e)?e.buffer:n.isURLSearchParams(e)?(s(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):n.isObject(e)||t&&"application/json"===t["Content-Type"]?(s(t,"application/json"),function(e,t,r){if(n.isString(e))try{return(t||JSON.parse)(e),n.trim(e)}catch(o){if("SyntaxError"!==o.name)throw o}return(r||JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){var t=this.transitional,r=t&&t.silentJSONParsing,o=t&&t.forcedJSONParsing,i=!r&&"json"===this.responseType;if(i||o&&n.isString(e)&&e.length)try{return JSON.parse(e)}catch(s){if(i){if("SyntaxError"===s.name)throw a(s,this,"E_JSON_PARSE");throw s}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300}};u.headers={common:{Accept:"application/json, text/plain, */*"}},n.forEach(["delete","get","head"],(function(e){u.headers[e]={}})),n.forEach(["post","put","patch"],(function(e){u.headers[e]=n.merge(i)})),e.exports=u},9012:function(e){"use strict";e.exports=function(e,t){return function(){for(var r=new Array(arguments.length),n=0;n<r.length;n++)r[n]=arguments[n];return e.apply(t,r)}}},9106:function(e,t,r){"use strict";var n=r(9516);function o(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,r){if(!t)return e;var a;if(r)a=r(t);else if(n.isURLSearchParams(t))a=t.toString();else{var i=[];n.forEach(t,(function(e,t){null!=e&&(n.isArray(e)?t+="[]":e=[e],n.forEach(e,(function(e){n.isDate(e)?e=e.toISOString():n.isObject(e)&&(e=JSON.stringify(e)),i.push(o(t)+"="+o(e))})))})),a=i.join("&")}if(a){var s=e.indexOf("#");-1!==s&&(e=e.slice(0,s)),e+=(-1===e.indexOf("?")?"?":"&")+a}return e}},4680:function(e){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},3948:function(e,t,r){"use strict";var n=r(9516);e.exports=n.isStandardBrowserEnv()?{write:function(e,t,r,o,a,i){var s=[];s.push(e+"="+encodeURIComponent(t)),n.isNumber(r)&&s.push("expires="+new Date(r).toGMTString()),n.isString(o)&&s.push("path="+o),n.isString(a)&&s.push("domain="+a),!0===i&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},9137:function(e){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},5019:function(e){"use strict";e.exports=function(e){return"object"==typeof e&&!0===e.isAxiosError}},4202:function(e,t,r){"use strict";var n=r(9516);e.exports=n.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a");function o(e){var n=e;return t&&(r.setAttribute("href",n),n=r.href),r.setAttribute("href",n),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:"/"===r.pathname.charAt(0)?r.pathname:"/"+r.pathname}}return e=o(window.location.href),function(t){var r=n.isString(t)?o(t):t;return r.protocol===e.protocol&&r.host===e.host}}():function(){return!0}},7018:function(e,t,r){"use strict";var n=r(9516);e.exports=function(e,t){n.forEach(e,(function(r,n){n!==t&&n.toUpperCase()===t.toUpperCase()&&(e[t]=r,delete e[n])}))}},2012:function(e,t,r){"use strict";var n=r(9516),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,r,a,i={};return e?(n.forEach(e.split("\n"),(function(e){if(a=e.indexOf(":"),t=n.trim(e.substr(0,a)).toLowerCase(),r=n.trim(e.substr(a+1)),t){if(i[t]&&o.indexOf(t)>=0)return;i[t]="set-cookie"===t?(i[t]?i[t]:[]).concat([r]):i[t]?i[t]+", "+r:r}})),i):i}},7980:function(e){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},4841:function(e,t,r){"use strict";var n=r(1817),o={};["object","boolean","number","function","string","symbol"].forEach((function(e,t){o[e]=function(r){return typeof r===e||"a"+(t<1?"n ":" ")+e}}));var a={},i=n.version.split(".");function s(e,t){for(var r=t?t.split("."):i,n=e.split("."),o=0;o<3;o++){if(r[o]>n[o])return!0;if(r[o]<n[o])return!1}return!1}o.transitional=function(e,t,r){var o=t&&s(t);function i(e,t){return"[Axios v"+n.version+"] Transitional option '"+e+"'"+t+(r?". "+r:"")}return function(r,n,s){if(!1===e)throw new Error(i(n," has been removed in "+t));return o&&!a[n]&&(a[n]=!0,console.warn(i(n," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(r,n,s)}},e.exports={isOlderVersion:s,assertOptions:function(e,t,r){if("object"!=typeof e)throw new TypeError("options must be an object");for(var n=Object.keys(e),o=n.length;o-- >0;){var a=n[o],i=t[a];if(i){var s=e[a],c=void 0===s||i(s,a,e);if(!0!==c)throw new TypeError("option "+a+" must be "+c)}else if(!0!==r)throw Error("Unknown option "+a)}},validators:o}},9516:function(e,t,r){"use strict";var n=r(9012),o=Object.prototype.toString;function a(e){return"[object Array]"===o.call(e)}function i(e){return void 0===e}function s(e){return null!==e&&"object"==typeof e}function c(e){if("[object Object]"!==o.call(e))return!1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function u(e){return"[object Function]"===o.call(e)}function l(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),a(e))for(var r=0,n=e.length;r<n;r++)t.call(null,e[r],r,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:a,isArrayBuffer:function(e){return"[object ArrayBuffer]"===o.call(e)},isBuffer:function(e){return null!==e&&!i(e)&&null!==e.constructor&&!i(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:s,isPlainObject:c,isUndefined:i,isDate:function(e){return"[object Date]"===o.call(e)},isFile:function(e){return"[object File]"===o.call(e)},isBlob:function(e){return"[object Blob]"===o.call(e)},isFunction:u,isStream:function(e){return s(e)&&u(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:l,merge:function e(){var t={};function r(r,n){c(t[n])&&c(r)?t[n]=e(t[n],r):c(r)?t[n]=e({},r):a(r)?t[n]=r.slice():t[n]=r}for(var n=0,o=arguments.length;n<o;n++)l(arguments[n],r);return t},extend:function(e,t,r){return l(t,(function(t,o){e[o]=r&&"function"==typeof t?n(t,r):t})),e},trim:function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e}}},726:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return m}});var n=r(6540),o=r(7581);const a=o.default.div.withConfig({displayName:"blogStyle__BlogWrapper",componentId:"sc-2nlfwy-0"})(["padding:5%;>h1{color:#fff;padding-bottom:30px;border-bottom:1px solid #fff;font-weight:300;}@media (max-width:700px){padding:10% 0 20%;}"]),i=o.default.div.withConfig({displayName:"blogStyle__Blogs",componentId:"sc-2nlfwy-1"})(["display:flex;@media (max-width:700px){display:block;}"]);o.default.div.withConfig({displayName:"blogStyle__BlogBox",componentId:"sc-2nlfwy-2"})(["margin-top:10%;color:#eeeeee;h3 a{margin:0;color:#eeeeee;text-decoration:none;font-weight:300;}h3 a:hover{color:#7fa1e8;}hr{background:#7fa1e8;width:15%;height:3px;margin:3% 0;}>p:first-of-type{font-size:18px;margin:0;font-weight:300;}>p:nth-of-type(2){font-size:16px;font-weight:300;}"]),o.default.p.withConfig({displayName:"blogStyle__BlogDes",componentId:"sc-2nlfwy-3"})(["margin:2% 0;font-weight:300;max-width:85%;"]);var s=r(6812),c=[{id:1,author:"Bhimesh Chauhan",panelImage:"da0acHr41p8",title:"Learn and Understand Recursion in JavaScript",tagLine:"I’ll walk you through two popular JS recursion examples in 10 minutes so you can finally understand how recursion works in JavaScript.",dated:"12th January, 2020 - Boston, MA",description:[["img","https://cdn-images-1.medium.com/max/2000/1*DkkJtUJr6f4H0HXD_3A0sQ.jpeg"],["h3","What is Recursion?"],["p",[["em","Recursion is simply when a function calls itself."]]],["p",[["normal","Lets jump right in and take a look at probably the most famous recursion example. This example returns the factorial of a supplied integer:"]]],["pre",[["normal","function factorial(x) {"],["br","br"],["normal","  if (x &lt; 0) return;"],["br","br"],["normal","  if (x === 0) return 1;"],["br","br"],["normal","  return x * factorial(x - 1);"],["br","br"],["normal","}"],["br","br"],["br","br"],["normal","factorial(3);"],["br","br"],["strong","// 6"]]],["p",[["strong","Woah. It’s Okay if that makes no sense to you."],["normal","The important part is happening on line 4:"],["code","return x * factorial(x — 1);"],["normal",". As you can see, the function is actually calling itself again ("],["code","factorial(x-1)"],["normal","), but with a parameter that is one less than when it was called the first time. This makes it a recursive function."]]],["blockquote","Before I break down that code example any further, it’s important you understand what factorials are."],["p",[["normal","To get the factorial of a number you multiply that number by itself minus one until you reach the number one."]]],["p",[["normal","Example 1: The factorial of 4 is 4 * 3 * 2 * 1, or "],["strong","24"],["normal","."]]],["p",[["normal",'"Example 2: The factorial of 2 is just 2 * 1, or "'],["strong","2"],["normal","."]]],["p",[["normal","Awesome, now that our High School Math lesson is over, we can return to the good stuff!"]]],["hr","hr"],["h3","The three key features of recursion"],["p",[["normal","All recursive functions should have three key features:"]]],["h4","A Termination Condition"],["p",[["normal","Simply put: "],["code","if(something bad happend)[ STOP };"],["normal"," The Termination Condition is our recursion fail-safe. Think of it like your emergency brake. It’s put there in case of bad input to prevent the recursion from ever running. In our factorial example, if"],["code","(x &lt; 0) return;"],["normal","is our termination condition. It’s not possible to factorial a negative number and thus, we don’t even want to run our recursion if a negative number is input."]]],["h4","A Base Case"],["p",[["normal","Simply put: "],["code","if(this happens) [ Yay! We're done };"],["normal"," The Base Case is similar to our termination condition in that it also stops our recursion. But remember, the termination condition is a catch-all for bad data. Whereas the base case is the goal of our recursive function. Base cases are usually within an if statement. In the factorial example, if"],["code","(x === 0) return 1;"],["normal"," is our base case. We know that once we’ve gotten x down to zero, we’ve succeeded in determining our factorial!"]]],["p",[["normal","Simply put: Our function calling itself. In the factorial example,"],["code","return x * factorial(x — 1);"],["normal"," is where the recursion actually happens. We’re returning the value of the number x multiplied by the value of whatever"],["code","factorial(x-1)"],["normal","evaluates to."]]]]}],u=r(4198);const l=(e,t)=>{if("img"===e)return n.createElement("img",{class:"uk-width-1-1",src:t,alt:"blog"});if("h4"===e)return n.createElement("h4",null,t);if("h3"===e)return n.createElement("h3",null,t);if("p"===e){let e="<p> ";return e+=t.map((e=>{let[t,r]=e;return"em"===t?`<em>${r}</em>`:"normal"===t?r:"strong"===t?`<strong>${r}</strong>`:"code"===t?`<code>${r}</code>`:""})),e+="</p>",e.split(",").join("")}if("blockquote"===e)return n.createElement("blockquote",null,t);if("pre"===e){let e="<pre> ";return e+=t.map((e=>{let[t,r]=e;return"em"===t?`<em>${r}</em>`:"normal"===t?r:"strong"===t?`<strong>${r}</strong>`:"code"===t?`<code>${r}</code>`:"br"===t?"<br>":""})),e+="</pre>",e.split(",").join("")}},f=e=>n.createElement("div",{class:"blogWriteUp"},n.createElement("article",{class:"uk-article uk-section-small"},n.createElement("header",{class:"uk-container"},n.createElement("div",{class:"author"},n.createElement("img",{src:u.A,class:"avatar",alt:"Go to the profile of Brandon Morelli"}),n.createElement("div",{class:"info uk-text-meta"},n.createElement("div",{className:"best-post-content-cat"},e.article.author),n.createElement("p",null,e.article.dated))),n.createElement("h1",null,e.article.title),n.createElement("p",null,e.article.tagLine)),e.article.description.map((e=>"img"===e[0]?n.createElement("section",{class:"hero uk-section-small"},l(e[0],e[1])):n.createElement("section",{class:"content uk-section-small"},n.createElement("div",{class:"uk-container"},"string"==typeof l(e[0],e[1])?n.createElement("div",{dangerouslySetInnerHTML:{__html:l(e[0],e[1])}}):l(e[0],e[1])))))));var p=r(2505),d=r.n(p);const h=()=>{const{0:e,1:t}=(0,n.useState)({});return(0,n.useEffect)((()=>{const r={authorization:"Client-ID dgD-DQc4cGrBqLvLT5GklBY2j24L1kxAVj7z_4sx3H0"};let n={};c.forEach((o=>{void 0===e[o.panelImage]&&d().get("https://api.unsplash.com/photos/"+o.panelImage,{headers:r}).then((r=>{const a=o.panelImage;n[a]=r.data.urls.raw,t({...e,...n})}))}))})),n.createElement("div",{className:"container pt-3"},n.createElement("div",{className:"row"},c.map((t=>n.createElement("article",{className:"best-post"},n.createElement("div",{className:"best-post-image",style:{backgroundImage:`url(${e[t.panelImage]})`}}),n.createElement("div",{className:"best-post-content"},n.createElement("div",{className:"best-post-content-sub"},n.createElement(f,{article:t}))))))))};var m=()=>n.createElement(s.A,null,n.createElement(a,null,n.createElement("h1",null,"Blog"),n.createElement(i,{className:"blog-container"},n.createElement(h,null))))},1817:function(e){"use strict";e.exports=JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}')}}]);
//# sourceMappingURL=component---src-pages-blog-js-2d56db4feb0c737ff205.js.map
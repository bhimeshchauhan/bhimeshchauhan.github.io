(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"2SVd":function(e,t,n){"use strict";e.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},"5oMp":function(e,t,n){"use strict";e.exports=function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},"9rSQ":function(e,t,n){"use strict";var r=n("xTJ+");function o(){this.handlers=[]}o.prototype.use=function(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1},o.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},o.prototype.forEach=function(e){r.forEach(this.handlers,(function(t){null!==t&&e(t)}))},e.exports=o},CgaS:function(e,t,n){"use strict";var r=n("xTJ+"),o=n("MLWZ"),a=n("9rSQ"),i=n("UnBK"),s=n("SntB"),c=n("hIuj"),u=c.validators;function l(e){this.defaults=e,this.interceptors={request:new a,response:new a}}l.prototype.request=function(e){"string"==typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=s(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=e.transitional;void 0!==t&&c.assertOptions(t,{silentJSONParsing:u.transitional(u.boolean,"1.0.0"),forcedJSONParsing:u.transitional(u.boolean,"1.0.0"),clarifyTimeoutError:u.transitional(u.boolean,"1.0.0")},!1);var n=[],r=!0;this.interceptors.request.forEach((function(t){"function"==typeof t.runWhen&&!1===t.runWhen(e)||(r=r&&t.synchronous,n.unshift(t.fulfilled,t.rejected))}));var o,a=[];if(this.interceptors.response.forEach((function(e){a.push(e.fulfilled,e.rejected)})),!r){var l=[i,void 0];for(Array.prototype.unshift.apply(l,n),l=l.concat(a),o=Promise.resolve(e);l.length;)o=o.then(l.shift(),l.shift());return o}for(var f=e;n.length;){var p=n.shift(),d=n.shift();try{f=p(f)}catch(h){d(h);break}}try{o=i(f)}catch(h){return Promise.reject(h)}for(;a.length;)o=o.then(a.shift(),a.shift());return o},l.prototype.getUri=function(e){return e=s(this.defaults,e),o(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},r.forEach(["delete","get","head","options"],(function(e){l.prototype[e]=function(t,n){return this.request(s(n||{},{method:e,url:t,data:(n||{}).data}))}})),r.forEach(["post","put","patch"],(function(e){l.prototype[e]=function(t,n,r){return this.request(s(r||{},{method:e,url:t,data:n}))}})),e.exports=l},DfZB:function(e,t,n){"use strict";e.exports=function(e){return function(t){return e.apply(null,t)}}},HSsa:function(e,t,n){"use strict";e.exports=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},"IYQ+":function(e,t,n){},JEQr:function(e,t,n){"use strict";(function(t){var r=n("xTJ+"),o=n("yK9s"),a=n("OH9c"),i={"Content-Type":"application/x-www-form-urlencoded"};function s(e,t){!r.isUndefined(e)&&r.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var c,u={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:(("undefined"!=typeof XMLHttpRequest||void 0!==t&&"[object process]"===Object.prototype.toString.call(t))&&(c=n("tQ2B")),c),transformRequest:[function(e,t){return o(t,"Accept"),o(t,"Content-Type"),r.isFormData(e)||r.isArrayBuffer(e)||r.isBuffer(e)||r.isStream(e)||r.isFile(e)||r.isBlob(e)?e:r.isArrayBufferView(e)?e.buffer:r.isURLSearchParams(e)?(s(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):r.isObject(e)||t&&"application/json"===t["Content-Type"]?(s(t,"application/json"),function(e,t,n){if(r.isString(e))try{return(t||JSON.parse)(e),r.trim(e)}catch(o){if("SyntaxError"!==o.name)throw o}return(n||JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){var t=this.transitional,n=t&&t.silentJSONParsing,o=t&&t.forcedJSONParsing,i=!n&&"json"===this.responseType;if(i||o&&r.isString(e)&&e.length)try{return JSON.parse(e)}catch(s){if(i){if("SyntaxError"===s.name)throw a(s,this,"E_JSON_PARSE");throw s}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300}};u.headers={common:{Accept:"application/json, text/plain, */*"}},r.forEach(["delete","get","head"],(function(e){u.headers[e]={}})),r.forEach(["post","put","patch"],(function(e){u.headers[e]=r.merge(i)})),e.exports=u}).call(this,n("8oxB"))},LYNF:function(e,t,n){"use strict";var r=n("OH9c");e.exports=function(e,t,n,o,a){var i=new Error(e);return r(i,t,n,o,a)}},Lmem:function(e,t,n){"use strict";e.exports=function(e){return!(!e||!e.__CANCEL__)}},MLWZ:function(e,t,n){"use strict";var r=n("xTJ+");function o(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function(e,t,n){if(!t)return e;var a;if(n)a=n(t);else if(r.isURLSearchParams(t))a=t.toString();else{var i=[];r.forEach(t,(function(e,t){null!=e&&(r.isArray(e)?t+="[]":e=[e],r.forEach(e,(function(e){r.isDate(e)?e=e.toISOString():r.isObject(e)&&(e=JSON.stringify(e)),i.push(o(t)+"="+o(e))})))})),a=i.join("&")}if(a){var s=e.indexOf("#");-1!==s&&(e=e.slice(0,s)),e+=(-1===e.indexOf("?")?"?":"&")+a}return e}},OH9c:function(e,t,n){"use strict";e.exports=function(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},OTTw:function(e,t,n){"use strict";var r=n("xTJ+");e.exports=r.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function o(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=o(window.location.href),function(t){var n=r.isString(t)?o(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return!0}},"Rn+g":function(e,t,n){"use strict";var r=n("LYNF");e.exports=function(e,t,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?t(r("Request failed with status code "+n.status,n.config,null,n.request,n)):e(n)}},SgzI:function(e){e.exports=JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}')},SntB:function(e,t,n){"use strict";var r=n("xTJ+");e.exports=function(e,t){t=t||{};var n={},o=["url","method","data"],a=["headers","auth","proxy","params"],i=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],s=["validateStatus"];function c(e,t){return r.isPlainObject(e)&&r.isPlainObject(t)?r.merge(e,t):r.isPlainObject(t)?r.merge({},t):r.isArray(t)?t.slice():t}function u(o){r.isUndefined(t[o])?r.isUndefined(e[o])||(n[o]=c(void 0,e[o])):n[o]=c(e[o],t[o])}r.forEach(o,(function(e){r.isUndefined(t[e])||(n[e]=c(void 0,t[e]))})),r.forEach(a,u),r.forEach(i,(function(o){r.isUndefined(t[o])?r.isUndefined(e[o])||(n[o]=c(void 0,e[o])):n[o]=c(void 0,t[o])})),r.forEach(s,(function(r){r in t?n[r]=c(e[r],t[r]):r in e&&(n[r]=c(void 0,e[r]))}));var l=o.concat(a).concat(i).concat(s),f=Object.keys(e).concat(Object.keys(t)).filter((function(e){return-1===l.indexOf(e)}));return r.forEach(f,u),n}},UnBK:function(e,t,n){"use strict";var r=n("xTJ+"),o=n("xAGQ"),a=n("Lmem"),i=n("JEQr");function s(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function(e){return s(e),e.headers=e.headers||{},e.data=o.call(e,e.data,e.headers,e.transformRequest),e.headers=r.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),r.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||i.adapter)(e).then((function(t){return s(e),t.data=o.call(e,t.data,t.headers,e.transformResponse),t}),(function(t){return a(t)||(s(e),t&&t.response&&(t.response.data=o.call(e,t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},XwJu:function(e,t,n){"use strict";e.exports=function(e){return"object"==typeof e&&!0===e.isAxiosError}},Y00U:function(e,t,n){},endd:function(e,t,n){"use strict";function r(e){this.message=e}r.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},r.prototype.__CANCEL__=!0,e.exports=r},eqyj:function(e,t,n){"use strict";var r=n("xTJ+");e.exports=r.isStandardBrowserEnv()?{write:function(e,t,n,o,a,i){var s=[];s.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),r.isString(o)&&s.push("path="+o),r.isString(a)&&s.push("domain="+a),!0===i&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}}},g7np:function(e,t,n){"use strict";var r=n("2SVd"),o=n("5oMp");e.exports=function(e,t){return e&&!r(t)?o(e,t):t}},hIuj:function(e,t,n){"use strict";var r=n("SgzI"),o={};["object","boolean","number","function","string","symbol"].forEach((function(e,t){o[e]=function(n){return typeof n===e||"a"+(t<1?"n ":" ")+e}}));var a={},i=r.version.split(".");function s(e,t){for(var n=t?t.split("."):i,r=e.split("."),o=0;o<3;o++){if(n[o]>r[o])return!0;if(n[o]<r[o])return!1}return!1}o.transitional=function(e,t,n){var o=t&&s(t);function i(e,t){return"[Axios v"+r.version+"] Transitional option '"+e+"'"+t+(n?". "+n:"")}return function(n,r,s){if(!1===e)throw new Error(i(r," has been removed in "+t));return o&&!a[r]&&(a[r]=!0,console.warn(i(r," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,r,s)}},e.exports={isOlderVersion:s,assertOptions:function(e,t,n){if("object"!=typeof e)throw new TypeError("options must be an object");for(var r=Object.keys(e),o=r.length;o-- >0;){var a=r[o],i=t[a];if(i){var s=e[a],c=void 0===s||i(s,a,e);if(!0!==c)throw new TypeError("option "+a+" must be "+c)}else if(!0!==n)throw Error("Unknown option "+a)}},validators:o}},"jfS+":function(e,t,n){"use strict";var r=n("endd");function o(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var n=this;e((function(e){n.reason||(n.reason=new r(e),t(n.reason))}))}o.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},o.source=function(){var e;return{token:new o((function(t){e=t})),cancel:e}},e.exports=o},tQ2B:function(e,t,n){"use strict";var r=n("xTJ+"),o=n("Rn+g"),a=n("eqyj"),i=n("MLWZ"),s=n("g7np"),c=n("w0Vi"),u=n("OTTw"),l=n("LYNF");e.exports=function(e){return new Promise((function(t,n){var f=e.data,p=e.headers,d=e.responseType;r.isFormData(f)&&delete p["Content-Type"];var h=new XMLHttpRequest;if(e.auth){var m=e.auth.username||"",g=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";p.Authorization="Basic "+btoa(m+":"+g)}var v=s(e.baseURL,e.url);function b(){if(h){var r="getAllResponseHeaders"in h?c(h.getAllResponseHeaders()):null,a={data:d&&"text"!==d&&"json"!==d?h.response:h.responseText,status:h.status,statusText:h.statusText,headers:r,config:e,request:h};o(t,n,a),h=null}}if(h.open(e.method.toUpperCase(),i(v,e.params,e.paramsSerializer),!0),h.timeout=e.timeout,"onloadend"in h?h.onloadend=b:h.onreadystatechange=function(){h&&4===h.readyState&&(0!==h.status||h.responseURL&&0===h.responseURL.indexOf("file:"))&&setTimeout(b)},h.onabort=function(){h&&(n(l("Request aborted",e,"ECONNABORTED",h)),h=null)},h.onerror=function(){n(l("Network Error",e,null,h)),h=null},h.ontimeout=function(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(l(t,e,e.transitional&&e.transitional.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",h)),h=null},r.isStandardBrowserEnv()){var y=(e.withCredentials||u(v))&&e.xsrfCookieName?a.read(e.xsrfCookieName):void 0;y&&(p[e.xsrfHeaderName]=y)}"setRequestHeader"in h&&r.forEach(p,(function(e,t){void 0===f&&"content-type"===t.toLowerCase()?delete p[t]:h.setRequestHeader(t,e)})),r.isUndefined(e.withCredentials)||(h.withCredentials=!!e.withCredentials),d&&"json"!==d&&(h.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&h.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&h.upload&&h.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function(e){h&&(h.abort(),n(e),h=null)})),f||(f=null),h.send(f)}))}},vDqi:function(e,t,n){e.exports=n("zuR4")},vx99:function(e,t,n){"use strict";n.r(t);var r=n("q1tI"),o=n.n(r),a=n("vOnD");const i=a.a.div.withConfig({displayName:"blogStyle__BlogWrapper",componentId:"sc-2nlfwy-0"})(["padding:5%;>h1{color:#fff;padding-bottom:30px;border-bottom:1px solid #fff;font-weight:300;}@media (max-width:700px){padding:10% 0 20%;}"]),s=a.a.div.withConfig({displayName:"blogStyle__Blogs",componentId:"sc-2nlfwy-1"})(["display:flex;@media (max-width:700px){display:block;}"]);a.a.div.withConfig({displayName:"blogStyle__BlogBox",componentId:"sc-2nlfwy-2"})(["margin-top:10%;color:#eeeeee;h3 a{margin:0;color:#eeeeee;text-decoration:none;font-weight:300;}h3 a:hover{color:#7fa1e8;}hr{background:#7fa1e8;width:15%;height:3px;margin:3% 0;}>p:first-of-type{font-size:18px;margin:0;font-weight:300;}>p:nth-of-type(2){font-size:16px;font-weight:300;}"]),a.a.p.withConfig({displayName:"blogStyle__BlogDes",componentId:"sc-2nlfwy-3"})(["margin:2% 0;font-weight:300;max-width:85%;"]);var c=n("Bl7J"),u=(n("Y00U"),[{id:1,author:"Bhimesh Chauhan",panelImage:"da0acHr41p8",title:"Learn and Understand Recursion in JavaScript",tagLine:"I’ll walk you through two popular JS recursion examples in 10 minutes so you can finally understand how recursion works in JavaScript.",dated:"12th January, 2020 - Boston, MA",description:[["img","https://cdn-images-1.medium.com/max/2000/1*DkkJtUJr6f4H0HXD_3A0sQ.jpeg"],["h3","What is Recursion?"],["p",[["em","Recursion is simply when a function calls itself."]]],["p",[["normal","Lets jump right in and take a look at probably the most famous recursion example. This example returns the factorial of a supplied integer:"]]],["pre",[["normal","function factorial(x) {"],["br","br"],["normal","  if (x &lt; 0) return;"],["br","br"],["normal","  if (x === 0) return 1;"],["br","br"],["normal","  return x * factorial(x - 1);"],["br","br"],["normal","}"],["br","br"],["br","br"],["normal","factorial(3);"],["br","br"],["strong","// 6"]]],["p",[["strong","Woah. It’s Okay if that makes no sense to you."],["normal","The important part is happening on line 4:"],["code","return x * factorial(x — 1);"],["normal",". As you can see, the function is actually calling itself again ("],["code","factorial(x-1)"],["normal","), but with a parameter that is one less than when it was called the first time. This makes it a recursive function."]]],["blockquote","Before I break down that code example any further, it’s important you understand what factorials are."],["p",[["normal","To get the factorial of a number you multiply that number by itself minus one until you reach the number one."]]],["p",[["normal","Example 1: The factorial of 4 is 4 * 3 * 2 * 1, or "],["strong","24"],["normal","."]]],["p",[["normal",'"Example 2: The factorial of 2 is just 2 * 1, or "'],["strong","2"],["normal","."]]],["p",[["normal","Awesome, now that our High School Math lesson is over, we can return to the good stuff!"]]],["hr","hr"],["h3","The three key features of recursion"],["p",[["normal","All recursive functions should have three key features:"]]],["h4","A Termination Condition"],["p",[["normal","Simply put: "],["code","if(something bad happend)[ STOP };"],["normal"," The Termination Condition is our recursion fail-safe. Think of it like your emergency brake. It’s put there in case of bad input to prevent the recursion from ever running. In our factorial example, if"],["code","(x &lt; 0) return;"],["normal","is our termination condition. It’s not possible to factorial a negative number and thus, we don’t even want to run our recursion if a negative number is input."]]],["h4","A Base Case"],["p",[["normal","Simply put: "],["code","if(this happens) [ Yay! We're done };"],["normal"," The Base Case is similar to our termination condition in that it also stops our recursion. But remember, the termination condition is a catch-all for bad data. Whereas the base case is the goal of our recursive function. Base cases are usually within an if statement. In the factorial example, if"],["code","(x === 0) return 1;"],["normal"," is our base case. We know that once we’ve gotten x down to zero, we’ve succeeded in determining our factorial!"]]],["p",[["normal","Simply put: Our function calling itself. In the factorial example,"],["code","return x * factorial(x — 1);"],["normal"," is where the recursion actually happens. We’re returning the value of the number x multiplied by the value of whatever"],["code","factorial(x-1)"],["normal","evaluates to."]]]]}]),l=(n("IYQ+"),n("MHOL")),f=n.n(l);const p=(e,t)=>{if("img"===e)return o.a.createElement("img",{class:"uk-width-1-1",src:t,alt:"blog"});if("h4"===e)return o.a.createElement("h4",null,t);if("h3"===e)return o.a.createElement("h3",null,t);if("p"===e){let e="<p> ";return e+=t.map(e=>{let[t,n]=e;return"em"===t?"<em>"+n+"</em>":"normal"===t?n:"strong"===t?"<strong>"+n+"</strong>":"code"===t?"<code>"+n+"</code>":""}),e+="</p>",e.split(",").join("")}if("blockquote"===e)return o.a.createElement("blockquote",null,t);if("pre"===e){let e="<pre> ";return e+=t.map(e=>{let[t,n]=e;return"em"===t?"<em>"+n+"</em>":"normal"===t?n:"strong"===t?"<strong>"+n+"</strong>":"code"===t?"<code>"+n+"</code>":"br"===t?"<br>":""}),e+="</pre>",e.split(",").join("")}},d=e=>o.a.createElement("div",{class:"blogWriteUp"},o.a.createElement("article",{class:"uk-article uk-section-small"},o.a.createElement("header",{class:"uk-container"},o.a.createElement("div",{class:"author"},o.a.createElement("img",{src:f.a,class:"avatar",alt:"Go to the profile of Brandon Morelli"}),o.a.createElement("div",{class:"info uk-text-meta"},o.a.createElement("div",{className:"best-post-content-cat"},e.article.author),o.a.createElement("p",null,e.article.dated))),o.a.createElement("h1",null,e.article.title),o.a.createElement("p",null,e.article.tagLine)),e.article.description.map(e=>"img"===e[0]?o.a.createElement("section",{class:"hero uk-section-small"},p(e[0],e[1])):o.a.createElement("section",{class:"content uk-section-small"},o.a.createElement("div",{class:"uk-container"},"string"==typeof p(e[0],e[1])?o.a.createElement("div",{dangerouslySetInnerHTML:{__html:p(e[0],e[1])}}):p(e[0],e[1]))))));var h=n("vDqi"),m=n.n(h);const g=()=>{const{0:e,1:t}=Object(r.useState)({});return Object(r.useEffect)(()=>{const n={authorization:"Client-ID dgD-DQc4cGrBqLvLT5GklBY2j24L1kxAVj7z_4sx3H0"};let r={};u.forEach(o=>{void 0===e[o.panelImage]&&m.a.get("https://api.unsplash.com/photos/"+o.panelImage,{headers:n}).then(n=>{const a=o.panelImage;r[a]=n.data.urls.raw,t({...e,...r})})})}),o.a.createElement("div",{className:"container pt-3"},o.a.createElement("div",{className:"row"},u.map(t=>o.a.createElement("article",{className:"best-post"},o.a.createElement("div",{className:"best-post-image",style:{backgroundImage:"url("+e[t.panelImage]+")"}}),o.a.createElement("div",{className:"best-post-content"},o.a.createElement("div",{className:"best-post-content-sub"},o.a.createElement(d,{article:t})))))))};t.default=()=>o.a.createElement(c.a,null,o.a.createElement(i,null,o.a.createElement("h1",null,"Blog"),o.a.createElement(s,{className:"blog-container"},o.a.createElement(g,null))))},w0Vi:function(e,t,n){"use strict";var r=n("xTJ+"),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function(e){var t,n,a,i={};return e?(r.forEach(e.split("\n"),(function(e){if(a=e.indexOf(":"),t=r.trim(e.substr(0,a)).toLowerCase(),n=r.trim(e.substr(a+1)),t){if(i[t]&&o.indexOf(t)>=0)return;i[t]="set-cookie"===t?(i[t]?i[t]:[]).concat([n]):i[t]?i[t]+", "+n:n}})),i):i}},xAGQ:function(e,t,n){"use strict";var r=n("xTJ+"),o=n("JEQr");e.exports=function(e,t,n){var a=this||o;return r.forEach(n,(function(n){e=n.call(a,e,t)})),e}},"xTJ+":function(e,t,n){"use strict";var r=n("HSsa"),o=Object.prototype.toString;function a(e){return"[object Array]"===o.call(e)}function i(e){return void 0===e}function s(e){return null!==e&&"object"==typeof e}function c(e){if("[object Object]"!==o.call(e))return!1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function u(e){return"[object Function]"===o.call(e)}function l(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),a(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:a,isArrayBuffer:function(e){return"[object ArrayBuffer]"===o.call(e)},isBuffer:function(e){return null!==e&&!i(e)&&null!==e.constructor&&!i(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){return"undefined"!=typeof FormData&&e instanceof FormData},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:s,isPlainObject:c,isUndefined:i,isDate:function(e){return"[object Date]"===o.call(e)},isFile:function(e){return"[object File]"===o.call(e)},isBlob:function(e){return"[object Blob]"===o.call(e)},isFunction:u,isStream:function(e){return s(e)&&u(e.pipe)},isURLSearchParams:function(e){return"undefined"!=typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:l,merge:function e(){var t={};function n(n,r){c(t[r])&&c(n)?t[r]=e(t[r],n):c(n)?t[r]=e({},n):a(n)?t[r]=n.slice():t[r]=n}for(var r=0,o=arguments.length;r<o;r++)l(arguments[r],n);return t},extend:function(e,t,n){return l(t,(function(t,o){e[o]=n&&"function"==typeof t?r(t,n):t})),e},trim:function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e}}},yK9s:function(e,t,n){"use strict";var r=n("xTJ+");e.exports=function(e,t){r.forEach(e,(function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])}))}},zuR4:function(e,t,n){"use strict";var r=n("xTJ+"),o=n("HSsa"),a=n("CgaS"),i=n("SntB");function s(e){var t=new a(e),n=o(a.prototype.request,t);return r.extend(n,a.prototype,t),r.extend(n,t),n}var c=s(n("JEQr"));c.Axios=a,c.create=function(e){return s(i(c.defaults,e))},c.Cancel=n("endd"),c.CancelToken=n("jfS+"),c.isCancel=n("Lmem"),c.all=function(e){return Promise.all(e)},c.spread=n("DfZB"),c.isAxiosError=n("XwJu"),e.exports=c,e.exports.default=c}}]);
//# sourceMappingURL=component---src-pages-blog-js-ff3839585bcc021d43b3.js.map
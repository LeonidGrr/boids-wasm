(()=>{var e,t,n={1424:(e,t,n)=>{(t=n(3645)(!1)).push([e.id,"*,\r\n*::before,\r\n*::after {\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\nhtml, body {\r\n    font-family: 'Prime', sans-serif;\r\n    overflow: hidden;\r\n    width: 100%;\r\n    height: 100%;\r\n    font-size: 16px;\r\n}\r\n\r\nh1, h2, h3, h4, h5, h6, p, ol, ul {\r\n    font-weight: normal;\r\n}\r\n\r\ncanvas, #renderCanvas {\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n",""]),e.exports=t},4902:(e,t,n)=>{"use strict";var r=n(667),i=(n(559),n(5978),n(3379)),o=n.n(i),a=n(1424),s=n.n(a);o()(s(),{insert:"head",singleton:!1}),s().locals;var c,l,u=function(e,t){var n=r.VO7.CreateCylinder(e,{height:1,diameterTop:.01,diameterBottom:.5},t);n.rotationQuaternion=new r._fP,this.mesh=n},h=n(4376),d=function(e,t){var n=new h.XS;n.domElement.style.marginTop="16px";var r={max_vel:{max:50,min:.1},min_vel:{max:50,min:.1},max_acc:{max:50,min:.1},min_acc:{max:50,min:.1},obstacle_w:{max:50,min:.1},align_w:{max:1,min:.1},target_w:{max:1,min:0},collision_w:{max:1,min:.1},cohesion_w:{max:1,min:.1},obstacle_dist:{max:50,min:.1},view_ang:{max:2*Math.PI,min:.1*Math.PI},view_r:{max:50,min:.1},collision_r:{max:50,min:.1}};Object.keys(t).forEach((function(i){if("time_scale"!==i&&"target_pos"!==i){var o=r[i],a=o.min,s=o.max;n.add(t,i,a,s,.1).onChange((function(t){return e(t,i)}))}}))},f=function(e,t,n,i,o){var a=this;this.config=t,this.meshes=[],this.data=[];for(var s=0;s<n;){var c=new u(""+s,o);this.data.push({pos:[Math.random(),Math.random(),Math.random()],vel:[1,1,0],rot:[0,0,0,1]}),this.meshes.push(c.mesh),s+=1}var l=i.reduce((function(e,t){var n=r.xx8.ExtractFromMesh(t,!0,!0),i=n.positions,o=n.uvs,a=n.indices,s=[];return t.position.toArray(s),e.push({points:i,indices:a,uvs:o,position:s}),e}),[]),h=e.boids_initialize(l,this.data,this.config);new d((function(e,t){a.config[t]=e,h.update_config(a.config)}),this.config),o.registerAfterRender((function(){h.boids_iteration(o.deltaTime).forEach((function(e,t){var n=e.rot,r=e.pos;a.meshes[t].position.set(r[0],r[1],r[2]),a.meshes[t].rotationQuaternion.set(n[0],n[1],n[2],n[3])}))}))};l=function(){var e,t,i,o,a,s,c,l,u;return function(e,t){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!((i=(i=a.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}(this,(function(h){switch(h.label){case 0:return e=document.querySelector("canvas"),t=new r.D4V(e,!0,{useHighPrecisionFloats:!0}),i=new r.xsS(t),(o=new r.YfP("orreryCamera",-Math.PI/4,Math.PI/4,100,r.Pa4.Zero(),i)).minZ=.01,o.maxZ=1e3,o.attachControl(e,!0),o.useBouncingBehavior=!0,o.wheelPrecision=50,o.upperRadiusLimit=100,[4,n.e(826).then(n.bind(n,4826))];case 1:return a=h.sent(),s=[],(c=new r.KuD("obstacleMaterial",i)).alpha=0,(l=r.VO7.CreateBox("obstacle1",{size:50},i)).material=c,s.push(l),(u=a.boids_config()).time_scale=.001,u.obstacle_dist=10,u.target_pos=[8,8,8],new f(a,u,100,s,i),t.runRenderLoop((function(){i.render()})),window.addEventListener("resize",(function(){t.resize()})),[2]}}))},new((c=void 0)||(c=Promise))((function(e,t){function n(e){try{i(l.next(e))}catch(e){t(e)}}function r(e){try{i(l.throw(e))}catch(e){t(e)}}function i(t){t.done?e(t.value):new c((function(e){e(t.value)})).then(n,r)}i((l=l.apply(void 0,[])).next())}))}},r={};function i(e){if(r[e])return r[e].exports;var t=r[e]={id:e,loaded:!1,exports:{}};return n[e].call(t.exports,t,t.exports,i),t.loaded=!0,t.exports}i.m=n,i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.f={},i.e=e=>Promise.all(Object.keys(i.f).reduce(((t,n)=>(i.f[n](e,t),t)),[])),i.u=e=>e+".56c25696c45d4e4cf8f4.js",i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="boids-wasm:",i.l=(n,r,o)=>{if(e[n])e[n].push(r);else{var a,s;if(void 0!==o)for(var c=document.getElementsByTagName("script"),l=0;l<c.length;l++){var u=c[l];if(u.getAttribute("src")==n||u.getAttribute("data-webpack")==t+o){a=u;break}}a||(s=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,i.nc&&a.setAttribute("nonce",i.nc),a.setAttribute("data-webpack",t+o),a.src=n),e[n]=[r];var h=(t,r)=>{a.onerror=a.onload=null,clearTimeout(d);var i=e[n];if(delete e[n],a.parentNode&&a.parentNode.removeChild(a),i&&i.forEach((e=>e(r))),t)return t(r)},d=setTimeout(h.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=h.bind(null,a.onerror),a.onload=h.bind(null,a.onload),s&&document.head.appendChild(a)}},i.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;i.g.importScripts&&(e=i.g.location+"");var t=i.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),i.p=e})(),(()=>{var e={179:0},t=[[4902,3]];i.f.j=(t,n)=>{var r=i.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else{var o=new Promise(((n,i)=>{r=e[t]=[n,i]}));n.push(r[2]=o);var a=i.p+i.u(t),s=new Error;i.l(a,(n=>{if(i.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var o=n&&("load"===n.type?"missing":n.type),a=n&&n.target&&n.target.src;s.message="Loading chunk "+t+" failed.\n("+o+": "+a+")",s.name="ChunkLoadError",s.type=o,s.request=a,r[1](s)}}),"chunk-"+t)}};var n=()=>{};function r(){for(var n,r=0;r<t.length;r++){for(var o=t[r],a=!0,s=1;s<o.length;s++){var c=o[s];0!==e[c]&&(a=!1)}a&&(t.splice(r--,1),n=i(i.s=o[0]))}return 0===t.length&&(i.x(),i.x=()=>{}),n}i.x=()=>{i.x=()=>{},a=a.slice();for(var e=0;e<a.length;e++)o(a[e]);return(n=r)()};var o=r=>{for(var o,a,[c,l,u,h]=r,d=0,f=[];d<c.length;d++)a=c[d],i.o(e,a)&&e[a]&&f.push(e[a][0]),e[a]=0;for(o in l)i.o(l,o)&&(i.m[o]=l[o]);for(u&&u(i),s(r);f.length;)f.shift()();return h&&t.push.apply(t,h),n()},a=self.webpackChunkboids_wasm=self.webpackChunkboids_wasm||[],s=a.push.bind(a);a.push=o})(),i.v=(e,t,n,r)=>{var o=fetch(i.p+""+n+".module.wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(o,r).then((t=>Object.assign(e,t.instance.exports))):o.then((e=>e.arrayBuffer())).then((e=>WebAssembly.instantiate(e,r))).then((t=>Object.assign(e,t.instance.exports)))},i.x()})();
//# sourceMappingURL=main.d53fb29e623814239edb.js.map
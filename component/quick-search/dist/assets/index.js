(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const st=globalThis,Mt=st.ShadowRoot&&(st.ShadyCSS===void 0||st.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Tt=Symbol(),It=new WeakMap;let Gt=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==Tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(Mt&&t===void 0){const r=e!==void 0&&e.length===1;r&&(t=It.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&It.set(e,t))}return t}toString(){return this.cssText}};const pe=s=>new Gt(typeof s=="string"?s:s+"",void 0,Tt),fe=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((r,i,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[n+1],s[0]);return new Gt(e,s,Tt)},ge=(s,t)=>{if(Mt)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const r=document.createElement("style"),i=st.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,s.appendChild(r)}},Rt=Mt?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return pe(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:me,defineProperty:$e,getOwnPropertyDescriptor:_e,getOwnPropertyNames:ve,getOwnPropertySymbols:ye,getPrototypeOf:Ae}=Object,M=globalThis,Nt=M.trustedTypes,be=Nt?Nt.emptyScript:"",pt=M.reactiveElementPolyfillSupport,K=(s,t)=>s,it={toAttribute(s,t){switch(t){case Boolean:s=s?be:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},ht=(s,t)=>!me(s,t),Lt={attribute:!0,type:String,converter:it,reflect:!1,hasChanged:ht};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),M.litPropertyMetadata??(M.litPropertyMetadata=new WeakMap);class j extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Lt){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,e);i!==void 0&&$e(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){const{get:i,set:n}=_e(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const c=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Lt}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;const t=Ae(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){const e=this.properties,r=[...ve(e),...ye(e)];for(const i of r)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const i of r)e.unshift(Rt(i))}else t!==void 0&&e.push(Rt(t));return e}static _$Eu(t,e){const r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ge(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostConnected)==null?void 0:r.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$EC(t,e){var n;const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){const o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:it).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=r.getPropertyOptions(i),c=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:it;this._$Em=i,this[i]=c.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,r){if(t!==void 0){if(r??(r=this.constructor.getPropertyOptions(t)),!(r.hasChanged??ht)(this[t],e))return;this.P(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,r){this._$AL.has(t)||this._$AL.set(t,e),r.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(r=this._$EO)==null||r.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}j.elementStyles=[],j.shadowRootOptions={mode:"open"},j[K("elementProperties")]=new Map,j[K("finalized")]=new Map,pt==null||pt({ReactiveElement:j}),(M.reactiveElementVersions??(M.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Y=globalThis,nt=Y.trustedTypes,Ut=nt?nt.createPolicy("lit-html",{createHTML:s=>s}):void 0,Qt="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Jt="?"+S,Ee=`<${Jt}>`,N=document,G=()=>N.createComment(""),Q=s=>s===null||typeof s!="object"&&typeof s!="function",Ct=Array.isArray,we=s=>Ct(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",ft=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ht=/-->/g,jt=/>/g,O=RegExp(`>|${ft}(?:([^\\s"'>=/]+)(${ft}*=${ft}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zt=/'/g,Dt=/"/g,Xt=/^(?:script|style|textarea|title)$/i,xe=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),P=xe(1),z=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Ft=new WeakMap,R=N.createTreeWalker(N,129);function Zt(s,t){if(!Ct(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ut!==void 0?Ut.createHTML(t):t}const Se=(s,t)=>{const e=s.length-1,r=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=W;for(let c=0;c<e;c++){const a=s[c];let h,l,d=-1,p=0;for(;p<a.length&&(o.lastIndex=p,l=o.exec(a),l!==null);)p=o.lastIndex,o===W?l[1]==="!--"?o=Ht:l[1]!==void 0?o=jt:l[2]!==void 0?(Xt.test(l[2])&&(i=RegExp("</"+l[2],"g")),o=O):l[3]!==void 0&&(o=O):o===O?l[0]===">"?(o=i??W,d=-1):l[1]===void 0?d=-2:(d=o.lastIndex-l[2].length,h=l[1],o=l[3]===void 0?O:l[3]==='"'?Dt:zt):o===Dt||o===zt?o=O:o===Ht||o===jt?o=W:(o=O,i=void 0);const f=o===O&&s[c+1].startsWith("/>")?" ":"";n+=o===W?a+Ee:d>=0?(r.push(h),a.slice(0,d)+Qt+a.slice(d)+S+f):a+S+(d===-2?c:f)}return[Zt(s,n+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]};class J{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[h,l]=Se(t,e);if(this.el=J.createElement(h,r),R.currentNode=this.el.content,e===2||e===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=R.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const d of i.getAttributeNames())if(d.endsWith(Qt)){const p=l[o++],f=i.getAttribute(d).split(S),g=/([.?@])?(.*)/.exec(p);a.push({type:1,index:n,name:g[2],strings:f,ctor:g[1]==="."?Te:g[1]==="?"?Ce:g[1]==="@"?ke:lt}),i.removeAttribute(d)}else d.startsWith(S)&&(a.push({type:6,index:n}),i.removeAttribute(d));if(Xt.test(i.tagName)){const d=i.textContent.split(S),p=d.length-1;if(p>0){i.textContent=nt?nt.emptyScript:"";for(let f=0;f<p;f++)i.append(d[f],G()),R.nextNode(),a.push({type:2,index:++n});i.append(d[p],G())}}}else if(i.nodeType===8)if(i.data===Jt)a.push({type:2,index:n});else{let d=-1;for(;(d=i.data.indexOf(S,d+1))!==-1;)a.push({type:7,index:n}),d+=S.length-1}n++}}static createElement(t,e){const r=N.createElement("template");return r.innerHTML=t,r}}function D(s,t,e=s,r){var o,c;if(t===z)return t;let i=r!==void 0?(o=e.o)==null?void 0:o[r]:e.l;const n=Q(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),n===void 0?i=void 0:(i=new n(s),i._$AT(s,e,r)),r!==void 0?(e.o??(e.o=[]))[r]=i:e.l=i),i!==void 0&&(t=D(s,i._$AS(s,t.values),i,r)),t}class Me{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,i=((t==null?void 0:t.creationScope)??N).importNode(e,!0);R.currentNode=i;let n=R.nextNode(),o=0,c=0,a=r[0];for(;a!==void 0;){if(o===a.index){let h;a.type===2?h=new X(n,n.nextSibling,this,t):a.type===1?h=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(h=new Oe(n,this,t)),this._$AV.push(h),a=r[++c]}o!==(a==null?void 0:a.index)&&(n=R.nextNode(),o++)}return R.currentNode=N,i}p(t){let e=0;for(const r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class X{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,r,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=D(this,t,e),Q(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):we(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&Q(this._$AH)?this._$AA.nextSibling.data=t:this.T(N.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=J.createElement(Zt(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Me(i,this),c=o.u(this.options);o.p(e),this.T(c),this._$AH=o}}_$AC(t){let e=Ft.get(t.strings);return e===void 0&&Ft.set(t.strings,e=new J(t)),e}k(t){Ct(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,i=0;for(const n of t)i===e.length?e.push(r=new X(this.O(G()),this.O(G()),this,this.options)):r=e[i],r._$AI(n),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class lt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,n){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=m}_$AI(t,e=this,r,i){const n=this.strings;let o=!1;if(n===void 0)t=D(this,t,e,0),o=!Q(t)||t!==this._$AH&&t!==z,o&&(this._$AH=t);else{const c=t;let a,h;for(t=n[0],a=0;a<n.length-1;a++)h=D(this,c[r+a],e,a),h===z&&(h=this._$AH[a]),o||(o=!Q(h)||h!==this._$AH[a]),h===m?t=m:t!==m&&(t+=(h??"")+n[a+1]),this._$AH[a]=h}o&&!i&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Te extends lt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}}class Ce extends lt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}}class ke extends lt{constructor(t,e,r,i,n){super(t,e,r,i,n),this.type=5}_$AI(t,e=this){if((t=D(this,t,e,0)??m)===z)return;const r=this._$AH,i=t===m&&r!==m||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==m&&(r===m||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Oe{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){D(this,t)}}const gt=Y.litHtmlPolyfillSupport;gt==null||gt(J,X),(Y.litHtmlVersions??(Y.litHtmlVersions=[])).push("3.2.0");const Pe=(s,t,e)=>{const r=(e==null?void 0:e.renderBefore)??t;let i=r._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;r._$litPart$=i=new X(t.insertBefore(G(),n),n,void 0,e??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let V=class extends j{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Pe(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return z}};var qt;V._$litElement$=!0,V.finalized=!0,(qt=globalThis.litElementHydrateSupport)==null||qt.call(globalThis,{LitElement:V});const mt=globalThis.litElementPolyfillSupport;mt==null||mt({LitElement:V});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ie=s=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,t)}):customElements.define(s,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Re={attribute:!0,type:String,converter:it,reflect:!1,hasChanged:ht},Ne=(s=Re,t,e)=>{const{kind:r,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,s),r==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,s)},init(c){return c!==void 0&&this.P(o,void 0,s),c}}}if(r==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,s)}}throw Error("Unsupported decorator location: "+r)};function Le(s){return(t,e)=>typeof e=="object"?Ne(s,t,e):((r,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...r,wrapped:!0}:r),o?Object.getOwnPropertyDescriptor(i,n):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ue(s){return Le({...s,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const He=s=>s.strings===void 0;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const je={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},ze=s=>(...t)=>({_$litDirective$:s,values:t});let De=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this.t=t,this._$AM=e,this.i=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=(s,t)=>{var r;const e=s._$AN;if(e===void 0)return!1;for(const i of e)(r=i._$AO)==null||r.call(i,t,!1),q(i,t);return!0},ot=s=>{let t,e;do{if((t=s._$AM)===void 0)break;e=t._$AN,e.delete(s),s=t}while((e==null?void 0:e.size)===0)},te=s=>{for(let t;t=s._$AM;s=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(s))break;e.add(s),Be(t)}};function Fe(s){this._$AN!==void 0?(ot(this),this._$AM=s,te(this)):this._$AM=s}function We(s,t=!1,e=0){const r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let n=e;n<r.length;n++)q(r[n],!1),ot(r[n]);else r!=null&&(q(r,!1),ot(r));else q(this,s)}const Be=s=>{s.type==je.CHILD&&(s._$AP??(s._$AP=We),s._$AQ??(s._$AQ=Fe))};class Ke extends De{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,r){super._$AT(t,e,r),te(this),this.isConnected=t._$AU}_$AO(t,e=!0){var r,i;t!==this.isConnected&&(this.isConnected=t,t?(r=this.reconnected)==null||r.call(this):(i=this.disconnected)==null||i.call(this)),e&&(q(this,t),ot(this))}setValue(t){if(He(this.t))this.t._$AI(t,this);else{const e=[...this.t._$AH];e[this.i]=t,this.t._$AI(e,this,0)}}disconnected(){}reconnected(){}}/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ye=()=>new Ve;class Ve{}const $t=new WeakMap,qe=ze(class extends Ke{render(s){return m}update(s,[t]){var r;const e=t!==this.Y;return e&&this.Y!==void 0&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.Y=t,this.ht=(r=s.options)==null?void 0:r.host,this.rt(this.ct=s.element)),m}rt(s){if(this.isConnected||(s=void 0),typeof this.Y=="function"){const t=this.ht??globalThis;let e=$t.get(t);e===void 0&&(e=new WeakMap,$t.set(t,e)),e.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),e.set(this.Y,s),s!==void 0&&this.Y.call(this.ht,s)}else this.Y.value=s}get lt(){var s,t;return typeof this.Y=="function"?(s=$t.get(this.ht??globalThis))==null?void 0:s.get(this.Y):(t=this.Y)==null?void 0:t.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function*Ge(s,t){if(s!==void 0){let e=0;for(const r of s)yield t(r,e++)}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qe=Symbol();class Je{get taskComplete(){return this.t||(this.i===1?this.t=new Promise((t,e)=>{this.o=t,this.h=e}):this.i===3?this.t=Promise.reject(this.l):this.t=Promise.resolve(this.u)),this.t}constructor(t,e,r){var n;this.p=0,this.i=0,(this._=t).addController(this);const i=typeof e=="object"?e:{task:e,args:r};this.v=i.task,this.j=i.args,this.m=i.argsEqual??Xe,this.k=i.onComplete,this.A=i.onError,this.autoRun=i.autoRun??!0,"initialValue"in i&&(this.u=i.initialValue,this.i=2,this.O=(n=this.T)==null?void 0:n.call(this))}hostUpdate(){this.autoRun===!0&&this.S()}hostUpdated(){this.autoRun==="afterUpdate"&&this.S()}T(){if(this.j===void 0)return;const t=this.j();if(!Array.isArray(t))throw Error("The args function must return an array");return t}async S(){const t=this.T(),e=this.O;this.O=t,t===e||t===void 0||e!==void 0&&this.m(e,t)||await this.run(t)}async run(t){var o,c,a,h,l;let e,r;t??(t=this.T()),this.O=t,this.i===1?(o=this.q)==null||o.abort():(this.t=void 0,this.o=void 0,this.h=void 0),this.i=1,this.autoRun==="afterUpdate"?queueMicrotask(()=>this._.requestUpdate()):this._.requestUpdate();const i=++this.p;this.q=new AbortController;let n=!1;try{e=await this.v(t,{signal:this.q.signal})}catch(d){n=!0,r=d}if(this.p===i){if(e===Qe)this.i=0;else{if(n===!1){try{(c=this.k)==null||c.call(this,e)}catch{}this.i=2,(a=this.o)==null||a.call(this,e)}else{try{(h=this.A)==null||h.call(this,r)}catch{}this.i=3,(l=this.h)==null||l.call(this,r)}this.u=e,this.l=r}this._.requestUpdate()}}abort(t){var e;this.i===1&&((e=this.q)==null||e.abort(t))}get value(){return this.u}get error(){return this.l}get status(){return this.i}render(t){var e,r,i,n;switch(this.i){case 0:return(e=t.initial)==null?void 0:e.call(t);case 1:return(r=t.pending)==null?void 0:r.call(t);case 2:return(i=t.complete)==null?void 0:i.call(t,this.value);case 3:return(n=t.error)==null?void 0:n.call(t,this.error);default:throw Error("Unexpected status: "+this.i)}}}const Xe=(s,t)=>s===t||s.length===t.length&&s.every((e,r)=>!ht(e,t[r]));function E(s){return Array.isArray?Array.isArray(s):re(s)==="[object Array]"}const Ze=1/0;function ts(s){if(typeof s=="string")return s;let t=s+"";return t=="0"&&1/s==-Ze?"-0":t}function es(s){return s==null?"":ts(s)}function A(s){return typeof s=="string"}function ee(s){return typeof s=="number"}function ss(s){return s===!0||s===!1||rs(s)&&re(s)=="[object Boolean]"}function se(s){return typeof s=="object"}function rs(s){return se(s)&&s!==null}function $(s){return s!=null}function _t(s){return!s.trim().length}function re(s){return s==null?s===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(s)}const is="Incorrect 'index' type",ns=s=>`Invalid value for key ${s}`,os=s=>`Pattern length exceeds max of ${s}.`,as=s=>`Missing ${s} property in key`,cs=s=>`Property 'weight' in key '${s}' must be a positive integer`,Wt=Object.prototype.hasOwnProperty;class hs{constructor(t){this._keys=[],this._keyMap={};let e=0;t.forEach(r=>{let i=ie(r);this._keys.push(i),this._keyMap[i.id]=i,e+=i.weight}),this._keys.forEach(r=>{r.weight/=e})}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function ie(s){let t=null,e=null,r=null,i=1,n=null;if(A(s)||E(s))r=s,t=Bt(s),e=yt(s);else{if(!Wt.call(s,"name"))throw new Error(as("name"));const o=s.name;if(r=o,Wt.call(s,"weight")&&(i=s.weight,i<=0))throw new Error(cs(o));t=Bt(o),e=yt(o),n=s.getFn}return{path:t,id:e,weight:i,src:r,getFn:n}}function Bt(s){return E(s)?s:s.split(".")}function yt(s){return E(s)?s.join("."):s}function ls(s,t){let e=[],r=!1;const i=(n,o,c)=>{if($(n))if(!o[c])e.push(n);else{let a=o[c];const h=n[a];if(!$(h))return;if(c===o.length-1&&(A(h)||ee(h)||ss(h)))e.push(es(h));else if(E(h)){r=!0;for(let l=0,d=h.length;l<d;l+=1)i(h[l],o,c+1)}else o.length&&i(h,o,c+1)}};return i(s,A(t)?t.split("."):t,0),r?e:e[0]}const ds={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},us={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(s,t)=>s.score===t.score?s.idx<t.idx?-1:1:s.score<t.score?-1:1},ps={location:0,threshold:.6,distance:100},fs={useExtendedSearch:!1,getFn:ls,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var u={...us,...ds,...ps,...fs};const gs=/[^ ]+/g;function ms(s=1,t=3){const e=new Map,r=Math.pow(10,t);return{get(i){const n=i.match(gs).length;if(e.has(n))return e.get(n);const o=1/Math.pow(n,.5*s),c=parseFloat(Math.round(o*r)/r);return e.set(n,c),c},clear(){e.clear()}}}class kt{constructor({getFn:t=u.getFn,fieldNormWeight:e=u.fieldNormWeight}={}){this.norm=ms(e,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach((e,r)=>{this._keysMap[e.id]=r})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,A(this.docs[0])?this.docs.forEach((t,e)=>{this._addString(t,e)}):this.docs.forEach((t,e)=>{this._addObject(t,e)}),this.norm.clear())}add(t){const e=this.size();A(t)?this._addString(t,e):this._addObject(t,e)}removeAt(t){this.records.splice(t,1);for(let e=t,r=this.size();e<r;e+=1)this.records[e].i-=1}getValueForItemAtKeyId(t,e){return t[this._keysMap[e]]}size(){return this.records.length}_addString(t,e){if(!$(t)||_t(t))return;let r={v:t,i:e,n:this.norm.get(t)};this.records.push(r)}_addObject(t,e){let r={i:e,$:{}};this.keys.forEach((i,n)=>{let o=i.getFn?i.getFn(t):this.getFn(t,i.path);if($(o)){if(E(o)){let c=[];const a=[{nestedArrIndex:-1,value:o}];for(;a.length;){const{nestedArrIndex:h,value:l}=a.pop();if($(l))if(A(l)&&!_t(l)){let d={v:l,i:h,n:this.norm.get(l)};c.push(d)}else E(l)&&l.forEach((d,p)=>{a.push({nestedArrIndex:p,value:d})})}r.$[n]=c}else if(A(o)&&!_t(o)){let c={v:o,n:this.norm.get(o)};r.$[n]=c}}}),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function ne(s,t,{getFn:e=u.getFn,fieldNormWeight:r=u.fieldNormWeight}={}){const i=new kt({getFn:e,fieldNormWeight:r});return i.setKeys(s.map(ie)),i.setSources(t),i.create(),i}function $s(s,{getFn:t=u.getFn,fieldNormWeight:e=u.fieldNormWeight}={}){const{keys:r,records:i}=s,n=new kt({getFn:t,fieldNormWeight:e});return n.setKeys(r),n.setIndexRecords(i),n}function et(s,{errors:t=0,currentLocation:e=0,expectedLocation:r=0,distance:i=u.distance,ignoreLocation:n=u.ignoreLocation}={}){const o=t/s.length;if(n)return o;const c=Math.abs(r-e);return i?o+c/i:c?1:o}function _s(s=[],t=u.minMatchCharLength){let e=[],r=-1,i=-1,n=0;for(let o=s.length;n<o;n+=1){let c=s[n];c&&r===-1?r=n:!c&&r!==-1&&(i=n-1,i-r+1>=t&&e.push([r,i]),r=-1)}return s[n-1]&&n-r>=t&&e.push([r,n-1]),e}const I=32;function vs(s,t,e,{location:r=u.location,distance:i=u.distance,threshold:n=u.threshold,findAllMatches:o=u.findAllMatches,minMatchCharLength:c=u.minMatchCharLength,includeMatches:a=u.includeMatches,ignoreLocation:h=u.ignoreLocation}={}){if(t.length>I)throw new Error(os(I));const l=t.length,d=s.length,p=Math.max(0,Math.min(r,d));let f=n,g=p;const _=c>1||a,C=_?Array(d):[];let b;for(;(b=s.indexOf(t,g))>-1;){let v=et(t,{currentLocation:b,expectedLocation:p,distance:i,ignoreLocation:h});if(f=Math.min(v,f),g=b+l,_){let w=0;for(;w<l;)C[b+w]=1,w+=1}}g=-1;let L=[],k=1,Z=l+d;const ue=1<<l-1;for(let v=0;v<l;v+=1){let w=0,x=Z;for(;w<x;)et(t,{errors:v,currentLocation:p+x,expectedLocation:p,distance:i,ignoreLocation:h})<=f?w=x:Z=x,x=Math.floor((Z-w)/2+w);Z=x;let Ot=Math.max(1,p-x+1),ut=o?d:Math.min(p+x,d)+l,U=Array(ut+2);U[ut+1]=(1<<v)-1;for(let y=ut;y>=Ot;y-=1){let tt=y-1,Pt=e[s.charAt(tt)];if(_&&(C[tt]=+!!Pt),U[y]=(U[y+1]<<1|1)&Pt,v&&(U[y]|=(L[y+1]|L[y])<<1|1|L[y+1]),U[y]&ue&&(k=et(t,{errors:v,currentLocation:tt,expectedLocation:p,distance:i,ignoreLocation:h}),k<=f)){if(f=k,g=tt,g<=p)break;Ot=Math.max(1,2*p-g)}}if(et(t,{errors:v+1,currentLocation:p,expectedLocation:p,distance:i,ignoreLocation:h})>f)break;L=U}const dt={isMatch:g>=0,score:Math.max(.001,k)};if(_){const v=_s(C,c);v.length?a&&(dt.indices=v):dt.isMatch=!1}return dt}function ys(s){let t={};for(let e=0,r=s.length;e<r;e+=1){const i=s.charAt(e);t[i]=(t[i]||0)|1<<r-e-1}return t}class oe{constructor(t,{location:e=u.location,threshold:r=u.threshold,distance:i=u.distance,includeMatches:n=u.includeMatches,findAllMatches:o=u.findAllMatches,minMatchCharLength:c=u.minMatchCharLength,isCaseSensitive:a=u.isCaseSensitive,ignoreLocation:h=u.ignoreLocation}={}){if(this.options={location:e,threshold:r,distance:i,includeMatches:n,findAllMatches:o,minMatchCharLength:c,isCaseSensitive:a,ignoreLocation:h},this.pattern=a?t:t.toLowerCase(),this.chunks=[],!this.pattern.length)return;const l=(p,f)=>{this.chunks.push({pattern:p,alphabet:ys(p),startIndex:f})},d=this.pattern.length;if(d>I){let p=0;const f=d%I,g=d-f;for(;p<g;)l(this.pattern.substr(p,I),p),p+=I;if(f){const _=d-I;l(this.pattern.substr(_),_)}}else l(this.pattern,0)}searchIn(t){const{isCaseSensitive:e,includeMatches:r}=this.options;if(e||(t=t.toLowerCase()),this.pattern===t){let g={isMatch:!0,score:0};return r&&(g.indices=[[0,t.length-1]]),g}const{location:i,distance:n,threshold:o,findAllMatches:c,minMatchCharLength:a,ignoreLocation:h}=this.options;let l=[],d=0,p=!1;this.chunks.forEach(({pattern:g,alphabet:_,startIndex:C})=>{const{isMatch:b,score:L,indices:k}=vs(t,g,_,{location:i+C,distance:n,threshold:o,findAllMatches:c,minMatchCharLength:a,includeMatches:r,ignoreLocation:h});b&&(p=!0),d+=L,b&&k&&(l=[...l,...k])});let f={isMatch:p,score:p?d/this.chunks.length:1};return p&&r&&(f.indices=l),f}}class T{constructor(t){this.pattern=t}static isMultiMatch(t){return Kt(t,this.multiRegex)}static isSingleMatch(t){return Kt(t,this.singleRegex)}search(){}}function Kt(s,t){const e=s.match(t);return e?e[1]:null}class As extends T{constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const e=t===this.pattern;return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}}class bs extends T{constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const r=t.indexOf(this.pattern)===-1;return{isMatch:r,score:r?0:1,indices:[0,t.length-1]}}}class Es extends T{constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const e=t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,this.pattern.length-1]}}}class ws extends T{constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const e=!t.startsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}}class xs extends T{constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const e=t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[t.length-this.pattern.length,t.length-1]}}}class Ss extends T{constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const e=!t.endsWith(this.pattern);return{isMatch:e,score:e?0:1,indices:[0,t.length-1]}}}class ae extends T{constructor(t,{location:e=u.location,threshold:r=u.threshold,distance:i=u.distance,includeMatches:n=u.includeMatches,findAllMatches:o=u.findAllMatches,minMatchCharLength:c=u.minMatchCharLength,isCaseSensitive:a=u.isCaseSensitive,ignoreLocation:h=u.ignoreLocation}={}){super(t),this._bitapSearch=new oe(t,{location:e,threshold:r,distance:i,includeMatches:n,findAllMatches:o,minMatchCharLength:c,isCaseSensitive:a,ignoreLocation:h})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class ce extends T{constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let e=0,r;const i=[],n=this.pattern.length;for(;(r=t.indexOf(this.pattern,e))>-1;)e=r+n,i.push([r,e-1]);const o=!!i.length;return{isMatch:o,score:o?0:1,indices:i}}}const At=[As,ce,Es,ws,Ss,xs,bs,ae],Yt=At.length,Ms=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,Ts="|";function Cs(s,t={}){return s.split(Ts).map(e=>{let r=e.trim().split(Ms).filter(n=>n&&!!n.trim()),i=[];for(let n=0,o=r.length;n<o;n+=1){const c=r[n];let a=!1,h=-1;for(;!a&&++h<Yt;){const l=At[h];let d=l.isMultiMatch(c);d&&(i.push(new l(d,t)),a=!0)}if(!a)for(h=-1;++h<Yt;){const l=At[h];let d=l.isSingleMatch(c);if(d){i.push(new l(d,t));break}}}return i})}const ks=new Set([ae.type,ce.type]);class Os{constructor(t,{isCaseSensitive:e=u.isCaseSensitive,includeMatches:r=u.includeMatches,minMatchCharLength:i=u.minMatchCharLength,ignoreLocation:n=u.ignoreLocation,findAllMatches:o=u.findAllMatches,location:c=u.location,threshold:a=u.threshold,distance:h=u.distance}={}){this.query=null,this.options={isCaseSensitive:e,includeMatches:r,minMatchCharLength:i,findAllMatches:o,ignoreLocation:n,location:c,threshold:a,distance:h},this.pattern=e?t:t.toLowerCase(),this.query=Cs(this.pattern,this.options)}static condition(t,e){return e.useExtendedSearch}searchIn(t){const e=this.query;if(!e)return{isMatch:!1,score:1};const{includeMatches:r,isCaseSensitive:i}=this.options;t=i?t:t.toLowerCase();let n=0,o=[],c=0;for(let a=0,h=e.length;a<h;a+=1){const l=e[a];o.length=0,n=0;for(let d=0,p=l.length;d<p;d+=1){const f=l[d],{isMatch:g,indices:_,score:C}=f.search(t);if(g){if(n+=1,c+=C,r){const b=f.constructor.type;ks.has(b)?o=[...o,..._]:o.push(_)}}else{c=0,n=0,o.length=0;break}}if(n){let d={isMatch:!0,score:c/n};return r&&(d.indices=o),d}}return{isMatch:!1,score:1}}}const bt=[];function Ps(...s){bt.push(...s)}function Et(s,t){for(let e=0,r=bt.length;e<r;e+=1){let i=bt[e];if(i.condition(s,t))return new i(s,t)}return new oe(s,t)}const at={AND:"$and",OR:"$or"},wt={PATH:"$path",PATTERN:"$val"},xt=s=>!!(s[at.AND]||s[at.OR]),Is=s=>!!s[wt.PATH],Rs=s=>!E(s)&&se(s)&&!xt(s),Vt=s=>({[at.AND]:Object.keys(s).map(t=>({[t]:s[t]}))});function he(s,t,{auto:e=!0}={}){const r=i=>{let n=Object.keys(i);const o=Is(i);if(!o&&n.length>1&&!xt(i))return r(Vt(i));if(Rs(i)){const a=o?i[wt.PATH]:n[0],h=o?i[wt.PATTERN]:i[a];if(!A(h))throw new Error(ns(a));const l={keyId:yt(a),pattern:h};return e&&(l.searcher=Et(h,t)),l}let c={children:[],operator:n[0]};return n.forEach(a=>{const h=i[a];E(h)&&h.forEach(l=>{c.children.push(r(l))})}),c};return xt(s)||(s=Vt(s)),r(s)}function Ns(s,{ignoreFieldNorm:t=u.ignoreFieldNorm}){s.forEach(e=>{let r=1;e.matches.forEach(({key:i,norm:n,score:o})=>{const c=i?i.weight:null;r*=Math.pow(o===0&&c?Number.EPSILON:o,(c||1)*(t?1:n))}),e.score=r})}function Ls(s,t){const e=s.matches;t.matches=[],$(e)&&e.forEach(r=>{if(!$(r.indices)||!r.indices.length)return;const{indices:i,value:n}=r;let o={indices:i,value:n};r.key&&(o.key=r.key.src),r.idx>-1&&(o.refIndex=r.idx),t.matches.push(o)})}function Us(s,t){t.score=s.score}function Hs(s,t,{includeMatches:e=u.includeMatches,includeScore:r=u.includeScore}={}){const i=[];return e&&i.push(Ls),r&&i.push(Us),s.map(n=>{const{idx:o}=n,c={item:t[o],refIndex:o};return i.length&&i.forEach(a=>{a(n,c)}),c})}class F{constructor(t,e={},r){this.options={...u,...e},this.options.useExtendedSearch,this._keyStore=new hs(this.options.keys),this.setCollection(t,r)}setCollection(t,e){if(this._docs=t,e&&!(e instanceof kt))throw new Error(is);this._myIndex=e||ne(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){$(t)&&(this._docs.push(t),this._myIndex.add(t))}remove(t=()=>!1){const e=[];for(let r=0,i=this._docs.length;r<i;r+=1){const n=this._docs[r];t(n,r)&&(this.removeAt(r),r-=1,i-=1,e.push(n))}return e}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:e=-1}={}){const{includeMatches:r,includeScore:i,shouldSort:n,sortFn:o,ignoreFieldNorm:c}=this.options;let a=A(t)?A(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return Ns(a,{ignoreFieldNorm:c}),n&&a.sort(o),ee(e)&&e>-1&&(a=a.slice(0,e)),Hs(a,this._docs,{includeMatches:r,includeScore:i})}_searchStringList(t){const e=Et(t,this.options),{records:r}=this._myIndex,i=[];return r.forEach(({v:n,i:o,n:c})=>{if(!$(n))return;const{isMatch:a,score:h,indices:l}=e.searchIn(n);a&&i.push({item:n,idx:o,matches:[{score:h,value:n,norm:c,indices:l}]})}),i}_searchLogical(t){const e=he(t,this.options),r=(c,a,h)=>{if(!c.children){const{keyId:d,searcher:p}=c,f=this._findMatches({key:this._keyStore.get(d),value:this._myIndex.getValueForItemAtKeyId(a,d),searcher:p});return f&&f.length?[{idx:h,item:a,matches:f}]:[]}const l=[];for(let d=0,p=c.children.length;d<p;d+=1){const f=c.children[d],g=r(f,a,h);if(g.length)l.push(...g);else if(c.operator===at.AND)return[]}return l},i=this._myIndex.records,n={},o=[];return i.forEach(({$:c,i:a})=>{if($(c)){let h=r(e,c,a);h.length&&(n[a]||(n[a]={idx:a,item:c,matches:[]},o.push(n[a])),h.forEach(({matches:l})=>{n[a].matches.push(...l)}))}}),o}_searchObjectList(t){const e=Et(t,this.options),{keys:r,records:i}=this._myIndex,n=[];return i.forEach(({$:o,i:c})=>{if(!$(o))return;let a=[];r.forEach((h,l)=>{a.push(...this._findMatches({key:h,value:o[l],searcher:e}))}),a.length&&n.push({idx:c,item:o,matches:a})}),n}_findMatches({key:t,value:e,searcher:r}){if(!$(e))return[];let i=[];if(E(e))e.forEach(({v:n,i:o,n:c})=>{if(!$(n))return;const{isMatch:a,score:h,indices:l}=r.searchIn(n);a&&i.push({score:h,key:t,value:n,idx:o,norm:c,indices:l})});else{const{v:n,n:o}=e,{isMatch:c,score:a,indices:h}=r.searchIn(n);c&&i.push({score:a,key:t,value:n,norm:o,indices:h})}return i}}F.version="7.0.0";F.createIndex=ne;F.parseIndex=$s;F.config=u;F.parseQuery=he;Ps(Os);var js=Object.defineProperty,zs=Object.getOwnPropertyDescriptor,le=s=>{throw TypeError(s)},de=(s,t,e,r)=>{for(var i=r>1?void 0:r?zs(t,e):t,n=s.length-1,o;n>=0;n--)(o=s[n])&&(i=(r?o(t,e,i):o(i))||i);return r&&i&&js(t,e,i),i},Ds=(s,t,e)=>t.has(s)||le("Cannot "+e),H=(s,t,e)=>(Ds(s,t,"read from private field"),t.get(s)),vt=(s,t,e)=>t.has(s)?le("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(s):t.set(s,e),B,rt,St;let ct=class extends V{constructor(){super(...arguments),vt(this,B,Ye()),this.searchTerm="",this.dataTask=new Je(this,{task:async()=>{const s=await fetch("/search-data.json");if(!s.ok)throw new Error(`HTTP ${s.status}`);const t=await s.json();return this.fuse=new F(t,{keys:["title","categories","excerpt"],shouldSort:!0,includeScore:!0}),t},args:()=>[]}),vt(this,rt,s=>{const t=s.key==="k"&&s.getModifierState("Meta"),e=s.key==="k"&&s.getModifierState("Control");(t||e)&&this.open()}),vt(this,St,s=>{this.searchTerm=s.target.value}),this.open=()=>{var s;(s=H(this,B).value)==null||s.showModal()},this.close=()=>{var s;(s=H(this,B).value)==null||s.close()}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",H(this,rt))}disconnectedCallback(){window.removeEventListener("keydown",H(this,rt))}get results(){return!this.searchTerm||!this.fuse||this.dataTask.status!==2?[]:this.fuse.search(this.searchTerm)}get hasResults(){return this.results.length>0}render(){return P`
      <dialog part="qs-dialog" ${qe(H(this,B))}>
        <div class="inner">
          <div class="controls">
            <input
              autofocus
              type="text"
              placeholder="Search for a page"
              part="qs-input"
              value=${this.searchTerm}
              @input=${H(this,St)}
            />
            <button class="close" @click=${this.close}>Close</button>
          </div>
          <hr part="qs-divider" />
          <div part="qs-results" class="results">
            ${this.dataTask.render({pending:()=>P`<div class="message">Loading search data...</div>`,error:s=>P`<div class="message error">
                  Search unavailable:
                  ${s instanceof Error?s.message:"Unknown error"}
                </div>`,complete:()=>this.hasResults?P`
                    <ul>
                      ${Ge(this.results,({item:s})=>P`<li>
                          <a part="qs-result" class="result" href=${s.url}>
                            <div part="qs-title" class="title">
                              ${s.title}
                            </div>
                            <div part="qs-excerpt" class="excerpt">
                              ${s.excerpt}
                            </div>
                            <div part="qs-categories" class="categories">
                              ${s.categories.map(t=>P`<span>${t}</span>`)}
                            </div>
                          </a>
                        </li>`)}
                    </ul>
                  `:P`<div class="message">
                    Enter a search term or select a category. Press escape to
                    return.
                  </div>`})}
          </div>
        </div>
      </dialog>
    `}};B=new WeakMap;rt=new WeakMap;St=new WeakMap;ct.styles=fe`
    :host {
      --gunmetal: #1b2f36;
      --seasalt: #fafafa;
      --carrot: #f79103;
      --teal: #376170;
      --raw-umber: #906b56;
      --paynes-gray: #4d5963;
      --shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      --gradient: linear-gradient(
        135deg,
        var(--paynes-gray) 0% 20%,
        var(--carrot) 20% 40%,
        var(--teal) 40% 60%,
        var(--raw-umber) 60% 80%,
        var(--gunmetal) 80% 100%
      );
    }

    * {
      box-sizing: border-box;
    }

    *:focus-visible {
      outline: 2px solid var(--raw-umber);
      outline-offset: 1px;
    }

    dialog {
      margin-top: 10vh;
      height: auto;
      width: 90vw;
      max-width: 600px;
      max-height: 80vh;
      padding: 0;
      border: 2px solid var(--gunmetal);
      border-radius: 8px;
      background: var(--seasalt);
      color: var(--gunmetal);
      box-shadow: var(--shadow);
      overflow: hidden;
      font-family: "Atkinson Hyperlegible Next", system-ui, sans-serif;
    }

    dialog::backdrop {
      backdrop-filter: blur(4px);
      background: rgba(27, 47, 54, 0.1);
    }

    .inner {
      max-height: 100%;
      padding: 1rem;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    input {
      flex: 1;
      padding: 0.75rem;
      font: inherit;
      font-size: 1rem;
      border: 2px solid var(--teal);
      border-radius: 8px;
      background: var(--seasalt);
      color: var(--gunmetal);

      &:focus {
        outline: none;
        border-color: var(--carrot);
        box-shadow: 0 0 0 2px rgba(247, 145, 3, 0.2);
      }

      &::placeholder {
        color: var(--paynes-gray);
      }
    }

    .close {
      display: inline-block;
      padding: 0.75rem 1rem;
      background: var(--gunmetal);
      color: var(--seasalt);
      border-radius: 8px;
      box-shadow: var(--shadow);
      border: none;
      font: inherit;
      cursor: pointer;

      &:hover {
        background: var(--gradient);
      }

      &:focus-visible {
        outline: 2px solid var(--raw-umber);
        outline-offset: 1px;
        background: var(--gradient);
      }
    }

    hr {
      width: 100%;
      border: none;
      height: 4px;
      background: var(--gradient);
      border-radius: 2px;
      margin: 0 0 1rem 0;
    }

    .results {
      max-height: 60vh;
      overflow-y: auto;
    }

    .message {
      padding: 2rem 1rem;
      text-align: center;
      color: var(--paynes-gray);
      font-style: italic;
    }

    .message.error {
      color: var(--raw-umber);
      font-weight: bold;
    }

    ul {
      margin: 0;
      padding: 0;
      padding-top: 0.5rem;
      list-style-type: none;
      display: grid;
      gap: 0.5rem;
    }

    .result {
      display: block;
      padding: 1rem;
      color: var(--gunmetal);
      text-decoration: none;
      border: 2px solid transparent;
      border-radius: 8px;
      background: var(--seasalt);
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--teal);
        transform: translateY(-1px);
      }

      &:focus-visible {
        outline: none;
        border-color: var(--carrot);
        box-shadow: 0 0 0 2px rgba(247, 145, 3, 0.2);
      }
    }

    .title {
      font-weight: bold;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
      color: var(--gunmetal);
      line-height: 1.2;
    }

    .excerpt {
      font-size: 0.9rem;
      color: var(--paynes-gray);
      line-height: 1.4;
      margin-bottom: 0.5rem;
    }

    .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      font-size: 0.8rem;
      text-transform: capitalize;

      & span {
        padding: 0.125rem 0.5rem;
        background: var(--teal);
        color: var(--seasalt);
        border-radius: 4px;
        font-weight: 500;
      }

      & span:last-child::after {
        content: none;
      }
    }


    /* Responsive adjustments */
    @media (max-width: 600px) {
      dialog {
        width: 95vw;
        margin-top: 5vh;
        max-height: 85vh;
      }

      .inner {
        padding: 0.75rem;
      }

      .controls {
        flex-direction: column;
        gap: 0.75rem;
      }

      .close {
        width: 100%;
        order: -1;
      }

      input {
        width: 100%;
      }
    }
  `;de([Ue()],ct.prototype,"searchTerm",2);ct=de([Ie("quick-search")],ct);

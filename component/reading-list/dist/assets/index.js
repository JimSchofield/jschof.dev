(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const L=globalThis,q=L.ShadowRoot&&(L.ShadyCSS===void 0||L.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,V=Symbol(),K=new WeakMap;let ae=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==V)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(q&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=K.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&K.set(t,e))}return e}toString(){return this.cssText}};const pe=i=>new ae(typeof i=="string"?i:i+"",void 0,V),ue=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((s,r,o)=>s+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new ae(t,i,V)},fe=(i,e)=>{if(q)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),r=L.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},J=q?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return pe(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ge,defineProperty:$e,getOwnPropertyDescriptor:me,getOwnPropertyNames:be,getOwnPropertySymbols:ye,getPrototypeOf:ve}=Object,v=globalThis,Z=v.trustedTypes,_e=Z?Z.emptyScript:"",D=v.reactiveElementPolyfillSupport,F=(i,e)=>i,R={toAttribute(i,e){switch(e){case Boolean:i=i?_e:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},W=(i,e)=>!ge(i,e),Q={attribute:!0,type:String,converter:R,reflect:!1,useDefault:!1,hasChanged:W};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),v.litPropertyMetadata??(v.litPropertyMetadata=new WeakMap);let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Q){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&$e(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){const{get:r,set:o}=me(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:r,set(a){const l=r==null?void 0:r.call(this);o==null||o.call(this,a),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Q}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;const e=ve(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){const t=this.properties,s=[...be(t),...ye(t)];for(const r of s)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const r of s)t.unshift(J(r))}else e!==void 0&&t.push(J(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fe(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var o;const s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){const a=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:R).toAttribute(t,s.type);this._$Em=e,a==null?this.removeAttribute(r):this.setAttribute(r,a),this._$Em=null}}_$AK(e,t){var o,a;const s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),n=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:R;this._$Em=r;const h=n.fromAttribute(t,l.type);this[r]=h??((a=this._$Ej)==null?void 0:a.get(r))??h,this._$Em=null}}requestUpdate(e,t,s){var r;if(e!==void 0){const o=this.constructor,a=this[e];if(s??(s=o.getPropertyOptions(e)),!((s.hasChanged??W)(a,t)||s.useDefault&&s.reflect&&a===((r=this._$Ej)==null?void 0:r.get(e))&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:o},a){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,a??t??this[e]),o!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,a]of this._$Ep)this[o]=a;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,a]of r){const{wrapped:l}=a,n=this[o];l!==!0||this._$AL.has(o)||n===void 0||this.C(o,void 0,a,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[F("elementProperties")]=new Map,x[F("finalized")]=new Map,D==null||D({ReactiveElement:x}),(v.reactiveElementVersions??(v.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const k=globalThis,z=k.trustedTypes,X=z?z.createPolicy("lit-html",{createHTML:i=>i}):void 0,ne="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,le="?"+y,Ae=`<${le}>`,S=document,U=()=>S.createComment(""),T=i=>i===null||typeof i!="object"&&typeof i!="function",Y=Array.isArray,we=i=>Y(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",j=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ee=/-->/g,te=/>/g,_=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),re=/'/g,se=/"/g,ce=/^(?:script|style|textarea|title)$/i,Se=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),d=Se(1),E=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),ie=new WeakMap,A=S.createTreeWalker(S,129);function he(i,e){if(!Y(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return X!==void 0?X.createHTML(e):e}const xe=(i,e)=>{const t=i.length-1,s=[];let r,o=e===2?"<svg>":e===3?"<math>":"",a=P;for(let l=0;l<t;l++){const n=i[l];let h,u,c=-1,$=0;for(;$<n.length&&(a.lastIndex=$,u=a.exec(n),u!==null);)$=a.lastIndex,a===P?u[1]==="!--"?a=ee:u[1]!==void 0?a=te:u[2]!==void 0?(ce.test(u[2])&&(r=RegExp("</"+u[2],"g")),a=_):u[3]!==void 0&&(a=_):a===_?u[0]===">"?(a=r??P,c=-1):u[1]===void 0?c=-2:(c=a.lastIndex-u[2].length,h=u[1],a=u[3]===void 0?_:u[3]==='"'?se:re):a===se||a===re?a=_:a===ee||a===te?a=P:(a=_,r=void 0);const b=a===_&&i[l+1].startsWith("/>")?" ":"";o+=a===P?n+Ae:c>=0?(s.push(h),n.slice(0,c)+ne+n.slice(c)+y+b):n+y+(c===-2?l:b)}return[he(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class N{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let o=0,a=0;const l=e.length-1,n=this.parts,[h,u]=xe(e,t);if(this.el=N.createElement(h,s),A.currentNode=this.el.content,t===2||t===3){const c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=A.nextNode())!==null&&n.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const c of r.getAttributeNames())if(c.endsWith(ne)){const $=u[a++],b=r.getAttribute(c).split(y),H=/([.?@])?(.*)/.exec($);n.push({type:1,index:o,name:H[2],strings:b,ctor:H[1]==="."?Ce:H[1]==="?"?Pe:H[1]==="@"?Fe:B}),r.removeAttribute(c)}else c.startsWith(y)&&(n.push({type:6,index:o}),r.removeAttribute(c));if(ce.test(r.tagName)){const c=r.textContent.split(y),$=c.length-1;if($>0){r.textContent=z?z.emptyScript:"";for(let b=0;b<$;b++)r.append(c[b],U()),A.nextNode(),n.push({type:2,index:++o});r.append(c[$],U())}}}else if(r.nodeType===8)if(r.data===le)n.push({type:2,index:o});else{let c=-1;for(;(c=r.data.indexOf(y,c+1))!==-1;)n.push({type:7,index:o}),c+=y.length-1}o++}}static createElement(e,t){const s=S.createElement("template");return s.innerHTML=e,s}}function C(i,e,t=i,s){var a,l;if(e===E)return e;let r=s!==void 0?(a=t._$Co)==null?void 0:a[s]:t._$Cl;const o=T(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=r:t._$Cl=r),r!==void 0&&(e=C(i,r._$AS(i,e.values),r,s)),e}class Ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,r=((e==null?void 0:e.creationScope)??S).importNode(t,!0);A.currentNode=r;let o=A.nextNode(),a=0,l=0,n=s[0];for(;n!==void 0;){if(a===n.index){let h;n.type===2?h=new M(o,o.nextSibling,this,e):n.type===1?h=new n.ctor(o,n.name,n.strings,this,e):n.type===6&&(h=new ke(o,this,e)),this._$AV.push(h),n=s[++l]}a!==(n==null?void 0:n.index)&&(o=A.nextNode(),a++)}return A.currentNode=S,r}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class M{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,r){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),T(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==E&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):we(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){var o;const{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=N.createElement(he(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(t);else{const a=new Ee(r,this),l=a.u(this.options);a.p(t),this.T(l),this._$AH=a}}_$AC(e){let t=ie.get(e.strings);return t===void 0&&ie.set(e.strings,t=new N(e)),t}k(e){Y(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,r=0;for(const o of e)r===t.length?t.push(s=new M(this.O(U()),this.O(U()),this,this.options)):s=t[r],s._$AI(o),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){const r=e.nextSibling;e.remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class B{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,t=this,s,r){const o=this.strings;let a=!1;if(o===void 0)e=C(this,e,t,0),a=!T(e)||e!==this._$AH&&e!==E,a&&(this._$AH=e);else{const l=e;let n,h;for(e=o[0],n=0;n<o.length-1;n++)h=C(this,l[s+n],t,n),h===E&&(h=this._$AH[n]),a||(a=!T(h)||h!==this._$AH[n]),h===p?e=p:e!==p&&(e+=(h??"")+o[n+1]),this._$AH[n]=h}a&&!r&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Ce extends B{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}}class Pe extends B{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}}class Fe extends B{constructor(e,t,s,r,o){super(e,t,s,r,o),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??p)===E)return;const s=this._$AH,r=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==p&&(s===p||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class ke{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}}const I=k.litHtmlPolyfillSupport;I==null||I(N,M),(k.litHtmlVersions??(k.litHtmlVersions=[])).push("3.3.1");const Oe=(i,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let r=s._$litPart$;if(r===void 0){const o=(t==null?void 0:t.renderBefore)??null;s._$litPart$=r=new M(e.insertBefore(U(),o),o,void 0,t??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const w=globalThis;class O extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Oe(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return E}}var oe;O._$litElement$=!0,O.finalized=!0,(oe=w.litElementHydrateSupport)==null||oe.call(w,{LitElement:O});const G=w.litElementPolyfillSupport;G==null||G({LitElement:O});(w.litElementVersions??(w.litElementVersions=[])).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ue=i=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(i,e)}):customElements.define(i,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Te={attribute:!0,type:String,converter:R,reflect:!1,hasChanged:W},Ne=(i=Te,e,t)=>{const{kind:s,metadata:r}=t;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(t.name,i),s==="accessor"){const{name:a}=t;return{set(l){const n=e.get.call(this);e.set.call(this,l),this.requestUpdate(a,n,i)},init(l){return l!==void 0&&this.C(a,void 0,i,l),l}}}if(s==="setter"){const{name:a}=t;return function(l){const n=this[a];e.call(this,l),this.requestUpdate(a,n,i)}}throw Error("Unsupported decorator location: "+s)};function de(i){return(e,t)=>typeof t=="object"?Ne(i,e,t):((s,r,o)=>{const a=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),a?Object.getOwnPropertyDescriptor(r,o):void 0})(i,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function m(i){return de({...i,state:!0,attribute:!1})}var Me=Object.defineProperty,He=Object.getOwnPropertyDescriptor,g=(i,e,t,s)=>{for(var r=s>1?void 0:s?He(e,t):e,o=i.length-1,a;o>=0;o--)(a=i[o])&&(r=(s?a(e,t,r):a(r))||r);return s&&r&&Me(e,t,r),r};let f=class extends O{constructor(){super(...arguments),this.apiEndpoint="/.netlify/functions/reading-list",this.books=[],this.filteredBooks=[],this.loading=!1,this.error="",this.searchTerm="",this.statusFilter="",this.seriesFilter="",this.yearFilter="",this.gradeFilter=""}async connectedCallback(){super.connectedCallback(),await this.fetchBooks()}async fetchBooks(){this.loading=!0,this.error="";try{const i=await fetch(this.apiEndpoint);if(!i.ok)throw new Error(`HTTP error! status: ${i.status}`);const e=await i.json();if(e.error)throw new Error(e.error);this.books=e.books||[],this.filteredBooks=[...this.books]}catch(i){this.error=`Failed to load reading list: ${i instanceof Error?i.message:"Unknown error"}`,console.error("Error fetching books:",i)}finally{this.loading=!1}}formatDate(i){if(!i)return null;try{const e=new Date(i);return isNaN(e.getTime())?i:e.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return i}}renderGrade(i){if(!i)return d`<span class="not-applicable">—</span>`;const e=i.charAt(0).toLowerCase();return d`<span class="grade-badge grade-${e}"
      >${i}</span
    >`}renderFinishedDate(i,e){return i?d`<span class="completion-date">${this.formatDate(i)}</span>`:e==="finished"?d`<span class="not-applicable">No date</span>`:d`<span class="not-applicable">—</span>`}getAvailableSeries(){return[...new Set(this.books.map(e=>e.series).filter(e=>!!e))].sort()}getAvailableYears(){return[...new Set(this.books.map(e=>e.year).filter(e=>typeof e=="number"))].sort((e,t)=>t-e)}getAvailableStatuses(){return["Finished","Ah Naw","Reading","Not started","Maybe Later"]}getAvailableGrades(){const i=new Set;return this.books.map(t=>t.grade).filter(t=>!!(t!=null&&t.trim())).forEach(t=>{i.add(t.toUpperCase())}),Array.from(i).sort((t,s)=>{const r=o=>{const a=o.charAt(0).toUpperCase(),l=o.slice(1);let n=0;switch(a){case"A":n=400;break;case"B":n=300;break;case"C":n=200;break;case"D":n=100;break;case"F":n=0;break;default:n=-100}return l==="+"?n+=30:l==="-"&&(n-=30),n};return r(s)-r(t)})}applyFilters(){this.filteredBooks=this.books.filter(i=>{var a,l;const e=!this.searchTerm||i.name.toLowerCase().includes(this.searchTerm.toLowerCase())||i.author.toLowerCase().includes(this.searchTerm.toLowerCase())||i.series&&i.series.toLowerCase().includes(this.searchTerm.toLowerCase()),t=!this.statusFilter||i.status===this.statusFilter,s=!this.seriesFilter||i.series===this.seriesFilter,r=!this.yearFilter||((a=i.year)==null?void 0:a.toString())===this.yearFilter,o=!this.gradeFilter||((l=i.grade)==null?void 0:l.toUpperCase())===this.gradeFilter;return e&&t&&s&&r&&o})}handleSearch(i){const e=i.target;this.searchTerm=e.value,this.applyFilters()}handleStatusFilter(i){const e=i.target;this.statusFilter=e.value,this.applyFilters()}handleSeriesFilter(i){const e=i.target;this.seriesFilter=e.value,this.applyFilters()}handleYearFilter(i){const e=i.target;this.yearFilter=e.value,this.applyFilters()}handleGradeFilter(i){const e=i.target;this.gradeFilter=e.value,this.applyFilters()}clearAllFilters(){this.searchTerm="",this.statusFilter="",this.yearFilter="",this.gradeFilter="",this.seriesFilter="",this.applyFilters()}renderFilters(){const i=this.getAvailableSeries(),e=this.getAvailableYears(),t=this.getAvailableStatuses(),s=this.getAvailableGrades();return d`
      <div class="filters">
        <div class="filter-group">
          <label for="search">Search Books</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, author, or series..."
            .value=${this.searchTerm}
            @input=${this.handleSearch}
          />
        </div>
        <div class="filter-group">
          <label for="status-filter">Filter by Status</label>
          <select
            id="status-filter"
            .value=${this.statusFilter}
            @change=${this.handleStatusFilter}
          >
            <option value="">All Statuses</option>
            ${t.map(r=>d`<option value="${r}">${r}</option>`)}
          </select>
        </div>
        <div class="filter-group">
          <label for="year-filter">Filter by Year</label>
          <select
            id="year-filter"
            .value=${this.yearFilter}
            @change=${this.handleYearFilter}
          >
            <option value="">All Years</option>
            ${e.map(r=>d`<option value="${r}">${r}</option>`)}
          </select>
        </div>
        <div class="filter-group">
          <label for="grade-filter">Filter by Grade</label>
          <select
            id="grade-filter"
            .value=${this.gradeFilter}
            @change=${this.handleGradeFilter}
          >
            <option value="">All Grades</option>
            ${s.map(r=>d`<option value="${r}">${r}</option>`)}
          </select>
        </div>
        <div class="filter-group">
          <label for="series-filter">Filter by Series</label>
          <select
            id="series-filter"
            .value=${this.seriesFilter}
            @change=${this.handleSeriesFilter}
          >
            <option value="">All Series</option>
            ${i.map(r=>d`<option value="${r}">${r}</option>`)}
          </select>
        </div>
        <div class="filter-group">
          <button 
            class="clear-filters-btn"
            @click=${this.clearAllFilters}
            type="button"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    `}renderTable(){return this.filteredBooks.length===0?d`
        <div class="no-results">No books found matching your filters.</div>
      `:d`
      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Series</th>
            <th>Status</th>
            <th>Year</th>
            <th>Finished</th>
            <th>Grade</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${this.filteredBooks.map(i=>d`
              <tr>
                <td>
                  <div class="book-title">${i.name}</div>
                  <div class="book-author">by ${i.author}</div>
                </td>
                <td>
                  ${i.series?d`<span class="series-badge">${i.series}</span>`:d`<span class="not-applicable">—</span>`}
                </td>
                <td>
                  <span class="status-badge status-${i.status.toLowerCase().replace(/\s+/g,"-")}">
                    ${i.status}
                  </span>
                </td>
                <td>
                  ${i.year?d`<span class="year-badge">${i.year}</span>`:d`<span class="not-applicable">—</span>`}
                </td>
                <td>${this.renderFinishedDate(i.finished,i.status)}</td>
                <td>${this.renderGrade(i.grade)}</td>
                <td>
                  ${i.notes||d`<span class="not-applicable">—</span>`}
                </td>
              </tr>
            `)}
        </tbody>
      </table>
    `}render(){return this.loading?d`
        <div class="loading">
          <p>Loading reading list...</p>
        </div>
      `:this.error?d`
        <div class="error">
          <p>${this.error}</p>
        </div>
      `:d`
      <div class="container">
        ${this.renderFilters()}

        <div class="table-container">${this.renderTable()}</div>
      </div>
    `}};f.styles=ue`
    :host {
      --primary-color: #2563eb;
      --text-color: #1f2937;
      --text-secondary: #6b7280;
      --border-color: #e5e7eb;
      --bg-color: #ffffff;
      --bg-hover: #f9fafb;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --danger-color: #ef4444;

      display: block;
      font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
        Arial, sans-serif;
      line-height: 1.6;
      color: var(--text-color);
    }

    * {
      box-sizing: border-box;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2.5rem;
      margin: 0 0 1rem 0;
      font-weight: 300;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin: 0;
    }

    .loading,
    .error {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .error {
      color: var(--danger-color);
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 12px;
    }

    .filters {
      background: var(--bg-color);
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .filter-group input,
    .filter-group select {
      padding: 0.75rem 1rem;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .filter-group input:focus,
    .filter-group select:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .clear-filters-btn {
      padding: 0.75rem 1rem;
      background-color: var(--text-secondary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      align-self: end;
    }

    .clear-filters-btn:hover {
      background-color: var(--text-color);
    }

    .clear-filters-btn:focus {
      outline: none;
      background-color: var(--primary-color);
    }

    .table-container {
      background: var(--bg-color);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      background: var(--bg-hover);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.025em;
      border-bottom: 2px solid var(--border-color);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      vertical-align: top;
    }

    tbody tr:hover {
      background-color: var(--bg-hover);
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .status-badge {
      display: inline-block;
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: lowercase;
    }

    .status-reading {
      background-color: #dbeafe;
      color: #1d4ed8;
    }

    .status-finished {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-ah.naw, .status-ah-naw {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .status-not.started, .status-not-started {
      background-color: #f3f4f6;
      color: #374151;
    }

    .status-maybe.later, .status-maybe-later {
      background-color: #fef3c7;
      color: #92400e;
    }

    .book-title {
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 0.25rem;
    }

    .book-author {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .series-badge {
      background-color: var(--bg-hover);
      color: var(--text-secondary);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-style: italic;
    }

    .year-badge {
      background-color: var(--primary-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .grade-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-align: center;
      min-width: 2rem;
      text-transform: uppercase;
    }

    .grade-a {
      background-color: #d1fae5;
      color: #065f46;
    }

    .grade-b {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .grade-c {
      background-color: #fef3c7;
      color: #92400e;
    }

    .grade-d {
      background-color: #fed7aa;
      color: #c2410c;
    }

    .grade-f {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .completion-date {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .not-applicable {
      color: #9ca3af;
      font-style: italic;
      font-size: 0.875rem;
    }

    .no-results {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      h1 {
        font-size: 2rem;
      }

      .filters {
        grid-template-columns: 1fr;
      }

      .table-container {
        overflow-x: auto;
      }

      table {
        min-width: 800px;
      }
    }
  `;g([de({attribute:"api-endpoint"})],f.prototype,"apiEndpoint",2);g([m()],f.prototype,"books",2);g([m()],f.prototype,"filteredBooks",2);g([m()],f.prototype,"loading",2);g([m()],f.prototype,"error",2);g([m()],f.prototype,"searchTerm",2);g([m()],f.prototype,"statusFilter",2);g([m()],f.prototype,"seriesFilter",2);g([m()],f.prototype,"yearFilter",2);g([m()],f.prototype,"gradeFilter",2);f=g([Ue("reading-list")],f);

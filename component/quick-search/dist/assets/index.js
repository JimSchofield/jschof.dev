(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce(((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1]),e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:f,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,h=globalThis,g=h.trustedTypes,_=g?g.emptyScript:``,v=h.reactiveElementPolyfillSupport,y=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},x=(e,t)=>!l(e,t),S={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:x};Symbol.metadata??=Symbol(`metadata`),h.litPropertyMetadata??=new WeakMap;var C=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=S){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get(){return r?.call(this)},set(t){let a=r?.call(this);i.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??S}static _$Ei(){if(this.hasOwnProperty(y(`elementProperties`)))return;let e=m(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y(`properties`))){let e=this.properties,t=[...f(e),...p(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$EC(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?b:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?b:e.converter;this._$Em=r,this[r]=i.fromAttribute(t,e.type),this._$Em=null}}requestUpdate(e,t,n){if(e!==void 0){if(n??=this.constructor.getPropertyOptions(e),!(n.hasChanged??x)(this[e],t))return;this.P(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(e,t,n){this._$AL.has(e)||this._$AL.set(e,t),!0===n.reflect&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e)!0!==n.wrapped||this._$AL.has(t)||this[t]===void 0||this.P(t,this[t],n)}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EU()}catch(t){throw e=!1,this._$EU(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach((e=>this._$EC(e,this[e]))),this._$EU()}updated(e){}firstUpdated(e){}};C.elementStyles=[],C.shadowRootOptions={mode:`open`},C[y(`elementProperties`)]=new Map,C[y(`finalized`)]=new Map,v?.({ReactiveElement:C}),(h.reactiveElementVersions??=[]).push(`2.0.4`);var ee=globalThis,w=ee.trustedTypes,te=w?w.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,T=`$lit$`,E=`lit$${Math.random().toFixed(9).slice(2)}$`,D=`?`+E,ne=`<${D}>`,O=document,k=()=>O.createComment(``),A=e=>e===null||typeof e!=`object`&&typeof e!=`function`,j=Array.isArray,re=e=>j(e)||typeof e?.[Symbol.iterator]==`function`,ie=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ae=/-->/g,oe=/>/g,N=RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),se=/'/g,ce=/"/g,le=/^(?:script|style|textarea|title)$/i,P=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),F=Symbol.for(`lit-noChange`),I=Symbol.for(`lit-nothing`),ue=new WeakMap,L=O.createTreeWalker(O,129);function de(e,t){if(!j(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return te===void 0?t:te.createHTML(t)}var fe=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=M;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===M?c[1]===`!--`?o=ae:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=N):(le.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=N):o=oe:o===N?c[0]===`>`?(o=i??M,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?N:c[3]===`"`?ce:se):o===ce||o===se?o=N:o===ae||o===oe?o=M:(o=N,i=void 0);let d=o===N&&e[t+1].startsWith(`/>`)?` `:``;a+=o===M?n+ne:l>=0?(r.push(s),n.slice(0,l)+T+n.slice(l)+E+d):n+E+(l===-2?t:d)}return[de(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},pe=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=fe(t,n);if(this.el=e.createElement(l,r),L.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=L.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(T)){let t=u[o++],n=i.getAttribute(e).split(E),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?he:r[1]===`?`?ge:r[1]===`@`?_e:B}),i.removeAttribute(e)}else e.startsWith(E)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(le.test(i.tagName)){let e=i.textContent.split(E),t=e.length-1;if(t>0){i.textContent=w?w.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],k()),L.nextNode(),c.push({type:2,index:++a});i.append(e[t],k())}}}else if(i.nodeType===8)if(i.data===D)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(E,e+1))!==-1;)c.push({type:7,index:a}),e+=E.length-1}a++}}static createElement(e,t){let n=O.createElement(`template`);return n.innerHTML=e,n}};function R(e,t,n=e,r){if(t===F)return t;let i=r===void 0?n.l:n.o?.[r],a=A(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n.l=i:(n.o??=[])[r]=i),i!==void 0&&(t=R(e,i._$AS(e,t.values),i,r)),t}var me=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??O).importNode(t,!0);L.currentNode=r;let i=L.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new z(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new ve(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=L.nextNode(),a++)}return L.currentNode=O,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},z=class e{get _$AU(){return this._$AM?._$AU??this.v}constructor(e,t,n,r){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this.v=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=R(this,e,t),A(e)?e===I||e==null||e===``?(this._$AH!==I&&this._$AR(),this._$AH=I):e!==this._$AH&&e!==F&&this._(e):e._$litType$===void 0?e.nodeType===void 0?re(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==I&&A(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=pe.createElement(de(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new me(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=ue.get(e.strings);return t===void 0&&ue.set(e.strings,t=new pe(e)),t}k(t){j(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(k()),this.O(k()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){let t=e.nextSibling;e.remove(),e=t}}setConnected(e){this._$AM===void 0&&(this.v=e,this._$AP?.(e))}},B=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=I,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=I}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=R(this,e,t,0),a=!A(e)||e!==this._$AH&&e!==F,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=R(this,r[n+o],t,o),s===F&&(s=this._$AH[o]),a||=!A(s)||s!==this._$AH[o],s===I?e=I:e!==I&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},he=class extends B{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===I?void 0:e}},ge=class extends B{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==I)}},_e=class extends B{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=R(this,e,t,0)??I)===F)return;let n=this._$AH,r=e===I&&n!==I||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==I&&(n===I||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ve=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){R(this,e)}},ye={M:T,P:E,A:D,C:1,L:fe,R:me,D:re,V:R,I:z,H:B,N:ge,U:_e,B:he,F:ve},be=ee.litHtmlPolyfillSupport;be?.(pe,z),(ee.litHtmlVersions??=[]).push(`3.2.0`);var xe=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new z(t.insertBefore(k(),e),e,void 0,n??{})}return i._$AI(e),i},V=class extends C{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this.o=xe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.o?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.o?.setConnected(!1)}render(){return F}};V._$litElement$=!0,V.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:V});var Se=globalThis.litElementPolyfillSupport;Se?.({LitElement:V}),(globalThis.litElementVersions??=[]).push(`4.1.0`);var Ce=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer((()=>{customElements.define(e,t)}))},we={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:x},Te=(e=we,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e)},init(t){return t!==void 0&&this.P(r,void 0,e),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e)}}throw Error(`Unsupported decorator location: `+r)};function Ee(e){return(t,n)=>typeof n==`object`?Te(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,r?{...e,wrapped:!0}:e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function De(e){return Ee({...e,state:!0,attribute:!1})}var{I:Oe}=ye,ke=e=>e.strings===void 0,Ae={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},je=e=>(...t)=>({_$litDirective$:e,values:t}),Me=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this.t=e,this._$AM=t,this.i=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},H=(e,t)=>{let n=e._$AN;if(n===void 0)return!1;for(let e of n)e._$AO?.(t,!1),H(e,t);return!0},U=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Ne=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Ie(t)}};function Pe(e){this._$AN===void 0?this._$AM=e:(U(this),this._$AM=e,Ne(this))}function Fe(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let e=n;e<r.length;e++)H(r[e],!1),U(r[e]);else r!=null&&(H(r,!1),U(r));else H(this,e)}var Ie=e=>{e.type==Ae.CHILD&&(e._$AP??=Fe,e._$AQ??=Pe)},Le=class extends Me{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),Ne(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(H(this,e),U(this))}setValue(e){if(ke(this.t))this.t._$AI(e,this);else{let t=[...this.t._$AH];t[this.i]=e,this.t._$AI(t,this,0)}}disconnected(){}reconnected(){}},Re=()=>new ze,ze=class{},Be=new WeakMap,Ve=je(class extends Le{render(e){return I}update(e,[t]){let n=t!==this.Y;return n&&this.Y!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.Y=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),I}rt(e){if(this.isConnected||(e=void 0),typeof this.Y==`function`){let t=this.ht??globalThis,n=Be.get(t);n===void 0&&(n=new WeakMap,Be.set(t,n)),n.get(this.Y)!==void 0&&this.Y.call(this.ht,void 0),n.set(this.Y,e),e!==void 0&&this.Y.call(this.ht,e)}else this.Y.value=e}get lt(){return typeof this.Y==`function`?Be.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function*He(e,t){if(e!==void 0){let n=0;for(let r of e)yield t(r,n++)}}var Ue=Symbol(),We=class{get taskComplete(){return this.t||(this.i===1?this.t=new Promise(((e,t)=>{this.o=e,this.h=t})):this.i===3?this.t=Promise.reject(this.l):this.t=Promise.resolve(this.u)),this.t}constructor(e,t,n){this.p=0,this.i=0,(this._=e).addController(this);let r=typeof t==`object`?t:{task:t,args:n};this.v=r.task,this.j=r.args,this.m=r.argsEqual??Ge,this.k=r.onComplete,this.A=r.onError,this.autoRun=r.autoRun??!0,`initialValue`in r&&(this.u=r.initialValue,this.i=2,this.O=this.T?.())}hostUpdate(){!0===this.autoRun&&this.S()}hostUpdated(){this.autoRun===`afterUpdate`&&this.S()}T(){if(this.j===void 0)return;let e=this.j();if(!Array.isArray(e))throw Error(`The args function must return an array`);return e}async S(){let e=this.T(),t=this.O;this.O=e,e===t||e===void 0||t!==void 0&&this.m(t,e)||await this.run(e)}async run(e){let t,n;e??=this.T(),this.O=e,this.i===1?this.q?.abort():(this.t=void 0,this.o=void 0,this.h=void 0),this.i=1,this.autoRun===`afterUpdate`?queueMicrotask((()=>this._.requestUpdate())):this._.requestUpdate();let r=++this.p;this.q=new AbortController;let i=!1;try{t=await this.v(e,{signal:this.q.signal})}catch(e){i=!0,n=e}if(this.p===r){if(t===Ue)this.i=0;else{if(!1===i){try{this.k?.(t)}catch{}this.i=2,this.o?.(t)}else{try{this.A?.(n)}catch{}this.i=3,this.h?.(n)}this.u=t,this.l=n}this._.requestUpdate()}}abort(e){this.i===1&&this.q?.abort(e)}get value(){return this.u}get error(){return this.l}get status(){return this.i}render(e){switch(this.i){case 0:return e.initial?.();case 1:return e.pending?.();case 2:return e.complete?.(this.value);case 3:return e.error?.(this.error);default:throw Error(`Unexpected status: `+this.i)}}},Ge=(e,t)=>e===t||e.length===t.length&&e.every(((e,n)=>!x(e,t[n])));function W(e){return Array.isArray?Array.isArray(e):$e(e)===`[object Array]`}var Ke=1/0;function qe(e){if(typeof e==`string`)return e;let t=e+``;return t==`0`&&1/e==-Ke?`-0`:t}function Je(e){return e==null?``:qe(e)}function G(e){return typeof e==`string`}function Ye(e){return typeof e==`number`}function Xe(e){return e===!0||e===!1||Qe(e)&&$e(e)==`[object Boolean]`}function Ze(e){return typeof e==`object`}function Qe(e){return Ze(e)&&e!==null}function K(e){return e!=null}function q(e){return!e.trim().length}function $e(e){return e==null?e===void 0?`[object Undefined]`:`[object Null]`:Object.prototype.toString.call(e)}var et=`Incorrect 'index' type`,tt=e=>`Invalid value for key ${e}`,nt=e=>`Pattern length exceeds max of ${e}.`,rt=e=>`Missing ${e} property in key`,it=e=>`Property 'weight' in key '${e}' must be a positive integer`,at=Object.prototype.hasOwnProperty,ot=class{constructor(e){this._keys=[],this._keyMap={};let t=0;e.forEach(e=>{let n=st(e);this._keys.push(n),this._keyMap[n.id]=n,t+=n.weight}),this._keys.forEach(e=>{e.weight/=t})}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}};function st(e){let t=null,n=null,r=null,i=1,a=null;if(G(e)||W(e))r=e,t=ct(e),n=lt(e);else{if(!at.call(e,`name`))throw Error(rt(`name`));let o=e.name;if(r=o,at.call(e,`weight`)&&(i=e.weight,i<=0))throw Error(it(o));t=ct(o),n=lt(o),a=e.getFn}return{path:t,id:n,weight:i,src:r,getFn:a}}function ct(e){return W(e)?e:e.split(`.`)}function lt(e){return W(e)?e.join(`.`):e}function ut(e,t){let n=[],r=!1,i=(e,t,a)=>{if(K(e))if(!t[a])n.push(e);else{let o=e[t[a]];if(!K(o))return;if(a===t.length-1&&(G(o)||Ye(o)||Xe(o)))n.push(Je(o));else if(W(o)){r=!0;for(let e=0,n=o.length;e<n;e+=1)i(o[e],t,a+1)}else t.length&&i(o,t,a+1)}};return i(e,G(t)?t.split(`.`):t,0),r?n:n[0]}var dt={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},ft={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},pt={location:0,threshold:.6,distance:100},mt={useExtendedSearch:!1,getFn:ut,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1},J={...ft,...dt,...pt,...mt},ht=/[^ ]+/g;function gt(e=1,t=3){let n=new Map,r=10**t;return{get(t){let i=t.match(ht).length;if(n.has(i))return n.get(i);let a=1/i**(.5*e),o=parseFloat(Math.round(a*r)/r);return n.set(i,o),o},clear(){n.clear()}}}var _t=class{constructor({getFn:e=J.getFn,fieldNormWeight:t=J.fieldNormWeight}={}){this.norm=gt(t,3),this.getFn=e,this.isCreated=!1,this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach((e,t)=>{this._keysMap[e.id]=t})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,G(this.docs[0])?this.docs.forEach((e,t)=>{this._addString(e,t)}):this.docs.forEach((e,t)=>{this._addObject(e,t)}),this.norm.clear())}add(e){let t=this.size();G(e)?this._addString(e,t):this._addObject(e,t)}removeAt(e){this.records.splice(e,1);for(let t=e,n=this.size();t<n;t+=1)--this.records[t].i}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_addString(e,t){if(!K(e)||q(e))return;let n={v:e,i:t,n:this.norm.get(e)};this.records.push(n)}_addObject(e,t){let n={i:t,$:{}};this.keys.forEach((t,r)=>{let i=t.getFn?t.getFn(e):this.getFn(e,t.path);if(K(i)){if(W(i)){let e=[],t=[{nestedArrIndex:-1,value:i}];for(;t.length;){let{nestedArrIndex:n,value:r}=t.pop();if(K(r))if(G(r)&&!q(r)){let t={v:r,i:n,n:this.norm.get(r)};e.push(t)}else W(r)&&r.forEach((e,n)=>{t.push({nestedArrIndex:n,value:e})})}n.$[r]=e}else if(G(i)&&!q(i)){let e={v:i,n:this.norm.get(i)};n.$[r]=e}}}),this.records.push(n)}toJSON(){return{keys:this.keys,records:this.records}}};function vt(e,t,{getFn:n=J.getFn,fieldNormWeight:r=J.fieldNormWeight}={}){let i=new _t({getFn:n,fieldNormWeight:r});return i.setKeys(e.map(st)),i.setSources(t),i.create(),i}function yt(e,{getFn:t=J.getFn,fieldNormWeight:n=J.fieldNormWeight}={}){let{keys:r,records:i}=e,a=new _t({getFn:t,fieldNormWeight:n});return a.setKeys(r),a.setIndexRecords(i),a}function Y(e,{errors:t=0,currentLocation:n=0,expectedLocation:r=0,distance:i=J.distance,ignoreLocation:a=J.ignoreLocation}={}){let o=t/e.length;if(a)return o;let s=Math.abs(r-n);return i?o+s/i:s?1:o}function bt(e=[],t=J.minMatchCharLength){let n=[],r=-1,i=-1,a=0;for(let o=e.length;a<o;a+=1){let o=e[a];o&&r===-1?r=a:!o&&r!==-1&&(i=a-1,i-r+1>=t&&n.push([r,i]),r=-1)}return e[a-1]&&a-r>=t&&n.push([r,a-1]),n}var X=32;function xt(e,t,n,{location:r=J.location,distance:i=J.distance,threshold:a=J.threshold,findAllMatches:o=J.findAllMatches,minMatchCharLength:s=J.minMatchCharLength,includeMatches:c=J.includeMatches,ignoreLocation:l=J.ignoreLocation}={}){if(t.length>X)throw Error(nt(X));let u=t.length,d=e.length,f=Math.max(0,Math.min(r,d)),p=a,m=f,h=s>1||c,g=h?Array(d):[],_;for(;(_=e.indexOf(t,m))>-1;){let e=Y(t,{currentLocation:_,expectedLocation:f,distance:i,ignoreLocation:l});if(p=Math.min(e,p),m=_+u,h){let e=0;for(;e<u;)g[_+e]=1,e+=1}}m=-1;let v=[],y=1,b=u+d,x=1<<u-1;for(let r=0;r<u;r+=1){let a=0,s=b;for(;a<s;)Y(t,{errors:r,currentLocation:f+s,expectedLocation:f,distance:i,ignoreLocation:l})<=p?a=s:b=s,s=Math.floor((b-a)/2+a);b=s;let c=Math.max(1,f-s+1),_=o?d:Math.min(f+s,d)+u,S=Array(_+2);S[_+1]=(1<<r)-1;for(let a=_;a>=c;--a){let o=a-1,s=n[e.charAt(o)];if(h&&(g[o]=+!!s),S[a]=(S[a+1]<<1|1)&s,r&&(S[a]|=(v[a+1]|v[a])<<1|1|v[a+1]),S[a]&x&&(y=Y(t,{errors:r,currentLocation:o,expectedLocation:f,distance:i,ignoreLocation:l}),y<=p)){if(p=y,m=o,m<=f)break;c=Math.max(1,2*f-m)}}if(Y(t,{errors:r+1,currentLocation:f,expectedLocation:f,distance:i,ignoreLocation:l})>p)break;v=S}let S={isMatch:m>=0,score:Math.max(.001,y)};if(h){let e=bt(g,s);e.length?c&&(S.indices=e):S.isMatch=!1}return S}function St(e){let t={};for(let n=0,r=e.length;n<r;n+=1){let i=e.charAt(n);t[i]=(t[i]||0)|1<<r-n-1}return t}var Ct=class{constructor(e,{location:t=J.location,threshold:n=J.threshold,distance:r=J.distance,includeMatches:i=J.includeMatches,findAllMatches:a=J.findAllMatches,minMatchCharLength:o=J.minMatchCharLength,isCaseSensitive:s=J.isCaseSensitive,ignoreLocation:c=J.ignoreLocation}={}){if(this.options={location:t,threshold:n,distance:r,includeMatches:i,findAllMatches:a,minMatchCharLength:o,isCaseSensitive:s,ignoreLocation:c},this.pattern=s?e:e.toLowerCase(),this.chunks=[],!this.pattern.length)return;let l=(e,t)=>{this.chunks.push({pattern:e,alphabet:St(e),startIndex:t})},u=this.pattern.length;if(u>X){let e=0,t=u%X,n=u-t;for(;e<n;)l(this.pattern.substr(e,X),e),e+=X;if(t){let e=u-X;l(this.pattern.substr(e),e)}}else l(this.pattern,0)}searchIn(e){let{isCaseSensitive:t,includeMatches:n}=this.options;if(t||(e=e.toLowerCase()),this.pattern===e){let t={isMatch:!0,score:0};return n&&(t.indices=[[0,e.length-1]]),t}let{location:r,distance:i,threshold:a,findAllMatches:o,minMatchCharLength:s,ignoreLocation:c}=this.options,l=[],u=0,d=!1;this.chunks.forEach(({pattern:t,alphabet:f,startIndex:p})=>{let{isMatch:m,score:h,indices:g}=xt(e,t,f,{location:r+p,distance:i,threshold:a,findAllMatches:o,minMatchCharLength:s,includeMatches:n,ignoreLocation:c});m&&(d=!0),u+=h,m&&g&&(l=[...l,...g])});let f={isMatch:d,score:d?u/this.chunks.length:1};return d&&n&&(f.indices=l),f}},Z=class{constructor(e){this.pattern=e}static isMultiMatch(e){return wt(e,this.multiRegex)}static isSingleMatch(e){return wt(e,this.singleRegex)}search(){}};function wt(e,t){let n=e.match(t);return n?n[1]:null}var Tt=class extends Z{constructor(e){super(e)}static get type(){return`exact`}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(e){let t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}},Et=class extends Z{constructor(e){super(e)}static get type(){return`inverse-exact`}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(e){let t=e.indexOf(this.pattern)===-1;return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},Dt=class extends Z{constructor(e){super(e)}static get type(){return`prefix-exact`}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(e){let t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}},Ot=class extends Z{constructor(e){super(e)}static get type(){return`inverse-prefix-exact`}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(e){let t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},kt=class extends Z{constructor(e){super(e)}static get type(){return`suffix-exact`}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(e){let t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}},At=class extends Z{constructor(e){super(e)}static get type(){return`inverse-suffix-exact`}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(e){let t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},jt=class extends Z{constructor(e,{location:t=J.location,threshold:n=J.threshold,distance:r=J.distance,includeMatches:i=J.includeMatches,findAllMatches:a=J.findAllMatches,minMatchCharLength:o=J.minMatchCharLength,isCaseSensitive:s=J.isCaseSensitive,ignoreLocation:c=J.ignoreLocation}={}){super(e),this._bitapSearch=new Ct(e,{location:t,threshold:n,distance:r,includeMatches:i,findAllMatches:a,minMatchCharLength:o,isCaseSensitive:s,ignoreLocation:c})}static get type(){return`fuzzy`}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(e){return this._bitapSearch.searchIn(e)}},Mt=class extends Z{constructor(e){super(e)}static get type(){return`include`}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(e){let t=0,n,r=[],i=this.pattern.length;for(;(n=e.indexOf(this.pattern,t))>-1;)t=n+i,r.push([n,t-1]);let a=!!r.length;return{isMatch:a,score:a?0:1,indices:r}}},Nt=[Tt,Mt,Dt,Ot,At,kt,Et,jt],Pt=Nt.length,Ft=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,It=`|`;function Lt(e,t={}){return e.split(It).map(e=>{let n=e.trim().split(Ft).filter(e=>e&&!!e.trim()),r=[];for(let e=0,i=n.length;e<i;e+=1){let i=n[e],a=!1,o=-1;for(;!a&&++o<Pt;){let e=Nt[o],n=e.isMultiMatch(i);n&&(r.push(new e(n,t)),a=!0)}if(!a)for(o=-1;++o<Pt;){let e=Nt[o],n=e.isSingleMatch(i);if(n){r.push(new e(n,t));break}}}return r})}var Rt=new Set([jt.type,Mt.type]),zt=class{constructor(e,{isCaseSensitive:t=J.isCaseSensitive,includeMatches:n=J.includeMatches,minMatchCharLength:r=J.minMatchCharLength,ignoreLocation:i=J.ignoreLocation,findAllMatches:a=J.findAllMatches,location:o=J.location,threshold:s=J.threshold,distance:c=J.distance}={}){this.query=null,this.options={isCaseSensitive:t,includeMatches:n,minMatchCharLength:r,findAllMatches:a,ignoreLocation:i,location:o,threshold:s,distance:c},this.pattern=t?e:e.toLowerCase(),this.query=Lt(this.pattern,this.options)}static condition(e,t){return t.useExtendedSearch}searchIn(e){let t=this.query;if(!t)return{isMatch:!1,score:1};let{includeMatches:n,isCaseSensitive:r}=this.options;e=r?e:e.toLowerCase();let i=0,a=[],o=0;for(let r=0,s=t.length;r<s;r+=1){let s=t[r];a.length=0,i=0;for(let t=0,r=s.length;t<r;t+=1){let r=s[t],{isMatch:c,indices:l,score:u}=r.search(e);if(c){if(i+=1,o+=u,n){let e=r.constructor.type;Rt.has(e)?a=[...a,...l]:a.push(l)}}else{o=0,i=0,a.length=0;break}}if(i){let e={isMatch:!0,score:o/i};return n&&(e.indices=a),e}}return{isMatch:!1,score:1}}},Bt=[];function Vt(...e){Bt.push(...e)}function Ht(e,t){for(let n=0,r=Bt.length;n<r;n+=1){let r=Bt[n];if(r.condition(e,t))return new r(e,t)}return new Ct(e,t)}var Q={AND:`$and`,OR:`$or`},Ut={PATH:`$path`,PATTERN:`$val`},Wt=e=>!!(e[Q.AND]||e[Q.OR]),Gt=e=>!!e[Ut.PATH],Kt=e=>!W(e)&&Ze(e)&&!Wt(e),qt=e=>({[Q.AND]:Object.keys(e).map(t=>({[t]:e[t]}))});function Jt(e,t,{auto:n=!0}={}){let r=e=>{let i=Object.keys(e),a=Gt(e);if(!a&&i.length>1&&!Wt(e))return r(qt(e));if(Kt(e)){let r=a?e[Ut.PATH]:i[0],o=a?e[Ut.PATTERN]:e[r];if(!G(o))throw Error(tt(r));let s={keyId:lt(r),pattern:o};return n&&(s.searcher=Ht(o,t)),s}let o={children:[],operator:i[0]};return i.forEach(t=>{let n=e[t];W(n)&&n.forEach(e=>{o.children.push(r(e))})}),o};return Wt(e)||(e=qt(e)),r(e)}function Yt(e,{ignoreFieldNorm:t=J.ignoreFieldNorm}){e.forEach(e=>{let n=1;e.matches.forEach(({key:e,norm:r,score:i})=>{let a=e?e.weight:null;n*=(i===0&&a?2**-52:i)**+((a||1)*(t?1:r))}),e.score=n})}function Xt(e,t){let n=e.matches;t.matches=[],K(n)&&n.forEach(e=>{if(!K(e.indices)||!e.indices.length)return;let{indices:n,value:r}=e,i={indices:n,value:r};e.key&&(i.key=e.key.src),e.idx>-1&&(i.refIndex=e.idx),t.matches.push(i)})}function Zt(e,t){t.score=e.score}function Qt(e,t,{includeMatches:n=J.includeMatches,includeScore:r=J.includeScore}={}){let i=[];return n&&i.push(Xt),r&&i.push(Zt),e.map(e=>{let{idx:n}=e,r={item:t[n],refIndex:n};return i.length&&i.forEach(t=>{t(e,r)}),r})}var $=class{constructor(e,t={},n){this.options={...J,...t},this.options.useExtendedSearch,this._keyStore=new ot(this.options.keys),this.setCollection(e,n)}setCollection(e,t){if(this._docs=e,t&&!(t instanceof _t))throw Error(et);this._myIndex=t||vt(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(e){K(e)&&(this._docs.push(e),this._myIndex.add(e))}remove(e=()=>!1){let t=[];for(let n=0,r=this._docs.length;n<r;n+=1){let i=this._docs[n];e(i,n)&&(this.removeAt(n),--n,--r,t.push(i))}return t}removeAt(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}getIndex(){return this._myIndex}search(e,{limit:t=-1}={}){let{includeMatches:n,includeScore:r,shouldSort:i,sortFn:a,ignoreFieldNorm:o}=this.options,s=G(e)?G(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return Yt(s,{ignoreFieldNorm:o}),i&&s.sort(a),Ye(t)&&t>-1&&(s=s.slice(0,t)),Qt(s,this._docs,{includeMatches:n,includeScore:r})}_searchStringList(e){let t=Ht(e,this.options),{records:n}=this._myIndex,r=[];return n.forEach(({v:e,i:n,n:i})=>{if(!K(e))return;let{isMatch:a,score:o,indices:s}=t.searchIn(e);a&&r.push({item:e,idx:n,matches:[{score:o,value:e,norm:i,indices:s}]})}),r}_searchLogical(e){let t=Jt(e,this.options),n=(e,t,r)=>{if(!e.children){let{keyId:n,searcher:i}=e,a=this._findMatches({key:this._keyStore.get(n),value:this._myIndex.getValueForItemAtKeyId(t,n),searcher:i});return a&&a.length?[{idx:r,item:t,matches:a}]:[]}let i=[];for(let a=0,o=e.children.length;a<o;a+=1){let o=e.children[a],s=n(o,t,r);if(s.length)i.push(...s);else if(e.operator===Q.AND)return[]}return i},r=this._myIndex.records,i={},a=[];return r.forEach(({$:e,i:r})=>{if(K(e)){let o=n(t,e,r);o.length&&(i[r]||(i[r]={idx:r,item:e,matches:[]},a.push(i[r])),o.forEach(({matches:e})=>{i[r].matches.push(...e)}))}}),a}_searchObjectList(e){let t=Ht(e,this.options),{keys:n,records:r}=this._myIndex,i=[];return r.forEach(({$:e,i:r})=>{if(!K(e))return;let a=[];n.forEach((n,r)=>{a.push(...this._findMatches({key:n,value:e[r],searcher:t}))}),a.length&&i.push({idx:r,item:e,matches:a})}),i}_findMatches({key:e,value:t,searcher:n}){if(!K(t))return[];let r=[];if(W(t))t.forEach(({v:t,i,n:a})=>{if(!K(t))return;let{isMatch:o,score:s,indices:c}=n.searchIn(t);o&&r.push({score:s,key:e,value:t,idx:i,norm:a,indices:c})});else{let{v:i,n:a}=t,{isMatch:o,score:s,indices:c}=n.searchIn(i);o&&r.push({score:s,key:e,value:i,norm:a,indices:c})}return r}};$.version=`7.0.0`,$.createIndex=vt,$.parseIndex=yt,$.config=J,$.parseQuery=Jt,Vt(zt);function $t(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var en=class extends V{constructor(...e){super(...e),this.searchTerm=``,this.dataTask=new We(this,{task:async()=>{let e=await fetch(`/search-data.json`);if(!e.ok)throw Error(`HTTP ${e.status}`);let t=await e.json();return this.fuse=new $(t,{keys:[`title`,`categories`,`excerpt`],shouldSort:!0,includeScore:!0}),t},args:()=>[]}),this.open=()=>{this.#e.value?.showModal()},this.close=()=>{this.#e.value?.close()}}#e=Re();connectedCallback(){super.connectedCallback(),window.addEventListener(`keydown`,this.#t)}disconnectedCallback(){window.removeEventListener(`keydown`,this.#t)}get results(){return!this.searchTerm||!this.fuse||this.dataTask.status!==2?[]:this.fuse.search(this.searchTerm)}get hasResults(){return this.results.length>0}#t=e=>{let t=e.key===`k`&&e.getModifierState(`Meta`),n=e.key===`k`&&e.getModifierState(`Control`);(t||n)&&this.open()};#n=e=>{this.searchTerm=e.target.value};render(){return P`
      <dialog part="qs-dialog" ${Ve(this.#e)}>
        <div class="inner">
          <div class="controls">
            <input
              autofocus
              type="text"
              placeholder="Search for a page"
              part="qs-input"
              value=${this.searchTerm}
              @input=${this.#n}
            />
            <button class="close" @click=${this.close}>Close</button>
          </div>
          <hr part="qs-divider" />
          <div part="qs-results" class="results">
            ${this.dataTask.render({pending:()=>P`<div class="message">Loading search data...</div>`,error:e=>P`<div class="message error">
                  Search unavailable:
                  ${e instanceof Error?e.message:`Unknown error`}
                </div>`,complete:()=>this.hasResults?P`
                    <ul>
                      ${He(this.results,({item:e})=>P`<li>
                          <a part="qs-result" class="result" href=${e.url}>
                            <div part="qs-title" class="title">
                              ${e.title}
                            </div>
                            <div part="qs-excerpt" class="excerpt">
                              ${e.excerpt}
                            </div>
                            <div part="qs-categories" class="categories">
                              ${e.categories.map(e=>P`<span>${e}</span>`)}
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
    `}static{this.styles=o`
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
  `}};$t([De()],en.prototype,`searchTerm`,void 0),en=$t([Ce(`quick-search`)],en);
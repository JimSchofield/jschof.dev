(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1],e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:f,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,h=globalThis,g=h.trustedTypes,_=g?g.emptyScript:``,v=h.reactiveElementPolyfillSupport,y=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},x=(e,t)=>!l(e,t),ee={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol(`metadata`),h.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ee){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ee}static _$Ei(){if(this.hasOwnProperty(y(`elementProperties`)))return;let e=m(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y(`properties`))){let e=this.properties,t=[...f(e),...p(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?b:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?b:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n,r=!1,i){if(e!==void 0){let a=this.constructor;if(!1===r&&(i=this[e]),n??=a.getPropertyOptions(e),!((n.hasChanged??x)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:`open`},S[y(`elementProperties`)]=new Map,S[y(`finalized`)]=new Map,v?.({ReactiveElement:S}),(h.reactiveElementVersions??=[]).push(`2.1.2`);var C=globalThis,te=e=>e,w=C.trustedTypes,ne=w?w.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,re=`$lit$`,T=`lit$${Math.random().toFixed(9).slice(2)}$`,ie=`?`+T,ae=`<${ie}>`,E=document,D=()=>E.createComment(``),O=e=>e===null||typeof e!=`object`&&typeof e!=`function`,k=Array.isArray,oe=e=>k(e)||typeof e?.[Symbol.iterator]==`function`,se=`[ 	
\f\r]`,A=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ce=/-->/g,le=/>/g,j=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),ue=/'/g,de=/"/g,fe=/^(?:script|style|textarea|title)$/i,M=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),N=Symbol.for(`lit-noChange`),P=Symbol.for(`lit-nothing`),pe=new WeakMap,F=E.createTreeWalker(E,129);function me(e,t){if(!k(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return ne===void 0?t:ne.createHTML(t)}var he=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=A;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===A?c[1]===`!--`?o=ce:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=j):(fe.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=j):o=le:o===j?c[0]===`>`?(o=i??A,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?j:c[3]===`"`?de:ue):o===de||o===ue?o=j:o===ce||o===le?o=A:(o=j,i=void 0);let d=o===j&&e[t+1].startsWith(`/>`)?` `:``;a+=o===A?n+ae:l>=0?(r.push(s),n.slice(0,l)+re+n.slice(l)+T+d):n+T+(l===-2?t:d)}return[me(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},ge=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=he(t,n);if(this.el=e.createElement(l,r),F.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=F.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(re)){let t=u[o++],n=i.getAttribute(e).split(T),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?ve:r[1]===`?`?ye:r[1]===`@`?be:R}),i.removeAttribute(e)}else e.startsWith(T)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(fe.test(i.tagName)){let e=i.textContent.split(T),t=e.length-1;if(t>0){i.textContent=w?w.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],D()),F.nextNode(),c.push({type:2,index:++a});i.append(e[t],D())}}}else if(i.nodeType===8)if(i.data===ie)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(T,e+1))!==-1;)c.push({type:7,index:a}),e+=T.length-1}a++}}static createElement(e,t){let n=E.createElement(`template`);return n.innerHTML=e,n}};function I(e,t,n=e,r){if(t===N)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=O(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=I(e,i._$AS(e,t.values),i,r)),t}var _e=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??E).importNode(t,!0);F.currentNode=r;let i=F.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new L(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new xe(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=F.nextNode(),a++)}return F.currentNode=E,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},L=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=P,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),O(e)?e===P||e==null||e===``?(this._$AH!==P&&this._$AR(),this._$AH=P):e!==this._$AH&&e!==N&&this._(e):e._$litType$===void 0?e.nodeType===void 0?oe(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==P&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=ge.createElement(me(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new _e(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=pe.get(e.strings);return t===void 0&&pe.set(e.strings,t=new ge(e)),t}k(t){k(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(D()),this.O(D()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=te(e).nextSibling;te(e).remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=P,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=P}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=I(this,e,t,0),a=!O(e)||e!==this._$AH&&e!==N,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=I(this,r[n+o],t,o),s===N&&(s=this._$AH[o]),a||=!O(s)||s!==this._$AH[o],s===P?e=P:e!==P&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===P?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},ve=class extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===P?void 0:e}},ye=class extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==P)}},be=class extends R{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=I(this,e,t,0)??P)===N)return;let n=this._$AH,r=e===P&&n!==P||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==P&&(n===P||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},xe=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}},Se={M:re,P:T,A:ie,C:1,L:he,R:_e,D:oe,V:I,I:L,H:R,N:ye,U:be,B:ve,F:xe},Ce=C.litHtmlPolyfillSupport;Ce?.(ge,L),(C.litHtmlVersions??=[]).push(`3.3.2`);var we=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new L(t.insertBefore(D(),e),e,void 0,n??{})}return i._$AI(e),i},Te=globalThis,z=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=we(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return N}};z._$litElement$=!0,z.finalized=!0,Te.litElementHydrateSupport?.({LitElement:z});var Ee=Te.litElementPolyfillSupport;Ee?.({LitElement:z}),(Te.litElementVersions??=[]).push(`4.2.2`);var De=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Oe={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:x},ke=(e=Oe,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e,!0,n)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e,!0,n)}}throw Error(`Unsupported decorator location: `+r)};function Ae(e){return(t,n)=>typeof n==`object`?ke(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function je(e){return Ae({...e,state:!0,attribute:!1})}var{I:Me}=Se,Ne=e=>e.strings===void 0,Pe={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Fe=e=>(...t)=>({_$litDirective$:e,values:t}),Ie=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},B=(e,t)=>{let n=e._$AN;if(n===void 0)return!1;for(let e of n)e._$AO?.(t,!1),B(e,t);return!0},V=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},Le=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),Be(t)}};function Re(e){this._$AN===void 0?this._$AM=e:(V(this),this._$AM=e,Le(this))}function ze(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(r))for(let e=n;e<r.length;e++)B(r[e],!1),V(r[e]);else r!=null&&(B(r,!1),V(r));else B(this,e)}var Be=e=>{e.type==Pe.CHILD&&(e._$AP??=ze,e._$AQ??=Re)},Ve=class extends Ie{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),Le(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(B(this,e),V(this))}setValue(e){if(Ne(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}},He=()=>new Ue,Ue=class{},H=new WeakMap,We=Fe(class extends Ve{render(e){return P}update(e,[t]){let n=t!==this.G;return n&&this.G!==void 0&&this.rt(void 0),(n||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),P}rt(e){if(this.isConnected||(e=void 0),typeof this.G==`function`){let t=this.ht??globalThis,n=H.get(t);n===void 0&&(n=new WeakMap,H.set(t,n)),n.get(this.G)!==void 0&&this.G.call(this.ht,void 0),n.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G==`function`?H.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});function*Ge(e,t){if(e!==void 0){let n=0;for(let r of e)yield t(r,n++)}}var Ke=Symbol(),qe=class{get taskComplete(){return this.t||(this.i===1?this.t=new Promise(((e,t)=>{this.o=e,this.h=t})):this.i===3?this.t=Promise.reject(this.l):this.t=Promise.resolve(this.u)),this.t}constructor(e,t,n){this.p=0,this.i=0,(this._=e).addController(this);let r=typeof t==`object`?t:{task:t,args:n};this.v=r.task,this.j=r.args,this.m=r.argsEqual??Je,this.k=r.onComplete,this.A=r.onError,this.autoRun=r.autoRun??!0,`initialValue`in r&&(this.u=r.initialValue,this.i=2,this.O=this.T?.())}hostUpdate(){!0===this.autoRun&&this.S()}hostUpdated(){this.autoRun===`afterUpdate`&&this.S()}T(){if(this.j===void 0)return;let e=this.j();if(!Array.isArray(e))throw Error(`The args function must return an array`);return e}async S(){let e=this.T(),t=this.O;this.O=e,e===t||e===void 0||t!==void 0&&this.m(t,e)||await this.run(e)}async run(e){let t,n;e??=this.T(),this.O=e,this.i===1?this.q?.abort():(this.t=void 0,this.o=void 0,this.h=void 0),this.i=1,this.autoRun===`afterUpdate`?queueMicrotask((()=>this._.requestUpdate())):this._.requestUpdate();let r=++this.p;this.q=new AbortController;let i=!1;try{t=await this.v(e,{signal:this.q.signal})}catch(e){i=!0,n=e}if(this.p===r){if(t===Ke)this.i=0;else{if(!1===i){try{this.k?.(t)}catch{}this.i=2,this.o?.(t)}else{try{this.A?.(n)}catch{}this.i=3,this.h?.(n)}this.u=t,this.l=n}this._.requestUpdate()}}abort(e){this.i===1&&this.q?.abort(e)}get value(){return this.u}get error(){return this.l}get status(){return this.i}render(e){switch(this.i){case 0:return e.initial?.();case 1:return e.pending?.();case 2:return e.complete?.(this.value);case 3:return e.error?.(this.error);default:throw Error(`Unexpected status: `+this.i)}}},Je=(e,t)=>e===t||e.length===t.length&&e.every(((e,n)=>!x(e,t[n])));function U(e){return Array.isArray?Array.isArray(e):tt(e)===`[object Array]`}var Ye=1/0;function Xe(e){if(typeof e==`string`)return e;let t=e+``;return t==`0`&&1/e==-Ye?`-0`:t}function Ze(e){return e==null?``:Xe(e)}function W(e){return typeof e==`string`}function G(e){return typeof e==`number`}function Qe(e){return e===!0||e===!1||et(e)&&tt(e)==`[object Boolean]`}function $e(e){return typeof e==`object`}function et(e){return $e(e)&&e!==null}function K(e){return e!=null}function q(e){return!e.trim().length}function tt(e){return e==null?e===void 0?`[object Undefined]`:`[object Null]`:Object.prototype.toString.call(e)}var nt=`Incorrect 'index' type`,rt=e=>`Invalid value for key ${e}`,it=e=>`Pattern length exceeds max of ${e}.`,at=e=>`Missing ${e} property in key`,ot=e=>`Property 'weight' in key '${e}' must be a positive integer`,st=Object.prototype.hasOwnProperty,ct=class{constructor(e){this._keys=[],this._keyMap={};let t=0;e.forEach(e=>{let n=lt(e);this._keys.push(n),this._keyMap[n.id]=n,t+=n.weight}),this._keys.forEach(e=>{e.weight/=t})}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}};function lt(e){let t=null,n=null,r=null,i=1,a=null;if(W(e)||U(e))r=e,t=ut(e),n=dt(e);else{if(!st.call(e,`name`))throw Error(at(`name`));let o=e.name;if(r=o,st.call(e,`weight`)&&(i=e.weight,i<=0))throw Error(ot(o));t=ut(o),n=dt(o),a=e.getFn}return{path:t,id:n,weight:i,src:r,getFn:a}}function ut(e){return U(e)?e:e.split(`.`)}function dt(e){return U(e)?e.join(`.`):e}function ft(e,t){let n=[],r=!1,i=(e,t,a,o)=>{if(K(e))if(!t[a])n.push(o===void 0?e:{v:e,i:o});else{let s=e[t[a]];if(!K(s))return;if(a===t.length-1&&(W(s)||G(s)||Qe(s)))n.push(o===void 0?Ze(s):{v:Ze(s),i:o});else if(U(s)){r=!0;for(let e=0,n=s.length;e<n;e+=1)i(s[e],t,a+1,e)}else t.length&&i(s,t,a+1,o)}};return i(e,W(t)?t.split(`.`):t,0),r?n:n[0]}var pt={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},mt={isCaseSensitive:!1,ignoreDiacritics:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},ht={location:0,threshold:.6,distance:100},gt={useExtendedSearch:!1,getFn:ft,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1},J={...mt,...pt,...ht,...gt},_t=/[^ ]+/g;function vt(e=1,t=3){let n=new Map,r=10**t;return{get(t){let i=t.match(_t).length;if(n.has(i))return n.get(i);let a=1/i**(.5*e),o=parseFloat(Math.round(a*r)/r);return n.set(i,o),o},clear(){n.clear()}}}var yt=class{constructor({getFn:e=J.getFn,fieldNormWeight:t=J.fieldNormWeight}={}){this.norm=vt(t,3),this.getFn=e,this.isCreated=!1,this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach((e,t)=>{this._keysMap[e.id]=t})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,W(this.docs[0])?this.docs.forEach((e,t)=>{this._addString(e,t)}):this.docs.forEach((e,t)=>{this._addObject(e,t)}),this.norm.clear())}add(e){let t=this.size();W(e)?this._addString(e,t):this._addObject(e,t)}removeAt(e){this.records.splice(e,1);for(let t=e,n=this.size();t<n;t+=1)--this.records[t].i}removeAll(e){for(let t=e.length-1;t>=0;--t)this.records.splice(e[t],1);for(let e=0,t=this.records.length;e<t;e+=1)this.records[e].i=e}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_addString(e,t){if(!K(e)||q(e))return;let n={v:e,i:t,n:this.norm.get(e)};this.records.push(n)}_addObject(e,t){let n={i:t,$:{}};this.keys.forEach((t,r)=>{let i=t.getFn?t.getFn(e):this.getFn(e,t.path);if(K(i)){if(U(i)){let e=[];for(let t=0,n=i.length;t<n;t+=1){let n=i[t];if(K(n)){if(W(n)){if(!q(n)){let r={v:n,i:t,n:this.norm.get(n)};e.push(r)}}else if(W(n.v)&&!q(n.v)){let t={v:n.v,i:n.i,n:this.norm.get(n.v)};e.push(t)}}}n.$[r]=e}else if(W(i)&&!q(i)){let e={v:i,n:this.norm.get(i)};n.$[r]=e}}}),this.records.push(n)}toJSON(){return{keys:this.keys,records:this.records}}};function bt(e,t,{getFn:n=J.getFn,fieldNormWeight:r=J.fieldNormWeight}={}){let i=new yt({getFn:n,fieldNormWeight:r});return i.setKeys(e.map(lt)),i.setSources(t),i.create(),i}function xt(e,{getFn:t=J.getFn,fieldNormWeight:n=J.fieldNormWeight}={}){let{keys:r,records:i}=e,a=new yt({getFn:t,fieldNormWeight:n});return a.setKeys(r),a.setIndexRecords(i),a}function St(e=[],t=J.minMatchCharLength){let n=[],r=-1,i=-1,a=0;for(let o=e.length;a<o;a+=1){let o=e[a];o&&r===-1?r=a:!o&&r!==-1&&(i=a-1,i-r+1>=t&&n.push([r,i]),r=-1)}return e[a-1]&&a-r>=t&&n.push([r,a-1]),n}var Y=32;function Ct(e,t,n,{location:r=J.location,distance:i=J.distance,threshold:a=J.threshold,findAllMatches:o=J.findAllMatches,minMatchCharLength:s=J.minMatchCharLength,includeMatches:c=J.includeMatches,ignoreLocation:l=J.ignoreLocation}={}){if(t.length>Y)throw Error(it(Y));let u=t.length,d=e.length,f=Math.max(0,Math.min(r,d)),p=a,m=f,h=(e,t)=>{let n=e/u;if(l)return n;let r=Math.abs(f-t);return i?n+r/i:r?1:n},g=s>1||c,_=g?Array(d):[],v;for(;(v=e.indexOf(t,m))>-1;){let e=h(0,v);if(p=Math.min(e,p),m=v+u,g){let e=0;for(;e<u;)_[v+e]=1,e+=1}}m=-1;let y=[],b=1,x=u+d,ee=1<<u-1;for(let t=0;t<u;t+=1){let r=0,i=x;for(;r<i;)h(t,f+i)<=p?r=i:x=i,i=Math.floor((x-r)/2+r);x=i;let a=Math.max(1,f-i+1),s=o?d:Math.min(f+i,d)+u,c=Array(s+2);c[s+1]=(1<<t)-1;for(let r=s;r>=a;--r){let i=r-1,o=n[e[i]];if(g&&(_[i]=+!!o),c[r]=(c[r+1]<<1|1)&o,t&&(c[r]|=(y[r+1]|y[r])<<1|1|y[r+1]),c[r]&ee&&(b=h(t,i),b<=p)){if(p=b,m=i,m<=f)break;a=Math.max(1,2*f-m)}}if(h(t+1,f)>p)break;y=c}let S={isMatch:m>=0,score:Math.max(.001,b)};if(g){let e=St(_,s);e.length?c&&(S.indices=e):S.isMatch=!1}return S}function wt(e){let t={};for(let n=0,r=e.length;n<r;n+=1){let i=e.charAt(n);t[i]=(t[i]||0)|1<<r-n-1}return t}var X=String.prototype.normalize?(e=>e.normalize(`NFD`).replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g,``)):(e=>e);function Tt(e){if(e.length<=1)return e;e.sort((e,t)=>e[0]-t[0]||e[1]-t[1]);let t=[e[0]];for(let n=1,r=e.length;n<r;n+=1){let r=t[t.length-1],i=e[n];i[0]<=r[1]+1?r[1]=Math.max(r[1],i[1]):t.push(i)}return t}var Et=class{constructor(e,{location:t=J.location,threshold:n=J.threshold,distance:r=J.distance,includeMatches:i=J.includeMatches,findAllMatches:a=J.findAllMatches,minMatchCharLength:o=J.minMatchCharLength,isCaseSensitive:s=J.isCaseSensitive,ignoreDiacritics:c=J.ignoreDiacritics,ignoreLocation:l=J.ignoreLocation}={}){if(this.options={location:t,threshold:n,distance:r,includeMatches:i,findAllMatches:a,minMatchCharLength:o,isCaseSensitive:s,ignoreDiacritics:c,ignoreLocation:l},e=s?e:e.toLowerCase(),e=c?X(e):e,this.pattern=e,this.chunks=[],!this.pattern.length)return;let u=(e,t)=>{this.chunks.push({pattern:e,alphabet:wt(e),startIndex:t})},d=this.pattern.length;if(d>Y){let e=0,t=d%Y,n=d-t;for(;e<n;)u(this.pattern.substr(e,Y),e),e+=Y;if(t){let e=d-Y;u(this.pattern.substr(e),e)}}else u(this.pattern,0)}searchIn(e){let{isCaseSensitive:t,ignoreDiacritics:n,includeMatches:r}=this.options;if(e=t?e:e.toLowerCase(),e=n?X(e):e,this.pattern===e){let t={isMatch:!0,score:0};return r&&(t.indices=[[0,e.length-1]]),t}let{location:i,distance:a,threshold:o,findAllMatches:s,minMatchCharLength:c,ignoreLocation:l}=this.options,u=[],d=0,f=!1;this.chunks.forEach(({pattern:t,alphabet:n,startIndex:p})=>{let{isMatch:m,score:h,indices:g}=Ct(e,t,n,{location:i+p,distance:a,threshold:o,findAllMatches:s,minMatchCharLength:c,includeMatches:r,ignoreLocation:l});m&&(f=!0),d+=h,m&&g&&u.push(...g)});let p={isMatch:f,score:f?d/this.chunks.length:1};return f&&r&&(p.indices=Tt(u)),p}},Z=class{constructor(e){this.pattern=e}static isMultiMatch(e){return Dt(e,this.multiRegex)}static isSingleMatch(e){return Dt(e,this.singleRegex)}search(){}};function Dt(e,t){let n=e.match(t);return n?n[1]:null}var Ot=class extends Z{constructor(e){super(e)}static get type(){return`exact`}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(e){let t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}},kt=class extends Z{constructor(e){super(e)}static get type(){return`inverse-exact`}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(e){let t=e.indexOf(this.pattern)===-1;return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},At=class extends Z{constructor(e){super(e)}static get type(){return`prefix-exact`}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(e){let t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}},jt=class extends Z{constructor(e){super(e)}static get type(){return`inverse-prefix-exact`}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(e){let t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},Mt=class extends Z{constructor(e){super(e)}static get type(){return`suffix-exact`}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(e){let t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}},Nt=class extends Z{constructor(e){super(e)}static get type(){return`inverse-suffix-exact`}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(e){let t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}},Pt=class extends Z{constructor(e,{location:t=J.location,threshold:n=J.threshold,distance:r=J.distance,includeMatches:i=J.includeMatches,findAllMatches:a=J.findAllMatches,minMatchCharLength:o=J.minMatchCharLength,isCaseSensitive:s=J.isCaseSensitive,ignoreDiacritics:c=J.ignoreDiacritics,ignoreLocation:l=J.ignoreLocation}={}){super(e),this._bitapSearch=new Et(e,{location:t,threshold:n,distance:r,includeMatches:i,findAllMatches:a,minMatchCharLength:o,isCaseSensitive:s,ignoreDiacritics:c,ignoreLocation:l})}static get type(){return`fuzzy`}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(e){return this._bitapSearch.searchIn(e)}},Ft=class extends Z{constructor(e){super(e)}static get type(){return`include`}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(e){let t=0,n,r=[],i=this.pattern.length;for(;(n=e.indexOf(this.pattern,t))>-1;)t=n+i,r.push([n,t-1]);let a=!!r.length;return{isMatch:a,score:a?0:1,indices:r}}},It=[Ot,Ft,At,jt,Nt,Mt,kt,Pt],Lt=It.length,Rt=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,zt=`|`;function Bt(e,t={}){return e.split(zt).map(e=>{let n=e.trim().split(Rt).filter(e=>e&&!!e.trim()),r=[];for(let e=0,i=n.length;e<i;e+=1){let i=n[e],a=!1,o=-1;for(;!a&&++o<Lt;){let e=It[o],n=e.isMultiMatch(i);n&&(r.push(new e(n,t)),a=!0)}if(!a)for(o=-1;++o<Lt;){let e=It[o],n=e.isSingleMatch(i);if(n){r.push(new e(n,t));break}}}return r})}var Vt=new Set([Pt.type,Ft.type]),Ht=class{constructor(e,{isCaseSensitive:t=J.isCaseSensitive,ignoreDiacritics:n=J.ignoreDiacritics,includeMatches:r=J.includeMatches,minMatchCharLength:i=J.minMatchCharLength,ignoreLocation:a=J.ignoreLocation,findAllMatches:o=J.findAllMatches,location:s=J.location,threshold:c=J.threshold,distance:l=J.distance}={}){this.query=null,this.options={isCaseSensitive:t,ignoreDiacritics:n,includeMatches:r,minMatchCharLength:i,findAllMatches:o,ignoreLocation:a,location:s,threshold:c,distance:l},e=t?e:e.toLowerCase(),e=n?X(e):e,this.pattern=e,this.query=Bt(this.pattern,this.options)}static condition(e,t){return t.useExtendedSearch}searchIn(e){let t=this.query;if(!t)return{isMatch:!1,score:1};let{includeMatches:n,isCaseSensitive:r,ignoreDiacritics:i}=this.options;e=r?e:e.toLowerCase(),e=i?X(e):e;let a=0,o=[],s=0;for(let r=0,i=t.length;r<i;r+=1){let i=t[r];o.length=0,a=0;for(let t=0,r=i.length;t<r;t+=1){let r=i[t],{isMatch:c,indices:l,score:u}=r.search(e);if(c){if(a+=1,s+=u,n){let e=r.constructor.type;Vt.has(e)?o.push(...l):o.push(l)}}else{s=0,a=0,o.length=0;break}}if(a){let e={isMatch:!0,score:s/a};return n&&(e.indices=o),e}}return{isMatch:!1,score:1}}},Ut=[];function Wt(...e){Ut.push(...e)}function Gt(e,t){for(let n=0,r=Ut.length;n<r;n+=1){let r=Ut[n];if(r.condition(e,t))return new r(e,t)}return new Et(e,t)}var Q={AND:`$and`,OR:`$or`},Kt={PATH:`$path`,PATTERN:`$val`},qt=e=>!!(e[Q.AND]||e[Q.OR]),Jt=e=>!!e[Kt.PATH],Yt=e=>!U(e)&&$e(e)&&!qt(e),Xt=e=>({[Q.AND]:Object.keys(e).map(t=>({[t]:e[t]}))});function Zt(e,t,{auto:n=!0}={}){let r=e=>{let i=Object.keys(e),a=Jt(e);if(!a&&i.length>1&&!qt(e))return r(Xt(e));if(Yt(e)){let r=a?e[Kt.PATH]:i[0],o=a?e[Kt.PATTERN]:e[r];if(!W(o))throw Error(rt(r));let s={keyId:dt(r),pattern:o};return n&&(s.searcher=Gt(o,t)),s}let o={children:[],operator:i[0]};return i.forEach(t=>{let n=e[t];U(n)&&n.forEach(e=>{o.children.push(r(e))})}),o};return qt(e)||(e=Xt(e)),r(e)}function Qt(e,{ignoreFieldNorm:t=J.ignoreFieldNorm}){let n=1;e.matches.forEach(({key:e,norm:r,score:i})=>{let a=e?e.weight:null;n*=(i===0&&a?2**-52:i)**+((a||1)*(t?1:r))}),e.score=n}function $t(e,{ignoreFieldNorm:t=J.ignoreFieldNorm}){e.forEach(e=>{Qt(e,{ignoreFieldNorm:t})})}var en=class{constructor(e){this.limit=e,this.heap=[]}get size(){return this.heap.length}shouldInsert(e){return this.size<this.limit||e<this.heap[0].score}insert(e){this.size<this.limit?(this.heap.push(e),this._bubbleUp(this.size-1)):e.score<this.heap[0].score&&(this.heap[0]=e,this._sinkDown(0))}extractSorted(e){return this.heap.sort(e)}_bubbleUp(e){let t=this.heap;for(;e>0;){let n=e-1>>1;if(t[e].score<=t[n].score)break;let r=t[e];t[e]=t[n],t[n]=r,e=n}}_sinkDown(e){let t=this.heap,n=t.length,r=e;do{e=r;let i=2*e+1,a=2*e+2;if(i<n&&t[i].score>t[r].score&&(r=i),a<n&&t[a].score>t[r].score&&(r=a),r!==e){let n=t[e];t[e]=t[r],t[r]=n}}while(r!==e)}};function tn(e,t){let n=e.matches;t.matches=[],K(n)&&n.forEach(e=>{if(!K(e.indices)||!e.indices.length)return;let{indices:n,value:r}=e,i={indices:n,value:r};e.key&&(i.key=e.key.src),e.idx>-1&&(i.refIndex=e.idx),t.matches.push(i)})}function nn(e,t){t.score=e.score}function rn(e,t,{includeMatches:n=J.includeMatches,includeScore:r=J.includeScore}={}){let i=[];return n&&i.push(tn),r&&i.push(nn),e.map(e=>{let{idx:n}=e,r={item:t[n],refIndex:n};return i.length&&i.forEach(t=>{t(e,r)}),r})}var $=class{constructor(e,t={},n){this.options={...J,...t},this.options.useExtendedSearch,this._keyStore=new ct(this.options.keys),this.setCollection(e,n),this._lastQuery=null,this._lastSearcher=null}_getSearcher(e){if(this._lastQuery===e)return this._lastSearcher;let t=Gt(e,this.options);return this._lastQuery=e,this._lastSearcher=t,t}setCollection(e,t){if(this._docs=e,t&&!(t instanceof yt))throw Error(nt);this._myIndex=t||bt(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(e){K(e)&&(this._docs.push(e),this._myIndex.add(e))}remove(e=()=>!1){let t=[],n=[];for(let r=0,i=this._docs.length;r<i;r+=1)e(this._docs[r],r)&&(t.push(this._docs[r]),n.push(r));if(n.length){for(let e=n.length-1;e>=0;--e)this._docs.splice(n[e],1);this._myIndex.removeAll(n)}return t}removeAt(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}getIndex(){return this._myIndex}search(e,{limit:t=-1}={}){let{includeMatches:n,includeScore:r,shouldSort:i,sortFn:a,ignoreFieldNorm:o}=this.options,s=G(t)&&t>0&&W(e),c;if(s){let n=new en(t);W(this._docs[0])?this._searchStringList(e,{heap:n,ignoreFieldNorm:o}):this._searchObjectList(e,{heap:n,ignoreFieldNorm:o}),c=n.extractSorted(a)}else c=W(e)?W(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e),$t(c,{ignoreFieldNorm:o}),i&&c.sort(a),G(t)&&t>-1&&(c=c.slice(0,t));return rn(c,this._docs,{includeMatches:n,includeScore:r})}_searchStringList(e,{heap:t,ignoreFieldNorm:n}={}){let r=this._getSearcher(e),{records:i}=this._myIndex,a=t?null:[];return i.forEach(({v:e,i,n:o})=>{if(!K(e))return;let{isMatch:s,score:c,indices:l}=r.searchIn(e);if(s){let r={item:e,idx:i,matches:[{score:c,value:e,norm:o,indices:l}]};t?(Qt(r,{ignoreFieldNorm:n}),t.shouldInsert(r.score)&&t.insert(r)):a.push(r)}}),a}_searchLogical(e){let t=Zt(e,this.options),n=(e,t,r)=>{if(!e.children){let{keyId:n,searcher:i}=e,a=this._findMatches({key:this._keyStore.get(n),value:this._myIndex.getValueForItemAtKeyId(t,n),searcher:i});return a&&a.length?[{idx:r,item:t,matches:a}]:[]}let i=[];for(let a=0,o=e.children.length;a<o;a+=1){let o=e.children[a],s=n(o,t,r);if(s.length)i.push(...s);else if(e.operator===Q.AND)return[]}return i},r=this._myIndex.records,i=new Map,a=[];return r.forEach(({$:e,i:r})=>{if(K(e)){let o=n(t,e,r);o.length&&(i.has(r)||(i.set(r,{idx:r,item:e,matches:[]}),a.push(i.get(r))),o.forEach(({matches:e})=>{i.get(r).matches.push(...e)}))}}),a}_searchObjectList(e,{heap:t,ignoreFieldNorm:n}={}){let r=this._getSearcher(e),{keys:i,records:a}=this._myIndex,o=t?null:[];return a.forEach(({$:e,i:a})=>{if(!K(e))return;let s=[];if(i.forEach((t,n)=>{s.push(...this._findMatches({key:t,value:e[n],searcher:r}))}),s.length){let r={idx:a,item:e,matches:s};t?(Qt(r,{ignoreFieldNorm:n}),t.shouldInsert(r.score)&&t.insert(r)):o.push(r)}}),o}_findMatches({key:e,value:t,searcher:n}){if(!K(t))return[];let r=[];if(U(t))t.forEach(({v:t,i,n:a})=>{if(!K(t))return;let{isMatch:o,score:s,indices:c}=n.searchIn(t);o&&r.push({score:s,key:e,value:t,idx:i,norm:a,indices:c})});else{let{v:i,n:a}=t,{isMatch:o,score:s,indices:c}=n.searchIn(i);o&&r.push({score:s,key:e,value:i,norm:a,indices:c})}return r}};$.version=`7.2.0`,$.createIndex=bt,$.parseIndex=xt,$.config=J,$.parseQuery=Zt,Wt(Ht),$.use=function(...e){e.forEach(e=>Wt(e))};function an(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var on=class extends z{constructor(...e){super(...e),this.searchTerm=``,this.dataTask=new qe(this,{task:async()=>{let e=await fetch(`/search-data.json`);if(!e.ok)throw Error(`HTTP ${e.status}`);let t=await e.json();return this.fuse=new $(t,{keys:[`title`,`categories`,`excerpt`],shouldSort:!0,includeScore:!0}),t},args:()=>[]}),this.open=()=>{this.#e.value?.showModal()},this.close=()=>{this.#e.value?.close()}}#e=He();connectedCallback(){super.connectedCallback(),window.addEventListener(`keydown`,this.#t)}disconnectedCallback(){window.removeEventListener(`keydown`,this.#t)}get results(){return!this.searchTerm||!this.fuse||this.dataTask.status!==2?[]:this.fuse.search(this.searchTerm)}get hasResults(){return this.results.length>0}#t=e=>{let t=e.key===`k`&&e.getModifierState(`Meta`),n=e.key===`k`&&e.getModifierState(`Control`);(t||n)&&this.open()};#n=e=>{this.searchTerm=e.target.value};render(){return M`
      <dialog part="qs-dialog" ${We(this.#e)}>
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
            ${this.dataTask.render({pending:()=>M`<div class="message">Loading search data...</div>`,error:e=>M`<div class="message error">
                  Search unavailable:
                  ${e instanceof Error?e.message:`Unknown error`}
                </div>`,complete:()=>this.hasResults?M`
                    <ul>
                      ${Ge(this.results,({item:e})=>M`<li>
                          <a part="qs-result" class="result" href=${e.url}>
                            <div part="qs-title" class="title">
                              ${e.title}
                            </div>
                            <div part="qs-excerpt" class="excerpt">
                              ${e.excerpt}
                            </div>
                            <div part="qs-categories" class="categories">
                              ${e.categories.map(e=>M`<span>${e}</span>`)}
                            </div>
                          </a>
                        </li>`)}
                    </ul>
                  `:M`<div class="message">
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
  `}};an([je()],on.prototype,`searchTerm`,void 0),on=an([De(`quick-search`)],on);
var t={autoInit:!1,dataScroll:"scroll-stash",dataAnchor:"scroll-stash-anchor",selectorAnchor:"",selectorAnchorParent:"",selectorTopElem:"",selectorBotElem:"",alignment:"nearest",behavior:"auto",anchorPadding:16,saveKey:"ScrollStash",throttleDelay:100,customEventPrefix:"scroll-stash:"};const e=(t,e,s)=>{let r=s.anchorPadding;if(s.selectorTopElem){const e=t.querySelector(s.selectorTopElem);e&&(r+=e.offsetHeight)}return e.offsetTop-r},s=(t,e,s)=>{let r=s.anchorPadding;if(s.selectorBotElem){const e=t.querySelector(s.selectorBotElem);e&&(r+=e.offsetHeight)}return e.offsetTop-(t.offsetHeight-(e.offsetHeight+r))},r=(t,e)=>{const s=t.getAttribute("data-"+e.dataAnchor);if("false"==s||"ignore"==s)return null;if(s&&t.querySelector(s))return t.querySelector(s);const r=e.selectorAnchor?t.querySelector(e.selectorAnchor):null;if(r&&e.selectorAnchorParent){const t=r.closest(e.selectorAnchorParent);if(t)return t}return r||null},o=(t,o,l)=>{const n=r(t,l);if(n){const r=((t,r,o)=>{const l=((t,r,o)=>{const l=e(t,r,o),n=s(t,r,o);return!(t.scrollTop>l||t.scrollTop<n)})(t,r,o);switch(o.alignment){case"start":return!l&&e(t,r,o);case"center":return!l&&((t,r,o)=>{const l=e(t,r,o),n=s(t,r,o);return n+(l-n)/2})(t,r,o);case"end":return!l&&s(t,r,o);case"nearest":return((t,r,o)=>{const l=e(t,r,o),n=s(t,r,o);return t.scrollTop>l?l:t.scrollTop<n&&n})(t,r,o);default:return!1}})(t,n,l);return r?(t.scroll({top:r,behavior:o=o||l.behavior}),t.dispatchEvent(new CustomEvent(l.customEventPrefix+"anchor",{bubbles:!0,detail:{scrolled:{value:r,behavior:o},key:t.getAttribute("data-"+l.dataScroll)}})),{scrolled:{value:r,behavior:o},msg:"Anchor was scrolled into view"}):{scrolled:!1,msg:"Anchor is already in view"}}return{scrolled:!1,msg:"Anchor was not found"}},l=t=>{const e={};return document.querySelectorAll(`[data-${t.dataScroll}]`).forEach(s=>{const r=s.getAttribute("data-"+t.dataScroll);r&&(e[r]=s.scrollTop)}),localStorage.setItem(t.saveKey,JSON.stringify(e)),document.dispatchEvent(new CustomEvent(t.customEventPrefix+"saved",{bubbles:!0,detail:{state:e}})),e};export default class{constructor(e){this.settings={...t,...e},this.state={},this.scrolls=[],this.ticking=!1,this.__handler=this.handler.bind(this),this.settings.autoInit&&this.init()}init(t=null){t&&(this.settings={...this.settings,...t}),this.state=(t=>{if(localStorage.getItem(t.saveKey)){let e=JSON.parse(localStorage.getItem(t.saveKey));return Object.keys(e).forEach(s=>{const r=document.querySelector(`[data-${t.dataScroll}="${s}"]`);r&&(r.scrollTop=e[s])}),document.dispatchEvent(new CustomEvent(t.customEventPrefix+"applied",{bubbles:!0,detail:{state:e}})),e}return{}})(this.settings),this.state=Object.keys(this.state).length?this.state:l(this.settings),this.scrolls=document.querySelectorAll(`[data-${this.settings.dataScroll}]`),this.scrolls.forEach(t=>{t.addEventListener("scroll",this.__handler,!1),o(t,!1,this.settings)})}destroy(){this.scrolls.forEach(t=>{t.removeEventListener("scroll",this.__handler,!1)}),this.state={},this.scrolls=[],localStorage.removeItem(this.settings.saveKey)}handler(){this.ticking||(this.ticking=!0,setTimeout(()=>{this.state=l(this.settings),this.ticking=!1},this.settings.throttleDelay))}anchorGet(t){return r(t,this.settings)}anchorShow(t,e){return o(t,e,this.settings)}}
//# sourceMappingURL=scripts.modern.js.map

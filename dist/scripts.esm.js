function t(){return(t=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t}).apply(this,arguments)}var e={autoInit:!1,dataScroll:"scroll-stash",dataAnchor:"scroll-stash-anchor",selectorAnchor:"",selectorAnchorParent:"",selectorTopElem:"",selectorBotElem:"",alignment:"nearest",behavior:"auto",anchorPadding:16,saveKey:"ScrollStash",throttleDelay:100,customEventPrefix:"scroll-stash:"},r=function(t,e,r){var n=r.anchorPadding;if(r.selectorTopElem){var s=t.querySelector(r.selectorTopElem);s&&(n+=s.offsetHeight)}return e.offsetTop-n},n=function(t,e,r){var n=r.anchorPadding;if(r.selectorBotElem){var s=t.querySelector(r.selectorBotElem);s&&(n+=s.offsetHeight)}return e.offsetTop-(t.offsetHeight-(e.offsetHeight+n))},s=function(t,e){var r=t.getAttribute("data-"+e.dataAnchor);if("false"==r||"ignore"==r)return null;if(r&&t.querySelector(r))return t.querySelector(r);var n=e.selectorAnchor?t.querySelector(e.selectorAnchor):null;if(n&&e.selectorAnchorParent){var s=n.closest(e.selectorAnchorParent);if(s)return s}return n||null},o=function(t,e,o){var a=s(t,o);if(a){var i=function(t,e,s){var o=function(t,e,s){var o=r(t,e,s),a=n(t,e,s);return!(t.scrollTop>o||t.scrollTop<a)}(t,e,s);switch(s.alignment){case"start":return!o&&r(t,e,s);case"center":return!o&&function(t,e,s){var o=r(t,e,s),a=n(t,e,s);return a+(o-a)/2}(t,e,s);case"end":return!o&&n(t,e,s);case"nearest":return function(t,e,s){var o=r(t,e,s),a=n(t,e,s);return t.scrollTop>o?o:t.scrollTop<a&&a}(t,e,s);default:return!1}}(t,a,o);return i?(t.scroll({top:i,behavior:e=e||o.behavior}),t.dispatchEvent(new CustomEvent(o.customEventPrefix+"anchor",{bubbles:!0,detail:{scrolled:{value:i,behavior:e},key:t.getAttribute("data-"+o.dataScroll)}})),{scrolled:{value:i,behavior:e},msg:"Anchor was scrolled into view"}):{scrolled:!1,msg:"Anchor is already in view"}}return{scrolled:!1,msg:"Anchor was not found"}},a=function(t){var e={};return document.querySelectorAll("[data-"+t.dataScroll+"]").forEach(function(r){var n=r.getAttribute("data-"+t.dataScroll);n&&(e[n]=r.scrollTop)}),localStorage.setItem(t.saveKey,JSON.stringify(e)),document.dispatchEvent(new CustomEvent(t.customEventPrefix+"saved",{bubbles:!0,detail:{state:e}})),e},i=function(){function r(r){this.settings=t({},e,r),this.state={},this.scrolls=[],this.ticking=!1,this.__handler=this.handler.bind(this),this.settings.autoInit&&this.init()}var n=r.prototype;return n.init=function(e){var r=this;void 0===e&&(e=null),e&&(this.settings=t({},this.settings,e)),this.state=function(t){if(localStorage.getItem(t.saveKey)){var e=JSON.parse(localStorage.getItem(t.saveKey));return Object.keys(e).forEach(function(r){var n=document.querySelector("[data-"+t.dataScroll+'="'+r+'"]');n&&(n.scrollTop=e[r])}),document.dispatchEvent(new CustomEvent(t.customEventPrefix+"applied",{bubbles:!0,detail:{state:e}})),e}return{}}(this.settings),this.state=Object.keys(this.state).length?this.state:a(this.settings),this.scrolls=document.querySelectorAll("[data-"+this.settings.dataScroll+"]"),this.scrolls.forEach(function(t){t.addEventListener("scroll",r.__handler,!1),o(t,!1,r.settings)})},n.destroy=function(){var t=this;this.scrolls.forEach(function(e){e.removeEventListener("scroll",t.__handler,!1)}),this.state={},this.scrolls=[],localStorage.removeItem(this.settings.saveKey)},n.handler=function(){var t=this;this.ticking||(this.ticking=!0,setTimeout(function(){t.state=a(t.settings),t.ticking=!1},this.settings.throttleDelay))},n.anchorGet=function(t){return s(t,this.settings)},n.anchorShow=function(t,e){return o(t,e,this.settings)},r}();export default i;
//# sourceMappingURL=scripts.esm.js.map
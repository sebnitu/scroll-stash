function t(){return(t=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&(t[s]=r[s])}return t}).apply(this,arguments)}var e={autoInit:!1,dataScroll:"scroll-stash",dataAnchor:"scroll-stash-anchor",selectorAnchor:"",selectorAnchorParent:"",selectorTopElem:"",selectorBotElem:"",alignment:"nearest",behavior:"auto",anchorPadding:16,saveKey:"ScrollStash",throttleDelay:100,customEventPrefix:"scroll-stash:"},r=function(t,e,r){var s=r.anchorPadding;if(r.selectorTopElem){var n=t.querySelector(r.selectorTopElem);n&&(s+=n.offsetHeight)}return e.offsetTop-s},s=function(t,e,r){var s=r.anchorPadding;if(r.selectorBotElem){var n=t.querySelector(r.selectorBotElem);n&&(s+=n.offsetHeight)}return e.offsetTop-(t.offsetHeight-(e.offsetHeight+s))},n=function(t,e){var r=t.getAttribute("data-"+e.dataAnchor);if("false"==r||"ignore"==r)return null;if(r&&t.querySelector(r))return t.querySelector(r);var s=e.selectorAnchor?t.querySelector(e.selectorAnchor):null;if(s&&e.selectorAnchorParent){var n=s.closest(e.selectorAnchorParent);if(n)return n}return s||null},o=function(t,e,o){var a=n(t,o);if(a){var i=function(t,e,n){var o=function(t,e,n){var o=r(t,e,n),a=s(t,e,n);return!(t.scrollTop>o||t.scrollTop<a)}(t,e,n);switch(n.alignment){case"start":return!o&&r(t,e,n);case"center":return!o&&function(t,e,n){var o=r(t,e,n),a=s(t,e,n);return a+(o-a)/2}(t,e,n);case"end":return!o&&s(t,e,n);case"nearest":return function(t,e,n){var o=r(t,e,n),a=s(t,e,n);return t.scrollTop>o?o:t.scrollTop<a&&a}(t,e,n);default:return!1}}(t,a,o);return i?(t.scroll({top:i,behavior:e=e||o.behavior}),t.dispatchEvent(new CustomEvent(o.customEventPrefix+"anchor",{bubbles:!0,detail:{scrolled:{value:i,behavior:e},key:t.getAttribute("data-"+o.dataScroll)}})),{scrolled:{value:i,behavior:e},msg:"Anchor was scrolled into view"}):{scrolled:!1,msg:"Anchor is already in view"}}return{scrolled:!1,msg:"Anchor was not found"}},a=function(t){var e={};return document.querySelectorAll("[data-"+t.dataScroll+"]").forEach(function(r){var s=r.getAttribute("data-"+t.dataScroll);s&&(e[s]=r.scrollTop)}),localStorage.setItem(t.saveKey,JSON.stringify(e)),document.dispatchEvent(new CustomEvent(t.customEventPrefix+"saved",{bubbles:!0,detail:{state:e}})),e};module.exports=function(){function r(r){this.settings=t({},e,r),this.state={},this.scrolls=[],this.ticking=!1,this.__handler=this.handler.bind(this),this.settings.autoInit&&this.init()}var s=r.prototype;return s.init=function(e){var r=this;void 0===e&&(e=null),e&&(this.settings=t({},this.settings,e)),this.state=function(t){if(localStorage.getItem(t.saveKey)){var e=JSON.parse(localStorage.getItem(t.saveKey));return Object.keys(e).forEach(function(r){var s=document.querySelector("[data-"+t.dataScroll+'="'+r+'"]');s&&(s.scrollTop=e[r])}),document.dispatchEvent(new CustomEvent(t.customEventPrefix+"applied",{bubbles:!0,detail:{state:e}})),e}return{}}(this.settings),this.state=Object.keys(this.state).length?this.state:a(this.settings),this.scrolls=document.querySelectorAll("[data-"+this.settings.dataScroll+"]"),this.scrolls.forEach(function(t){t.addEventListener("scroll",r.__handler,!1),o(t,!1,r.settings)})},s.destroy=function(){var t=this;this.scrolls.forEach(function(e){e.removeEventListener("scroll",t.__handler,!1)}),this.state={},this.scrolls=[],localStorage.removeItem(this.settings.saveKey)},s.handler=function(){var t=this;this.ticking||(this.ticking=!0,setTimeout(function(){t.state=a(t.settings),t.ticking=!1},this.settings.throttleDelay))},s.anchorGet=function(t){return n(t,this.settings)},s.anchorShow=function(t,e){return o(t,e,this.settings)},r}();
//# sourceMappingURL=scripts.js.map

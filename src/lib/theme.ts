export const THEME_STORAGE_KEY = "punto-theme";
export const THEME_CHANGE_EVENT = "punto-theme-change";

/*
  Inline script placed in the head. It runs before first paint so the page
  never flashes the wrong theme. A saved choice wins, otherwise the device
  setting is used. It also follows the device setting and other tabs.
  The toggle sets data-theme itself and tells React with THEME_CHANGE_EVENT.
*/
export const themeScript = `(function(){
var k="${THEME_STORAGE_KEY}",r=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");
function g(){try{var c=localStorage.getItem(k);return c==="light"||c==="dark"?c:"system"}catch(e){return"system"}}
function a(){var c=g();r.setAttribute("data-theme",c==="dark"||(c==="system"&&m.matches)?"dark":"light")}
a();
m.addEventListener("change",a);
window.addEventListener("storage",a);
})();`;

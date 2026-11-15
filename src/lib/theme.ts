export const THEME_STORAGE_KEY = "punto-theme";
export const THEME_CHANGE_EVENT = "punto-theme-change";

export type ThemeChoice = "light" | "dark" | "system";

/*
  Inline script placed in the head. It runs before first paint so the page
  never flashes the wrong theme. It also reacts to the system setting, to the
  toggle (through the custom event) and to other tabs (storage event).
  Keep it small and free of template values.
*/
export const themeScript = `(function(){
var k="${THEME_STORAGE_KEY}",r=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");
function g(){try{var c=localStorage.getItem(k);return c==="light"||c==="dark"?c:"system"}catch(e){return"system"}}
function a(){var c=g();r.setAttribute("data-theme",c==="dark"||(c==="system"&&m.matches)?"dark":"light")}
a();
m.addEventListener("change",a);
window.addEventListener("storage",a);
window.addEventListener("${THEME_CHANGE_EVENT}",a);
})();`;

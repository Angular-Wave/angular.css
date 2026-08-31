/* Version: 0.7.8 - July 17, 2025 11:49:51 */
// File for DOCsy to update doc version
window.VERSION = '0.7.8';
const script = document.createElement('script');
script.src = '/angular.css/js/angular-ts.umd.js';
script.type = 'text/javascript';
document.head.appendChild(script);
script.onload = function () {
  window.dispatchEvent(new CustomEvent('AngularLoaded'));
};

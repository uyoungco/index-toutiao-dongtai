"use strict";

var a = function a() {
  return 10;
};

function getIEVersion() {
  var rv = 99;
  if (navigator.appName == "Microsoft Internet Explorer") {
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
    if (re.exec(ua) != null) {
      rv = parseFloat(RegExp.$1);
    }
  }
  return rv;
}
if (getIEVersion() <= 9) {
  // document.body.innerHTML += "<div class='ie-fix'><div class='title'>为了保障你的隐私安全和最佳预览体验，本页面即将不支持IE9及以下IE版本浏览器访问，建议你使用Chrome等高级浏览器或升级到IE最新版本浏览器。</div></div>"
  $(".ie-tips").html("<div class='ie-fix'><div class='title'>为了保障你的账号安全和最佳浏览体验，该页面即将不再支持IE9及以下IE版本浏览器访问，建议你升级到IE浏览器最新版本，或使用Chrome等浏览器最新版本。</div></div>");
}
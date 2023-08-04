export default function initRem() {
  const _dom = document.documentElement;
  const resizeEvent =
    'orientationchange' in window ? 'orientationchange' : 'resize';

  const mobDesign = 375;
  const pcDesign = 1440;
  const calculate = function () {
    const clientWidth = _dom.clientWidth;
    if (!clientWidth) return;

    const myWidth = clientWidth > 1024 ? pcDesign : mobDesign;
    let size = (clientWidth / myWidth) * 100;
    if (clientWidth > 1920) {
      size = 1920 / myWidth;
    }

    _dom.style.setProperty('font-size', size + 'px', 'important');
    console.log(size, 'size');
  };
  if (!document.addEventListener) return;
  calculate();
  window.addEventListener(resizeEvent, calculate, false);
}

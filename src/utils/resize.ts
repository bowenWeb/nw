const WIDTH = 1024;

const isMobile = () => {
  const rect = document.body.getBoundingClientRect();
  return rect.width - 1 < WIDTH;
};

const initResize = () => {
  if (isMobile()) {
    // set device = mobile
  } else {
    // set device = pc
  }
};

const resizeHandler = () => {
  if (isMobile()) {
     // set device = mobile
  } else {
     // set device = pc
  }
};

const addEventListenerOnResize = () => {
  window.addEventListener('resize', resizeHandler);
};

const removeEventListenerResize = () => {
  window.removeEventListener('resize', resizeHandler);
};

export { addEventListenerOnResize, removeEventListenerResize, initResize };

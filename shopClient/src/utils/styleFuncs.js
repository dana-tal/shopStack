
const getButtonFontSize = () => {
  let size = "11px";

  if (window.matchMedia("(min-width: 401px)").matches) size = "12px";
  if (window.matchMedia("(min-width: 768px)").matches) size = "17px";
  if (window.matchMedia( "(min-width: 912px)").matches) size = "17px";
  if (window.matchMedia("(min-width: 1280px)").matches) size = "19px";

  console.log("size="+size);
  return size;
};

/*
const getFormWidthRange=()=> {
  const width = window.innerWidth;

  if (width <= 400) {
    return { minWidth: "90%", maxWidth: "95%" };
  }

  if (width <= 600) {
    return { minWidth: "85%", maxWidth: 500 };
  }

  if (width <= 900) {
    return { minWidth: 600, maxWidth: 700 };
  }

  if (width <= 1200) {
    return { minWidth: 700, maxWidth: 950 };
  }

  return { minWidth: 800, maxWidth: 1000 };
}
*/

export {
    getButtonFontSize,
   
}
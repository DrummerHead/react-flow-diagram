// @flow

type GetReturn = {
  width: number,
  height: number,
  x: number,
  y: number,
};
const elemLayout = (() => {
  let elem: ?HTMLElement = null;

  const set = (e: HTMLElement): void => {
    elem = e;
  };

  const gc = (): void => {
    elem = undefined;
  };

  const get = (): GetReturn => {
    if (elem) {
      const { left, top, width, height } = elem.getBoundingClientRect();
      return {
        width: parseInt(width, 10),
        height: parseInt(height, 10),
        x: parseInt(left, 10),
        y: parseInt(top, 10),
      };
    } else {
      return {
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      };
    }
  };

  return { set, get, gc };
})();

export default elemLayout;

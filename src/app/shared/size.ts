export const sizes = [
  {
    ratio: '9x16',
    w: 720,
    h: 1280,
  },
  {
    ratio: '16x9',
    w: 1280,
    h: 720,
  },
];

export const getSize = (ratio) => {
  return sizes.filter((size) => size.ratio === ratio)[0];
};

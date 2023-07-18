
export const addDecimals = (n: number) => {
  return parseFloat((Math.round(n * 100) / 100).toFixed(2));
};


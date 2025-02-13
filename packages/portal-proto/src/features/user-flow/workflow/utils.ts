const descendingOrd = (array) => {
  return array.sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });
};

const ascendingOrd = (array) => {
  return array.sort((a, b) => {
    if (b < a) {
      return -1;
    } else if (b > a) {
      return 1;
    } else {
      return 0;
    }
  });
};

export const sortAlphabetically: (array: any, direction: any) => any = (
  array,
  direction,
) => {
  return direction === "a-z" ? descendingOrd(array) : ascendingOrd(array);
};

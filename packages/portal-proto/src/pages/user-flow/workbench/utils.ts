
export interface AppRegistrationEntry {
  readonly name: string;
  readonly icon?: string;
  readonly tags: ReadonlyArray<string>;
  readonly hasDemo?: boolean;
  readonly id?: string;
  readonly description?: string;
}

const descendingOrd = (array, param) => {
  return array.sort((a, b) => {
    if (a[param] < b[param]) {
      return -1
    } else if (a[param] > b[param]) {
      return 1
    } else {
      return 0
    }
  })
}

const ascendingOrd = (array, param) => {
  return array.sort((a, b) => {
    if (b[param] < a[param]) {
      return -1
    } else if (b[param] > a[param]) {
      return 1
    } else {
      return 0
    }
  })
}

export const sortAlphabetically = (array, direction, category) => {
  return direction === "a-z" ? descendingOrd(array, category) : ascendingOrd(array, category)
}


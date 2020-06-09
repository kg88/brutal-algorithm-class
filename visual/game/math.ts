// Shuffle array in-place
export function shuffle(array: any[]) {
  for (let i = 0; i < array.length; i++) {
    let pick = Math.floor(Math.random() * (array.length)); // [0 ~ 1)
    swap(array, i, pick);
  }
  return array;
}

export function swap(array: any[], i: number, j: number) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

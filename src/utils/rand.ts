// [min,max)  max is not included
export function between(min = 0, max = 100) {
  // return min + Math.random() * (max - min)
  return min + Math.floor(Math.random() * (max - min));
}
export function float(min = 0, max = 100) {
  return min + Math.random() * (max - min);
}

export function int(min = 0, max = 100) {
  return between(min, max);
  // return min + Math.floor(Math.random() * (max - min))
}

export function choose(arr = []) {
  let index = between(0, arr.length);
  return arr[index];
}

export function timestamp(min = 0, max: number = Date.now()) {
  min = min || new Date("2008-5-12").getTime();
  max = max || Date.now();
  return between(min, max);
}

export function shuffle(arr: any[]) {
  if (Array.isArray(arr)) {
    for (let i = arr.length - 1; i > 0; i--) {
      let index = between(0, i);
      let temp = arr[i];
      arr[i] = arr[index];
      arr[index] = temp;
    }
  }
  return arr;
}

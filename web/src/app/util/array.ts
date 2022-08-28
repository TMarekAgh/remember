const defaultComparer = (i1: any, i2: any) => i1 == i2;

export class ArrayUtil {
  static getDifference(a1: any[], a2: any[], comparer = defaultComparer) {
    let i = 0, j = 0;

    let diff = [];

    a1.sort();
    a2.sort();

    while(i < a1.length && j < a2.length) {
      let i1 = a1[i];
      let i2 = a2[j];
      if(i1 != i2) {
        if(i1 > i2) {
          diff.push(i2)
          j = j++
        } else {
          diff.push(i1)
          i = i++
        }
      } else {
        i = i++;
        j = j++
      }
    }
  }

  static equal(a1: any[], a2: any[], comparer = defaultComparer) {
    if(a1 == a2) return true; //compare by ref(must be equal)
    if((!a1 || !a2) && a1 != a2) return false; //if any false'y and both aren't equal
    if(a1.length != a2.length) return false; //if lengths don't match

    a1.sort()
    a2.sort()

    for(let i = 0; i < a1.length; i++) {
      if(!comparer(a1[i], a2[i])) return false;
    }

    return true;
  }
}


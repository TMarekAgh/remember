
const defaultEqualityComparer = ((x, y) => x == y)

export const distinct = (arr: any[], comp = defaultEqualityComparer) => {
    arr.sort();
    const result = []

    let last = arr[0];
    
    for(let i = 1; i <= arr.length; i++) {
        if(comp(last, arr[i])) continue;
        result.push(last);
        last = arr[i]
    }

    return result;
}

export const except =  (arr: any[], except: any[], comp = defaultEqualityComparer) => {
    const result = [];

    for(const el of arr) {
        if(except.some((value: any) => comp(value, el))) continue;
        result.push(el)
    }

    return result;
}
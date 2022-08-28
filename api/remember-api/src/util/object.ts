export const execForEachProp = (obj: any, func: any) => {
    for(const key in obj) {
        const value = obj[key];
        func(obj, key, value);
    }
}
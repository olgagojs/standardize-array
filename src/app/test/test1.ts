import { Type } from '@angular/core';

export const arr5: Array<Array<Type<string>>> = [];
export const rrr: Array<Type<string>> = [];
export const www: Array<Type<string> | Type<number>> = [];
export const ttt: Map<string, Array<string>> = new Map([['test', []]]);

console.log(arr5, rrr, www, ttt);

export function groupByDay<T>(data: Array<T>, timestampField: string): Map<string, Array<T>> {
    const resultMap: Map<string, Array<T>> = new Map();
    for (const item of data) {
        const dateString = timestampField;
        const dateGroup = resultMap.get(dateString);
        if (dateGroup) {
            dateGroup.push(item);
        } else {
            resultMap.set(dateString, [item]);
        }
    }
    return resultMap;
}

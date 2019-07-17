import { Type } from '@angular/core';

export const arr5: Type<string>[][] = [];
export const rrr: Type<string>[] = [];
export const www: (Type<string> | Type<number>)[] = [];
export const ttt: Map<string, string[]> = new Map([['test', []]]);

console.log(arr5, rrr, www, ttt);

export function groupByDay<T>(data: T[], timestampField: string): Map<string, T[]> {
    const resultMap: Map<string, T[]> = new Map();
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

// Flags for lang switcher
const suitableLocales = [].reduce<any>((acc: string[][], locale: string) => {
    const countryCode = locale.split('_')[1] || '';
    if (countryCode.length === 2) {
        acc.push([locale, `flags/${countryCode}.svg`]);
    }
    return acc;
}, []);
console.log('suitableLocales', suitableLocales);

const social_settings: Array<{
    description?: string,
    image?: string,
    title?: string,
    type?: string,
}> = [{}];
console.log(social_settings);
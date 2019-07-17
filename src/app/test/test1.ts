import { Type } from '@angular/core';

export const arr5: Array<Array<Type<string>>> = [];
export const rrr: Array<Type<string>> = [];
export const www: Array<Type<string> | Type<number>> = [];
export const ttt: Map<string, Array<string>> = new Map([['test', []]]);

console.log(arr5, rrr, www, ttt);

export interface ISocialSettings {
    description?: string;
    image?: string;
    title?: string;
    type?: string;
}

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

// Flags for lang switcher
const suitableLocales = [].reduce<any>((acc: Array<Array<string>>, locale: string) => {
    const countryCode = locale.split('_')[1] || '';
    if (countryCode.length === 2) {
        acc.push([locale, `flags/${countryCode}.svg`]);
    }
    return acc;
}, []);
console.log('suitableLocales', suitableLocales);

const social_settings: Array<ISocialSettings> = [{}];
console.log(social_settings);
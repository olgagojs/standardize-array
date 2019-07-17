import { Type } from '@angular/core';

export const arr5: Type<string>[][] = [];
export const rrr: Type<string>[] = [];
export const www: (Type<string> | Type<number>)[] = [];
export const ttt: Map<string, string[]> = new Map([['test', []]]);

console.log(arr5, rrr, www, ttt);
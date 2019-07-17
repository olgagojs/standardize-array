import { Type } from '@angular/core';

export const arr5: Array<Array<Type<string>>> = [];
export const rrr: Array<Type<string>> = [];
export const www: Array<Type<string> | Type<number>> = [];
export const ttt: Map<string, Array<string>> = new Map([['test', []]]);

console.log(arr5, rrr, www, ttt);
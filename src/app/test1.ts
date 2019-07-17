import { Type } from '@angular/core';

export const arr1: string[] = [];
console.log(arr1);

export const arr2: (string | number | boolean)[] = [];
console.log(arr2);

export const arr3: string[] = [];
console.log(arr3);

export const arr4: Type<string>[] = [];
console.log(arr4);

export const arr5: Type<string>[][] = [];
console.log(arr5);
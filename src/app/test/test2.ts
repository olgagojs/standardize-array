import { Type } from '@angular/core';

export const arr1: Array<number> = [];
console.log(arr1);

export const arr2: Array<string | number | boolean> = [];
console.log(arr2);

export const arr3: Array<number> = [];
console.log(arr3);

export const arr4: Array<Type<number>> = [];
console.log(arr4);

export const arr5: Array<Array<Type<number>>> = [];
console.log(arr5);
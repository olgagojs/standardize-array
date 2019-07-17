import {
    apply,
    FileEntry,
    forEach,
    mergeWith,
    Rule,
    SchematicContext,
    template,
    Tree,
    url
} from '@angular-devkit/schematics';
import { normalize } from '@angular-devkit/core';

import * as path from 'path';
import * as fs from 'fs';

export function standardizeArray(_options: any): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        if (!_options.path) {
            console.log('Required options field "path" is undefined');
            return tree;
        }
        const urlText = normalize(path.join(__dirname, _options.path));
        const rule = mergeWith(apply(
            url(urlText), [
                template({ ..._options }),
                forEach((fileEntry) => {
                    const typeOfFile = fileEntry.path.slice(fileEntry.path.indexOf('.') + 1);
                    if (typeOfFile === 'ts') {
                        const pathFile = path.join(urlText, fileEntry.path);
                        if (fs.existsSync(pathFile)) {
                            const replaceText = handleFileEntryByRecursion(fileEntry);
                            if (replaceText) {
                                fs.writeFileSync(path.join(urlText, fileEntry.path), replaceText);
                                console.log('write', pathFile);
                            }
                        }
                        return null;
                    }
                    return null;
                })
            ]
        ));
        return rule(tree, _context);
    };
}

const REGEXP_ARRAY = /\bArray<.*\>/g;

function handleFileEntryByRecursion(fileEntry: FileEntry) {
    //BEFORE: export const arr5: Array<Array<Type<string>>> = [];
    let moduleText = fileEntry.content.toString();
    //RESULT
    let replaceModule = '';

    //REGEXP RETURN: ['Array<Array<Type<string>>>']
    let arrays = moduleText.match(REGEXP_ARRAY) || [];
    while (arrays.length) {
        for (let arr of arrays) {

            //before: Array<T>, timestampField: string): Map<string, Array<T>>
            const indexNextOpenBracket = arr.slice(arr.indexOf('<') + 1).indexOf('<');
            const indexCloseBracket = arr.indexOf('>');
            if (indexNextOpenBracket > indexCloseBracket) {
                //after: Array<T>
                arr = arr.slice(0, indexCloseBracket + 1);
            }

            //if Array<string>>
            //if Array<string>[], locale: string) =>
            const firstBrackets = arr.split('<').length - 1;
            const lastBrackets = arr.split('>').length - 1;
            if (firstBrackets < lastBrackets) {
                let indexBrackets = lastBrackets - firstBrackets + 1;
                while (indexBrackets) {
                    indexBrackets = indexBrackets - 1;
                    if (indexBrackets === 0) {
                        arr = arr.slice(0, arr.lastIndexOf('>') + 1);
                    } else {
                        arr = arr.slice(0, arr.lastIndexOf('>'));
                    }
                }
            }

            //handle inner data in array
            let typeArr = arr.slice(6, arr.length - 1);
            if (arr.indexOf('|') !== -1) {
                typeArr = `(${typeArr})`;
            }
            moduleText = moduleText.replace(arr, `${typeArr}[]`);
        }
        arrays = moduleText.match(REGEXP_ARRAY) || [];
        replaceModule = moduleText;
    }
    // AFTER: 'Type<string>[][]'
    return replaceModule;
}

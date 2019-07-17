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
                            const replaceText = handleFileEntry(fileEntry);
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

function handleFileEntry(fileEntry: FileEntry) {
    //before: export const arr5: Array<Array<Type<string>>> = [];
    let moduleText = fileEntry.content.toString();
    let replaceModule = '';

    //regexp return: ['Array<Array<Type<string>>>']
    let arrays = moduleText.match(/\Array<.*>\>/g) || [];
    while (arrays.length) {
        for (let arr of arrays) {

            //if Array<T>, timestampField: string): Map<string, Array<T>>
            const indexNextOpenBracket = arr.slice(arr.indexOf('<') + 1).indexOf('<');
            const indexCloseBracket = arr.indexOf('>');
            if (indexNextOpenBracket > indexCloseBracket) {
                arr = arr.slice(0, indexCloseBracket + 1);
            }

            //if Array<string>>
            const firstBrackets = arr.split('<').length - 1;
            const lastBrackets = arr.split('>').length - 1;
            if (firstBrackets < lastBrackets) {
                arr = arr.slice(0, arr.length - (lastBrackets - firstBrackets));
            }

            //handle inner data in array
            let typeArr = arr.slice(6, arr.length - 1);
            if (arr.indexOf('|') !== -1) {
                typeArr = `(${typeArr})`;
            }
            moduleText = moduleText.replace(arr, `${typeArr}[]`);
        }
        arrays = moduleText.match(/\Array<.*>\>/g) || [];
        replaceModule = moduleText;
    }
    // after: 'Type<string>[][]'
    return replaceModule;
}

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
            console.log('Required field path is undefined');
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
                                console.log(replaceText);
                                console.log(_options);
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
    let moduleText = fileEntry.content.toString();
    let replaceModule = '';
    while (moduleText.indexOf('Array<') !== -1) {
        const beginText = moduleText.slice(moduleText.indexOf('Array<'));
        if (beginText.indexOf('>') !== -1) {
            const searchTextArray = beginText.slice(0, beginText.indexOf('>') + 1);
            let typeText = searchTextArray.replace('Array<', '').replace('>', '');
            if (typeText.indexOf('|') !== -1) {
                typeText = `(${typeText})`;
            }
            const replaceText = `${typeText}[]`;
            moduleText = moduleText.replace(searchTextArray, replaceText);
            replaceModule = moduleText;
            // console.log('Before: ');
            // console.log(moduleText);
            // console.log('After: ');
            // console.log(replaceModule);
        }
    }
    return replaceModule;
}
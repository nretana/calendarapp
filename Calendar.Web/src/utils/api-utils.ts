import { PatchDocument, PatchOperation } from '../store/services/api-types';

export const isObject  = (obj: any): obj is object => {
    return typeof obj === 'object' && obj !== null;
}

export const getPatchDocument = (object: any, operation: PatchOperation) : PatchDocument[] => {
    if(!isObject(object)){
        throw new TypeError("incorrect object value")
    }

    const patchDocument: PatchDocument[] = [];
    for (const [key, value] of Object.entries(object)){
        patchDocument.push({ op: operation, 
                             path: `/${key.toLowerCase()}`,
                             value
                            });
    }
    return patchDocument;
}


export const statusCodeErrorMessage = (status: number | string) : string => {

    switch(status){
        case 'FETCH_ERROR':
        case 'PARSING_ERROR':
        case 'TIMEOUT_ERROR':
        case 'CUSTOM_ERROR':
            return 'There was a problem trying to process your request. Please try again later.';
        default:
            return 'There was a problem trying to process your request. Please try again later.';
    }
}
// @ts-ignore
import { ErrorModel } from "../Models/Error.js";

const errors: ErrorModel[] = [];

export function addError(error: ErrorModel) {
    if (errors.find(e => e.id === error.id) === undefined) {
        errors.push(error);
    }
}

export function getErrorById(element_id: string): ErrorModel {
    return errors.find(e => e.id === element_id);
}

export function removeError(element_id: string) {
    const index = errors.findIndex(e => e.id === element_id);
    if (index !== -1) {
        errors.splice(index, 1);
    }
}

export function functionGetAllErrors(): ErrorModel[] {
    return errors;
}

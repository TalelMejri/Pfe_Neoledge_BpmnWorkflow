// @ts-ignore
import { ErrorModel } from "../Models/Error.js";

const errors: ErrorModel[] = [];

export function addError(error: ErrorModel) {
    let errorIndex = errors.findIndex(e => e.idElement === error.idElement && e.message === error.message);
    if (errorIndex == -1) {
        errors.push(error);
    }
}

export function getErrorById(element_id: number): ErrorModel | undefined {
    return errors.find(e => e.idElement === element_id) 
}

export function removeError(element_id: number, message: string) {
    const index = errors.findIndex(e => e.idElement === element_id && e.message === message);
    if (index !== -1) {
        errors.splice(index, 1);
    }
}

export function removeAllErrors() {
    errors.splice(0, errors.length);
}

export function GetAllErrors(): ErrorModel[] {
    return errors.filter(e => e.code == 2);
}

export function GetAllProblems(): ErrorModel[] {
    return errors;
}

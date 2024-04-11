export class ErrorModel {
    constructor(message, code, idElement) {
        this.id = Math.random();
        this.message = message;
        this.code = code;
        this.idElement = idElement;
    }
}

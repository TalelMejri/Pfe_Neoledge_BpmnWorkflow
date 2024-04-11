export class ErrorModel {
    id:number;
    message:string;
    code:number;
    idElement:number;
    constructor(message:string, code:number, idElement:number) {
        this.id = Math.random();
        this.message = message;
        this.code = code;
        this.idElement = idElement;
    }

}

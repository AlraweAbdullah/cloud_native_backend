export class Category {
    id : number
    name : string


    constructor (category : {id:number, name:string}){
        this.id  = category.id;
        this.name = category.name;
    }

    static create(id:number, name:string){
        return new Category( {id:id, name:name})
    }

    
}


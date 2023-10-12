export class Country {
    id : number
    name : string
    
    constructor (country : {id:number, name:string}){
        this.id  = country.id;
        this.name = country.name
    }

    static create(id:number, name:string){
        return new Country( {id:id, name:name})
    }

    
}


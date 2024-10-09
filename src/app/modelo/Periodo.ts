export class Periodo {
    id: number = 0;
    anio: String = '' ;
    actual: boolean = false;
    denominacion: String = "";
    fechaInicial: Date = new Date();
    fechaFinal: Date = new Date();;

    constructor(id: number, anio: String, actual: boolean, denominacion: String, fechaInicial: Date, fechaFinal: Date) {
        this.id = id;
        this.anio = anio;
        this.actual = actual;
        this.denominacion = denominacion;
        this.fechaInicial = fechaInicial;
        this.fechaFinal = fechaFinal;
    }
}

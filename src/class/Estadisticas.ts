export class Estadistica {

    // -----------------------------------------------------------------
    // Atributos
    // -----------------------------------------------------------------

	v1: number
	v2: number
	v3: number
	v4: number
	v5: number
	promedio: number
	total: number

    // -----------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------

	constructor() {
		this.v1 = 0
		this.v2 = 0
		this.v3 = 0
		this.v4 = 0
		this.v5 = 0
		this.promedio = 0
		this.total = 0
	}

    // -----------------------------------------------------------------
    // Metodos
    // -----------------------------------------------------------------

	calificar(valor: number) {
		switch (valor) {
			case 1:
				this.v1++
				break;
			case 2:
				this.v2++
				break;
			case 3:
				this.v3++
				break;
			case 4:
				this.v4++
				break;
			case 5:
				this.v5++
				break;
		}
		this.total++
		let punteado = 5 * this.v5 + 4 * this.v4 + 3 * this.v3 + 2 * this.v2 + 1 * this.v1
		this.promedio = punteado / this.total
	}

	cargarDatos(datos) {
		this.v1 = datos['v1']
		this.v2 = datos['v2']
		this.v3 = datos['v3']
		this.v4 = datos['v4']
		this.v5 = datos['v5']
		this.promedio = datos['promedio']
		this.total = datos['total']
	}
}


export class EstadisticasDiarias{
    
    // -----------------------------------------------------------------
    // Atributos
    // -----------------------------------------------------------------

	acum: number
	total: number
	promedio: number

    // -----------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------

	constructor(){
		this.acum = 0
		this.total = 0
		this.promedio = 0
	}

    // -----------------------------------------------------------------
    // Metodos
    // -----------------------------------------------------------------

	cargarDatos(datos){
		this.acum = datos['acum']
		this.total = datos['total']
		this.promedio = datos['promedio']
	}

	calificar(valor:number){
		this.acum += valor
		this.total ++
		this.promedio = this.acum/this.total
	}
}

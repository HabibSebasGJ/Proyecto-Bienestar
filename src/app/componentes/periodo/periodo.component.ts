import { Component, OnInit } from '@angular/core';
import { Periodo } from 'src/app/modelo/Periodo';
import { PeriodoService } from 'src/app/servicios/periodo.service';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit{

  errorMensaje: string = '';
  errorMensajeCambiar: string = '';
  public periodo: Periodo[] = this.peri.semestrePeriodo
  newPeriodo: Periodo = new Periodo(0, '', false, '', new Date(), new Date());
  selectedSemestre: number | null = null;

  constructor(private peri: PeriodoService){}

  ngOnInit(): void {
    this.listarPeriodo();
  }

  listarPeriodo(): void {
    this.peri.obtenerSemestre().subscribe(
      (data) => {
        this.periodo = data;
        console.log('Actividades disponibles: ', this.periodo);
      },
      (error) => {
        console.error('Error al obtener actividades:', error);
      }
    );
  }

  crearSemestre(): void {
    const yearPattern = /^\d{4}$/;

    if(!yearPattern.test(this.newPeriodo.anio.toString())){
      this.errorMensaje = 'Porfavor ingrese un año valido';
      return;
    }

    if (!this.newPeriodo.anio ||
        !this.newPeriodo.denominacion ||
        !this.newPeriodo.fechaInicial ||
        !this.newPeriodo.fechaFinal){
          this.errorMensaje = 'Por favor, Complete todo los campos ;b';
          return;
        }

        if (new Date(this.newPeriodo.fechaFinal) < new Date(this.newPeriodo.fechaInicial)) {
          this.errorMensaje = 'La fecha final debe ser posterior a la fecha inicial.';
          return;
      }

      // Limpia el mensaje de error si todos los campos están llenos
      this.errorMensaje = '';

      const ultimoId = this.periodo.length > 0 ? Math.max(...this.periodo.map(p => p.id)) : 0;
      this.newPeriodo.id = ultimoId + 1;

      this.peri.crearSemestre(this.newPeriodo).subscribe(
        (response) => {
          console.log('Semestre Creado: ', response);
          this.listarPeriodo();
          this.newPeriodo = new Periodo(0, '', false, '', new Date(), new Date());
        },
        (error) => {
          console.error('Error al crear el Periodo: ', error);
          this.errorMensaje = 'Ocurrio un error al crear el semestre. Intentelo otra vez';
        }
      );
  }

  cambiarSemestre(): void {
    if (!this.selectedSemestre) {
      this.errorMensajeCambiar = 'Por favor, seleccione un semestre para cambiar.';
      return;
    }
  
    // Limpia el mensaje de error anterior
    this.errorMensajeCambiar = '';
  
    // Cambia el estado de los semestres
    this.periodo.forEach(p => {
      p.actual = p.id === this.selectedSemestre;
    });
  
    // Llama al servicio para actualizar el estado en el backend
    this.peri.actualizarSemestre(this.periodo).subscribe(
      response => {
        console.log('Semestre cambiado: ', response);
        this.listarPeriodo(); // Actualiza la lista para reflejar cambios
      },
      error => {
        console.error('Error al cambiar el semestre:', error);
        this.errorMensajeCambiar = 'Ocurrió un error al cambiar el semestre. Inténtelo de nuevo.';
      }
    );
  }
  
}

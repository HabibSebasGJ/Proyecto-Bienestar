import { Component, OnInit } from '@angular/core';
import { Periodo } from 'src/app/modelo/Periodo';
import { PeriodoService } from 'src/app/servicios/periodo.service';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit {

  errorMensaje: string = '';
  errorMensaje2: string = '';
  public periodo: Periodo[] = this.peri.semestrePeriodo;
  newPeriodo: Periodo = new Periodo(0, '', false, '', new Date(), new Date());

  constructor(private peri: PeriodoService) {}

  ngOnInit(): void {
    this.listarPeriodo();
  }

  listarPeriodo(): void {
    this.peri.obtenerSemestre().subscribe(
      (data) => {
        // Ordenar los semestres por año de forma descendente
        this.periodo = data.sort((a, b) => parseInt(b.anio.toString()) - parseInt(a.anio.toString()));
        console.log('Semestres disponibles: ', this.periodo);
      },
      (error) => {
        console.error('Error al obtener semestres:', error);
      }
    );
  }


  crearSemestre(): void {
    const yearPattern = /^\d{4}$/;

    if (!yearPattern.test(this.newPeriodo.anio.toString())) {
      this.errorMensaje = 'Por favor ingrese un año válido';
      return;
    }

    if (!this.newPeriodo.anio ||
        !this.newPeriodo.denominacion ||
        !this.newPeriodo.fechaInicial ||
        !this.newPeriodo.fechaFinal) {
      this.errorMensaje = 'Por favor, complete todos los campos';
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
        this.errorMensaje = 'Ocurrió un error al crear el semestre. Inténtelo otra vez';
      }
    );
  }

  cambiarEstado(semestre: Periodo): void {
    const nuevoEstado = !semestre.actual;

    if (nuevoEstado) {
      // Desactivar cualquier semestre que esté activo
      const semestreActivo = this.periodo.find(p => p.actual);
      if (semestreActivo && semestreActivo.id !== semestre.id) {
        semestreActivo.actual = false; // Desactivar el semestre activo
        this.peri.cambiarEstadoSemestre(semestreActivo.id, false).subscribe(
          (response) => {
            console.log('Estado del semestre desactivado:', response);
          },
          (error) => {
            console.error('Error al desactivar el semestre:', error);
            this.errorMensaje2 = 'Ocurrió un error al desactivar el semestre. Inténtelo otra vez';
          }
        );
      }
    }

    this.peri.cambiarEstadoSemestre(semestre.id, nuevoEstado).subscribe(
      (response) => {
        semestre.actual = nuevoEstado; // Actualiza el estado en la vista
        console.log('Estado del semestre actualizado:', response);
      },
      (error) => {
        console.error('Error al cambiar el estado del semestre:', error);
        this.errorMensaje2 = 'Ocurrió un error al cambiar el estado. Inténtelo otra vez';
      }
    );
  }

}

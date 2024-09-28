import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { Periodo } from 'src/app/modelo/Periodo';
import { PeriodoService } from 'src/app/servicios/periodo.service';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit{

  mensajeError: string = '';
  public periodo: Periodo[] = this.peri.semestrePeriodo
  newPeriodo: Periodo = new Periodo(0, 0, false, '', new Date(), new Date());

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
      this.mensajeError = 'Porfavor ingrese un año valido';
      return;
    }

    if (!this.newPeriodo.anio ||
        !this.newPeriodo.denominacion ||
        !this.newPeriodo.fechaInicial ||
        !this.newPeriodo.fechaFinal){
          this.mensajeError = 'Por favor, Complete todo los campos ;b';
          return;
        }

      // Limpia el mensaje de error si todos los campos están llenos
      this.mensajeError = '';

      const ultimoId = this.periodo.length > 0 ? Math.max(...this.periodo.map(p => p.id)) : 0;
      this.newPeriodo.id = ultimoId + 1;

      this.peri.crearSemestre(this.newPeriodo).subscribe(
        (response) => {
          console.log('Semestre Creado: ', response);
          this.listarPeriodo();
          this.newPeriodo = new Periodo(0, 0, false, '', new Date(), new Date());
        },
        (error) => {
          console.error('Error al crear el Periodo: ', error);
          this.mensajeError = 'Ocurrio un error al crear el semestre. Intentelo otra vez';
        }
      );
  }
}

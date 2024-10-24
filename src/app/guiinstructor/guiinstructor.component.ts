import { Component, OnInit } from '@angular/core';
import { Instructor } from '../modelo/Instructor';
import { Usuario } from '../modelo/Usuario';
import { SessionService } from '../servicios/session.service';
import { Actividad } from '../modelo/Actividad';
import { ActividadService } from '../servicios/actividad.service';
import { PeriodoEstadoService } from '../servicios/periodo-estado.service'; // Importar el servicio
import { Periodo } from '../modelo/Periodo'; // Importar el modelo de Periodo

@Component({
  selector: 'app-guiinstructor',
  templateUrl: './guiinstructor.component.html',
  styleUrls: ['./guiinstructor.component.scss'],
})
export class GUIInstructorComponent implements OnInit {
  mostrarCronogramaActividadInstructor: boolean = true;
  mostrarListarInscripcion: boolean = false;
  public usuario: Usuario = new Usuario(0, "", "", "", "", "", "", "", "", "");
  public actividades: Actividad[] = [];
  public periodoActivo: Periodo | null = null; // Variable para almacenar el periodo activo

  constructor(
    private sesSer: SessionService,
    private acti: ActividadService,
    private periodoEstadoService: PeriodoEstadoService // Inyectar el servicio
  ) {}

  ngOnInit(): void {
    this.listarActividades();
    this.usuario = this.sesSer.getUser();
    
    // Suscribirse al periodo activo
    this.periodoEstadoService.periodoActivo$.subscribe(
      (periodo) => {
        this.periodoActivo = periodo;
        console.log('Periodo activo en GuiInstructor:', this.periodoActivo);
        // Aquí puedes cargar las actividades asociadas al periodo activo, si es necesario
        if (this.periodoActivo) {
          this.cargarActividadesPorPeriodo(this.periodoActivo.id);
        }
      }
    );
  }

  cargarActividadesPorPeriodo(periodoId: number): void {
    // Implementa la lógica para cargar las actividades basadas en el periodo activo
    this.acti.obtenerActividadesPorPeriodo(periodoId).subscribe(  (data) => {
        this.actividades = data;
        console.log('Actividades cargadas para el periodo:', this.actividades);
      },
      (error) => {
        console.error('Error al cargar actividades por periodo:', error);
      }
    );
  }

  _mostrarListarInscripcion() {
    this.mostrarCronogramaActividadInstructor = false;
    this.mostrarListarInscripcion = true;
  }

  _mostrarmostrarCronogramaActividadInstructor() {
    this.mostrarCronogramaActividadInstructor = true;
    this.mostrarListarInscripcion = false;
  }

  listarActividades() {
    this.acti.obtenerActividades().subscribe(
      (data) => {
        this.actividades = data;
      }
    );
  }
}

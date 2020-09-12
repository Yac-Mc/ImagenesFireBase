import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {


  @Input() archivos: FileItem[] = [];
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any){
    this.mouseSobre.emit(true);
    this._PrevenirDetener(event);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any){
    this.mouseSobre.emit(false);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any){

    const transferencia = this._GetTransferencia(event);

    if (!transferencia){
      return;
    }

    this._ExtraerArchivos(transferencia.files);

    this._PrevenirDetener(event);
    this.mouseSobre.emit(false);

  }

  private _GetTransferencia(event: any){
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _ExtraerArchivos( archivoLista: FileList){

    // tslint:disable-next-line: forin
    for (const propiedad in Object.getOwnPropertyNames(archivoLista)){
      const tmpArchivo = archivoLista[propiedad];

      if (this._ArchivoPuedeSerCargado(tmpArchivo)){
        const newArchivo = new FileItem(tmpArchivo);
        this.archivos.push(newArchivo);
      }

    }

  }


  // Validaciones
  private _ArchivoPuedeSerCargado(archivo: File): boolean{
    if (!this._ArchivoExisteEnDrop(archivo.name) && this._EsImagen(archivo.type)){
      return true;
    }
    else{
      return false;
    }
  }

  private _PrevenirDetener( event ){
    event.preventDefault();
    event.stopPropagation();
  }

  private _ArchivoExisteEnDrop(nombreArcvhivo: string): boolean {
    for (const archivo of this.archivos){
      if (archivo.nombreArchivo === nombreArcvhivo){
        return true;
      }
    }
    return false;
  }

  private _EsImagen( tipoArchivo: string){
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }

}

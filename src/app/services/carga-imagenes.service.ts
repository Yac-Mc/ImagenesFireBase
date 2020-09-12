import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private carpetaImagenes = 'img';
  constructor(private db: AngularFirestore) { }

  cargarImgFirebase(imagenes: FileItem[]){

    const storageRef = firebase.storage().ref();

    for (const item of imagenes){

      item.cargando = true;
      if (item.progreso >= 100){
        continue;
      }

      const uploadTask: firebase.storage.UploadTask = storageRef
                                                        .child(`${this.carpetaImagenes}/${item.nombreArchivo}`)
                                                        .put(item.archivo);

      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          (error) => console.error('Error al subir', error),
          () => {
            console.log('Imagen cargada correctamente');
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              item.url = url;
              item.cargando = false;
              this.guardarImagen({
                nombre: item.nombreArchivo,
                url: item.url
              });
            });
          }
        );
    }

  }

  private guardarImagen(imagen: {nombre: string, url: string}){

    this.db.collection(`/${this.carpetaImagenes}`)
            // .add(Object.assign({}, imagen));
            .add(imagen);

  }
}

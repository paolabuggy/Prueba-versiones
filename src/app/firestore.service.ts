import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  //Crea un nuevo producto
  public createProduct(data: {nombre: string, url: string}) {
    return this.firestore.collection('products').add(data);
  }

  //Obtiene un producto
  public getProduct(documentId: string) {
    return this.firestore.collection('products').doc(documentId).snapshotChanges();
  }

  //Obtiene todos los productos
  public getProducts() {
    return this.firestore.collection('products').snapshotChanges();
  }

  //Actualiza un producto
  public updateProduct(documentId: string, data: any) {
    return this.firestore.collection('products').doc(documentId).set(data);
  }

  // Borra un producto
  public deleteProduct(documentId: string) {
    return this.firestore.collection('products').doc(documentId).delete();
  }
}

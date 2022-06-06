import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../firestore.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {

  public products: any = [];

  public documentId = "";
  public currentStatus = 1;
  public newProductForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
    id: new FormControl('')
  });

  constructor(private firestoreService: FirestoreService) { 
    
  }

  ngOnInit() {
    this.newProductForm.setValue({
      id: '',
      nombre: '',
      url: ''
    });

    
    this.firestoreService.getProducts().subscribe((productsSnapshot) => {
      this.products = [];
      productsSnapshot.forEach((productData: any) => {
        this.products.push({
          id: productData.payload.doc.id,
          data: productData.payload.doc.data()
        });
      });
    });
  }

  public newProduct(form:any, documentId = this.documentId) {
    console.log(`Status: ${this.currentStatus}`);
    if (this.currentStatus == 1) {
      let data = {
        nombre: form.nombre,
        url: form.url
      }
      this.firestoreService.createProduct(data).then(() => {
        console.log('Documento creado exitosamente!');
        this.newProductForm.setValue({
          nombre: '',
          url: '',
          id: ''
        });
      }, (error) => {
        console.error(error);
      });
    } else {
      let data = {
        nombre: form.nombre,
        url: form.url
      }
      this.firestoreService.updateProduct(documentId, data).then(() => {
        this.currentStatus = 1;
        this.newProductForm.setValue({
          nombre: '',
          url: '',
          id: ''
        });
        console.log('Documento editado exitosamente');
      }, (error) => {
        console.log(error);
      });
    }
  }

  public editProduct(documentId:any) {
    let editSubscribe = this.firestoreService.getProduct(documentId).subscribe((product:any) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.newProductForm.setValue({
        id: documentId,
        nombre: product.payload.data()['nombre'],
        url: product.payload.data()['url']
      });
      editSubscribe.unsubscribe();
    });
  }
  
  public deleteProduct(documentId:any) {
    this.firestoreService.deleteProduct(documentId).then(() => {
      console.log('Documento eliminado!');
    }, (error) => {
      console.error(error);
    });
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Producto } from 'src/app/model/Producto';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductoTemporalService } from 'src/app/services/producto-temporal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-inicio',
  templateUrl: './pantalla-inicio.component.html',
  styleUrls: ['./pantalla-inicio.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PantallaInicioComponent implements OnInit {
  title = 'Polishop';
  productos: Array<Producto>;
  productosPoli: Array<Producto>;
  productosComu: Array<Producto>;

  matrizPrincipalesPoli: Producto[][];
  matrizPrincipalesComu: Producto[][];
  productoTemp: Producto;

  constructor(private productoService: ProductoService, private productoTemporal: ProductoTemporalService, private router: Router){
    this.matrizPrincipalesPoli = [];
    this.matrizPrincipalesComu = [];
    this.cargarProductosPoli();
    this.cargarProductosComu();
    this.cargarTodosProductos();
  }

  cargarProductosPoli(){
    this.productoService.getAllProductosByDependencia('Poli').subscribe(
      misProductosObs => {
        this.productosPoli = misProductosObs;
      },
      error => {
        console.error('Error: ', error);
      },
      () => {
        console.log("Productos Poli cargados satisfactoriamente.");
        this.cargarProdPeqPoli();
      }
    );
  }

  cargarProductosComu(){
    this.productoService.getAllProductosByDependencia('Comunidad').subscribe(
      misProductosObs => {
   
        this.productosComu = misProductosObs;
      },
      error => {
        console.error('Error: ', error);
      },
      () => {
        console.log("Productos Comunidad cargados satisfactoriamente.");
        this.cargarProdPeqComu();
      }
    );
  }

  cargarTodosProductos(){
    this.productoService.getAllProductos().subscribe(
      misProductosObs => {
        this.productos = misProductosObs;
      },
      error => {
        console.log("Error: ", error);
      },
      () => {
        console.log("Productos cargados satisfactoriamente.");
      }
    );
  }

  cargarProdPeqPoli(){
    var aux = 0;
    loop: for(var i = 0; i < 3; i++){
      this.matrizPrincipalesPoli[i] = [];
      for(var j = 0; j < 3; j++){
        if(aux == 9) break loop;
        this.matrizPrincipalesPoli[i][j] = this.productosPoli[aux];
        aux++;
      }
    }
  }

  cargarProdPeqComu(){
    var aux = 0;
    loop: for(var i = 0; i < 3; i++){
      this.matrizPrincipalesComu[i] = [];
      for(var j = 0; j < 3; j++){
        if(aux == 9) break loop;
        this.matrizPrincipalesComu[i][j] = this.productosComu[aux];
        aux++;
      }
    }
  }

  goProducto(producto){
    this.productoTemp = producto;
    this.productoTemporal.actualProduct = this.productoTemp;
        
    this.router.navigate(
      ['/p-producto/', producto.id],
      {queryParams: {
        idProd: this.productoTemp.id, 
        nameProd: this.productoTemp.nombre
      }, 
      skipLocationChange: false}
    );
    this.delay(5);
  }

  doSomething(){
    console.log('did something');
  }

  ngOnInit() {
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>location.reload());
  }

}

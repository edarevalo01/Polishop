import { Comprador } from "./comprador";
import { ProductoCarrito } from "./producto-carrito";
import { Producto } from "./producto";
import { GeneralService } from "../Services/general.service";
import { Storage } from "@ionic/storage";

export class ObservablePolishop {
	static instance: ObservablePolishop;
	private observers: IObserverPolishop[];
	public precioTotal: number = 0;

	// Flags
	public settedUsuario: boolean = false;
	public settedProductosCarrito: boolean = false;
	public settedProductosPoli: boolean = false;
	public settedProductosComu: boolean = false;
	public settedAllProductos: boolean = false;

	// Data
	public usuario: Comprador;
	public productosCarrito: ProductoCarrito[] = [];
	public productosPoli: Producto[] = [];
	public productosComu: Producto[] = [];
	public allProductos: Producto[] = [];

	/**
	 * Constructor
	 * @param service
	 */
	private constructor(public service: GeneralService) {
		this.observers = [];
		this.getProductosPoli();
		this.getProductosComu();
		this.getAllProductos();
	}

	public refrescarPeticiones() {
		this.settedProductosPoli = false;
		this.settedProductosComu = false;
		this.settedAllProductos = false;

		this.productosPoli = [];
		this.productosComu = [];
		this.allProductos = [];
		this.getProductosPoli();
		this.getProductosComu();
		this.getAllProductos();
	}

	public refrescarCarrito() {
		this.settedProductosCarrito = false;
		this.productosCarrito = [];
		this.getProductosCarrito();
	}

	/**
	 * Obtener instancia unica (Singleton).
	 * @param service
	 */
	public static getInstance(service: GeneralService): ObservablePolishop {
		if (ObservablePolishop.instance == undefined) {
			ObservablePolishop.instance = new ObservablePolishop(service);
		}
		return ObservablePolishop.instance;
	}

	/**
	 * Agregar Observer.
	 * @param observer
	 */
	public addObserver(observer: IObserverPolishop) {
		this.observers.push(observer);
		this.informarObservers();
	}

	/**
	 * Informar Observers.
	 */
	private informarObservers() {
		this.observers.forEach(function(observer) {
			observer.refrescarDatos();
		});
	}

	public deleteSesionUsuario() {
		this.usuario = new Comprador();
		this.productosCarrito = [];
		this.settedProductosCarrito = false;
		this.settedUsuario = false;
		this.precioTotal = 0;
		this.informarObservers();
	}

	public getUsuarioFirstTime() {
		this.getUsuario();
	}

	private getUsuario() {
		var idUsuario = this.service.getIdUsuario();
		if (!this.settedUsuario) {
			this.service.getInfoCompradorById(+idUsuario).subscribe(
				(response) => {
					this.settedUsuario = true;
					this.usuario = response;
				},
				(error) => {},
				() => {
					this.informarObservers();
					this.getProductosCarrito();
				}
			);
		} else {
			this.informarObservers();
		}
	}

	private getProductosCarrito() {
		this.precioTotal = 0;
		var idUsuario = this.service.getIdUsuario();
		if (!this.settedProductosCarrito) {
			this.service.getProductosCarrito(+idUsuario).subscribe(
				(response) => {
					this.settedProductosCarrito = true;
					this.productosCarrito = response;
				},
				(error) => {},
				() => {
					this.informarObservers();
					this.productosCarrito.forEach((producto) => {
						this.precioTotal += parseInt(producto.valor) * producto.cantidad;
					});
				}
			);
		} else {
			this.informarObservers();
		}
	}

	private getProductosPoli() {
		if (!this.settedProductosPoli) {
			this.service.getProductosByDependencia("Poli").subscribe(
				(response) => {
					this.settedProductosPoli = true;
					this.productosPoli = response;
				},
				(error) => {},
				() => {
					this.informarObservers();
				}
			);
		} else {
			this.informarObservers();
		}
	}

	private getProductosComu() {
		if (!this.settedProductosComu) {
			this.service.getProductosByDependencia("Comunidad").subscribe(
				(response) => {
					this.settedProductosComu = true;
					this.productosComu = response;
				},
				(error) => {},
				() => {
					this.informarObservers();
				}
			);
		} else {
			this.informarObservers();
		}
	}

	private getAllProductos() {
		if (!this.settedAllProductos) {
			this.service.getAllProductos().subscribe(
				(response) => {
					this.settedAllProductos = true;
					this.allProductos = response;
				},
				(error) => {},
				() => {
					this.informarObservers();
				}
			);
		} else {
			this.informarObservers();
		}
	}

	public addProductoACarrito(producto: Producto) {
		this.settedProductosCarrito = false;
		this.getProductosCarrito();
	}
}

export interface IObserverPolishop {
	refrescarDatos();
}

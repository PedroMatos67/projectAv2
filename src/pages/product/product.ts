import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController
} from "ionic-angular";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-product",
  templateUrl: "product.html"
})
export class ProductPage {
  product;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private storage: Storage,
    public toastCtrl: ToastController
  ) {
    this.product = this.navParams.get("product");
  }

  
  refresh = refresher => {
    refresher.complete();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  };

 
  close = () => this.viewCtrl.dismiss();

  
  addToCart = () => {
    let cart = [];
    this.storage.get("cart_pizza_app").then(res => {
      if (res) cart = res;

     
      let product = {
        price: this.product.price,
        title: this.product.title
      };
      cart.push(product);

     
      this.storage.set("cart_pizza_app", cart).then(() => {
        this.toastCtrl
          .create({
            message: `Já adicionamos ${this.product.title} ao seu carrinho ;)`,
            showCloseButton: true,
            closeButtonText: "Ok",
            position: "top",
            duration: 3000
          })
          .present()
          .then(() => {
            this.close();
          });
      });
    });
  };

  
  toPrice = price => parseFloat(price).toFixed(2);
}

import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { FirebaseProvider } from "../../providers/firebase";
import { LoadingProvider } from "../../providers/loading";

@IonicPage()
@Component({
  selector: "page-feed",
  templateUrl: "feed.html"
})
export class FeedPage {
  user;
  products;
  amount = 0;
  items = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private firebaseProvider: FirebaseProvider,
    private loadingProvider: LoadingProvider,
    private modalCtrl: ModalController
  ) {
    this.loadingProvider.present().then(() => {
      this.getCurrentUser();
      this.getProducts();
    });
  }

  
  refresh(refresher) {
    refresher.complete();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  
  open = product => this.modalCtrl.create("ProductPage", { product }).present();

 
  openCart = () => this.modalCtrl.create("CartPage", { modal: true }).present();

  
  openProducts = () =>
    this.modalCtrl.create("MenuPage", { modal: true }).present();

  ionViewDidLoad = () => {
    
    this.storage.get("cart_pizza_app").then(res => {
      if (res) {
        this.items = res;

        
        let i = 0;
        for (i; i < this.items.length; i++) {
          let price = parseFloat(this.items[i].price);
          this.amount = this.amount + price;
        }
      }
    });
  };

  
  getCurrentUser = () => {
    this.storage.get("user_pizza_app").then(user => {
      this.user = user;
    });
  };

  
  getProducts = () => {
    this.firebaseProvider.getProducts().subscribe(res => {
      this.loadingProvider.dismiss();
      this.products = res;
    });
  }

 
  toPrice = price => parseFloat(price).toFixed(2);
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingProvider } from '../../providers/loading';
import { FirebaseProvider } from '../../providers/firebase';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cart = [];
  modal = false;
  amount = 0;
  user;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    public alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private loadingProvider: LoadingProvider,
    private firebaseProvider: FirebaseProvider
  ) {
    this.getCartData();
    this.getCurrentUser();
    this.modal = this.navParams.get('modal');
  }

 
  refresh(refresher) {
    refresher.complete();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

 
  close() {
    this.viewCtrl.dismiss()
  }

  
  getCartData() {
    this.storage.get('cart_pizza_app')
      .then((res) => {
        if (res) {
          this.cart = res;
          this.updateAmount();
        }
      })
  }

  
  updateAmount() {
  
    let i = 0;
    for (i; i < this.cart.length; i++) {
      let price = parseFloat(this.cart[i].price);
      this.amount = this.amount + price;
    }
  }

  
  toPrice(price) {
    price = parseFloat(price);
    return price.toFixed(2);
  }

  
  removeItem(i, item) {
    let index = i;
    this.cart.splice(index, 1);
        this.storage.set('cart_pizza_app', this.cart)
      .then((res) => {
        let alert = this.alertCtrl.create({
          title: 'Sucesso',
          subTitle: 'Item removido do seu carrinho com sucesso!',
          buttons: ['Ok']
        });
        alert.present();
        this.updateAmount();
      })
  }


  getCurrentUser() {
    this.storage.get('user_pizza_app')
      .then((user) => {
        this.user = user;
      })
  }

  
  pay() {
    const prompt = this.alertCtrl.create({
      title: 'Finalizar',
      message: "Total: R$" + this.toPrice(this.amount),
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Efetuar pedido',
          handler: data => {
           
            this.loadingProvider.present();
            let order = {
              items: this.cart,
              total: this.amount,
              from: this.user.uid
            }
            this.firebaseProvider.postOrder(order)
              .then((res) => {
                this.loadingProvider.dismiss();
                
                this.storage.set('cart_pizza_app', null);

                
                let alert = this.alertCtrl.create({
                  title: 'Obrigado',
                  subTitle: 'Seu pedido em breve estara pronto!',
                  buttons: ['Voltar']
                });
                alert.present();
              })
          }
        }
      ]
    });
    prompt.present();
  }

}

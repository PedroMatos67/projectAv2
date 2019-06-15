import { NgModule } from './node_modules/@angular/core';
import { IonicPageModule } from './node_modules/ionic-angular';
import { ProductPage } from './product';

@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
  ],
})
export class ProductPageModule {}

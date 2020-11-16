import { NumberFormatStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CartserviceService } from 'src/app/service/cartservice.service';
import { ProductserviceService } from 'src/app/service/productservice.service';
import { UserService } from 'src/app/service/UserService';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items: any = [];
  //imageUrl:any;
  grandTotal: any = 0;
  tempProductId: any = 0;
  cartArray: any = [];
  productArray: any = [];
  combinedArray: any = [];
  hasUserCartItems: boolean = false;
  userArray: any = [];
  productUnitInStock: any;
  showSnipper: boolean = false;
  isUserNull: boolean = false;
  constructor(private cartService: CartserviceService, private userService: UserService,
    private productService: ProductserviceService,
    private sanitizer: DomSanitizer) {

    if (sessionStorage.getItem("regId") == null) {
      window.alert("you need to login first");
      this.isUserNull = true;
    }


    this.sniper();
    console.log("2 unit in stock of product table is " + this.productUnitInStock);
  }

  sniper() {
    this.showSnipper = true;
    setTimeout(() => {
      this.showSnipper = false;
      this.getCart();
    }, 1000);
  }

  getCart() {
    this.cartService.getCartItemById(sessionStorage.getItem("regId")).subscribe(res => {
      console.log("this user has cart item " + sessionStorage.getItem("regId"));

      this.cartArray = res['response'];
      console.log(this.cartArray);
      for (let ca of this.cartArray) {
        if (ca.user_reg_id == sessionStorage.getItem("regId"))
          this.hasUserCartItems = true;
        this.grandTotal = this.grandTotal + ca.total_price;
        console.log("grand total in get cart is " + this.grandTotal);
        this.productService.getProductById(ca.product_id).subscribe(res => {
          this.productArray = res['response'];
          for (let pa of this.productArray)
            this.productUnitInStock = pa.unit_in_stock;
          console.log("1 unit in stock of product table is " + this.productUnitInStock + "----" + ca.product_id);

        });
      }
    });
  }
  value: any;
  getValue(event: any) {
    this.value = event.target.innerText;
    console.log(this.value);
  }

  incrementQuantity(product_id: any) {
    for (var i = 0; i < this.cartArray.length; i++) {
      if (this.cartArray[i].product_id == product_id) {
        if (this.cartArray[i].unit_in_stock != 0) {
          console.log("checking cart array " + this.cartArray[i].quantity + "---prd unit in stock " + this.productUnitInStock);
          this.productUnitInStock -= 1;
          this.cartArray[i].quantity += 1;
          this.cartArray[i].total_price = this.cartArray[i].quantity * this.cartArray[i].product_price;
          this.grandTotal = this.grandTotal + this.cartArray[i].product_price;
          this.productService.updateProductUnitOnly(this.cartArray[i].product_id, this.productUnitInStock).subscribe();
          this.cartService.updateCart(this.cartArray[i].cart_item_id, sessionStorage.getItem("regId"),
            this.cartArray[i].product_id, this.cartArray[i].quantity, this.cartArray[i].total_price).subscribe();
          console.log("increment updated");
        }
      }
    }
  }

  decrementQuantity(product_id: any) {
    for (var i = 0; i < this.cartArray.length; i++) {
      if (this.cartArray[i].product_id == product_id) {
        if (this.cartArray[i].quantity != 1) {
          this.productUnitInStock += 1;
          this.cartArray[i].quantity -= 1;
          this.cartArray[i].total_price = this.cartArray[i].quantity * this.cartArray[i].product_price;
          this.grandTotal = this.grandTotal - this.cartArray[i].product_price;
          this.productService.updateProductUnitOnly(this.cartArray[i].product_id, this.productUnitInStock).subscribe();
          this.cartService.updateCart(this.cartArray[i].cart_item_id, sessionStorage.getItem("regId"),
            this.cartArray[i].product_id, this.cartArray[i].quantity, this.cartArray[i].total_price).subscribe();
          console.log("decrement updated");
        }
      }
    }
  }


  removeItem(product_id: any) {
    for (var i = 0; i < this.cartArray.length; i++) {
      if (this.cartArray[i].product_id == product_id) {
        this.productService.updateProductUnitOnly(this.cartArray[i].product_id, (this.productUnitInStock + this.cartArray[i].quantity)).subscribe();
        this.cartService.deleteCart(product_id, sessionStorage.getItem("regId")).subscribe();
        console.log("cart item deleted");
        window.alert("item removed");
        this.hasUserCartItems = false;
        break;
      }
    }
    this.showSnipper = true;
    setTimeout(() => {
      this.showSnipper = false;
      this.grandTotal = 0;
      this.getCart();
    }, 1000);

  }


  ngOnInit(): void {
    console.log("ng oninit called");
  }

  getSantizeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}

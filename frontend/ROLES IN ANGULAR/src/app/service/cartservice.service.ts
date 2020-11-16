import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class CartserviceService {
  items: any = [];
  quantity: any = 0;
  cartUri = "http://localhost:3000/api/cart/items"
  constructor(private http: HttpClient) { }

  addToCart(product: any = []) {
    console.log(" cart service addProducts method called " + JSON.stringify(product));
    for (var i = 0; i < product.length; i++) {
      this.items.push(product[i]);

    }

  }
  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  getAllCartItems() {
    return this.http.get<any>(`${this.cartUri}`);
  }

  getCartItemById(user_reg_id) {
    return this.http.get<any>(`${this.cartUri}/${user_reg_id}`);
  }



  addCartItem(product_id, user_reg_id, quantity, total_price, product_price, product_name, product_category, product_description,
    unit_in_stock, product_image) {
    const add_cart_item = {

      product_id: product_id,
      user_reg_id: user_reg_id,
      quantity: quantity,
      total_price: total_price,
      product_price: product_price,
      product_name: product_name,
      product_category: product_category,
      product_description: product_description,
      unit_in_stock: unit_in_stock,
      product_image: product_image
    };
    console.log("before adding cartitems into table");
    return this.http.post(`${this.cartUri}`, add_cart_item);
  }



  updateCart(cart_item_id, user_reg_id, product_id, quantity, total_price) {
    const update_cart = {
      cart_item_id: cart_item_id,
      user_reg_id: user_reg_id,
      product_id: product_id,
      quantity: quantity,
      total_price: total_price
    };
    console.log("before updating product into table");
    return this.http.put(`${this.cartUri}/${product_id}/${user_reg_id}`, update_cart);

  }

  deleteCart(product_id: number, user_reg_id: any) {
    return this.http.delete(`${this.cartUri}/${product_id}/${user_reg_id}`);
  }

  deleteWholeCart(user_reg_id) {
    return this.http.delete(`${this.cartUri}/${user_reg_id}`);
  }

}

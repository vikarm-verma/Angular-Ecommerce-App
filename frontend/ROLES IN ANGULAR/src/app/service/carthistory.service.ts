import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarthistoryService {

  constructor(private http: HttpClient) { }

  cartHistoryUri = "http://localhost:3000/api/cart/items/history"
  getAllCartHistoryItems() {
    return this.http.get<any>(`${this.cartHistoryUri}`);
  }

  getCartHistoryItemById(user_reg_id) {
    return this.http.get<any>(`${this.cartHistoryUri}/${user_reg_id}`);
  }



  addCartHistoryItem(cart_item_id, product_id, user_reg_id, quantity, total_price, product_price, product_name,
    product_category, product_description,
    unit_in_stock, product_image) {
    const add_cart_item = {
      cart_item_id: cart_item_id,
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
    console.log("before adding cartitems into history table");
    return this.http.post(`${this.cartHistoryUri}`, add_cart_item);
  }



  updateCartHistoryItem(cart_item_id, user_reg_id, product_id, quantity, total_price) {
    const update_cart = {
      cart_item_id: cart_item_id,
      user_reg_id: user_reg_id,
      product_id: product_id,
      quantity: quantity,
      total_price: total_price
    };
    console.log("before updating product into table");
    return this.http.put(`${this.cartHistoryUri}/${product_id}/${user_reg_id}`, update_cart);

  }

  deleteCartHistoryItem(product_id: number, user_reg_id: any) {
    return this.http.delete(`${this.cartHistoryUri}/${product_id}/${user_reg_id}`);
  }


}

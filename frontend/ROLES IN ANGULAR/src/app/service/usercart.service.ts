import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsercartService {


  userCartUri="http://localhost:3000/api/usercart/items"
  constructor(private http: HttpClient) { }

  getUserItems() {
    return this.http.get<any>(`${this.userCartUri}`);
  }

  getUserCartItemById(user_reg_id) {
    return this.http.get<any>(`${this.userCartUri}/${user_reg_id}`);
  }

  
  
  addUserCartItem(user_reg_id,grand_total) {
    const add_cart_item = {
      user_reg_id:user_reg_id,
      grand_total:grand_total
    };
    console.log("before adding cartitems into final cart table");
    return this.http.post(`${this.userCartUri}`,add_cart_item);
  }



  updateUserCartItem(cart_item_id,user_reg_id,product_id,quantity,total_price) {
    const update_cart = {
      cart_item_id:cart_item_id,
      user_reg_id:user_reg_id,
      product_id:product_id,
      quantity:quantity,
      total_price:total_price
    };
    console.log("before updating product into table");
    return this.http.put(`${this.userCartUri}/${product_id}/${user_reg_id}`, update_cart);
    
  }
  // updateUserProfile(user_profile_id, user_name, user_age, user_mobile, user_gender, user_address, user_image) {
  //   const update_user_profile = {
  //     user_profile_id: user_profile_id,
  //     user_name: user_name,
  //     user_age: user_age,
  //     user_mobile: user_mobile,
  //     user_gender: user_gender,
  //     user_address: user_address,
  //     user_image: user_image
  //   };
  //   return this.http.put(`${this.uri}/${user_profile_id}`, update_user_profile);
  // }

  deleteUserCartItem(product_id: number,user_reg_id:any) {
    return this.http.delete(`${this.userCartUri}/${product_id}/${user_reg_id}`);
  }

}

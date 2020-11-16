import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {

  // uri = "http://localhost:3000-/api/users/profile";
  // adminUri = "http://localhost:3000/api/users/foradmin";
  productUri = "http://localhost:3000/api/products"
  productUnitUri = "http://localhost:3000/api/products/units"

  productId: any;
  constructor(private http: HttpClient) { }

  // getUsersForAdmin() {
  //   return this.http.get<any>(`${this.adminUri}`);
  // }

  getAllProducts() {
    return this.http.get<any>(`${this.productUri}`);
  }

  getProductById(product_id) {
    return this.http.get<any>(`${this.productUri}/${product_id}`);
  }

  addProduct(product_id, product_name, product_category, product_description, product_price, unit_in_stock, product_image) {
    const add_product = {
      product_id: product_id,
      product_name: product_name,
      product_category: product_category,
      product_description: product_description,
      product_price: product_price,
      unit_in_stock: unit_in_stock,
      product_image: product_image
    };
    console.log("before adding product into table");
    return this.http.post(`${this.productUri}`, add_product);
  }



  updateProduct(product_id, product_name, product_category, product_description, product_price, unit_in_stock, product_image) {
    const update_product = {
      product_id: product_id,
      product_name: product_name,
      product_category: product_category,
      product_description: product_description,
      product_price: product_price,
      unit_in_stock: unit_in_stock,
      product_image: product_image
    };
    console.log("before updating product into table");
    return this.http.put(`${this.productUri}/${product_id}`, update_product);

  }

  deleteProduct(product_id: number) {
    return this.http.delete(`${this.productUri}/${product_id}`);
  }

  updateProductUnitOnly(product_id, unit_in_stock) {
    const update_unit = {
      product_id: product_id,
      unit_in_stock: unit_in_stock
    };
    console.log("before unit updated");
    return this.http.put(`${this.productUnitUri}/${product_id}`, update_unit);

  }

}

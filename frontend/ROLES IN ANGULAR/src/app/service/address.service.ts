import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  addressUri = "http://localhost:3000/api/user/address"
  constructor(private http: HttpClient) { }

  setAddress(user_reg_id, full_name, street_address_1,
    street_address_2, city, state, zip_code) {
    const set_address = {

      user_reg_id: user_reg_id,
      full_name: full_name,
      street_address_1: street_address_1,
      street_address_2: street_address_2,
      city: city,
      state: state,
      zip_code: zip_code

    }
    return this.http.post(`${this.addressUri}`, set_address);
  }

  getAllAddress() {
    return this.http.get<any>(`${this.addressUri}`);
  }

  getAddressById(user_reg_id) {
    return this.http.get<any>(`${this.addressUri}/${user_reg_id}`);
  }

  updateAddress(user_reg_id, full_name, street_address_1,
    street_address_2, city, state, zip_code) {
    const update_address = {

      user_reg_id: user_reg_id,
      full_name: full_name,
      street_address_1: street_address_1,
      street_address_2: street_address_2,
      city: city,
      state: state,
      zip_code: zip_code
    }
    return this.http.put(`${this.addressUri}/${user_reg_id}`, update_address);
  }

  deleteAddress(user_reg_id) {
    return this.http.delete(`${this.addressUri}/${user_reg_id}`);
  }
}

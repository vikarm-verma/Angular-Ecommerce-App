import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

/* profile service for crud operation with user and admin */

export class ProfileserviceService {

  uri = "http://localhost:3000/api/users/profile";
  adminUri = "http://localhost:3000/api/users/foradmin";

  constructor(private http: HttpClient) { }

  getUsersForAdmin() {
    return this.http.get<any>(`${this.adminUri}`);
  }

  getUserProfile() {
    return this.http.get<any>(`${this.uri}`);
  }

  getUserProfileById(user_profile_id) {
    return this.http.get<any>(`${this.uri}/${user_profile_id}`);
  }

  addUserProfile(user_reg_id, user_name, user_age, user_mobile, user_gender, user_address, user_image) {
    const add_user_profile = {
      user_reg_id: user_reg_id,
      user_name: user_name,
      user_age: user_age,
      user_mobile: user_mobile,
      user_gender: user_gender,
      user_address: user_address,
      user_image: user_image
    };
    // console.log("in userprofile service add user method");
    return this.http.post(`${this.uri}`, add_user_profile);
  }

  updateUserProfile(user_profile_id, user_name, user_age, user_mobile, user_gender, user_address, user_image) {
    const update_user_profile = {
      user_profile_id: user_profile_id,
      user_name: user_name,
      user_age: user_age,
      user_mobile: user_mobile,
      user_gender: user_gender,
      user_address: user_address,
      user_image: user_image
    };
    return this.http.put(`${this.uri}/${user_profile_id}`, update_user_profile);
  }

  deleteUserProfile(user_profile_id: number) {
    return this.http.delete(`${this.uri}/${user_profile_id}`);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

/* user service for crud operation */
export class UserService {
 
  
  uri = "http://localhost:3000/api/users";

  constructor(private http: HttpClient) { }

  getUser() {
    return this.http.get<any>(`${this.uri}`);
  }

  getUserById(user_reg_id) {
    return this.http.get(`${this.uri}/${user_reg_id}`);
  }

  addUser(user_email,user_password, user_repassword,user_role) {
    const add_user = {
      user_email: user_email,
      user_password: user_password,
      user_repassword: user_repassword,
      user_role:user_role
    };
    return this.http.post(`${this.uri}`, add_user);
  }

  updateUser(user_reg_id:any,user_password:any, user_repassword:any) {
    const update_user = {
      user_password: user_password,
      user_repassword: user_repassword,
    };
    return this.http.put(`${this.uri}/${user_reg_id}`,update_user);
  }

  deleteUser(user_reg_id:number) {
    return this.http.delete(`${this.uri}/${user_reg_id}`);
  }

}
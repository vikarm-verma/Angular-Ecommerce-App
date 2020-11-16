
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProfileserviceService } from '../service/profileservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  title: any;
  uEmail: any;
  isUserLoggedIn = true;
  isAdminRole: boolean = false;
  role: any;
  isNonAdminRole: boolean = false;
  allUsers: any = [];
  imageUrl: any;
  userName: any;

  // here you can see DomSanitizer - it is use sanitize the url which you use while working with image , it gives
  // a kind of persmission to user that he/she can access the url and work with it
  constructor(private router: Router,
    private ups: ProfileserviceService,
    private sanitizer: DomSanitizer) {
    //when user logs in at that time some items set into sessionStoragre which will help you out for the whole
    //project to check and get them whenever required   
  }

  navbarOpen = false;
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  //here sessionstorage will remove all items 
  logout() {
    sessionStorage.clear();
    this.isUserLoggedIn = !this.isUserLoggedIn;
    this.isAdminRole = false;
    this.isNonAdminRole = false;
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.uEmail = sessionStorage.getItem("email");
    this.role = sessionStorage.getItem("role");
    if (this.role == 'admin')
      this.isAdminRole = true;
    if (this.uEmail === null) {
      this.isUserLoggedIn = !this.isUserLoggedIn;
    }
    else {
      this.isUserLoggedIn = this.isUserLoggedIn;
      this.ups.getUserProfile().subscribe((data) => {
        this.allUsers = data['response'];
        for (let prUser of this.allUsers) {
          if (prUser.user_reg_id == sessionStorage.getItem("regId")) {
            this.userName = prUser.user_name;
            sessionStorage.setItem("userName", this.userName);
            // we are getting image path from my sql and concatenating it with node api path ,
            //here the path is not going to match with any method instead it will search for that
            //static folder where such named image is stored.
            this.imageUrl = "http://localhost:3000/" + prUser.user_image;
          }
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/UserService';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  allUsers: any = [];
  user_email: any;
  password: any;
  repassword: any;
  userArray: any;
  userRole = "user";
  isUserEmailValid: boolean = true;
  isBothPassValid: boolean = true;

/* getting all user */
  constructor(private ccs: UserService, private router: Router, private dialog: MatDialog) {
    this.ccs.getUser().subscribe(res => {
      this.userArray = res['response'];
    });
  }

  ngOnInit() {
   // console.log("ngoninit working");
  }

/* adding user to db */
  addUser() {
    for (var ua of this.userArray) {
  //    console.log(this.user_email + ' == ' + ua.user_email);
      if (this.user_email == ua.user_email && ua.user_email != '') {
    //    console.log("user is already registered");
        this.isUserEmailValid = false;
        return;
      }
      else {
        this.isUserEmailValid = true;
      }
    }

    if (this.password === this.repassword) {
      this.ccs.addUser(this.user_email, this.password, this.repassword, this.userRole = 'user').subscribe((data) => console.log(data));
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "Successfully registered !!!",
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.router.navigate(['/login']);
        }
      });
    }
    else {
      this.isBothPassValid = false;
     // console.log("password does not match");
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "PASSWORDS DO NOT MATCH !!!",
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.router.navigate(['/register']);
        }
      });
    }
  }

  cancel() {
    this.user_email = "";
    this.password = "";
    this.repassword = "";
    this.userRole = "";
    this.isUserEmailValid = true;
    this.isBothPassValid = true;
  }
}

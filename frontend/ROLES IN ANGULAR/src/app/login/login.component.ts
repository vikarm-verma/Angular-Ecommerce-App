import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../service/UserService';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  isLoginMode = true;
  email: any;
  regId: any;
  password: any;
  userArray: any;
  result: boolean = false;
  user_role: any;
  checkUser: boolean = false;

  /* here UserService is called for getting user data ,Router for navigate to another url , and MatDialog
  for showing dialog box */
  alreadyLoggedIn: boolean = false;
  constructor(private ccs: UserService, private router: Router, private dialog: MatDialog) {
    this.ccs.getUser().subscribe(res => {
      this.userArray = res['response'];
      if (this.userArray.user_reg_id == sessionStorage.getItem("regId"))
        this.alreadyLoggedIn = true;

        //having same logic if already logged in user tries to get login page , so he will redirected to 
        //home page after 2 seconds.
      else {
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);

      }
    });
  }
  userRole: any;
  /* validating user's input ,if correct then go to home page else show error message and be on this page only */
  validate() {
    for (var ua of this.userArray) {
      if ((ua.user_email === this.email && ua.user_password === this.password)) {
        this.checkUser = true;
        this.regId = ua.user_reg_id;
        this.userRole = ua.user_role;
        sessionStorage.setItem("regId", this.regId);
        sessionStorage.setItem("role", this.user_role);
        if (ua.user_role == 'user' || ua.user_role == 'clerk' || ua.user_role == 'admin' || ua.user_role == 'manager' || ua.user_role == 'cashier') {
          this.user_role = ua.user_role;
          sessionStorage.setItem("role", this.user_role);

          /* here AlertDialogComponent is a component where we have set functionality of dialog box */
          const alertDialog = this.dialog.open(AlertDialogComponent, {
            data: {
              title: "WELCOME TO 'THE NEW BEGINNERS'",
            }
          });
          alertDialog.afterClosed().subscribe(result1 => {
            if (result1 === true) {
              this.result = true;
              sessionStorage.setItem("email", this.email);
              /* we can navigate to another url using this router.navigate */
              this.router.navigate(['/home']);
            }
          });
        }
        break;
      }
    }
    if (this.checkUser == false) {
      this.result = false;
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "EITHER EMAIL OR PASSWORD IS INCORRECT",
        }
      });
      alertDialog.afterClosed().subscribe(result1 => {
        if (result1 === true) {
          this.email = "";
          this.password = "";
        }
      });
    }
  }

  ngOnInit() {
  }
}

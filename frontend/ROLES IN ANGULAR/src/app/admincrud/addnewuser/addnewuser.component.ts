import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from 'src/app/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { UserService } from 'src/app/service/UserService';

@Component({
  selector: 'app-addnewuser',
  templateUrl: './addnewuser.component.html',
  styleUrls: ['./addnewuser.component.css']
})

export class AddnewuserComponent implements OnInit {
  allUsers: any = [];
  data: any;
  user_email: any;
  password: any;
  repassword: any;
  formdata: any;
  userArray: any;
  userRole = "user";
  isUserEmailValid: boolean = true;
  isBothPassValid: boolean = true;
  rolesList: any = [];
  sLength: any;
  constructor(private ccs: UserService, private router: Router, private dialog: MatDialog) {
    this.sLength = sessionStorage.length;
    if (sessionStorage.length != 0) {
      this.ccs.getUser().subscribe(res => {
        this.userArray = res['response'];
      });
      this.rolesList.push('user', 'cashier', 'clerk', 'manager');
    }
  }

  // when admin changes role this will call
  changeRole(e: any) {
    this.userRole = e.target.value;

  }

  ngOnInit() {
  }

  addUser() {
    if (sessionStorage.length != 0) {
      for (var ua of this.userArray) {
        console.log(this.user_email + ' == ' + ua.user_email);
        if (this.user_email == ua.user_email && ua.user_email != '') {
          // console.log("user is already registered");
          this.isUserEmailValid = false;
          return;
        }
        else {
          this.isUserEmailValid = true;
        }
      }

      // asking to user before adding a record in db
      if (this.password === this.repassword) {
        const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Confirm Adding Record',
            message: 'Are you sure, you want to add a record ? '
          }
        });
        confirmDialog.afterClosed().subscribe(result => {
          if (result === true) {
            this.ccs.addUser(this.user_email, this.password, this.repassword, this.userRole).subscribe((data) => console.log(data));
            const alertDialog = this.dialog.open(AlertDialogComponent, {
              data: {
                title: "NEW USER ADDED",
              }
            });
            alertDialog.afterClosed().subscribe(result => {
              if (result === true) {
                this.router.navigate(['/admin']);
              }
            });
          }
        });
      }
      else {
        this.isBothPassValid = false;
        //console.log("password does not match");
      }
    }
  }
}

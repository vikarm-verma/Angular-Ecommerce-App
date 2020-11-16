import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/UserService';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileserviceService } from '../service/profileservice.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  allUsers: any = [];
  singleUserDetails: any[];
  flag = false;
  toggleText: any = 'See Your Details';
  updateUserDiv = false;
  userEmail: any;
  userArray: any;
  password:any;
  rePassword:any;
  registerForm: FormGroup;
  submitted = false;
  imageUrl: any;
  regId:any;
  userName:any;

  constructor(private ccs: UserService, private ups: ProfileserviceService,
    private router: Router, private sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private dialog:MatDialog) {
    this.userEmail = sessionStorage.getItem("email");
    this.userName=sessionStorage.getItem("userName");
  //  console.log("in constructor " + this.userEmail);
    this.ccs.getUser().subscribe(res => {
      this.userArray = res['response'];
    });

  }





  ngOnInit(): void {
  }
  updateUser(id: number) {
    this.updateUserDiv = true;
    this.flag = !this.flag;
    //console.log("it is in update user");
    this.allUsers = this.getUserById(id);

  }
  submit() {
    if (this.password === this.rePassword) {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm Update Record',
          message: 'Are you sure, you want to update a record ? '
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.ccs.updateUser(this.regId,
            this.password,
            this.rePassword).subscribe((data) => console.log(data));
            const alertDialog=this.dialog.open(AlertDialogComponent,{
              data:{
                title:"PASSWORD UPDATED",
              }
              
            });
            alertDialog.afterClosed().subscribe(result => {
              if (result === true) {
                location.reload();
              }
            });
        }
      });
    
    }
    else {
      const alertDialog=this.dialog.open(AlertDialogComponent,{
        data:{
          title:"PASSWORD NOT MATCHED",
          message:"TRY TO WRITE SIMILAR PASSWORDS"
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
        //  location.reload();
        }
      });
      
    }

  }

  getSingleUser() {
    this.updateUserDiv = false;
    this.flag = !this.flag;
    this.toggleText = !this.flag ? 'See Your Details' : 'Hide Your Detail';
    this.ccs.getUser().subscribe((data) => {
      this.allUsers = data['response'];
      //console.log(data)
    });
    this.ups.getUserProfile().subscribe((data) => {
      this.allUsers = data['response'];
      for (let prUser of this.allUsers) {
        if (prUser.user_reg_id == sessionStorage.getItem("regId")) {
          this.imageUrl = "http://localhost:3000/" + prUser.user_image;
         // console.log("in if showing" + this.imageUrl);
        }
      }
    });
  }

  getSantizeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  deleteUser(id: number) {
    this.ccs.deleteUser(id).subscribe((data) => console.log(data));
    location.reload();
    //this.flag=!this.flag;
  }

  getUserById(id: number) {
    this.ccs.getUserById(id).subscribe((data) => {
      this.allUsers = data['response'];
      for(let user of this.allUsers)
      {
      this.regId=user.user_reg_id;
      this.password=user.user_password;
      this.rePassword=user.user_repassword;
      }
      return this.allUsers;
    });
  }

  addUser() {
    this.router.navigate(['/register']);
  }
}

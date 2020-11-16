import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UserService } from '../service/UserService';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileserviceService } from '../service/profileservice.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-admincrud',
  templateUrl: './admincrud.component.html',
  styleUrls: ['./admincrud.component.css'],
})

export class AdmincrudComponent implements OnInit {

  allUsers: any = [];
  flag = false;
  flag1 = false;
  toggleText: any = 'Show Users';
  updateUserDiv = false;
  user: any;
  imageUrl: any = [];
  userProfileArray: any = [];
  showContent: any;
  value: any;
  isUserAdmin: boolean = false;
  constructor(
    private ccs: UserService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private ups: ProfileserviceService,
    private route: ActivatedRoute,
    private dialog: MatDialog) {
    if (sessionStorage.getItem("role") == 'admin') {
      this.isUserAdmin = true;
    }
    else {
    // this method will use to navigate after 2 seconds to home if user role is not admin
    //and still tries to get the data
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }
  }

  /* registering form controls */
  profileForm = new FormGroup({
    userName: new FormControl(),
    userAge: new FormControl(),
    userMobile: new FormControl(),
    userGender: new FormControl(),
    userAddress: new FormControl(),
    userImage: new FormControl(),
  });

  // opject creation for table on html page
  dtOptions: DataTables.Settings = {};

  /* This method calls when the component rendered */
  ngOnInit(): void {
    // this is for waiting for data before table arrives so table and data will occur together
    setTimeout(() => this.showContent = true, 500);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      destroy: true,
    };
  }

  /* this method will fetch data from my sql db using json array ,it will show profile section with all
  disabled controls */

  getValue(event: any) {
    if (sessionStorage.getItem("regId") != null) {
      this.flag = !this.flag;
      this.toggleText = !this.flag ? 'Show Users' : 'Hide Users';
      this.flag1 = true;
      this.value = event.target.innerText;
      this.ups.getUsersForAdmin().subscribe(res => {
        this.userProfileArray = res['response'];
        for (let prUser of this.userProfileArray) {
          if (prUser.user_reg_id == this.value) {
            this.profileForm.controls.userName.setValue(prUser.user_name);
            this.profileForm.controls.userAge.setValue(prUser.user_age);
            this.profileForm.controls.userMobile.setValue(prUser.user_mobile);
            this.profileForm.controls.userGender.setValue(prUser.user_gender);
            this.profileForm.controls.userAddress.setValue(prUser.user_address);
            this.imageUrl = "http://localhost:3000/" + prUser.user_image;
          }
        }
      });
    }
  }


  /* it will get all users using a toggle button from json array , data will fetch
  from both tables using a join which is implemented in api
  */
  getAllUsers() {
    if (sessionStorage.length != 0) {
      this.updateUserDiv = false;
      this.flag1 = false;
      this.flag = !this.flag;
      this.toggleText = !this.flag ? 'Show Users' : 'Hide Users';
      this.ups.getUsersForAdmin().subscribe(res => {
        this.userProfileArray = res['response'];
        for (let prUser of this.userProfileArray) {
          if (prUser.user_reg_id == sessionStorage.getItem("regId")) {
            this.imageUrl = "http://localhost:3000/" + prUser.user_image;
          }
        }
      });
    }
    else {
      this.router.navigate(['\login']);
    }
  }

  /* for sanitizing url ,else url will not work in fetching image , this is issue with browser  */
  getSantizeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustUrl("http://localhost:3000/" + url);
  }

  // getSantizeUrl1(url: any) {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }

  /* will delete permanently a user after showing a confirm dialog box */
  deleteUser(id: number) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete Record',
        message: 'Are you sure, you want to delete a record ? '
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.ups.deleteUserProfile(id).subscribe((data) => console.log(data));
        const alertDialog = this.dialog.open(AlertDialogComponent, {
          data: {
            title: "USER DELETED",
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

  /* will add a new user ,will route to the new child component  */
  addUser() {
    if (sessionStorage.length != 0) {
      const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "ADD NEW USER",
          message: "YOU ARE GOING TO ADD A NEW USER"
        }
      });
      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.router.navigate(['addnewuser'], { relativeTo: this.route });
        }
      });
    }
    else {
      this.router.navigate(['/login']);
    }
  }
}

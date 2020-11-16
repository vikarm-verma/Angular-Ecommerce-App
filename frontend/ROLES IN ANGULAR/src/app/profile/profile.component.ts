import { FormatWidth } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { UserService } from '../service/UserService';
import { ProfileserviceService } from '../service/profileservice.service';


const URL = "http://localhost:3000/api/upload";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  uploader: FileUploader;
  imageUrl: any;
  userProfileArray: any = [];
  userRegId: any;
  userProfileId: any;
  userEmail: any;
  role: any;
  isUpdate: boolean = false;
  isOldImage: boolean = false;
  isNewImage: boolean = false;
  user_image: any;
  value: any = 0;
  isUpload: any;
  imageShow: any;
  filename: any;
  isFileSelected: boolean = false;
  sLength:any;
  /* name pattern which will allow user to write single name without trailing and leading space 
  and two names with one space in the mid */
  uNamePattern = "^[a-zA-Z]+([ ][a-zA-Z]+)?$";

  /* mobile number accepted if starts with 7 or 8  or 9 follwing 9 digits */
  mNumberPattern = "[789][0-9]{9}";

  /* registering controls with validators using required and pattern ,in reactive forms 
  form controls has to register  */
  profileForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.pattern(this.uNamePattern)]),
    userAge: new FormControl('', Validators.required),
    userMobile: new FormControl('', [Validators.required, Validators.pattern(this.mNumberPattern)]),
    userGender: new FormControl('', Validators.required),
    userAddress: new FormControl('', Validators.required),
    userImage: new FormControl(),
  });

  /* when this component loads it will show user's profile data if present else blank for would be there */
  constructor(private http: HttpClient,
    private router: Router,
    private ups: ProfileserviceService,
    private ccs: UserService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog) {
      this.sLength=sessionStorage.length;
    this.userEmail = sessionStorage.getItem("email");
    this.role = sessionStorage.getItem("role");
    this.userRegId = sessionStorage.getItem("regId");
    this.ups.getUserProfile().subscribe(res => {
      this.imageUrl = null;
      this.userProfileArray = res['response'];
      for (let prUser of this.userProfileArray) {
        if (prUser.user_reg_id == sessionStorage.getItem("regId") || prUser.user_reg_id == sessionStorage.getItem("regId1")) {
          this.userProfileId = prUser.user_profile_id;
          this.profileForm.controls.userName.setValue(prUser.user_name);
          this.profileForm.controls.userAge.setValue(prUser.user_age);
          this.profileForm.controls.userMobile.setValue(prUser.user_mobile);
          this.profileForm.controls.userGender.setValue(prUser.user_gender);
          this.profileForm.controls.userAddress.setValue(prUser.user_address);
          this.imageUrl = "http://localhost:3000/" + prUser.user_image;
          this.isOldImage = true;
          this.isNewImage = false;
          this.isUpdate = true;
        }
      }
    });
  }

  /* after registration for validating this will return control nome to the template's property */
  get userName() {
    return this.profileForm.get('userName');
  }
  get userAge() {
    return this.profileForm.get('userAge');
  }
  get userMobile() {
    return this.profileForm.get('userMobile');
  }
  get userGender() {
    return this.profileForm.get('userGender');
  }
  get userAddress() {
    return this.profileForm.get('userAddress');
  }



  /* here we are using FileUploader of angular this will be in ngOnInit() only , it will 
  be called by upload.uploadAll() from template when user clicks on upload button of file uploader control 
  */
  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: URL,
      itemAlias: 'userImage'
    });
    this.uploader.onAfterAddingFile = f => {
      // this will remove all images from your selection and will let remain the latest one 
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
      f.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "IMAGE UPLOADED SUCCESSFULLY",
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.isUpload = false;
        }
      });
    };
  }





  /* this will call when you click on browse button of file upload  
  it will show selected image in image control */

  onSelectFile(event) {
    this.isOldImage = false;
    this.isNewImage = true;
    this.isFileSelected = !this.isFileSelected;
    this.isUpload = true;
    this.user_image = this.profileForm.controls.userImage.value;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imageShow = event.target.result;
      }
    }
  }

  //this will add user profile to db and image path too
  addUserProfile() {
    /* if you are filling your profile first time then it will ask for uploading image ,without it 
    it will not not enable submit button */
    if (this.profileForm.controls.userImage.value==null) {
      const alertDialog = this.dialog.open(AlertDialogComponent, {
        data: {
          title: "SELECT IMAGE",
        }
      });
      alertDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.router.navigate(['\profile']);
        }
      });
    }
    else {
      console.log("in else");
      /* here whenever you select an image and stroe it into db column which is of varchar type
      it stores image in the form of path with adding c:\\fakepath ,and later on it will 
      become a complete image name , so here we are removing that pre adder using replace method
      and this will now save image with image name only with its extension */
      var filename = this.profileForm.controls.userImage.value.replace("C:\\fakepath\\", "");
      //console.log("=>" + this.profileForm.controls.userImage.value + "new value " + filename);
      this.ups.addUserProfile(
        sessionStorage.getItem("regId"),
        this.profileForm.controls.userName.value,
        this.profileForm.controls.userAge.value,
        this.profileForm.controls.userMobile.value,
        this.profileForm.controls.userGender.value,
        this.profileForm.controls.userAddress.value,
        filename).subscribe();
        const alertDialog = this.dialog.open(AlertDialogComponent, {
          data: {
            title: "RECORD SAVED",
          }
        });
        alertDialog.afterClosed().subscribe(result => {
          if (result === true) {
            location.reload();
          }
        });
     // console.log("data added" + this.profileForm.value);
      // this.isUpdate = !this.isUpdate;
      this.router.navigate(['/home']);
    }
  }

  getSantizeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  /* this is for updating profile ,controls will be filled up when we come to page first
  it will do uploading task ,if you do not change image then same image will be there in db and static folder
 */
  updateUserProfile() {
    this.isUpdate = false;
    if (this.isFileSelected == true) {
      this.filename = this.profileForm.controls.userImage.value.replace("C:\\fakepath\\", "");
    }
    else if (this.isFileSelected == false) {

      this.filename = this.imageUrl.replace("http://localhost:3000/", "");

    }
    this.ups.updateUserProfile(
      this.userProfileId,
      this.profileForm.controls.userName.value,
      this.profileForm.controls.userAge.value,
      this.profileForm.controls.userMobile.value,
      this.profileForm.controls.userGender.value,
      this.profileForm.controls.userAddress.value,
      this.filename).subscribe();
    const alertDialog = this.dialog.open(AlertDialogComponent, {
      data: {
        message: "User's record updated"

      }
    });
    this.router.navigate(['/home']);
  }  
}

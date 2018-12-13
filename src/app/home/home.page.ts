import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import { ReturnDataService } from '../return-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  base64Image: any;

  constructor(private camera: Camera,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private http: HTTP,
    private returnDataService: ReturnDataService) { }

  ngOnInit() {
    this.base64Image = "../default.jpg";
    console.log(this.base64Image);
    // console.log(this.dataReturned);
  }

  // allows user to upload images using the photo library as the image source
  getImage() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    // when cordova has access to the picture, upload it
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImage(imageData);
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  // allows user to upload an image from their camera 
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    // upload image once cordova gets it
    this.camera.getPicture(options).then((imageData) => {
      this.uploadImage(imageData);
    }, err => {
      this.presentAlert(err);
      console.log(err);
    });
  }

  // upload image to the server
  uploadImage(imageData) {
    this.base64Image = 'data:image/png;base64,' + imageData;

    // display loading animation during upload
    this.presentLoading();

    // here are the parameters we will need for our POST request
    let formData = {
      'base64image': imageData,
      'submit': 'submit'
    };

    this.http.post('http://parcohome.ddns.net/imagerecognition.php', formData, {})
      .then((data) => {
        // show confirmation message when successful
        this.presentToast("Image uploaded successfully");
        console.log(data.data);
        // if the image could not be classified or is considered "non-food", alert the user
        if (data.data === "The image was not classified as food by the IBM Image Recognition API.") {
          this.presentAlert('The image was not classified as food by the IBM Image Recognition API.');
        } 
        // else we update the dataReturned object in our returnDataService
        else {
          this.returnDataService.setData(data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // shows toast messages
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss();

    toast.present();
  }

  // shows alerts
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  // displays loading animation
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Uploading',
      duration: 2000
    });
    return await loading.present();
  }
}
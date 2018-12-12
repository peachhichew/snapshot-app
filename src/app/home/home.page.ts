import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { ReturnDataService } from '../return-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  base64Image: any;
  // public dataReturned: object;

  constructor(private camera: Camera,
    private transfer: FileTransfer,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private http: HTTP,
    private returnDataService: ReturnDataService) { }

  ngOnInit() {
    this.base64Image = "../turkey.jpeg";
    console.log(this.base64Image);
    // console.log(this.dataReturned);
  }

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

    this.camera.getPicture(options).then((imageData) => {
      this.uploadImage(imageData);
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.uploadImage(imageData);

    }, err => {
      // this.presentAlert(err);
      console.log(err);
    });
  }

  uploadImage(imageData) {
    this.base64Image = 'data:image/png;base64,' + imageData;

    this.presentLoading();

    let formData = {
      'base64image': imageData,
      'submit': 'submit'
    };

    this.http.post('http://parcohome.ddns.net/imagerecognition.php', formData, {})
      .then((data) => {
        this.presentToast("Image uploaded successfully");
        console.log(data.data);
        // this.dataReturned = data.data;
        // console.log('data after upload: ', this.dataReturned);
        this.returnDataService.setData(data.data);
        // this.returnDataService.getData();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss();

    toast.present();
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Uploading',
      duration: 2000
    });
    return await loading.present();
  }
}
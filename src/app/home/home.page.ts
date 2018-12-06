import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  base64Image: any;

  constructor(private camera: Camera,
    private transfer: FileTransfer,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController) { }

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

    console.log(imageData);

    this.presentLoading();

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: 'image',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {},
      params: {
        'image': 'data:image/png;base64,' + imageData,
        'submit': null
      }
    }

    console.log(options);

    fileTransfer.upload('data:image/png;base64,' + imageData, encodeURI('parcohome.ddns.net/imagerecognition.php'), options)
      .then((data) => {
        console.log(data);
        var json = JSON.parse(data.response);
        console.log(json);
        // loader.dismiss();
        this.presentToast("Image uploaded successfully");
        console.log("Image uploaded successfully");
        // var find_monument = false;
        // var model = 0;
        // var classifier = 0;
        // for (var j = 0; j < json.images[0].classifiers.length; j++) {
        //   for (var i = 0; i < json.images[0].classifiers[j].classes.length; i++) {
        //     if (json.images[0].classifiers[j].classes[i].class == 'building' || json.images[0].classifiers[j].classes[i].class == 'arch' || json.images[0].classifiers[j].classes[i].class == 'tower' || json.images[0].classifiers[j].classes[i].class == 'bridge') {
        //       find_monument = true;
        //     }
        //     if (json.images[0].classifiers[j].classes[i].class == 'pontalexandre3.zip' || json.images[0].classifiers[j].classes[i].class == 'Arc_Carroussel') {
        //       classifier = j;
        //       model = i;
        //     }
        //   }
        // }
        // if (find_monument) {
        //   this.presentAlert(json.images[0].classifiers[classifier].classes[0].class + " with score of : " + json.images[0].classifiers[classifier].classes[0].score);
        // } else {
        //   this.presentAlert("Watson hasn't found any monument on this picture...");
        // }
        // //this.presentAlert(json.images[0].classifiers[1].classes[0].class+" with score of : "+ json.images[0].classifiers[0].classes[0].score);
      }, (err) => {
        console.log(err);
        // loader.dismiss();
        this.presentToast(err);
      });
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
      // subHeader: 'Subtitle',
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

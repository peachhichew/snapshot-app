import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';

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
      httpMethod: 'POST',
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

// NEW CODE
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
// import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
// import { File, FileEntry } from '@ionic-native/file/ngx';
// import { HttpClient } from '@angular/common/http';
// import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { Storage } from '@ionic/storage';

// import { finalize } from 'rxjs/operators';

// const STORAGE_KEY = 'my_images';

// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
// })
// export class HomePage implements OnInit {

//   images = [];

//   constructor(private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
//     private actionSheetController: ActionSheetController, private toastController: ToastController,
//     private storage: Storage, private plt: Platform, private loadingController: LoadingController,
//     private ref: ChangeDetectorRef) { }

//   ngOnInit() {
//     this.plt.ready().then(() => {
//       this.loadStoredImages();
//     });
//   }

//   loadStoredImages() {
//     this.storage.get(STORAGE_KEY).then(images => {
//       if (images) {
//         // parse the data we get back from the DB as a JSON
//         let arr = JSON.parse(images);
//         this.images = [];
//         for (let img of arr) {
//           // create a path to the current directory for where the images are 
//           let filePath = this.file.dataDirectory + img;
//           // creating a resolve path so that it works with webview 
//           let resPath = this.pathForImage(filePath);
//           this.images.push({ name: img, path: resPath, filePath: filePath });
//         }
//       }
//     });
//   }

//   // resolve the url for the image
//   pathForImage(img) {
//     if (img === null) {
//       return '';
//     } else {
//       // transforms url to a url that the webview can handle or display
//       let converted = this.webview.convertFileSrc(img);
//       return converted;
//     }
//   }

//   async presentToast(text) {
//     const toast = await this.toastController.create({
//       message: text,
//       position: 'bottom',
//       duration: 3000
//     });
//     toast.present();
//   }

//   // prompt the user to choose a destination to select the images from (library or camera)
//   async selectImage() {
//     const actionSheet = await this.actionSheetController.create({
//       header: "Select Image source",
//       buttons: [{
//         text: 'Load from Library',
//         handler: () => {
//           this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
//         }
//       },
//       {
//         text: 'Use Camera',
//         handler: () => {
//           this.takePicture(this.camera.PictureSourceType.CAMERA);
//         }
//       },
//       {
//         text: 'Cancel',
//         role: 'cancel'
//       }
//       ]
//     });
//     await actionSheet.present();
//   }

//   // get the image path, not using base64, and make a copy locally within the project
//   takePicture(sourceType: PictureSourceType) {
//     var options: CameraOptions = {
//       quality: 100,
//       sourceType: sourceType,
//       saveToPhotoAlbum: false,
//       correctOrientation: true
//     };

//     // get the name of the image and the path of the folder in our app
//     this.camera.getPicture(options).then(imagePath => {
//       // get the name of the image
//       var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
//       // get the path without the folder
//       var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
//       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
//     });
//   }

//   // create a unique name for the file
//   createFileName() {
//     var d = new Date(),
//       n = d.getTime(),
//       newFileName = n + ".jpg";
//     return newFileName;
//   }

//   // here we use the file plugin to use the path, current name to resolve the current file,
//   // along with the target directory and ew name for the new file
//   copyFileToLocalDir(namePath, currentName, newFileName) {
//     // takes the file and copies it into our app's folder after we capture it
//     this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
//       // making sure that the storage knows about the file
//       this.updateStoredImages(newFileName);
//     }, error => {
//       this.presentToast('Error while storing file.');
//     });
//   }

//   updateStoredImages(name) {
//     // getting the array of images from the storage
//     this.storage.get(STORAGE_KEY).then(images => {
//       let arr = JSON.parse(images);
//       // if we haven't created anything in the storage, we create a new array and store it 
//       if (!arr) {
//         let newImages = [name];
//         this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
//       } else {
//         // if an array exists already, we push the image (with new file name) into the array and storage
//         arr.push(name);
//         this.storage.set(STORAGE_KEY, JSON.stringify(arr));
//       }

//       // get the real file path of the image and create the resource path 
//       let filePath = this.file.dataDirectory + name;
//       let resPath = this.pathForImage(filePath);

//       let newEntry = {
//         name: name,
//         path: resPath,
//         filePath: filePath
//       };

//       // add it to the front of the array
//       this.images = [newEntry, ...this.images];
//       this.ref.detectChanges(); // trigger change detection cycle
//     });
//   }

//   deleteImage(imgEntry, position) {
//     // create a local array 
//     this.images.splice(position, 1);

//     this.storage.get(STORAGE_KEY).then(images => {
//       let arr = JSON.parse(images);
//       // remove the image from ionic storage
//       let filtered = arr.filter(name => name != imgEntry.name);
//       this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

//       var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

//       // remove the file from our local project folder
//       this.file.removeFile(correctPath, imgEntry.name).then(res => {
//         this.presentToast('File removed.');
//       });
//     });
//   }

//   // resolve path of local file, which will result in a FileEntry object
//   // we read the file to get the data from it
//   startUpload(imgEntry) {
//     // resolve the real path of the file
//     this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
//       .then(entry => {
//         // read the file
//         (<FileEntry>entry).file(file => this.readFile(file))
//       })
//       .catch(err => {
//         this.presentToast('Error while reading file.');
//       });
//   }

//   // the result we get from reading the file is a blob
//   // we can add it as form data in our POST request
//   readFile(file: any) {
//     // use a file reader to read the file as an array buffer
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       // send the image as form data to PHP server
//       const formData = new FormData();
//       // convert it to a blob object
//       const imgBlob = new Blob([reader.result], {
//         type: file.type
//       });
//       // append the file to the image blob and file name to the form data, which will be sent to the server
//       formData.append('file', imgBlob, file.name);
//       this.uploadImageData(formData);
//     };
//     reader.readAsArrayBuffer(file);
//   }

//   async uploadImageData(formData: FormData) {
//     console.log("form data ", formData);
//     const loading = await this.loadingController.create({
//       message: 'Uploading image...',
//     });
//     await loading.present();

//     // send a POST request to the server with the image
//     // http://localhost:8080/upload.php
//     // parcohome.ddns.net/imagerecognition.php
//     this.http.post("http://192.168.64.2/upload.php", formData)
//       .pipe(
//         finalize(() => {
//           loading.dismiss();
//         })
//       )
//       .subscribe(res => {
//         // present the toast if the upload is successful
//         if (res['success']) {
//           this.presentToast('File upload complete.')
//         } else {
//           this.presentToast('File upload failed.')
//         }
//       });
//   }
// }
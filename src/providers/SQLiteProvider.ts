import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ToastController } from '@ionic/angular';

@Injectable()
export class SQLiteProvider {
  // declare a var that will point to the initialized db:
  public db: SQLiteObject;

  constructor(
    private sqlite: SQLite,
    public toastController: ToastController) { }

  // using SQLite, we want to make a query to create the database that will contain 
  // our food information
  createDatabase() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      this.db = db;
      this.db.executeSql('CREATE TABLE IF NOT EXISTS `food` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` TEXT, `information` TEXT)')
        .then(() => console.log('Database running.'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  // once the database is created, we want to display all the information that is in 
  // the 'food' table
  getRecentFood() {
    let numOfRows;
    let query = "select * from food order by id desc limit 5";
    // #resultsList is the place where we want to insert all this new HTML containing
    // information about food
    let list = document.querySelector('#resultsList');
    // clear the HTML every time this method is called so that we can display new
    // food information without having repeated data from the previous call
    list.innerHTML = "";
    this.db.executeSql(query, []).then((data) => {
      numOfRows = data.rows.length;
      for (let i = 0; i < numOfRows; i++) {
        // get the name + health information of the food
        let foodName = data.rows.item(i).name;
        let healthInformation = JSON.parse(data.rows.item(i).information);
        // create <h2> element that displays the name
        let nameOnPage = document.createElement('h2');
        nameOnPage.innerHTML = foodName;
        // create <p> element that contains only the health information
        // since we can access each individual property from the parsed JSON, we will be 
        // concatenating each property's value to generate a long string of information
        let detailsOnPage = document.createElement('p');
        detailsOnPage.innerHTML += "Weight: " + healthInformation.weight + "g<br>";
        detailsOnPage.innerHTML += "Calories: " + healthInformation.calories + "cal<br>";
        detailsOnPage.innerHTML += "Total Fat: " + healthInformation.totalFat + "g<br>";
        detailsOnPage.innerHTML += "Saturated Fat: " + healthInformation.saturatedFat + "g<br>";
        detailsOnPage.innerHTML += "Cholesterol: " + healthInformation.cholesterol + "mg<br>";
        detailsOnPage.innerHTML += "Sodium: " + healthInformation.sodium + "mg<br>";
        detailsOnPage.innerHTML += "Total Carbs: " + healthInformation.carbs + "g<br>";
        detailsOnPage.innerHTML += "Dietary Fiber: " + healthInformation.fiber + "g<br>";
        detailsOnPage.innerHTML += "Total Sugars: " + healthInformation.sugar + "g<br>";
        detailsOnPage.innerHTML += "Protein: " + healthInformation.protein + "g<br>";
        detailsOnPage.innerHTML += "Potassium: " + healthInformation.potassium + "mg<br>";
        // lastly we will append the <h2> and <p> elements to the #resultList
        list.appendChild(nameOnPage);
        list.appendChild(detailsOnPage);
      }
    })
      .catch(e => {
        console.log(e);
      })
  }

  // write a query to insert new food into the table
  insertNewFood(name, information) {
    let query = "insert into food (name, information) values (?, ?)";
      this.db.executeSql(query, [name, information]).then((data) => {
    })
      .catch(e => {
        console.log(e);
      })
  }


  // async presentToast(msg) {
  //   const toast = await this.toastController.create({
  //     message: msg,
  //     duration: 3000,
  //     position: 'bottom'
  //   });

  //   toast.onDidDismiss();

  //   toast.present();
  // }
}
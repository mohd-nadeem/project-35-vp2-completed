//Create variables here
var dogImg, happyDog, dog;
var foodS, foodStock;
var feed, addFood;
var fedTime, lastFed;
var foodObj;
var database;

function preload() {
  //load images here
  happyDog = loadImage("images/dogImg1.png");
  dogImg = loadImage("images/dogImg.png");
}

function setup() {
  createCanvas(1000, 500);
  database = firebase.database();
  dog = createSprite(820, 250, 20, 20);

  feed = createButton('Feed The Dog');
  feed.position(650, 95);
  feed.mousePressed(feedDog);

  addFood = createButton('Add Food');
  addFood.position(770, 95)
  addFood.mousePressed(addFoods);

  foodObj = new Food(100, 100, 20, 20);
  dog.addImage(dogImg);
  dog.scale = 0.3;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  drawSprites();

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed : " + lastFed % 12 + "PM", 350, 30);
  } else if (lastFed === 0) {
    text("Last Feed : 12 AM", 350, 30);
  } else {
    text("Last Feed : " + lastFed + "AM", 350, 30);
  }
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  });
}

function feedDog() {
  dog.addImage(happyDog)
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  });
}




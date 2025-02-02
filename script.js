// is diagonal move allowed 
const diagonal = false;

// canvas size 
const cw = 900;
const ch = 600;

// How many columns and rows 
let numCars = 4;
let cars = [];
const carColors = ['red', 'blue', 'green', 'yellow'];

var img_road;
var img_building;
let carImages = [];

function preload() {
  img_road = loadImage('assets/road.png');
  img_building = loadImage('assets/house_solo.png');
  img_building2 = loadImage('assets/house_solo2.png');
  img_block = loadImage('assets/block.png');
  img_block2 = loadImage('assets/block2.png');
  swamp = loadImage('assets/swamp.png');
  park = loadImage('assets/park.png');
  img_long_block = loadImage('assets/long_building.png');
  img_long_block2 = loadImage('assets/long_building2.png');
  img_long_block3 = loadImage('assets/long_building3.png');
  img_long_block4 = loadImage('assets/long_building4.png');
  img_long_block5 = loadImage('assets/long_building5.png');
  for (let i = 0; i < numCars; i++) {
    carImages[i] = loadImage(`assets/car${i + 1}.png`);
  }
}

function randomIntAtoB(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

var rando = 3;
var cols = 9 * rando;
var rows = 6 * rando;

function randomFloatAtoB(a, b) {
  return Math.random() * (b - a) + a;
}

const wallAmount = randomFloatAtoB(0.1, 0.5);
const backcolor = 'white';
const wallcolor = 'black';
const pathcolor = 'darkred';
const opencolor = 'lightgreen';
const closedcolor = 'lightpink';

var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];

function heuristic(a, b) {
  if (diagonal) return (dist(a.i, a.j, b.i, b.j));
  else return (abs(a.i - b.i) + abs(a.j - b.j));
}

function gfn(a, b) {
  if (diagonal) return (dist(a.i, a.j, b.i, b.j));
  else return (abs(a.i - b.i) + abs(a.j - b.j));
}

function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--)
    if (arr[i] == elt)
      arr.splice(i, 1);
}

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = true;

  this.show = function (col) {
    if (this.wall) {
      fill(wallcolor);
      noStroke();
      rect(this.i * w, this.j * h, w, h);
    } else if (col) {
      fill(col);
      rect(this.i * w, this.j * h, w, h);
    }
  };

  this.addNeighbors = function (grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) this.neighbors.push(grid[i + 1][j]);
    if (i > 0) this.neighbors.push(grid[i - 1][j]);
    if (j < rows - 1) this.neighbors.push(grid[i][j + 1]);
    if (j > 0) this.neighbors.push(grid[i][j - 1]);

    if (diagonal) {
      if (i > 0 && j > 0) this.neighbors.push(grid[i - 1][j - 1]);
      if (i < cols - 1 && j > 0) this.neighbors.push(grid[i + 1][j - 1]);
      if (i > 0 && j < rows - 1) this.neighbors.push(grid[i - 1][j + 1]);
      if (i < cols - 1 && j < rows - 1) this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}

class Car {
  constructor(start, end, id) {
    this.end = end;
    this.id = id;
    this.current = start;
    this.path = [];
    this.found = false;
    this.locked = false;
  }

  calculatePath() {
    this.path = findPath(this.current, this.end);
    this.found = this.path ? true : false;
  }

  moveOneStep() {
    if (this.path && this.path.length > 1) {
      this.current = this.path[1];
      this.path.shift();
    }
  }
}

function setup() {
  createCanvas(cw, ch);
  w = width / cols;
  h = height / rows;

  for (var i = 0; i < cols; i++)
    grid[i] = new Array(rows);

  for (var i = 0; i < cols; i++)
    for (var j = 0; j < rows; j++)
      grid[i][j] = new Spot(i, j);

  grid = createCityGrid(grid);

  for (var i = 0; i < cols; i++)
    for (var j = 0; j < rows; j++)
      grid[i][j].addNeighbors(grid);

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
}

function draw() {
  background(backcolor);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];
      if (!cell.wall) {
        image(img_road, i * w, j * h, w, h);
      }
    }
  }
}

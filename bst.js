const canvas = document.getElementById('myCanvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.font = "20px Arial";


var curPerc = 0;
var isRedrawing = false;

function makeNode(x, y, value, currentPercent) {

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI * currentPercent);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(value, x - 10, y + 5);

    curPerc++;
    if (curPerc < 100) {
        requestAnimationFrame(function () {
            makeNode(x, y, value, curPerc / 100)
        });
    }
}
function redrawNode(x, y, value) {
    console.log('redrwaing')
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(value, x - 10, y + 5);
}

function joinNode(x, y, toX, toY) {
    ctx.moveTo(x, y);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}
class Node {
    constructor(data, x, y) {
        this.value = data;
        this.frequency = 1;
        this.x = x;
        this.y = y;
        this.left = null;
        this.right = null;
    }
}
class BST {
    constructor() {
        this.root = null;
        this.dataArray = [];
    }
    insertHelper(value, node, parentNode, gap, x, y) {
        curPerc = 0;    //Clear animation percentage 
        gap = (gap / 2 > 60) ? gap / 2 : gap;
        if (node === null) {
            node = new Node(value, x, y);
            if (parentNode !== null) {
                joinNode(parentNode.x, parentNode.y, x, y);
                isRedrawing ? redrawNode(parentNode.x, parentNode.y, parentNode.value) : makeNode(parentNode.x, parentNode.y, parentNode.value);
            }

            this.dataArray.push({
                x, y, value
            });
            isRedrawing ? redrawNode(x, y, value) : makeNode(x, y, value);

            return node;
        }
        if (node.value === value) {
            node.frequency++;
            return node;
        } else if (node.value > value) {
            node.left = this.insertHelper(value, node.left, node, gap, x - gap, y + 100);
        } else if (node.value < value) {
            node.right = this.insertHelper(value, node.right, node, gap, x + gap, y + 100);
        }
        return node;
    }
    insert(value, redrawing) {
        isRedrawing = redrawing;
        this.root = this.insertHelper(value, this.root, null, 500, 600, 50);
    }
    remove(value) {
        const indexOfValue = this.dataArray.findIndex(item => { return item.value === value });
        let newDataArray = [];

        if (indexOfValue > -1)
            for (let i = 0; i < this.dataArray.length; i++)
                if (i !== indexOfValue)
                    newDataArray.push(this.dataArray[i].value);

        //Clear Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Redraw All
        this.dataArray = [];
        this.root = null;
        for (let i = 0; i < newDataArray.length; i++)
            this.insert(newDataArray[i], true);
    }
}

//Check if point is in circle
function isInRectangle(centerX, centerY, radius, x, y) {
    return x >= centerX - radius && x <= centerX + radius && y >= centerY - radius && y <= centerY + radius;
}
function isPointInCircle(centerX, centerY, radius, x, y) {
    if (isInRectangle(centerX, centerY, radius, x, y)) {
        let dx = centerX - x;
        let dy = centerY - y;
        dx *= dx;
        dy *= dy;
        const distanceSquared = dx + dy;
        const radiusSquared = radius * radius;
        return distanceSquared <= radiusSquared;
    }
    return false;
}

//Util functions
function isInArray(array, el) {
    for (var i = 0; i < array.length; i++)
        if (array[i].value == el) return true;
    return false;
}
function getRandomNumber(array) {
    var rand = Math.random() * 200 - 100;
    if (!isInArray(tree.dataArray, rand)) {
        return Math.floor(rand);
    }
    return getRandomNumber(array);
}



var tree = new BST();

//Listen Space Key Press Event
document.body.onkeyup = function (e) {
    if (e.keyCode == 32) {

        //Create random number between -100 ~ 100
        const val = getRandomNumber();
        console.log(val)
        tree.insert(parseInt(val), false);

        //Check is value is in range of -100 ~ 100
        if (val >= -100 && val <= 100)
            tree.insert(parseInt(val), false);
        else
            alert('The number must be in the range of -100 to 100')
    }
}

//Get Mouse Click Event
document.addEventListener("click", function (event) {
    //Find clicked number
    let num = 1000;

    for (let i = 0; i < tree.dataArray.length; i++) {
        if (isPointInCircle(tree.dataArray[i].x, tree.dataArray[i].y, 30, event.clientX, event.clientY)) {
            num = tree.dataArray[i].value;
            break;
        }
    }
    console.log(num)

    //Remove if number is clicked
    if (num != 1000) {
        tree.remove(num);
    }
});

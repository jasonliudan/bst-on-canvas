const canvas = document.getElementById('myCanvas');
console.log('canvas', canvas)
canvas.width = window.innerWidth - 500;
canvas.height = window.innerHeight * 2;
const ctx = canvas.getContext("2d");
ctx.font = "20px Arial";

function makeNode(x, y, data) {
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
}
function createText(x, y, data) {
    ctx.fillStyle = "black";
    ctx.fillText(data, x - 10, y + 5);
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
    }
    insertHelper(value, node, parentNode, gap, x, y) {
        gap = (gap / 2 > 60) ? gap / 2 : gap;
        if (node === null) {
            node = new Node(value, x, y);
            if (parentNode !== null) {
                joinNode(x, y, parentNode.x, parentNode.y);
                makeNode(parentNode.x, parentNode.y, parentNode.value);
                createText(parentNode.x, parentNode.y, parentNode.value);
            }
            makeNode(x, y, value);
            createText(x, y, value);

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
    insert(value) {
        this.root = this.insertHelper(value, this.root, null, 500, 600, 50);
    }
}

var tree = new BST();
var tree = new BST();
var bstForm = document.getElementById('bstForm');
bstForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let val = document.querySelector('[name="bst-val"]').value;
    tree.insert(parseInt(val));
});

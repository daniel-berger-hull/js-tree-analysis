import { Node , renderNode , displayNodes } from './Tree.js';



let allNodes = [];
let myCenterNode = {};

let otherNode = {};






export const init = () => {

    myCenterNode = new Node(50);
    otherNode = new Node(1);

    console.log('Init: Create Random Values for Nodes...');
    for (let i=0;i<10;i++) {
        const newValue = Math.round( Math.random() * 99) + 1;
        //console.log(`${i} = ${newValue}`);
        allNodes.push(newValue);
    }

    console.log("Init: Initial Random values:");
    console.log( allNodes );
    
    console.log("Init: Inserting all the random values in the tree...");
    allNodes.forEach( (element) => {  myCenterNode.insert(element); })


    console.log("Will display nodes...");
    displayNodes(myCenterNode);
    console.log("Display nodes done!");

    console.log("Depth Search...");
    console.log(myCenterNode.depth(0));
    console.log("Depth Done!");

    

}

export const render = () => {
    console.log("Render called...");
    var c = document.getElementById("tree-canvas");
    var ctx = c.getContext("2d");


    // export const renderNode = (context, position, size) => {


    renderNode( ctx, {x: 50,y: 50}, 25 ,  myCenterNode);
    renderNode( ctx, {x: 150,y: 50}, 25 ,  otherNode);

    

}

// ctx.strokeStyle = "#FF0000";
    // ctx.beginPath();
    // ctx.arc(100, 100, 10, 0, 2 * Math.PI);
    // ctx.fillStyle = 'green';
    // ctx.fill();
    // ctx.stroke();

    // ctx.strokeStyle = "#00FF00";
    // ctx.beginPath();
    // ctx.arc(200, 100, 15, 0, 2 * Math.PI);
    // ctx.fillStyle = 'white';
    // ctx.fill();
    // ctx.stroke();







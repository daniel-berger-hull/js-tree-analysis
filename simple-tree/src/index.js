import { Node , renderNode , displayNodes } from './Tree.js';


const NODE_WIDTH            =   50;
const NODE_HEIGTH           =   50;

const NODE_SPACE_BETWEEN_X  =   5;
const NODE_SPACE_BETWEEN_Y  =   40;


let rootNode = {};

// let otherNode = {};






export const init = () => {

    let allNodes = [];

    rootNode = new Node(50);
    // otherNode = new Node(1);

    console.log('Init: Create Random Values for Nodes...');
    for (let i=0;i<5;i++) {
        const newValue = Math.round( Math.random() * 99) + 1;
        allNodes.push(newValue);
    }

    console.log("Init: Initial Random values:");
    console.log( allNodes );
    
    // console.log("Init: Inserting all the random values in the tree...");
    allNodes.forEach( (element) => {  rootNode.insert(element); })


    // console.log("Will display nodes...");
    // displayNodes(rootNode);
    // console.log("Display nodes done!");

   
    
}

export const render = () => {
    console.log("Render called...");
    var canvas = document.getElementById("tree-canvas");
    var ctx = canvas.getContext("2d");


    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;


    const treeDepth = rootNode.depth(0);
    const treeWidth = rootNode.width();

    const treeWidthSpan = (treeWidth * NODE_WIDTH) + ((treeWidth-1) * NODE_SPACE_BETWEEN_X) ;    
//    const treeHeightSpan = (treeDepth-1) * NODE_SPACE_BETWEEN_Y;
    const treeHeightSpan = (treeDepth * NODE_HEIGTH) + ( (treeDepth-1) * NODE_SPACE_BETWEEN_Y)
    const treeInterRowSpace = NODE_HEIGTH + NODE_SPACE_BETWEEN_Y;


    const marginX = (canvasWidth - treeWidthSpan)/ 2;
    const marginY = (canvasHeight - treeHeightSpan)/ 2;
        




    console.log(`Canvas Size = [${canvasWidth},${canvasHeight}]`);
    
    console.log(`Tree Depth ${treeDepth}`);
    console.log(`Tree Width ${treeWidth}`);
    console.log(`Total Tree size is [${treeWidthSpan},${treeHeightSpan}]`);
    
    // console.log(`Tree Width ${treeWidth}`);



    //  let xPos = marginX;
    //  for (let xPos=marginX;xPos<canvasWidth;xPos+=50){
    // //    for (let i=0;i<xPos+=50;xPos<canvasWidth){

    //      renderNode( ctx, {x: xPos,y: 50}, 25 ,  rootNode);
    //  }

   



    ctx.fillStyle = "#FBED20;";
    // ctx.fillRect(20, 20, 150, 100);

    ctx.lineWidth = "5";
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.rect(marginX, marginY, treeWidthSpan, treeHeightSpan);
    ctx.stroke();


    ctx.strokeStyle = "#FBED20";
    let yPos = marginY;
    let xStart = marginX;
    let xCenter = marginX + (treeWidthSpan/2); 
    let xEnd = marginX + treeWidthSpan;
    for (let row=0; row< treeDepth; row++){

        ctx.beginPath();
        ctx.moveTo(xStart, yPos);
        ctx.lineTo(xEnd, yPos);
        ctx.stroke();

        renderNode( ctx, {x: xCenter,y: yPos}, 25 ,  rootNode);

        yPos += treeInterRowSpace;
    }

    // renderNode( ctx, {x: 50,y: 50}, 25 ,  rootNode);
    // renderNode( ctx, {x: 150,y: 50}, 25 ,  otherNode);


}






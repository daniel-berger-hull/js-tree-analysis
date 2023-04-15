import { Node , TreeGraph, renderNode , displayNodes } from './Tree.js';


const NODE_WIDTH            =   50;
const NODE_HEIGTH           =   50;

const NODE_SPACE_BETWEEN_X  =   5;
const NODE_SPACE_BETWEEN_Y  =   40;


let treeGraph =  {};



export const init = () => {


    let allNodes = [];
    treeGraph =  new TreeGraph();

    treeGraph.insert(50);


    console.log('Init: Create Random Values for Nodes...');
    for (let i=0;i<5;i++) {
        const newValue = Math.round( Math.random() * 99) + 1;
        allNodes.push(newValue);
    }

    console.log("Init: Initial Random values:");
    console.log( allNodes );

    // console.log("Init: Inserting all the random values in the tree...");
    allNodes.forEach( (element) => {  treeGraph.insert(element); })



    treeGraph.recalculate();
    console.log(`Init: Tree Depth = ${treeGraph.getDepth()} , Width = ${treeGraph.getWidth()}`);


    
}
const renderNodes = (context,xCenter,yPos,xSpan,yIncrement,nodeToDraw) => {


    // let currentLevel = 1;
    let nodesStack = [];

    nodesStack.push( {   x:  xCenter,
                         y:  yPos,
                         dx:  xSpan,
                         dy: yIncrement,
                         node: nodeToDraw });


    while (nodesStack.length !== 0) {

        let nextItem = nodesStack.pop();
        let currentNode = nextItem.node;
        

        //Start by draying the node itself
        renderNode(context, { x: nextItem.x, y: nextItem.y }, 25 , currentNode.getValue());
        
        
        // Determine now the relative position of the children...
        // The x Position of the children are half way to the left and right this node..
        const xLeftChild  = nextItem.x - (Math.round(nextItem.dx/2));
        const xRightChild = nextItem.x + (Math.round(nextItem.dx/2));
        // For the Y, we only go down, so we add the y increment ...
        const yLeftChild = nextItem.y + nextItem.dy;
        const yRightChild = nextItem.y + nextItem.dy;
        
        //The x span or widht of the children should have half of the space, since this is a tree...
        const subXSpan = nextItem.dx << 1;
        const subYSpan = nextItem.dy;
        

        // Stacking the right side first, will make the exploration of the tree more natural
        // As the left side will be poped first, and we will exhaust all the left side
        // and then, pop the right side and to the same...
        if ( currentNode.getRightChild() !==  null)  {
                nodesStack.push( {   x:  xRightChild,
                                     y:  yRightChild,
                                     dx:  subXSpan,
                                     dy: subYSpan,
                                     node: currentNode.getRightChild() });

        }
            // nodesStack.push(  { node: currentNode.getRightChild() , level: currentLevel+1 }   );

        if ( currentNode.getLeftChild() !==  null)  {
            nodesStack.push( {     x:  xLeftChild,
                                   y:  yLeftChild,
                                   dx:  subXSpan,
                                   dy: subYSpan,
                                   node: currentNode.getLeftChild() });
        }
            // nodesStack.push( { node: currentNode.getLeftChild() , level: currentLevel+1 } );
    }

}

export const render = () => {
    console.log("Render called...");
    var canvas = document.getElementById("tree-canvas");
    var ctx = canvas.getContext("2d");

    var canvasWidth  = canvas.width;
    var canvasHeight = canvas.height;

    const treeDepth  = treeGraph.getDepth();   
    const treeWidth  = treeGraph.getWidth();
    const treeWidthSpan = (treeWidth * NODE_WIDTH) + ((treeWidth-1) * NODE_SPACE_BETWEEN_X) ;    
    const treeHeightSpan = (treeDepth * NODE_HEIGTH) + ( (treeDepth-1) * NODE_SPACE_BETWEEN_Y)
    const treeInterRowSpace = NODE_HEIGTH + NODE_SPACE_BETWEEN_Y;
    const marginX = (canvasWidth - treeWidthSpan)/ 2;
    const marginY = (canvasHeight - treeHeightSpan)/ 2;
    
    
    const allNodesByLevel = treeGraph.getValuesByLevel();
    console.log("Values by level:");
    console.log(allNodesByLevel);


    console.log(`Canvas Size = [${canvasWidth},${canvasHeight}]`);
    
    console.log(`Tree Depth ${treeDepth}`);
    console.log(`Tree Width ${treeWidth}`);
    console.log(`Total Tree size is [${treeWidthSpan},${treeHeightSpan}]`);
    

    // Draw a red box around the tree, to delimit the maximum area to be covered
    ctx.fillStyle = "#FBED20;";
    ctx.lineWidth = "1";
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.rect(marginX, marginY, treeWidthSpan, treeHeightSpan);
    ctx.stroke();


    ctx.strokeStyle = "#FBED20";
    let yPos = marginY;
    let xStart = marginX;
    let xCenter = marginX + (treeWidthSpan/2); 
    let xEnd = marginX + treeWidthSpan;


    // const renderNodes = (context,xCenter,yPos,xSpan,yIncrement,nodeToDraw) => {

    /// Satureday: Just added this function, and hope to draw recursively all the sub nodes!!
     renderNodes (ctx,
                 xCenter, yPos, 
                 treeWidthSpan/2,marginY,
                 treeGraph.getRootNode());

    // for (let row=0; row< treeDepth; row++){

    //     ctx.beginPath();
    //     ctx.moveTo(xStart, yPos);
    //     ctx.lineTo(xEnd, yPos);
    //     ctx.stroke();

    //     let xNode = xStart + 20;

    //     //  allNodesByLevel
    //     for (let col=0; col< allNodesByLevel[row].length; col++){
    //         renderNode( ctx, {x: xNode,y: yPos}, 25 ,  allNodesByLevel[row][col] );

    //         xNode +=  NODE_WIDTH + NODE_SPACE_BETWEEN_X;  
    //     }
        
    //     yPos += treeInterRowSpace;
    // }

}





import { Node , TreeGraph, renderNode , renderSegment, displayNodes } from './Tree.js';






const NODE_WIDTH            =   50;
const NODE_HEIGTH           =   50;

const NODE_SPACE_BETWEEN_X  =   5;
const NODE_SPACE_BETWEEN_Y  =   40;


let treeGraph =  {};
let nodesStack = [];

let graphNodeLocations = [];
let graphSegmentLocations = [];


// To Do: 
//  1- Add calculate general param function  Done, April 18
//    Transfer all the calculation in the beginning of the render function into its own calculateRender...  function
//    And use a global JSON object to have them accessible to all other functions of this file 
//
//  2 - Render precalculation       
//     I can't draw line between node, as line has to be drawn first, under the circle of the node
//     And currently, that mean that I would know the coordinate of where node will be drawn 
//     Should get 
//   
//   3 - Render radial tree
//   Check the document https://cs.brown.edu/people/rtamassi/gdhandbook/chapters/trees.pdf for details...


export const init = () => {


    let allNodes = [];
    treeGraph =  new TreeGraph();

    treeGraph.insert(50);


   // console.log('Init: Create Random Values for Nodes...');
    for (let i=0;i<8;i++) {
        const newValue = Math.round( Math.random() * 99) + 1;
        allNodes.push(newValue);
    }

    // allNodes.push(25);
    // allNodes.push(75);
    // allNodes.push(15);
    // allNodes.push(35);
    // allNodes.push(60);
    // allNodes.push(90);
    // allNodes.push(7);
    // allNodes.push(20);
    // allNodes.push(30);
    // allNodes.push(40);
    
    console.log("Init: Initial Random values:");
    console.log( allNodes );

    // console.log("Init: Inserting all the random values in the tree...");
    allNodes.forEach( (element) => {  treeGraph.insert(element); })



    treeGraph.recalculate();
    console.log(`Init: Tree Depth = ${treeGraph.getDepth()} , Width = ${treeGraph.getWidth()}`);


    console.log(`Init: Display Nodes In Order  (treeGraph.getValuesInOrder())`);
    console.log( treeGraph.getValuesInOrder() );

    console.log(`%cInit: Display Nodes In Order  (treeGraph.getValuesPostOrder())`, "color:red");
    console.log( treeGraph.getValuesPostOrder() );

}



const stack1Children = (node, nodeCoords) => { 

    let childNode = null;
    if ( node.getLeftChild() !==  null)           
        childNode = node.getLeftChild();
    else  if ( node.getRightChild() !==  null)    
        childNode = node.getRightChild();
    else  
        throw "There is not child node to stack!";


    //The x span or width of the single children should exactly the same as the parent: Will use vertical line for single child to save space...
    const subXSpan = nodeCoords.dx;
    const subYSpan = nodeCoords.dy;
   // The x Position of the children are half way to the left and right this node..
   const xChild  = nodeCoords.x;
   const yChild  = nodeCoords.y + nodeCoords.dy;

   nodesStack.push( {   x:  xChild,
                        y:  yChild,
                        dx: subXSpan,
                        dy: subYSpan,
                        node: childNode });



    graphSegmentLocations.push( { xStart: nodeCoords.x, 
                                  yStart:  nodeCoords.y, 
                                  xEnd: xChild,
                                  yEnd: yChild } );

}

const stack2Children = (node, nodeCoords) => { 

    //All the arithmetic of this method relies on having 2 sub nodes!
    if ( node.getLeftChild() ===  null ||   node.getRightChild() ===  null)  {
        throw "The stackChildren method should be called only on nodes having exactly 2 children!";
    }

    //The x span or widht of the children should have half of the space, since this is a tree...
    const subXSpan = Math.round(nodeCoords.dx/2);
    const subYSpan = nodeCoords.dy;
    // The x Position of the children are half way to the left and right this node..
    const xLeftChild  = nodeCoords.x - (Math.round(subXSpan/2));    
    const xRightChild = nodeCoords.x + (Math.round(subXSpan/2));    


    // For the Y, we only go down, so we add the y increment ...
    const yLeftChild = nodeCoords.y + nodeCoords.dy;
    const yRightChild = nodeCoords.y + nodeCoords.dy;
      
    // Stacking the right side first, will make the exploration of the tree more natural
    // As the left side will be poped first, and we will exhaust all the left side
    // and then, pop the right side and to the same...
    nodesStack.push( {   x:  xRightChild,
                         y:  yRightChild,
                         dx:  subXSpan,
                         dy: subYSpan,
                         node: node.getRightChild() });

    nodesStack.push( {  x:  xLeftChild,
                        y:  yLeftChild,
                        dx:  subXSpan,
                        dy: subYSpan,
                        node: node.getLeftChild() });


    graphSegmentLocations.push( {   xStart: nodeCoords.x, 
                                    yStart:  nodeCoords.y, 
                                    xEnd: xLeftChild,
                                    yEnd: yLeftChild } );
    graphSegmentLocations.push( {   xStart: nodeCoords.x, 
                                    yStart:  nodeCoords.y, 
                                    xEnd: xRightChild,
                                    yEnd: yRightChild } );
    

}

const renderNodes = (context,xCenter,yPos,xSpan,yIncrement,nodeToDraw) => {


    nodesStack = [];
    graphNodeLocations = [];
    graphSegmentLocations = [];

    nodesStack.push( {   x:  xCenter,
                         y:  yPos,
                         dx:  xSpan,
                         dy: yIncrement,
                         node: nodeToDraw });


    while (nodesStack.length !== 0) {

        let nextItem = nodesStack.pop();
        let currentNode = nextItem.node;
        
        
        //Start by drawing the node itself
        //renderNode(context, { x: nextItem.x, y: nextItem.y }, 15 , currentNode.getValue());
        graphNodeLocations.push( { x: nextItem.x, y: nextItem.y, value: currentNode.getValue() });
        
         // Note: having dedicated methods like stack1Children & stack2Children doesn't look go
         //       BUT it is the only way for now I can handle the node with one child and have them vertical 
         //       (instead a pyramid shape like the 2 children notes )
         //       Can I do better that this?
          switch( currentNode.getChildrenCount() ) {
            case 1:
                stack1Children (  currentNode, 
                                 { x:   nextItem.x, 
                                   y:   nextItem.y,
                                   dx:  nextItem.dx,  
                                   dy:  nextItem.dy});  
              break;
            case 2:
                 stack2Children (  currentNode, 
                                  { x:   nextItem.x, 
                                    y:   nextItem.y,
                                    dx:  nextItem.dx,  
                                    dy:  nextItem.dy});  
              break;
          } 

    }




    graphSegmentLocations.forEach( segment => { renderSegment(context, 
                                                             { x: segment.xStart, y: segment.yStart } , 
                                                             { x: segment.xEnd,   y: segment.yEnd } , "#00FF00") 

    });


     graphNodeLocations.forEach( node => {
         renderNode(context, { x: node.x, y: node.y }, 15 , node.value);
     });
    
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
    
    
    // const allNodesByLevel = treeGraph.getValuesByLevel();
    // console.log("Values by level:");
    // console.log(allNodesByLevel);

    // console.log(`Canvas Size = [${canvasWidth},${canvasHeight}]`);
    
    // console.log(`Tree Depth ${treeDepth}`);
    // console.log(`Tree Width ${treeWidth}`);
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


    renderNodes (ctx,
                 xCenter, yPos, 
                 treeWidthSpan,marginY,
                 treeGraph.getRootNode());

}





import { Node } from '../model/Tree.js';

import { CANVAS_MAX_WIDTH ,
         NODE_WIDTH, NODE_HEIGTH,
         NODE_SPACE_BETWEEN_X,NODE_SPACE_BETWEEN_Y } from './RenderConstants.js';






export class ReingoldRenderingAlgo {

    #treeModel;
    #graphNodes;            // This is an array where the nodes and their locations with be at the end...
    #graphSegments;         // This is an array of segments (start and end locations) connecting the nodes of the graph
    #canvasSpecs;           // General details about the Canvas or drawing Zone where the Tree is going to be rendered
    #nodesInputStack;

    constructor(treeModel,canvasSpecs) {

        this.#validateParams(treeModel,canvasSpecs);

        this.#treeModel   = treeModel;
        this.#canvasSpecs = canvasSpecs;

        this.#graphNodes = [];
        this.#graphSegments = [];
        this.#nodesInputStack   = [];

    }

    #validateParams(treeGraph,canvasSpecs){

        if ( treeGraph === null || typeof treeGraph === "undefined")
           throw "You MUST provide a valid TreeGraph object to the BasicRenderingAlgo class!";


        if ( canvasSpecs === null || typeof canvasSpecs === "undefined")
            throw "You MUST provide a valid Canvas Specification object to the BasicRenderingAlgo class!";

        if ( canvasSpecs.width <= 0 ||  canvasSpecs.width > CANVAS_MAX_WIDTH)
            throw "The Canvas's width provided in the Canvas  Specification object appears to be invalid!";

        if ( canvasSpecs.height <= 0 || canvasSpecs.height > CANVAS_MAX_WIDTH)
            throw "The Canvas's width provided in the Canvas  Specification object appears to be invalid!";
    }

    getRenderNodes()     {   return this.#graphNodes; }
    getRenderSegments()  {   return this.#graphSegments; }




    stack1Children = (node, nodeCoords) => {

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



        this.#nodesInputStack.push( {    x:  xChild,
                                    y:  yChild,
                                    dx: subXSpan,
                                    dy: subYSpan,
                                    node: childNode });

        this.#graphSegments.push( { xStart: nodeCoords.x,
                                    yStart:  nodeCoords.y,
                                    xEnd: xChild,
                                    yEnd: yChild } );
    }

    stack2Children (node, nodeCoords)  {

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
        this.#nodesInputStack.push( {   x:  xRightChild,
                                        y:  yRightChild,
                                        dx:  subXSpan,
                                        dy: subYSpan,
                                        node: node.getRightChild() });

        this.#nodesInputStack.push( {   x:  xLeftChild,
                                        y:  yLeftChild,
                                        dx:  subXSpan,
                                        dy: subYSpan,
                                        node: node.getLeftChild() });


        this.#graphSegments.push( {    xStart: nodeCoords.x,
                                       yStart:  nodeCoords.y,
                                       xEnd: xLeftChild,
                                       yEnd: yLeftChild } );
        this.#graphSegments.push( {    xStart: nodeCoords.x,
                                       yStart:  nodeCoords.y,
                                       xEnd: xRightChild,
                                       yEnd: yRightChild } );
    }

   
    // assignStartPos(node , xPos,yPos) {


    //     node.setX(xPos);
    //     node.setY(yPos);
        
    //     const childCount = node.getChildrenCount();

    //     if ( childCount === 2) {

    //         this.assignStartPos(node.getLeftChild() ,  xPos-1, yPos+1);
    //         this.assignStartPos(node.getRightChild() , xPos+1, yPos+1);
    //     } else if ( childCount === 1) {

    //         if ( node.getLeftChild() !==  null )       this.assignStartPos(node.getLeftChild() ,  xPos, yPos+1);
    //         else if ( node.getRightChild() !==  null ) this.assignStartPos(node.getRightChild() , xPos, yPos+1);
    //     }

    //     console.log(`Node ${node.getValue()} assigned to [${xPos} , ${yPos}]`);

    //     return childCount;
    // }


  assignPos(node) {

    const allChildren = node.getTreeCount();
    let leftCount = 0;
    let rightCount = 0;
    let finalX = xPos;
    let finalY = yPos;
    

    if ( node.getLeftChild() !==  null )    leftCount  = node.getLeftChild().getTreeCount();
    if ( node.getRightChild() !==  null )   rightCount = node.getRightChild().getTreeCount();



    console.log("The count of all children is " + allChildren);



    assignStartPos(node,0,0);

  }

//   assignStartPos(node , xPos,yPos) {


//     let leftCount = 0;
//     let rightCount = 0;
//     let finalX = xPos;
//     let finalY = yPos;
    

//     if ( node.getLeftChild() !==  null )    leftCount  = node.getLeftChild().getTreeCount();
//     if ( node.getRightChild() !==  null )   rightCount = node.getRightChild().getTreeCount();
    

//     // Start with the simplest case a Leaf... Assign youself and return the control up to the parent nodes...
//     if ( leftCount === 0 && rightCount === 0) {
//         // node.setX(xPos);
//         // node.setY(yPos);
//     }

//     //Then if there is only a left part to your sub tree, center yourself on top of your only node (left one), en continue the calculation in your left children...
//     else if ( leftCount !== 0 && rightCount === 0) {
//         // node.setX(xPos);
//         // node.setY(yPos);
//         this.assignStartPos(node.getLeftChild() ,  xPos, yPos+1);
//     }

//     //Or if it the opposite (no left part), then same as previous, but use the right sub node as anchor, and continue calcuation there...
//     else if ( leftCount === 0 && rightCount !== 0) {
//         // node.setX(xPos);
//         // node.setY(yPos);
//         this.assignStartPos(node.getRightChild() ,  xPos, yPos+1);
//     }
    
//     else  {
//         //Finally, you have 2 sub trees (one to the left and to the right), then you have to center yourself on top of them, proportionnal to the side of the sub tree..
//         // For instance, if you left tree is way bigger (children count), then you have to let more space to the left tree, then you move yourself to the right to create
//         // space under me...
//         //finalX = leftCount+1;

//         if (yPos === 0)
//             finalX = leftCount+1;
//         else
//             finalX = xPos+1;
        
//         // node.setX(leftCount+1);
//         // node.setY(yPos);

//         //this.assignStartPos(node.getLeftChild() ,  leftCount+xPos, yPos+1);
//         this.assignStartPos(node.getLeftChild() ,  finalX - Math.round(leftCount/2), yPos+1);
//         this.assignStartPos(node.getRightChild() , finalX + leftCount+1+Math.round(rightCount/2), yPos+1);
//     }

//     node.setX(finalX);
//     node.setY(finalY);
//     console.log(`Node ${node.getValue()} assigned to [${finalX} , ${finalY}]`);

// }


assignPos(node) {

    let leftCount = 0;
    let rightCount = 0;
    

    if ( node.getLeftChild() !==  null )    leftCount  = node.getLeftChild().getTreeCount();
    if ( node.getRightChild() !==  null )   rightCount = node.getRightChild().getTreeCount();


    this.assignStartPos(node,leftCount+1,1)


}

assignStartPos(node , xCenterPos,yPos) {


    let leftCount = 0;
    let rightCount = 0;
    // let finalX = xCenterPos;
    // let finalY = yPos;
    

    if ( node.getLeftChild() !==  null )    leftCount  = node.getLeftChild().getTreeCount();
    if ( node.getRightChild() !==  null )   rightCount = node.getRightChild().getTreeCount();
    

    // Start with the simplest case a Leaf... Assign youself and return the control up to the parent nodes...
    if ( leftCount === 0 && rightCount === 0) {
        node.setX(xCenterPos);
        node.setY(yPos);

        console.log(`Final Node ${node.getValue()} assigned to [${xCenterPos} , ${yPos}]`);
        return;
    }

    //Then if there is only a left part to your sub tree, center yourself on top of your only node (left one), en continue the calculation in your left children...
    else if ( leftCount !== 0 && rightCount === 0) {
        node.setX(xCenterPos);
        node.setY(yPos);
        const deltaX =  Math.round(leftCount/2);
        const nextCenterX = xCenterPos - deltaX;

        console.log(`Left Only Node ${node.getValue()} assigned to [${xCenterPos} , ${yPos}], deltaX = ${deltaX} and nextCenterX = ${nextCenterX}`);
        this.assignStartPos(node.getLeftChild() ,  nextCenterX, yPos+1);
    }

    //Or if it the opposite (no left part), then same as previous, but use the right sub node as anchor, and continue calcuation there...
    else if ( leftCount === 0 && rightCount !== 0) {
        node.setX(xCenterPos);
        node.setY(yPos);
        const deltaX =  Math.round(rightCount/2);
        const nextCenterX = xCenterPos + deltaX;

        console.log(`Rigth Only Node ${node.getValue()} assigned to [${xCenterPos} , ${yPos}], deltaX = ${deltaX} and nextCenterX = ${nextCenterX}`);

        this.assignStartPos(node.getRightChild() ,  nextCenterX, yPos+1);
    }
    
    else  {
        //Finally, you have 2 sub trees (one to the left and to the right), then you have to center yourself on top of them, proportionnal to the side of the sub tree..
        // For instance, if you left tree is way bigger (children count), then you have to let more space to the left tree, then you move yourself to the right to create
        // space under me...
        
        node.setX(xCenterPos);
        node.setY(yPos);

        const deltaXLeft  =  Math.round(leftCount/2);
        const deltaXRight =  Math.round(rightCount/2);

        
        const nextLeftCenterX = xCenterPos - deltaXLeft;
        const nextRightCenterX = xCenterPos + deltaXRight;
        
        console.log(`Full Tree  Node ${node.getValue()} assigned to [${xCenterPos} , ${yPos}], Left deltaX = ${deltaXLeft} and Left nextCenterX = ${nextLeftCenterX},  Right deltaX = ${deltaXRight} and Right nextCenterX = ${nextRightCenterX}`);

        this.assignStartPos(node.getLeftChild() ,  nextLeftCenterX, yPos+1);
        this.assignStartPos(node.getRightChild() , nextRightCenterX, yPos+1);
    }



}

    calculateNodesLocations (xCenter,yPos)  {


        console.log(`%c This is the Reingold! `, "color:red");

        this.assignPos(this.#treeModel.getRootNode());

       
        this.#nodesInputStack   = [];
        this.#graphNodes        = [];
        this.#graphSegments     = [];


        const treeDepth    = this.#treeModel.getDepth();
        const treeWidth    = this.#treeModel.getWidth();

        // This space calculation is very specifi to a Tree Rendering algo, and should not be here but in a specialized rendering class
        let    treeWidthSpan     = (treeWidth * NODE_WIDTH) + ((treeWidth-1) * NODE_SPACE_BETWEEN_X) ;
        const  treeHeightSpan    = (treeDepth * NODE_HEIGTH) + ( (treeDepth-1) * NODE_SPACE_BETWEEN_Y)
        const  treeInterRowSpace = NODE_HEIGTH + NODE_SPACE_BETWEEN_Y;

        // It happens that for tree really unbalanced, the width become very big, so the division below is a patch, but a more elegant solution would be required here!
        if (treeWidthSpan > this.#canvasSpecs.width)
            treeWidthSpan =  treeWidthSpan/2;


        const marginX = (this.#canvasSpecs.width - treeWidthSpan)/ 2;


         this.#nodesInputStack.push( {  x:  xCenter,
                                  y:  yPos,
                                  dx:  treeWidthSpan,
                                  dy:   NODE_SPACE_BETWEEN_Y,
                                  node: this.#treeModel.getRootNode() });


        while (this.#nodesInputStack.length !== 0) {

            let nextItem = this.#nodesInputStack.pop();
            let currentNode = nextItem.node;

            //Start by drawing the node itself
            this.#graphNodes.push( { x: nextItem.x, y: nextItem.y, value: currentNode.getValue() });


            // Note: having dedicated methods like stack1Children & stack2Children doesn't look good...
            //       BUT it is the only way for now I can handle the node with one child and have them verticaly aligned in a tree graph...
            //       (instead a pyramid shape like the 2 children notes )
            //       Can I do better that this?
            switch( currentNode.getChildrenCount() ) {
                case 1:
                    this.stack1Children (  currentNode,
                                            {   x:   nextItem.x,
                                                y:   nextItem.y,
                                                dx:  nextItem.dx,
                                                dy:  nextItem.dy});
                break;
                case 2:
                    this.stack2Children (  currentNode,
                                            {   x:   nextItem.x,
                                                y:   nextItem.y,
                                                dx:  nextItem.dx,
                                                dy:  nextItem.dy});
                break;
            }
        }

    }
}
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



    calculateNodesLocations() {


        this.#graphSegments = [];

        let node = this.#treeModel.getRootNode();


        console.log(`%c assignPos II called` , "color:red");
        let leftCount = 0;
        let rightCount = 0;
        
        if ( node.getLeftChild() !==  null )    leftCount  = node.getLeftChild().getTreeCount();
        if ( node.getRightChild() !==  null )   rightCount = node.getRightChild().getTreeCount();

        this.assignStartPos(node,leftCount+1,1);

        const recordSegments = (node) => {

            if ( node.getLeftChild() !==  null )  {

                this.#graphSegments.push( { xStart:  node.getX(),
                                            yStart:  node.getY(),
                                            xEnd:    node.getLeftChild().getX(),
                                            yEnd:    node.getLeftChild().getY() } );

                recordSegments(node.getLeftChild());
            }

            if ( node.getRightChild() !==  null ) {

                this.#graphSegments.push( { xStart:  node.getX(),
                                            yStart:  node.getY(),
                                            xEnd:    node.getRightChild().getX(),
                                            yEnd:    node.getRightChild().getY() } );

                recordSegments(node.getRightChild());
            }
        }


        recordSegments(node);

    }

    assignStartPos(node , xCenterPos,yPos) {

        let leftCount = 0;
        let rightCount = 0;
        
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
            // const nextCenterX = xCenterPos - deltaX;
            const nextCenterX = xCenterPos;
            

            console.log(`Left Only Node ${node.getValue()} size of ${leftCount} assigned to [${xCenterPos} , ${yPos}], deltaX = ${deltaX} and nextCenterX = ${nextCenterX}`);

            this.assignStartPos(node.getLeftChild() ,  nextCenterX, yPos+1);
        }

        //Or if it the opposite (no left part), then same as previous, but use the right sub node as anchor, and continue calcuation there...
        else if ( leftCount === 0 && rightCount !== 0) {
            node.setX(xCenterPos);
            node.setY(yPos);
            const deltaX =  Math.round(rightCount/2);
            // const nextCenterX = xCenterPos + deltaX;
            const nextCenterX = xCenterPos;
            

            console.log(`Rigth Only Node ${node.getValue()} size of ${rightCount} assigned to [${xCenterPos} , ${yPos}], deltaX = ${deltaX} and nextCenterX = ${nextCenterX}`);
        
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
            
            console.log(`Full Tree  Node ${node.getValue()} size of L${leftCount} R${rightCount} assigned to [${xCenterPos} , ${yPos}], Left deltaX = ${deltaXLeft} and Left nextCenterX = ${nextLeftCenterX},  Right deltaX = ${deltaXRight} and Right nextCenterX = ${nextRightCenterX}`);

            this.assignStartPos(node.getLeftChild() ,  nextLeftCenterX, yPos+1);
            this.assignStartPos(node.getRightChild() , nextRightCenterX, yPos+1);
        }



    }

    
}
import {Node,TreeGraph} from '../model/Tree.js';


const NODE_WIDTH            =   25;
const NODE_HEIGTH           =   25;

const NODE_SPACE_BETWEEN_X  =   5;
const NODE_SPACE_BETWEEN_Y  =   20;



export class TreeGraphRender {

    #graphNodeLocations; 
    #graphSegmentLocations;
    #nodesStack;
    #canvas;   
    #treeGraph;

    #treeWidthSpan;
    #treeHeightSpan;
    #treeInterRowSpace;

    #marginX ;
    #marginY;

    // Should use a Rendering Algorithm and deletegate the calculation of where the nodes should be drawed..

    constructor(targetCanvas, treeGraph) {

        this.#validateParams(targetCanvas, treeGraph);

        this.#canvas = targetCanvas;
        this.#treeGraph = treeGraph;

        this.#init();
    }

    #validateParams(targetCanvas, treeGraph){

        if ( targetCanvas === null || typeof targetCanvas === "undefined") 
           throw "You MUST provide a valid Canvas object to the TreeGraphRender class!";
        if ( treeGraph === null || typeof treeGraph === "undefined") 
           throw "You MUST provide a valid TreeGraph object to the TreeGraphRender class!";

    }

    #init() {

        this.#graphNodeLocations = [];
        this.#graphSegmentLocations = [];
        this.#nodesStack = [];

        var canvasWidth  = this.#canvas.width;
        var canvasHeight = this.#canvas.height;

        const treeDepth  = this.#treeGraph.getDepth();   
        const treeWidth  = this.#treeGraph.getWidth();

        this.#treeWidthSpan = (treeWidth * NODE_WIDTH) + ((treeWidth-1) * NODE_SPACE_BETWEEN_X) ;    
        this.#treeHeightSpan = (treeDepth * NODE_HEIGTH) + ( (treeDepth-1) * NODE_SPACE_BETWEEN_Y)
        this.#treeInterRowSpace = NODE_HEIGTH + NODE_SPACE_BETWEEN_Y;
        
        // It happens that for tree really unbalanced, the width become very big,
        // so the division below is a patch, but a more elegant solution would be required here!
        if (this.#treeWidthSpan > canvasWidth) 
            this.#treeWidthSpan =  this.#treeWidthSpan/2;

        this.#marginX = (canvasWidth - this.#treeWidthSpan)/ 2;
        //const marginY = (canvasHeight - treeHeightSpan)/ 2;       // This was the orginal code,but that give graph too wide!
        this.#marginY = this.#treeInterRowSpace;
        
    

        console.log(`Canvas Size = [${canvasWidth}px ,${canvasHeight}px],  Tree Size = [${treeWidth},${treeDepth}]`);    
        console.log(`%c Render Window width,heigth [${window.innerWidth},${window.innerHeight} ]`, "color:red");
        console.log(`Total Tree size is [${this.#treeWidthSpan},${this.#treeHeightSpan}]`);

    }

    toString() {
        return `Canvas`;
    }

    
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

        this.#nodesStack.push( {    x:  xChild,
                                    y:  yChild,
                                    dx: subXSpan,
                                    dy: subYSpan,
                                    node: childNode });

        this.#graphSegmentLocations.push( { xStart: nodeCoords.x, 
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
        this.#nodesStack.push( {    x:  xRightChild,
                                    y:  yRightChild,
                                    dx:  subXSpan,
                                    dy: subYSpan,
                                    node: node.getRightChild() });

        this.#nodesStack.push( {    x:  xLeftChild,
                                    y:  yLeftChild,
                                    dx:  subXSpan,
                                    dy: subYSpan,
                                    node: node.getLeftChild() });


        this.#graphSegmentLocations.push( {    xStart: nodeCoords.x, 
                                                yStart:  nodeCoords.y, 
                                                xEnd: xLeftChild,
                                                yEnd: yLeftChild } );
        this.#graphSegmentLocations.push( {    xStart: nodeCoords.x, 
                                                yStart:  nodeCoords.y, 
                                                xEnd: xRightChild,
                                                yEnd: yRightChild } );
    }

    renderNodes (context,xCenter,yPos)  {
        
        this.#nodesStack = [];
        this.#graphNodeLocations = [];
        this.#graphSegmentLocations = [];

         this.#nodesStack.push( {       x:  xCenter,
                                        y:  yPos,
                                        dx:  this.#treeWidthSpan,
                                        dy:   this.#marginY,
                                        node: this.#treeGraph.getRootNode() });
    

        while (this.#nodesStack.length !== 0) {

            let nextItem = this.#nodesStack.pop();
            let currentNode = nextItem.node;
        
        
            //Start by drawing the node itself
            this.#graphNodeLocations.push( { x: nextItem.x, y: nextItem.y, value: currentNode.getValue() });
            
            // Note: having dedicated methods like stack1Children & stack2Children doesn't look go
            //       BUT it is the only way for now I can handle the node with one child and have them vertical 
            //       (instead a pyramid shape like the 2 children notes )
            //       Can I do better that this?
            switch( currentNode.getChildrenCount() ) {
                case 1:
                    this.stack1Children (  currentNode, 
                                    { x:   nextItem.x, 
                                    y:   nextItem.y,
                                    dx:  nextItem.dx,  
                                    dy:  nextItem.dy});  
                break;
                case 2:
                    this.stack2Children (  currentNode, 
                                    { x:   nextItem.x, 
                                        y:   nextItem.y,
                                        dx:  nextItem.dx,  
                                        dy:  nextItem.dy});  
                break;
            } 
        }


        this.#graphSegmentLocations.forEach( segment => { this.renderSegment(context, 
                                                                { x: segment.xStart, y: segment.yStart } , 
                                                                { x: segment.xEnd,   y: segment.yEnd } , "#00FF00") 

        });


        this.#graphNodeLocations.forEach( node => {
            this.renderNode(context, { x: node.x, y: node.y }, 10 , node.value);
        });
    
    }

    
    renderNode(context, position, size , value) {

        context.strokeStyle = "#FBED20";
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Math.PI);
        context.fillStyle = 'white';
        context.fill();
        context.lineWidth = 2;
        context.stroke();

        context.textAlign = "center";
        context.textBaseline = "middle"; 
        context.font = "12px Arial";
        const label = value;

        context.fillStyle = "black";
        context.fillText(label, position.x+1, position.y+1);
        context.fillStyle = "#0046BE";
        context.fillText(label, position.x, position.y);
    
    }

    renderSegment (context, startPos, endPos, color) {
    
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);
        context.strokeStyle = color;
        
        context.stroke(); 
    }

    draw() {

        var ctx = this.#canvas.getContext("2d");


        ctx.fillStyle = "#FBED20;";
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#FF0000";
        ctx.beginPath();
        ctx.rect(this.#marginX, 
                 this.#marginY, 
                 this.#treeWidthSpan, 
                 this.#treeHeightSpan);
        ctx.stroke();
    
    
        ctx.strokeStyle = "#FBED20";
        let xCenter = this.#marginX + (this.#treeWidthSpan/2); 
        let yCenter = this.#marginY;

        this.renderNodes (  ctx, xCenter, yCenter );
    
    }
}
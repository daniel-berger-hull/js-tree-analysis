import { BasicRenderingAlgo } from './BasicRenderingAlgo.js';


import {  NODE_WIDTH, NODE_HEIGTH, 
          NODE_SPACE_BETWEEN_X,NODE_SPACE_BETWEEN_Y,
          NODE_RADIUS } from './RenderConstants.js';



export class TreeGraphRender {


    #canvas;   
    #treeGraph;
    #renderingAlgo;

    //Note: Those private fields are they really needed?  The rendering Algo is doing the exact same calculations..
    #treeWidthSpan;
    #treeHeightSpan;
    #treeInterRowSpace;
    #marginX ;
    #marginY;


    
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

     
        const canvasSpecs = {  width: this.#canvas.width,
                               height: this.#canvas.height };
        
        this.#renderingAlgo = new  BasicRenderingAlgo(this.#treeGraph,canvasSpecs);


        // Note: does the rest of the code in this #init() is really necessary? A lot of this is done in Rendering Algo,which should be better placed to make the calculation..
        const canvasWidth  = this.#canvas.width;
        const canvasHeight = this.#canvas.height;
        const treeDepth    = this.#treeGraph.getDepth();   
        const treeWidth    = this.#treeGraph.getWidth();

        // This space calculation is very specifi to a Tree Rendering algo, and should not be here but in a specialized rendering class
        // For instance, the Width span of a tree is very dependent of the algo used (some a very wide while some other a way more efficient and compact in their rendering)
        this.#treeWidthSpan     = (treeWidth * NODE_WIDTH) + ((treeWidth-1) * NODE_SPACE_BETWEEN_X) ;    
        this.#treeHeightSpan    = (treeDepth * NODE_HEIGTH) + ( (treeDepth-1) * NODE_SPACE_BETWEEN_Y)
        this.#treeInterRowSpace = NODE_HEIGTH + NODE_SPACE_BETWEEN_Y;
        
        // It happens that for tree really unbalanced, the width become very big, so the division below is a patch, but a more elegant solution would be required here!
        if (this.#treeWidthSpan > canvasWidth) 
            this.#treeWidthSpan =  this.#treeWidthSpan/2;

        this.#marginX = (canvasWidth - this.#treeWidthSpan)/ 2;
        //const marginY = (canvasHeight - treeHeightSpan)/ 2;       // This was the orginal code,but that give graph too wide!
        this.#marginY = this.#treeInterRowSpace;
        

    }

    displaySepcs() {

        console.log(`Window  size is [${window.innerWidth}px, ${window.innerHeight}px], `);
        console.log(`Canvas Size = [${this.#canvas.width}px, ${this.#canvas.height}px], `);
        console.log(`Tree Size = [${this.#treeGraph.getWidth()}, ${this.#treeGraph.getDepth()}], `);
        console.log(`Tree span  is [${this.#treeWidthSpan}, ${this.#treeHeightSpan}]`);
    }

    
    renderTreeGraph (context,xCenter,yPos)  {
        
        this.#renderingAlgo.renderNodes (xCenter,yPos);
        const resultnodes     = this.#renderingAlgo.getRenderNodes();
        const resultSegments  = this.#renderingAlgo.getRenderSegments();

        resultSegments.forEach( segment => { this.renderSegment(  context, 
                                                                { x: segment.xStart, y: segment.yStart } , 
                                                                { x: segment.xEnd,   y: segment.yEnd } , 
                                                                  "#00FF00") 

        });

        resultnodes.forEach( node => {
            this.renderNode(context, { x: node.x, y: node.y }, NODE_RADIUS , node.value);
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


    //Responsibility of TreeGraphRender
    // * Should determined the center pos the where the graph to be drawn
    // * Should delegated to a Render Algo the calculation of nodes' location on the rendering
    // * Should be the one drawing, from a solution of locations from an Algo class
    // ------------------------------------------
    // Responsibility of Render Algo 
    // * Should  do the detailed calculation of where the nodes
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

        this.renderTreeGraph( ctx, xCenter, yCenter );
    
    }
}
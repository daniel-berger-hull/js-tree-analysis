// import { BasicRenderingAlgo }    from './BasicRenderingAlgo.js';
// import { ReingoldRenderingAlgo } from './ReingoldRenderingAlgo.js';


// import {  NODE_WIDTH, NODE_HEIGTH, 
//           NODE_SPACE_BETWEEN_X,NODE_SPACE_BETWEEN_Y,
//           NODE_RADIUS } from './RenderConstants.js';

         

export class GraphRender {


//     #canvas;   
//     #treeGraph;
//     #reingoldRenderingAlgo;
//     #basicRenderAlgo;
    
//     //Note: Those private fields are they really needed?  The rendering Algo is doing the exact same calculations..
//     #treeWidthSpan;
//     #treeHeightSpan;
//     #treeInterRowSpace;
//     #marginX ;
//     #marginY;


    
//     constructor(targetCanvas, treeGraph) {

//         this.#validateParams(targetCanvas, treeGraph);

//         this.#canvas = targetCanvas;
//         this.#treeGraph = treeGraph;

//         this.#init();
//     }

//     #validateParams(targetCanvas, treeGraph){

//         if ( targetCanvas === null || typeof targetCanvas === "undefined") 
//            throw "You MUST provide a valid Canvas object to the TreeGraphRender class!";
//         if ( treeGraph === null || typeof treeGraph === "undefined") 
//            throw "You MUST provide a valid TreeGraph object to the TreeGraphRender class!";

//     }

//     #init() {

//         const canvasSpecs = {  width:  this.#canvas.width,
//                                height: this.#canvas.height };
        
//         this.#reingoldRenderingAlgo = new  ReingoldRenderingAlgo(this.#treeGraph,canvasSpecs);
//         this.#basicRenderAlgo = new  BasicRenderingAlgo(this.#treeGraph,canvasSpecs);

    
//         // Note: does the rest of the code in this #init() is really necessary? A lot of this is done in Rendering Algo,which should be better placed to make the calculation..
//         const canvasWidth  = this.#canvas.width;
//         const canvasHeight = this.#canvas.height;
//         const treeDepth    = this.#treeGraph.getDepth();   
//         const treeWidth    = this.#treeGraph.getWidth();

//         // This space calculation is very specifi to a Tree Rendering algo, and should not be here but in a specialized rendering class
//         // For instance, the Width span of a tree is very dependent of the algo used (some a very wide while some other a way more efficient and compact in their rendering)
//         this.#treeWidthSpan     = (treeWidth * NODE_WIDTH) + ((treeWidth-1) * NODE_SPACE_BETWEEN_X) ;    
//         this.#treeHeightSpan    = (treeDepth * NODE_HEIGTH) + ( (treeDepth-1) * NODE_SPACE_BETWEEN_Y)
//         this.#treeInterRowSpace = NODE_HEIGTH + NODE_SPACE_BETWEEN_Y;
        
//         // It happens that for tree really unbalanced, the width become very big, so the division below is a patch, but a more elegant solution would be required here!
//         if (this.#treeWidthSpan > canvasWidth) 
//             this.#treeWidthSpan =  this.#treeWidthSpan/2;

//         this.#marginX = (canvasWidth - this.#treeWidthSpan)/ 2;
//         //const marginY = (canvasHeight - treeHeightSpan)/ 2;       // This was the orginal code,but that give graph too wide!
//         this.#marginY = this.#treeInterRowSpace;
        

//     }

//     displaySepcs() {

//         console.log(`Window  size is [${window.innerWidth}px, ${window.innerHeight}px], `);
//         console.log(`Canvas Size = [${this.#canvas.width}px, ${this.#canvas.height}px], `);
//         console.log(`Tree Size = [${this.#treeGraph.getWidth()}, ${this.#treeGraph.getDepth()}], `);
//         console.log(`Tree span  is [${this.#treeWidthSpan}, ${this.#treeHeightSpan}]`);
//     }

    
//     //This method demo the rendering of the basic Rendering algo, with is top-down algo, who calculate based on the center position of a sub tree, to place it roots there.
//     // and the algo goes recursively to the children using the same principe...
//     renderTreeGraphBasic (context,xCenter,yPos)  {

//         context.fillStyle = "#FBED20;";
//         context.lineWidth = "1";
//         context.strokeStyle = "#FF0000";
//         context.beginPath();
//         context.rect(this.#marginX, 
//                  this.#marginY, 
//                  this.#treeWidthSpan, 
//                  this.#treeHeightSpan);
//         context.stroke();
    
    
//         this.#basicRenderAlgo.calculateNodesLocations (xCenter,yPos);

//         const resultnodes     = this.#basicRenderAlgo.getRenderNodes();
//         const resultSegments  = this.#basicRenderAlgo.getRenderSegments();

//         resultSegments.forEach( segment => { this.renderSegment(  context, 
//                                                                 { x: segment.xStart, y: segment.yStart } , 
//                                                                 { x: segment.xEnd,   y: segment.yEnd } , 
//                                                                   "#00FF00") 

//         });

//         resultnodes.forEach( node => {
//             this.renderNode(context, { x: node.x, y: node.y }, NODE_RADIUS , node.value);
//         });


//     }

//     renderTreeGraphReingold( context, xCenter, yCenter ) {

    
//          this.#reingoldRenderingAlgo.calculateNodesLocations();
         
//          const x = this.#treeGraph.getRootNode().getX();
//          const y = this.#treeGraph.getRootNode().getY();

//          const resultSegments  = this.#reingoldRenderingAlgo.getRenderSegments();

//         resultSegments.forEach( segment => { this.renderSegment(  context, 
//                                             {   x: xCenter + (segment.xStart*40), 
//                                                 y: yCenter + (segment.yStart*30) } , 
//                                             {   x: xCenter + (segment.xEnd  *40),   
//                                                 y: yCenter + (segment.yEnd  *30)} , 
//                                                 "#E0E0E0")   }); 

//          const drawNode = (context,nextNode) => { 
  
//             const nodePos = {  x : xCenter + (nextNode.getX() * 40),
//                                y : yCenter + (nextNode.getY() * 30) };
      
             
//                 const isLeaf = (nextNode.getChildrenCount() === 0) ? true : false;

//                 this.renderNode(context, nodePos, 10 , nextNode.getValue(),isLeaf); 
 
 
//                 if ( nextNode.getLeftChild() !==  null)     drawNode(context,nextNode.getLeftChild());
//                 if ( nextNode.getRightChild() !==  null)    drawNode(context,nextNode.getRightChild());
//          }
 
//          drawNode(context,this.#treeGraph.getRootNode());
// }    
//     renderNode(context, position, size , value, isLeaf) {

//         context.strokeStyle = "#FBED20";
//         context.beginPath();
//         context.arc(position.x, position.y, size, 0, 2 * Math.PI);

//         context.fillStyle = (isLeaf === true) ? 'blue' : 'white';

//         context.fill();
//         context.lineWidth = 2;
//         context.stroke();

//         context.textAlign = "center";
//         context.textBaseline = "middle"; 
//         context.font = "12px Arial";
//         const label = value;

//         context.fillStyle = "black";
//         context.fillText(label, position.x+1, position.y+1);
//         // context.fillStyle = "#0046BE";

//         context.fillStyle = (isLeaf === true) ? 'white' : "#0046BE";
//         context.fillText(label, position.x, position.y);
    
//     }

//     renderSegment (context, startPos, endPos, color) {
    
//         context.beginPath();
//         context.moveTo(startPos.x, startPos.y);
//         context.lineTo(endPos.x, endPos.y);
//         context.strokeStyle = color;
//         context.lineWidth = 1;
        
//         context.stroke(); 
//     }


//     //Responsibility of TreeGraphRender
//     // * Should determine the center pos the where the graph to be drawn
//     // * Should delegated to a Render Algo the calculation of nodes' location on the rendering
//     // * Should be the one drawing, from a solution of locations from an Algo class
//     // ------------------------------------------
//     // Responsibility of Render Algo 
//     // * Should  do the detailed calculation of where the nodes
//     draw() {

//         var ctx = this.#canvas.getContext("2d");

//         let xCenter = this.#marginX + (this.#treeWidthSpan/2); 
//         let yCenter = this.#marginY;

//         //this.renderTreeGraphBasic( ctx, xCenter, yCenter );
      
//         this.renderTreeGraphReingold( ctx, xCenter, yCenter );
//     }

//     draw(xPos, yPos) {

//         var ctx = this.#canvas.getContext("2d");

//         // let xCenter = this.#marginX + xPos;
//         // let yCenter = this.#marginY + yPos;

//         let xLeftBorder = xPos;
//         let yTopBorder = yPos;

//          this.renderTreeGraphReingold( ctx, xLeftBorder, yTopBorder );
//     }
}
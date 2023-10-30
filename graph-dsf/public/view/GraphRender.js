"use strict";


// import { Graph }      from '../model/Graph.js';
import  { determinePos } from './NodeSpaceLocator.js';

import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING  } from './RenderingConstants.js';



// This class should only draw on the Canvas, and the calculations required, like the locations of the node shouhld be delegated to some other classes or functions...
// The reason is that the way we spread the nodes on a the screen can be done in many differents ways, but things like draw a node or segment alway stay the same and should be done in this class only


export class GraphRender {


    #canvas;   
    #graphObject;
    #renderingMode;

    constructor(targetCanvas, graph, renderingMode) {

        this.#validateParams(targetCanvas,graph);

        this.#canvas = targetCanvas;
        this.#graphObject = graph;
        this.#renderingMode = renderingMode;
        this.#init();
    }

    #validateParams(targetCanvas, graph){

        if ( targetCanvas === null || typeof targetCanvas === "undefined") 
           throw "You MUST provide a valid Canvas object to the GraphRender class!";
           if ( graph === null || typeof graph === "undefined") 
           throw "You MUST provide a valid Graph object GraphRender class!";


    }

    #init() {

        //Note the init may be removed later if no usage is done...
    }


    getCanvas()                  { return this.#canvas;         };
    getGraph()                   { return this.#graphObject;    };
    getRenderingMode()           { return this.#renderingMode;  };    


    setCanvas(canvas)            {  this.#canvas = canvas;       }
    setGraph(graph)              {  this.#graphObject = graph;   };
    setRenderingMode(mode)       {  this.#renderingMode;  };    


    #isValidRenderingMode(mode) {
        if (mode < CIRCULAR_GRAPH_RENDERING || mode > RANDOM_GRAPH_RENDERING)  return false;
        else
            return true;



    }


    renderNode(context, position, size , value, isLeaf) {

        context.strokeStyle = "#FBED20";
        context.beginPath();
        context.arc(position.x, position.y, size, 0, 2 * Math.PI);

        context.fillStyle = (isLeaf === true) ? 'blue' : 'white';

        context.fill();
        context.lineWidth = 2;
        context.stroke();

        context.textAlign = "center";
        context.textBaseline = "middle"; 
        context.font = "12px Arial";
        const label = value;

        context.fillStyle = "black";
        context.fillText(label, position.x+1, position.y+1);

        context.fillStyle = (isLeaf === true) ? 'white' : "#0046BE";
        context.fillText(label, position.x, position.y);    
    }

    renderSegment (context, startPos, endPos, color) {
    
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(endPos.x, endPos.y);
        context.strokeStyle = color;
        context.lineWidth = 1;
        
        context.stroke(); 
    }

    renderLoopSegment (context, position, size, color) {
    
        context.beginPath();
        context.arc(position.x, position.y-(size*1.3), size, 0, 2 * Math.PI);

        context.lineWidth = 1;
        context.stroke();
        
    }


    getCanvasSpecs () {

        return { width: this.#canvas.width,
                 height: this.#canvas.height};
    }


    drawSegments(ctx, graph, nodePosArray) {

        for (let i=0;i<graph.size();i++) {
            const nextNodeValue = graph.getNodeValue(i);
            const startNodePos =   { x: nodePosArray[i].x,        
                                     y: nodePosArray[i].y };


            const edges =  graph.getEdgesForNode(i);

            // 2 Type of segments here: A) The regular from Node x to y, at different location B) A special case, where a node points to itself and an arc from and to the node has to be draw...
            edges.forEach( index => { 

                if (index !== i) {
                   // console.log(i + " to " + index);
                    const endNodePos =   { x: nodePosArray[index].x,   y: nodePosArray[index].y };
                    this.renderSegment(  ctx,  startNodePos,  endNodePos, "#00FF00"); 
                } else {
                    console.log("Render: an edge on the same node detected!");
                    this.renderLoopSegment (ctx, startNodePos,  10, "#00FF00");
                }
            });           
        }
    }


    drawPath(ctx, graph, nodePosArray) {

        const seletectedNodeIndex = graph.getSelectedNode();
        const path = graph.DFS(seletectedNodeIndex);
      
        console.log("Display path from node :" + seletectedNodeIndex);

        let startIndex = path[0];
        let startNodePos =   { x: nodePosArray[startIndex].x,        
                               y: nodePosArray[startIndex].y };        

        for (let i=1;i<path.length;i++) {

            let endIndex = path[i];
            let endNodePos =   {   x: nodePosArray[endIndex].x,        
                                   y: nodePosArray[endIndex].y }; 

            this.renderSegment(  ctx,  startNodePos,  endNodePos, "#FF0000"); 
            
            startNodePos = endNodePos;
        }

    }

    drawNodes(ctx, nodePosArray) {

        // Draw the node on top of the segments...
        nodePosArray.forEach( (pos,index) => { 
            this.renderNode( ctx, pos, 10 ,  index  ,true) ; 
        });
    }

    draw() {

        var ctx = this.#canvas.getContext("2d");
        const graph = this.#graphObject;
        const nodePositions = determinePos( graph, this.getCanvasSpecs(), this.getRenderingMode()  );

        this.drawSegments(ctx, graph, nodePositions);
        this.drawPath(ctx, graph, nodePositions);
        this.drawNodes(ctx, nodePositions);
    }

}

import { Graph }      from '../model/Graph.js';

import { CIRCULAR_GRAPH_RENDERING  , CONCENTRIC_GRAPH_RENDERING  ,RANDOM_GRAPH_RENDERING  } from './RenderingConstants.js';



export function determinePos(graph, canvasSpecs, renderingType) {

  //      console.log("NodeSpaceLocator: determinePos Function: Graph has a size of " + graph.size());

        // for (let i=0;i<graph.size();i++) {
        //     const nextNodeValue = graph.getNodeValue(i);

        //     //console.log(i + " --> val: " +  nextNodeValue + " , Edges: " + graph.getEdgesForNode(i));

        // }

        let xCenter = canvasSpecs.width / 2;
        let yCenter = canvasSpecs.height / 2;

        let dim = (xCenter > yCenter) ? yCenter: xCenter;
        const radius = Math.round( dim  * 0.75);

        // console.log("Canvas");
        // console.log("\t [width,height] = " + canvasSpecs.width + "," + canvasSpecs.height);
        // console.log("\t [x Center, y Center] = " + xCenter + "," + yCenter);
        

        // return  circularAnglePositions( graph.size(), 
        //                                     {xCenter: xCenter,
        //                                     yCenter: yCenter},
        //                                     radius     
        //                                     );


        

        switch (renderingType) {
            case CIRCULAR_GRAPH_RENDERING:
                return  circularAnglePositions( graph.size(), {xCenter: xCenter, yCenter: yCenter}, radius );
            case CONCENTRIC_GRAPH_RENDERING:
                return  concentricPositions( graph, {xCenter: xCenter, yCenter: yCenter}, radius );
            case RANDOM_GRAPH_RENDERING:
                return randomPositions(graph  ,   {xCenter: xCenter, yCenter: yCenter},radius);  
    
        }
                                             


        // return positions;
}

function circularAnglePositions(n, centerPos, radius ) {
    let positions = [];
    const angle = 2*Math.PI / n;

    let currentAngle = 0;
    for (let i=0;i<n;i++) {

        const x = centerPos.xCenter - Math.round( radius * Math.sin(currentAngle) ); 
        const y = centerPos.yCenter - Math.round( radius * Math.cos(currentAngle) ); 

        //console.log( i + " [x,y] = " + x + "," + y);
        currentAngle += angle;

        positions.push( {x:x, y:y} );
    }

    return positions;
}

function concentricPositions(graph, centerPos, radius ) {

    const n =  graph.size();

    //If there are to few  nodes (Like 4 or less), there is no point to use concentric circle for the rendering, and simple circle rendering will be ok...
    if (n <= 4)   return  circularAnglePositions( n, centerPos, radius );

    

  

      let positions = [];

      const nodeListByEdgeCount = new Map();


    //   Sort node by edges count (most edge at the top)
    //   --> Nodes with most edge in the inner circle 
    //   --> Node with fewer or orphan on the outside circle

      for (let i=0;i<n;i++){
        const edges = graph.getEdgesForNode(i);;
        const edgeCount = edges.length;

        let nodeList = nodeListByEdgeCount.get(edgeCount);

        if (nodeList === undefined) {
            nodeList = [i];
        } else {
            nodeList.push(i);
        }

        nodeListByEdgeCount.set(edgeCount, nodeList);

        console.log("Node List");
      }

      


    // const angle = 2*Math.PI / n;



    // let currentAngle = 0;
    // for (let i=0;i<n;i++) {

    //     const x = centerPos.xCenter - Math.round( radius * Math.sin(currentAngle) ); 
    //     const y = centerPos.yCenter - Math.round( radius * Math.cos(currentAngle) ); 

    //     //console.log( i + " [x,y] = " + x + "," + y);
    //     currentAngle += angle;

    //     positions.push( {x:x, y:y} );
    // }

    positions =  randomPositions(graph  ,   centerPos,radius);  

    return positions;
}

function randomPositions(graph, centerPos,radius) {
    const n =  graph.size();
    let positions = [];
 

    for (let i=0;i<n;i++) {

        const x = centerPos.xCenter - Math.round( 2 * radius * Math.random() - radius); 
        const y = centerPos.yCenter - Math.round( 2 * radius * Math.random() - radius); 

        positions.push( {x:x, y:y} );
    }

    return positions;


}


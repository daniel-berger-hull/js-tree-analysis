
import { Graph }      from '../model/Graph.js';


export function determinePos(graph, canvasSpecs) {

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


    return randomPositions(graph  ,
                        {xCenter: xCenter,
                            yCenter: yCenter},radius);                                            


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


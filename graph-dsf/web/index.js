
"use strict";
import { Graph }      from './model/Graph.js';
import { GraphRender}   from './view/GraphRender.js';


const MAX_NODE_NUMBER = 15;
const MAX_NODE_VALUE  = 50;
const MAX_EDGE_NUMBER  = 2;

const ERROR_MESSAGE_TIMEOUT = 3000;


const CIRCULAR_GRAPH_RENDERING    = 1;
const CONCENTRIC_GRAPH_RENDERING  = 2;
const RANDOM_GRAPH_RENDERING      = 3;


let graph;


let renderingMode = CIRCULAR_GRAPH_RENDERING;



/////////////////////////////////////////////////////////////////////////////////
/*                      EVENT HANDLERS SECTION                                */
/////////////////////////////////////////////////////////////////////////////////


const setEventHandlers  = () => {
    console.log("setEventHandlers");

  
     window.addEventListener("resize", windowResizeHandler );
     document.addEventListener('keydown', keydownHandler );


     const dfsButton = document.getElementById("dfs-button");
     dfsButton.addEventListener("click", dfsButtonClickHandler );

     const dfsAllPathButton = document.getElementById("dfs-all-path-button");
     dfsAllPathButton.addEventListener("click", dfsAllPathButtonClickHandler );


     const radioButtons = ["circular-rendering","concentric-rendering","random-rendering"];


     radioButtons.forEach( radioID => {

        const radioButton = document.getElementById(radioID);
        radioButton.addEventListener("click", renderingButtonClickHandler );

     });
     

}

const  keydownHandler = (event)  => {
        
    if ( event.key === 'Escape') {
     
        hideWarningMessage();
    }
   
}


const windowResizeHandler = () => {


    const canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;

    render();        
}

const dfsButtonClickHandler  = () => {

    const value = document.getElementById("NodeToWorkOn").value;

    if( isNaN(value) )   {
        displayWarningMessage("Not numeric value entered!");
        return;
    }
    

      if ( (value < 0) || (value > graph.size()) ) {

        displayWarningMessage("Invalid Node Index entered!");
        return;
      }
    
      graph.setSelectedNode(value);

      render();

}

const dfsAllPathButtonClickHandler  = () => {


    const nbrNodes = graph.size();

    console.log("Find path for all " + nbrNodes + "Nodes");



    for (let i=0;i<nbrNodes;i++) {

        graph.setSelectedNode(i);
        const path = graph.DFS(i);
        console.log(`${i} - ${path}`);

        if (path.length === nbrNodes) 
            console.log("%cComplete",'color: #00ff00');
        else
            console.log(`%cPartial ${path.length}`,'color: #ff0000');

    }
}

const renderingButtonClickHandler = (event) => {


    if ( event.currentTarget.id === "circular-rendering") {
        console.log("Click circular-rendering");
        renderingMode = CIRCULAR_GRAPH_RENDERING;
    } else if ( event.currentTarget.id === "concentric-rendering") {
        console.log("Click concentric-rendering");
        renderingMode = CONCENTRIC_GRAPH_RENDERING;
    } else if ( event.currentTarget.id === "random-rendering") {
        console.log("Click random-rendering");
        renderingMode = RANDOM_GRAPH_RENDERING;
    } 


}




/////////////////////////////////////////////////////////////////////////////////
/*                        CORE METHODS  SECTION                                */
/////////////////////////////////////////////////////////////////////////////////

export const init = () => {

    //const nbrNodes = Math.round( Math.random() * MAX_NODE_NUMBER ) + 5;
    const nbrNodes = 8;
    
    graph = new Graph(nbrNodes);

    console.log("Init callled total nodes number is " + nbrNodes);

    for (let i=0;i<nbrNodes;i++) {

        const nodeValue = Math.round( Math.random() * MAX_NODE_VALUE ) + 1;
        //const nbrEdges = Math.round( Math.random() * MAX_EDGE_NUMBER ) + 1;


        const edges = getRandomEdgeIndexes(i,nbrNodes);


        edges.forEach(index => {
            graph.addEdge(i, index);
        });

        graph.setNodeValue(i,nodeValue);


        setEventHandlers();


        //console.log(i + " value is " + " nodeValue, edges --> " + graph.getEdgesForNode(i));

    }


    // Driver Code
    // graph = new Graph(4);
  
    // graph.addEdge(3, 3);
    // graph.addEdge(0, 1);
    // graph.addEdge(0, 2);
    // graph.addEdge(1, 2);
    // graph.addEdge(2, 0);
    // graph.addEdge(2, 3);
   

    // // graph.setNodeValue(0,3);
    // // graph.setNodeValue(1,6);
    // // graph.setNodeValue(2,9);
    // // graph.setNodeValue(3,1);
    // graph.setNodeValue(0,0);
    // graph.setNodeValue(1,1);
    // graph.setNodeValue(2,2);
    // graph.setNodeValue(3,3);

 
   // console.log("Graph has a size of " + graph.size());
 

    //  console.log("Following is Depth First Traversal (starting from vertex 2  value is " + graph.getNodeValue(2) + ")");
    //  graph.DFS(2);

    //  console.log(0 + " --> " + graph.getEdgesForNode(0));
    //  console.log(1 + " --> " + graph.getEdgesForNode(1));
    //  console.log(2 + " --> " + graph.getEdgesForNode(2));


}



export const render = () => {

    console.log("Render called...");
    var canvas = document.getElementById("graph-canvas");
    canvas.width = window.innerWidth - 60;



    let renderObject = new GraphRender(canvas,graph);
    renderObject.draw();


    updateGraphDetailSection();


    console.log("Render called...");
   


}



/////////////////////////////////////////////////////////////////////////////////
/*                        UTILITY METHODS  SECTION                             */
/////////////////////////////////////////////////////////////////////////////////





const displayWarningMessage = (msg) => {


    const errorWarningSection  = document.getElementById("warning-section");
    const errorWarningMsg  = document.getElementById("error-warning-msg");


    errorWarningSection.style = "visibility: visible;"
    errorWarningMsg.innerHTML = msg;


    window.setTimeout(hideWarningMessage, ERROR_MESSAGE_TIMEOUT );
} 

const hideWarningMessage= () => {

    const errorWarningSection  = document.getElementById("warning-section");
    const errorWarningMsg  = document.getElementById("error-warning-msg");

    errorWarningSection.style = "visibility: hidden;"
    errorWarningMsg.innerHTML = " "

}




// The Graph Detail Section is at the bottom of the screen, under the Canvas
const updateGraphDetailSection  = () => {

    
    const nbrNodes =  graph.size();
    for (let i=0;i<nbrNodes;i++) {

        const nodeValue = Math.round( Math.random() * MAX_NODE_VALUE ) + 1;    
        console.log(i + " value is " + " nodeValue, edges --> " + graph.getEdgesForNode(i));
    }

    document.getElementById("NodeTotalCount").innerHTML = nbrNodes;
}



const getRandomEdgeIndexes = (currentIndex,nbrNodes) => {

    const nbrEdges = Math.round( Math.random() * MAX_EDGE_NUMBER ) + 1;
    const indexes = [];


    for (let j=0;j<nbrEdges; ) {

        const otherNodeIndex = Math.round( Math.random() * (nbrNodes-1) );

        if ( !indexes.includes(otherNodeIndex) && otherNodeIndex !== currentIndex ){
            
            indexes.push(otherNodeIndex);
            j++;
        }
    }

    return indexes;
}





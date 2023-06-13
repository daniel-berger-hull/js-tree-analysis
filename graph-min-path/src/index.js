



import { GraphMatrix, GraphRender }      from './model/graph.js';


// import { GraphRender }      from './view/GraphRender.js';


const NODE_WIDTH            =   25;
const NODE_HEIGTH           =   25;

const NODE_SPACE_BETWEEN_X  =   5;
const NODE_SPACE_BETWEEN_Y  =   20;


let treeGraph1 =  {};
let treeGraph2 =  {};

let graphTest = {};

// let nodesStack = [];

// let graphNodeLocations = [];
// let graphSegmentLocations = [];


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

    // Would need a copy function in the TreeGraph

    let allNodes = [];
//     treeGraph1 =  new TreeGraph();
//     treeGraph1.insert(50);

//     treeGraph2 =  new TreeGraph();
//     // treeGraph2.insert(50);


//    // 'Init: Create Random Values for Nodes...
//     for (let i=0;i<35;i++) {
//         const newValue = Math.round( Math.random() * 99) + 1;
//         allNodes.push(newValue);
//     }

    // Uncomment this line to have a very symetric Tree, for testing it is best...
    //  allNodes.push(25,75,15,35,60,90,7,20,30,40);
    //  allNodes.push(25,75,35,60,90,30,70,80,95,28);  // Not working 
    
    
    //   allNodes.push(25,75,15,35,7,20,30,40);          // Case simple Right Rotation case
    //    allNodes.push(25,75,15,35,30,40) ;   //  Case Right-X Rotation case
    //  allNodes.push(25,75,15,35,7,20,30,40,5);           // Case simple Right Rotation case (second case)
     
    // allNodes.push(25,75,15,35,30,40) ;   //  Case Right-X Rotation case
    
    
    //allNodes.push(25,75,15,35,30,40,45) ;   // Case Left and Right Rotation special case...
    
    // allNodes.push(35,20,15) ;   //  Case Right-X Rotation case
    // allNodes.push(25,75,15,35,30,40,45) ;   // Case Left and Right Rotation special case...
 


    // allNodes.push(39, 18, 97, 40, 52, 75, 15, 40, 5, 34);

    // allNodes.push(36, 34, 96, 45, 53, 81, 18, 5, 89, 13, 7, 96, 74, 58, 58, 43, 56, 29, 74, 73, 20, 73, 95, 43, 28);

    // console.log("Init: Initial Random values:");
    // console.log( allNodes );

    // // Inserting all the random values in the tree..."
    // allNodes.forEach( (element) => {  treeGraph1.insert(element); })
    // treeGraph1.recalculateDepth();

    // treeGraph1.deepCopy(treeGraph2);
    // treeGraph2.reorderAVLTree();
    // treeGraph2.recalculateDepth();
    
    // console.log(`%c Get SubTree Width :`,"color:green");
  
    // const root1 = treeGraph1.getRootNode();
    // const root2 = treeGraph2.getRootNode();


    // updateCanvasSize();
///////////////////////////////////////////////////////////////////////////////////

// Driver code
let graph = [ [ 0, 4, 0, 0, 0, 0, 0, 8, 0 ],
              [ 4, 0, 8, 0, 0, 0, 0, 11, 0 ],
              [ 0, 8, 0, 7, 0, 4, 0, 0, 2 ],
              [ 0, 0, 7, 0, 9, 14, 0, 0, 0],
              [ 0, 0, 0, 9, 0, 10, 0, 0, 0 ],
              [ 0, 0, 4, 14, 10, 0, 2, 0, 0],
              [ 0, 0, 0, 0, 0, 2, 0, 1, 6 ],
              [ 8, 11, 0, 0, 0, 0, 1, 0, 7 ],
              [ 0, 0, 2, 0, 0, 0, 6, 7, 0 ] ]


 graphTest = new GraphMatrix();
 graphTest.dijkstra(graph, 0);

}

 export function updateCanvasSize() {

    const canvasbox1 = document.getElementById("canvasbox1");
    const canvas = document.getElementById("graph-canvas");
    // const canvas2 = document.getElementById("tree-canvas2");
    
    
    canvas.width  = canvasbox1.clientWidth - 150;
    // canvas2.width = canvasbox1.clientWidth - 150;
 }



export const render = () => {
    var canvas = document.getElementById("graph-canvas");

    console.log("Will Render");

    let render = new GraphRender(canvas,graphTest);
  

    //GraphRender
    // var canvas2 = document.getElementById("tree-canvas2");

    // const treeRender1 = new TreeGraphRender(canvas,treeGraph1);
    // const treeRender2 = new TreeGraphRender(canvas2,treeGraph2);
    

    // treeGraph1.recalculateDepth();
    // treeGraph2.recalculateDepth();

    // const tree1CanvasHeight = (treeGraph1.getDepth() * 30) + 25 + 25;
    // const tree2CanvasHeight = (treeGraph2.getDepth() * 30) + 25 + 25;
    
    // canvas.height  = tree1CanvasHeight;
    // canvas2.height = tree2CanvasHeight;


  


    // treeRender1.displaySepcs();

    //treeRender.draw();

   // const treeHeight  = this.#treeGraph.getRootNode().getHeight();


   // treeGraph1.getDepth();
    

    // let xCenter = this.#marginX + (this.#treeWidthSpan/2); 
    // let yCenter = this.#marginY;
//    treeRender1.draw(50, 5);

}



   

    

  

 




// import { Node , TreeGraph, renderNode , renderSegment  } from './model/Tree.js';
import { Node , TreeGraph } from './model/Tree.js';

import { TreeGraphRender} from './view/TreeGraphRender.js';



const NODE_WIDTH            =   25;
const NODE_HEIGTH           =   25;

const NODE_SPACE_BETWEEN_X  =   5;
const NODE_SPACE_BETWEEN_Y  =   20;


let treeGraph =  {};
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


    let allNodes = [];
    treeGraph =  new TreeGraph();

    treeGraph.insert(50);


   // 'Init: Create Random Values for Nodes...
    for (let i=0;i<12;i++) {
        const newValue = Math.round( Math.random() * 99) + 1;
        allNodes.push(newValue);
    }

    // Uncomment this line to have a very symetric Tree, for testing it is best...
    // allNodes.push(25,75,15,35,60,90,7,20,30,40);
    // allNodes.push(25,75,35,60,90,30,70,80,95,28);
    

    console.log("Init: Initial Random values:");
    console.log( allNodes );

    // Inserting all the random values in the tree..."
    allNodes.forEach( (element) => {  treeGraph.insert(element); })


    // allNodes.forEach( (element) => {  
    //     const result = (treeGraph.find(element) !== null) ? "found" : "Not found";
    //     console.log(`Searching for ${element} --> ${result}`);
    // });


    treeGraph.recalculate();
    // console.log(`Init: Tree Depth = ${treeGraph.getDepth()} , Width = ${treeGraph.getWidth()}`);

//      console.log(`Init: Display Nodes...`);
//      console.log( treeGraph.displayNodes() );
 }



export const render = () => {
    console.log("Render called...");
    var canvas = document.getElementById("tree-canvas");

    const treeRender = new TreeGraphRender(canvas,treeGraph);

    treeRender.displaySepcs();

    treeRender.draw();

   

    

  

 }




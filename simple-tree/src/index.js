import { TreeGraph }      from './model/TreeGraph.js';
import { TreeGraphRender} from './view/TreeGraphRender.js';



const NODE_WIDTH            =   25;
const NODE_HEIGTH           =   25;

const NODE_SPACE_BETWEEN_X  =   5;
const NODE_SPACE_BETWEEN_Y  =   20;


let treeGraph1 =  {};
let treeGraph2 =  {};

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
    treeGraph1 =  new TreeGraph();
    treeGraph1.insert(50);

    treeGraph2 =  new TreeGraph();
    // treeGraph2.insert(50);


   // 'Init: Create Random Values for Nodes...
    // for (let i=0;i<25;i++) {
    //     const newValue = Math.round( Math.random() * 99) + 1;
    //     allNodes.push(newValue);
    // }

    // Uncomment this line to have a very symetric Tree, for testing it is best...
    // allNodes.push(25,75,15,35,60,90,7,20,30,40);
    // allNodes.push(25,75,35,60,90,30,70,80,95,28); 
    
    allNodes.push(25,75,15,35,60,90,85,95,97) ;

    console.log("Init: Initial Random values:");
    console.log( allNodes );

    // Inserting all the random values in the tree..."
    allNodes.forEach( (element) => {  treeGraph1.insert(element); })

    // allNodes.forEach( (element) => {  treeGraph2.insert(element); })
    

    // allNodes.forEach( (element) => {  
    //     const result = (treeGraph.find(element) !== null) ? "found" : "Not found";
    //     console.log(`Searching for ${element} --> ${result}`);
    // });


    treeGraph1.recalculate();
    treeGraph1.displayNodes();


    treeGraph1.deepCopy(treeGraph2);
    

    console.log("%c Copy of treeGraph1:","color:green");
    treeGraph2.recalculate();
    treeGraph2.displayNodes();

    // console.log('%c Post-Order values:',"color:red");
    // console.log(treeGraph.getValuesPostOrder());

     treeGraph2.reorderAVLTree();


    // console.log(`Init: Tree Depth = ${treeGraph.getDepth()} , Width = ${treeGraph.getWidth()}`);

 }



export const render = () => {
    console.log("Render called...");
    var canvas = document.getElementById("tree-canvas");

    const treeRender1 = new TreeGraphRender(canvas,treeGraph1);
    const treeRender2 = new TreeGraphRender(canvas,treeGraph2);
    

    treeRender1.displaySepcs();

    //treeRender.draw();


    // let xCenter = this.#marginX + (this.#treeWidthSpan/2); 
    // let yCenter = this.#marginY;
    treeRender1.draw(50, 50);
    treeRender2.draw(50, 300);



}



   

    

  

 




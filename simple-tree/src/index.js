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
    for (let i=0;i<35;i++) {
        const newValue = Math.round( Math.random() * 99) + 1;
        allNodes.push(newValue);
    }

    // Uncomment this line to have a very symetric Tree, for testing it is best...
    //  allNodes.push(25,75,15,35,60,90,7,20,30,40);
    //  allNodes.push(25,75,35,60,90,30,70,80,95,28);  // Not working 
    
    
    //   allNodes.push(25,75,15,35,7,20,30,40);          // Case simple Right Rotation case
    //    allNodes.push(25,75,15,35,30,40) ;   //  Case Right-X Rotation case
    //  allNodes.push(25,75,15,35,7,20,30,40,5);           // Case simple Right Rotation case (second case)
     
    // allNodes.push(25,75,15,35,30,40) ;   //  Case Right-X Rotation case
    
    
    //allNodes.push(25,75,15,35,30,40,45) ;   // Case Left and Right Rotation special case...
    
    // allNodes.push(35,20,15) ;   //  Case Right-X Rotation case
    //allNodes.push(25,75,15,35,30,40,45) ;   // Case Left and Right Rotation special case...
 


    // allNodes.push(39, 18, 97, 40, 52, 75, 15, 40, 5, 34);

    console.log("Init: Initial Random values:");
    console.log( allNodes );

    // Inserting all the random values in the tree..."
    allNodes.forEach( (element) => {  treeGraph1.insert(element); })

    treeGraph1.recalculateDepth();
    // treeGraph1.displayNodes();


    treeGraph1.deepCopy(treeGraph2);

  
    treeGraph2.recalculateDepth();
    treeGraph2.reorderAVLTree();

    // console.log(`%c Value Right after  reorderAVLTree on treeGraph2:`,"color:purple");
    // treeGraph2.displayNodes();

    //
    
    console.log(`%c Value after recalculate of treeGraph2:`,"color:green");
    
    treeGraph2.recalculateDepth();
    // treeGraph2.displayNodes();


 }



export const render = () => {
    // console.log("Render called...");
    var canvas = document.getElementById("tree-canvas");

    const treeRender1 = new TreeGraphRender(canvas,treeGraph1);
    const treeRender2 = new TreeGraphRender(canvas,treeGraph2);
    

    // treeRender1.displaySepcs();

    //treeRender.draw();


    // let xCenter = this.#marginX + (this.#treeWidthSpan/2); 
    // let yCenter = this.#marginY;
    treeRender1.draw(50, 50);
    treeRender2.draw(50, 350);



}



   

    

  

 




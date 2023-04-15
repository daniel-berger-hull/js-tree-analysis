
export const MAX_NODE_VALUE     = 1000;
export const INVALID_NODE_VALUE =   -1;

export const VALUE_NOT_FOUND_CODE = -5;


// let currentLevel = 0;



// This class contains and manages the info of a single cell in a Tree Graph...  
export class Node {

    #value;
    #leftChild;
    #rightChild;

    
    constructor(value) {

        if ( this.isValidValue(value) )  this.#value = value;
        else this.#value = INVALID_NODE_VALUE;

        this.#leftChild = null;
        this.#rightChild = null;
    }

    getValue() {

        return this.#value;
    }

    getValues() {

        const result = [];
        if ( this.getLeftChild() !== null)  result.push( ...this.getLeftChild().getValues() );
        
        result.push( this.getValue() );

        if ( this.getRightChild() !== null)  result.push( ...this.getRightChild().getValues() );


        return result;
    }

    setValue(value) {

        if ( isValidValue(value) )
           this.#value = value;

    }

    getLeftChild()   {   return this.#leftChild;  }
    getRightChild()  {   return this.#rightChild; }

     // "Thursday: This function is not completed!!!"
     getChildLevel(level)   { 

        const currentTreeDepth = this.depth(0);

        if (level > currentTreeDepth) {
            const message = "You are asking for a level of child node that is not existing in this graph!!!";
            console.log(message);
            throw message;
        }


          return this.#leftChild; 
        
    }


    insert(newValue) {

        //Make sure to create an node first
        if (newValue <= 0)
            throw "0 or negative value! current is " + newValue;

        let newNode = new Node(newValue);

        this.insertChild(newNode);
    }


    insertChild(child) {
      
        if (!this.isValidValue(child)) return;

        if (child.getValue() < this.getValue()) {

            if ( this.#leftChild !== null)
                this.#leftChild.insertChild(child);
            else
                this.#leftChild = child;

        }  else  {
        
            if ( this.#rightChild !== null)
                this.#rightChild.insertChild(child);
            else
                this.#rightChild = child;
        }
           
        //Implicit here, children with value equal to this node value are put to the right of this value...
    }

    isValidValue(value) {
        if (value <0) return false;
        if (value >MAX_NODE_VALUE) return false;

        return true;
    }

    isValidNode(newNode) {

          if ( (newNode === null) || (newNode === undefined) )  return false;
          if (newNode.getValue() === undefined)  return false;

          return true;
    }

    find(value) {

        if (this.getValue() === value)  return value;

        if (value < this.getValue()) {

            if ( this.#leftChild !== null)
                return this.#leftChild.find(value);
            else
                return VALUE_NOT_FOUND_CODE;

        }  else  {
        
            if ( this.#rightChild !== null)
                return this.#rightChild.find(value);
            else
                return VALUE_NOT_FOUND_CODE;
        }
    }


    // Try to find the deepest level in the sub nodes...
    depth(currentDepth) {


        currentDepth++;
        let leftDepth = currentDepth;
        let rightDepth = currentDepth;
        
        if ( this.getLeftChild()  !== null) leftDepth = this.getLeftChild().depth(leftDepth);
        if ( this.getRightChild() !== null) leftDepth = this.getRightChild().depth(rightDepth);

         //console.log(`Value: ${this.getValue()} at depth ${currentDepth} left is ${this.getLeftChild()}, right is ${this.getRightChild()}, all values are [${leftDepth} , ${currentDepth} , ${rightDepth}]`);

        return Math.max(leftDepth, currentDepth, rightDepth)

    }

     // Try to find the total possible width of the node and its sub nodes 
     // Note: The width doesn't imply that there are 'width' nodes at the last layer of the tree,
     //       but  it is a possible maximum width...
     width() {

        const depth = this.depth(0);
        return 1 << (depth-1);
    }

}



// This class contains all the nodes of a Tree graph, and also manages all the main operations 
// that can be done on a Graph Tree.
export class TreeGraph {


    #rootNode;
    #depth = 0;
    #width = 0;

    constructor() {
        this.#rootNode = null;
        this.#depth = 0;
        this.#width = 0;
    }


    getRootNode()                { return this.#rootNode; };
    getDepth()                   { return this.#depth;    };
    getWidth()                   { return this.#width;    };

    insert(newValue) {

        //Make sure to create an node first
        if (newValue <= 0)
            throw "0 or negative value! current is " + newValue;

        
        //Easiest case: Nothing in the tree, so the first value is the node...
        if ( this.getRootNode() === null ) {
            this.#rootNode = new Node(newValue);
            return newValue;
        }

        let newNode = new Node(newValue);
        this.getRootNode().insertChild(newNode);

        return newValue;
    }



    // this method should be called after any insert or delete on the TreeGraph, as it finds the depth and width,
    // (if they been changed of course)
    recalculate() {

        let currentLevel = 1;
        let nodesStack = [];

        nodesStack.push( { node: this.getRootNode() , level:currentLevel } );

        while (nodesStack.length !== 0) {

            let nextItem = nodesStack.pop();
            let currentNode = nextItem.node;
            let currentLevel = nextItem.level;

            //Must keep track to how low we go in the tree, as it will represent the depth of this tree...
            if (currentLevel > this.#depth)   this.#depth = currentLevel;

            // Stacking the right side first, will make the exploration of the tree more natural
            // As the left side will be poped first, and we will exhaust all the left side
            // and then, pop the right side and to the same...
            if ( currentNode.getRightChild() !==  null)  
                nodesStack.push(  { node: currentNode.getRightChild() , level: currentLevel+1 }   );

            if ( currentNode.getLeftChild() !==  null)  
                nodesStack.push( { node: currentNode.getLeftChild() , level: currentLevel+1 } );
        }


         // To find the total possible width of the root and its sub nodes 
        // Note: The width doesn't imply that there are 'width' nodes at the last layer of the tree,
        //       but  it is a possible maximum width...
        this.#width =  1 << (this.#depth-1);      
    }


    //This will return all the nodes, grouped by layer where they appear in the Tree
    // i.e:  Level 1 is root, Level 2 is A,B, Level 3 is A1,A2,B1,B2, etc...
    getValuesByLevel() {

        let currentLevel = 1;
        let nodesStack = [];

        let results = [];
        //The first level is a given as it is the root at level 1...
        // results.push(  [ this.getRootNode().getValue()] );
        //results.push(  { level: currentLevel , values: [ this.getRootNode().getValue()] });
        
        
        //
        nodesStack.push( { node: this.getRootNode() , level:currentLevel } );

        while (nodesStack.length !== 0) {

            let nextItem = nodesStack.pop();
            let currentNode = nextItem.node;
            let currentLevel = nextItem.level;

            //Must keep track to how low we go in the tree, as it will represent the depth of this tree...
            if (currentLevel > this.#depth)   this.#depth = currentLevel;

            let currentValues = results[currentLevel-1];    //The results array is a 0 index based (start at 0)
            
            if (currentValues === null ||  typeof currentValues === "undefined")
                results.push([currentNode.getValue()]);
            else {
                currentValues.push(currentNode.getValue());
            }

            // Stacking the right side first, will make the exploration of the tree more natural
            // As the left side will be poped first, and we will exhaust all the left side
            // and then, pop the right side and to the same...
            if ( currentNode.getRightChild() !==  null)  
                nodesStack.push(  { node: currentNode.getRightChild() , level: currentLevel+1 }   );

            if ( currentNode.getLeftChild() !==  null)  
                nodesStack.push( { node: currentNode.getLeftChild() , level: currentLevel+1 } );


        }


        return results;
    

    }

    // following will leverage equivalent functions of a Node Tree
    // get All Values
    //displayNodes

}


// Utility function to identify the node's and it children values..
export const displayNodes = (node) => {

    if (node === null || typeof node === 'undefined')  return;


    currentLevel++;

    if ( node.getLeftChild() !==  null)  displayNodes( node.getLeftChild() );
    console.log("Level " + currentLevel + " --> "  +  node.getValue());
    if ( node.getRightChild() !==  null)  displayNodes( node.getRightChild() );

    currentLevel--;
}



export const renderNode = (context, position, size , value) => {

    console.log("Node Value is " + value);
    

    context.strokeStyle = "#FBED20";
    context.beginPath();
    context.arc(position.x, position.y, size, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 2;
    context.stroke();

    context.textAlign = "center";
    context.textBaseline = "middle"; 
    context.font = "30px Arial";
    const label = value;

    context.fillStyle = "black";
    context.fillText(label, position.x+2, position.y+2);
    context.fillStyle = "gray";
    context.fillText(label, position.x+1, position.y+1);
    context.fillStyle = "#0046BE";
    context.fillText(label, position.x, position.y);
   
}






export const MAX_NODE_VALUE     = 1000;
export const INVALID_NODE_VALUE =   -1;

export const VALUE_NOT_FOUND_CODE = -5;



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

    getChildrenCount() {

        let childCount = 0;
        if ( this.getLeftChild()  !==  null )   childCount++;
        if ( this.getRightChild() !==  null )   childCount++;
    
        return childCount;
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

    // If found, Will return a node with value searched for ...
    find(value) {

        const findInChild = ( node, value ) => {

            if ( node.getValue() === value)   return node;

            let result;
            if ( node.getLeftChild() !==  null) {
                result = findInChild( node.getLeftChild()  , value );
                if (result !== null) return result;
            }   
            if ( node.getRightChild() !==  null)  {
                result = findInChild( node.getRightChild()  , value );
                if (result !== null) return result;
            }   
            
            return null;
        }


        return findInChild( this.getRootNode() , value );
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

    getNodesInOrder() {

        let nodesStack = [];
        let nodeList = [];

        const exploreNodeInOrder = (node  ) => {

            if ( node.getLeftChild() !==  null)    exploreNodeInOrder( node.getLeftChild() );
            nodeList.push(node);
            if ( node.getRightChild() !==  null)   exploreNodeInOrder( node.getRightChild() );  
        }

        exploreNodeInOrder( this.getRootNode() );
    

       return nodeList;
    }

    getValuesInOrder() {
        const nodeListInOrder = this.getNodesInOrder();
        const values = [];

        nodeListInOrder.forEach( nextNode => {  values.push(nextNode.getValue()) });

        return values;
    }


    getNodesPostOrder() {

        let currentLevel = 1;
        let nodesStack = [];
        let nodeList = [];


    
        const exploreNodePostOrder = (node  ) => {

            if ( node.getLeftChild() !==  null)    exploreNodePostOrder( node.getLeftChild() );
            if ( node.getRightChild() !==  null)   exploreNodePostOrder( node.getRightChild() );  
            nodeList.push(node);
        }

        exploreNodePostOrder( this.getRootNode() );

       return nodeList;
    }

    getValuesPostOrder() {
        const nodeListPostOrder = this.getNodesPostOrder();
        const values = [];

        nodeListPostOrder.forEach( nextNode => {  values.push(nextNode.getValue()) });

        return values;
    }


    displayNodes () {

        let  currentLevel = 0;



        const _displayNodes = (node) => {

            if (node === null || typeof node === 'undefined')  return;

            currentLevel++;

            if ( node.getLeftChild() !==  null)    _displayNodes( node.getLeftChild() );
            console.log("Level " + currentLevel + " --> "  +  node.getValue());
            if ( node.getRightChild() !==  null)   _displayNodes( node.getRightChild() );  

            currentLevel--;
        }

        _displayNodes( this.getRootNode() );
    }



}



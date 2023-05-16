import { Node  } from './Node.js';

import { AVL_MAX_CHILD_DELTA } from './ModelConstants.js';


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
//    getWidth()                   { return this.#width;    };
    getWidth()                   { return this.#rootNode.getSubTreeWidth();    };


    getSize()                    { return this. getValuesInOrder().length };


    setRootNode(newRoot) { 
    
        if (newRoot !== null)
            this.#rootNode = newRoot;

    };


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

 
    //Will recreate a completely new tree, where each nodes is re created, instead of using a reference to the nodes of the source tree...
    deepCopy(destinationTree) {

        const _deepCopy = (sourceNode, destinationNode) => {

            if ( sourceNode === null )   return;                 // Safeguard here, but this condition should normally new happen...
            
            if ( destinationNode === null ) {                   // the first execution, when at the root of the tree is problematic, is this check is required
                destinationNode = new Node(sourceNode.getValue()); 
            } else
                destinationNode.insert( sourceNode.getValue() );

            if ( sourceNode.getLeftChild()  !==  null )   _deepCopy( sourceNode.getLeftChild(),  destinationNode );
            if ( sourceNode.getRightChild() !==  null )   _deepCopy( sourceNode.getRightChild(), destinationNode ); 

            return destinationNode;
        }

       const copiedRootNode = _deepCopy(this.getRootNode() ,null );
       destinationTree.setRootNode(copiedRootNode);
   }

    // If the value is found, it will return a node with value searched for ...
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
    recalculateDepth() {

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
        // Note 2: this method to determine the width is not very pratical, as it doesn't take into consideration any content of the tree, which really affects its actual width... use the Node's getSubTreeWidth instead...
        this.#width =  1 << (this.#depth-1);      

        this.getRootNode().getHeight();         // This call is not very elegent
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



     //Right Child become current 'node' (formelly node), and former 'node' becomes its left child. Parent now points to new current 'node' (formelly right child)
    rightRotation(parent,node){

        let tmp = node;

        node = node.getLeftChild();
        tmp.setLeftChild(node.getRightChild());
        node.setRightChild(tmp);
       
        if (parent !== null) {        
            if (node.getValue()<parent.getValue())
                parent.setLeftChild(node);
            else
                parent.setRightChild(node); 
        } else
            this.setRootNode(node);
        
        this.getRootNode().getHeight();

    }

 

    
    rightLeftRotation(parent,node){

        this.leftRotation(node,node.getLeftChild());
        this.rightRotation(parent,node);
    }
    

    leftRotation(parent,node){

        let tmp = node;

        node = node.getRightChild();
        tmp.setRightChild(node.getLeftChild());
        node.setLeftChild(tmp);
        
        if (parent !== null) {
            if (node.getValue()<parent.getValue())
                parent.setLeftChild(node);
            else
                parent.setRightChild(node); 
        } else
            this.setRootNode(node);
        
        this.getRootNode().getHeight();
    }


    leftRightRotation(parent,node){

        this.rightRotation(node,node.getRightChild());
        this.leftRotation(parent,node);
    }

   

   

    reorderAVLTree() {


        let parentNode = null;
        

        console.log("reorderAVLTree");
        const _reorder = ( parent, node  ) => {

            if ( node.getLeftChild() !==  null)    _reorder( node, node.getLeftChild() );
            if ( node.getRightChild() !==  null)   _reorder( node, node.getRightChild() );  

            // the Tree is left heavy...
            if ( node.getChildDelta() > AVL_MAX_CHILD_DELTA ) {

                if ( node.getLeftChild().getChildDelta() >= 0) {
                    console.log(`Node ${node.getValue()} needs an AVL  Right rotation (delta is ${node.getChildDelta()})}`);
                    this.rightRotation(parent, node);
                }
                    
                else {
                    console.log(`Node ${node.getValue()} needs an AVL  Right-Left rotation (delta is ${node.getChildDelta()})}`);
                    this.rightLeftRotation(parent, node);
                }

            } 
            // Or the right side of the Tree is heavy... 
            else  if ( node.getChildDelta() <  -AVL_MAX_CHILD_DELTA ) {
                

                if ( node.getRightChild().getChildDelta() <= 0) {
                    console.log(`Node ${node.getValue()} needs an AVL Left  rotation (delta is ${node.getChildDelta()})}`);
                    this.leftRotation(parent, node);
                }
                    
                else {
                    console.log(`Node ${node.getValue()} needs an AVL Left-Right  rotation (delta is ${node.getChildDelta()})}`);
                    this.leftRightRotation(parent, node);
                }
            }

            // Reorder in AVL implies 3 levels of node, the node itself, but also its parent and children also. 
            //Childre are easy to access, but the parent is not directly know by a node, so that is why we keep track in 'parentNode' variable
            parentNode = node;
        }

        _reorder( null, this.getRootNode() );
    }


    displayNodes () {

        let  currentLevel = 0;


        this.getRootNode().getHeight();

        const _displayNodes = (node) => {

            if (node === null || typeof node === 'undefined')  return;

            currentLevel++;

            if ( node.getLeftChild() !==  null)    _displayNodes( node.getLeftChild() );
            // console.log( node.getValue() + " at Level " + currentLevel + " , Height = " + node.getHeight() );
            console.log( node.toString() );
            if ( node.getRightChild() !==  null)   _displayNodes( node.getRightChild() );  

            currentLevel--;
        }

        _displayNodes( this.getRootNode() );
    }



}

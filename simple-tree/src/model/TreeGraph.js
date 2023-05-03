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
    getWidth()                   { return this.#width;    };


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

    deepCopy(destinationTree) {

       
         const _deepCopy = (destination, node) => {

            destination.insert( node.getValue() );

            if ( node.getLeftChild()  !==  null )   _deepCopy( destination, node.getLeftChild() );
            if ( node.getRightChild() !==  null )   _deepCopy( destination, node.getRightChild() ); 

        }

        _deepCopy(destinationTree, this.getRootNode());

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
        this.#width =  1 << (this.#depth-1);      


        this.getRootNode().getDepth();
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


    rightRotation(parent,node){

        let tmp = node;

        node = node.getLeftChild();
        tmp.setLeftChild(node.getRightChild());
        node.setRightChild(tmp);
       


        if (parent !== null) {        
            //parent.setLeftChild(node);   //Used to work with the left child!?!
            if (node.getValue()<parent.getValue())
                parent.setLeftChild(node);
            else
                parent.setRightChild(node); 
        } else
            this.setRootNode(node);
        
        this.getRootNode().getDepth();


        //Right Child become current node (formelly node)
        // former node (formelly node) become left child of 
        //parent now points to new current node (formelly right child)
    }

    specialRightRotation(parent,node){

        let tmp = node;

        node = node.getLeftChild();
        tmp.setLeftChild(node.getRightChild());
        node.setRightChild(tmp);
       


        if (parent !== null)        
            parent.setRightChild(node);   //This is here the big difference with rightRotation... Used to work with the left child!?!
         else
            this.setRootNode(node);
        
        this.getRootNode().getDepth();


        //Right Child become current node (formelly node)
        // former node (formelly node) become left child of 
        //parent now points to new current node (formelly right child)
    }

    
    rightLeftRotation(parent,node){


        this.specialLeftRotation(node,node.getLeftChild());
     


        //May use the rightRotation() method here instead..
        
        let tmp = node;
        node = node.getLeftChild();
        tmp.setLeftChild(node.getRightChild());
        node.setRightChild(tmp);
       


        if (parent !== null)
            parent.setLeftChild(node);
        else
            this.setRootNode(node);
        
        this.getRootNode().getDepth();


        //Right Child become current node (formelly node)
        // former node (formelly node) become left child of 
        //parent now points to new current node (formelly right child)
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
        
        this.getRootNode().getDepth();
    }

   
    specialLeftRotation(parent,node){

        let tmp = node;

        node = node.getRightChild();
        tmp.setRightChild(node.getLeftChild());
        node.setLeftChild(tmp);
        
        // if (parent !== null)
        //     parent.setLeftChild(node);  // Here is the difference with the LeftRotation
        // else
        //     this.setRootNode(node);
        if (parent !== null) {
            if (node.getValue()<parent.getValue())
                parent.setLeftChild(node);
            else
                parent.setRightChild(node); 
        } else
            this.setRootNode(node);

        this.getRootNode().getDepth();
    }


    // Ok works
    leftRightRotation(parent,node){

        this.specialRightRotation(node,node.getRightChild());

        // May user the leftRotation method here..
        let tmp = node;
        node = node.getRightChild();
        tmp.setRightChild(node.getLeftChild());
        node.setLeftChild(tmp);
        
        if (parent !== null) {
                parent.setRightChild(node);
        } else
            this.setRootNode(node);
        
        this.getRootNode().getDepth();
    }

    reorderAVLTree() {


        let parentNode = null;
        

        console.log("reorderAVLTree");
        const _reorder = ( parent, node  ) => {

            if ( node.getLeftChild() !==  null)    _reorder( node, node.getLeftChild() );
            if ( node.getRightChild() !==  null)   _reorder( node, node.getRightChild() );  

           //console.log(node.getValue());
            // the Tree is left heavy...
            if ( node.getChildDelta() > AVL_MAX_CHILD_DELTA ) {
                console.log(`Node ${node.getValue()} needs an AVL  Right rotation (delta is ${node.getChildDelta()})}`);

                if ( node.getLeftChild().getChildDelta() >= 0)
                    this.rightRotation(parent, node);
                else
                    this.rightLeftRotation(parent, node);

                let a =2;
            } 
            // Or the right side of the Tree is heavy... 
            else  if ( node.getChildDelta() <  -AVL_MAX_CHILD_DELTA ) {
                console.log(`Node ${node.getValue()} needs an AVL Left  rotation (delta is ${node.getChildDelta()})}`);

                if ( node.getRightChild().getChildDelta() <= 0)
                    this.leftRotation(parent, node);
                else
                    this.leftRightRotation(parent, node);

                let a =2;
            }

            // Reorder in AVL implies 3 levels of node, the node itself, but also its parent and children also. 
            //Childre are easy to access, but the parent is not directly know by a node, so that is why we keep track in 'parentNode' variable
            parentNode = node;
        }

        _reorder( null, this.getRootNode() );
    }


    displayNodes () {

        let  currentLevel = 0;


        this.getRootNode().getDepth();

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

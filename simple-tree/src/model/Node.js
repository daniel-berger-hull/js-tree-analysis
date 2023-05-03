

import { MAX_NODE_VALUE, 
        INVALID_NODE_VALUE, 
        NODE_HEIGTH_NOT_KNOWN,
        NODE_CHILD_DELTA_NEUTRAL  } from './ModelConstants.js';



// This class contains and manages the info of a single cell in a Tree Graph...  
export class Node {

    #value;
    #leftChild;
    #rightChild;
    #height;
    #childHeightDelta;
  
    #x;
    #y;
    

    constructor(value) {

        if ( this.isValidValue(value) )  this.#value = value;
        else this.#value = INVALID_NODE_VALUE;

        this.#leftChild        = null;
        this.#rightChild       = null;
        this.#height           = NODE_HEIGTH_NOT_KNOWN;
        this.#childHeightDelta = NODE_CHILD_DELTA_NEUTRAL;
    }

    getValue()           {    return this.#value;               }     
    getHeight()          {    return this.#height;              }

    getX()               {    return this.#x;                   }
    getY()               {    return this.#y;                   }
    setX(newX)           {    this.#x = newX;                   } 
    setY(newY)           {    this.#y = newY;                   }
    

    getValue()           {    return this.#value;               } 
    getHeight()          {    return this.#height;              }
    // getChildDelta()     {    return this.#childHeightDelta;   }

    toString()          { return `${this.getValue()} , Height=${this.getHeight()},  Child Delta=${this.getChildDelta()}`; }

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
 
    getLeftChild()          {   return this.#leftChild;      }
    getRightChild()         {   return this.#rightChild;     }
    setLeftChild(node)      {   this.#leftChild  = node;     }
    setRightChild(node)     {   this.#rightChild = node;     }


    getChildrenCount() {

        let childCount = 0;
        if ( this.getLeftChild()  !==  null )   childCount++;
        if ( this.getRightChild() !==  null )   childCount++;
    
        return childCount;
    }

    getTreeCount() {
        let allChildCount = 1;

        if ( this.getLeftChild()  !==  null )   allChildCount +=  this.getLeftChild().getTreeCount(); 
        if ( this.getRightChild() !==  null )   allChildCount +=  this.getRightChild().getTreeCount(); 

        return allChildCount;    // Plus one, as you have to count yourself as member of this Sub Tree..
    }


   


    getChildDelta()  {

        const leftHeight = (this.getLeftChild() !== null) ? this.getLeftChild().getHeight() : 0;
        const rightHeight = (this.getRightChild() !== null) ? this.getRightChild().getHeight() : 0;
        
        return leftHeight-rightHeight;  
        
    }

    getValues() {

        const result = [];
        if ( this.getLeftChild() !== null)  result.push( ...this.getLeftChild().getValues() );
        
        result.push( this.getValue() );

        if ( this.getRightChild() !== null)  result.push( ...this.getRightChild().getValues() );

        return result;
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



    getDepth() {

        let leftDepth  = 0;
        let rigthDepth = 0;
        

        if ( this.getLeftChild()  !==  null )   leftDepth  =  this.getLeftChild().getDepth();
        if ( this.getRightChild() !==  null )   rigthDepth =  this.getRightChild().getDepth();


        //First case Leaf: has not left or right subtree, only itself so minimal depth is one
        if ( (leftDepth === 0) && (rigthDepth === 0))    
            this.#height = 1;
        // Otherwise, return the highest number of any side, PLUS this parent node, hince the + 1 at the end
        else if ( leftDepth > rigthDepth ) 
            this.#height =  leftDepth + 1;           
        else
            this.#height =  rigthDepth + 1;

        //Difference between the height of but subtrees is required for AVL Trees...
        this.#childHeightDelta = leftDepth - rigthDepth;

        return  this.#height;
 }


    getSubTreeWidth() {

      
        const getSubWidth = (childNode) => {

            const childCount = childNode.getChildrenCount();
            let   leftWidth = 0;
            let   rigthWith = 0;


            //The leafs of the tree have only themselve, or a width of 1 in other words...
            if ( childCount === 0)  return 1;

            if ( childNode.getLeftChild()  !==  null )   leftWidth = getSubWidth(childNode.getLeftChild());
            if ( childNode.getRightChild() !==  null )   rigthWith = getSubWidth(childNode.getRightChild());
        
            // then the simplest case is that one side an empty subtree (then count of 0), and the other has only one leaf (then count of 1), then it is a vertical subtree, widht is 1 
            if ( (leftWidth+rigthWith) === 1)  return 1;


            // The case of unbalanced subtrees: One if empty, while the other has a realy subtree (more than one leaf). 
            if ( (leftWidth !==0) && (rigthWith === 0) )  return leftWidth;
            if ( (leftWidth ===0) && (rigthWith !== 0) )  return rigthWith;
            
            //Otherwise, both subtrees have a width (even a leaf on each side is chaning the situation here).
            //You need then to return the sum of both sub trees PLUS the parent node, since this one need to be in the center, so it takes space
            return leftWidth + 1 + rigthWith;
        }

        return getSubWidth(this);

           
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



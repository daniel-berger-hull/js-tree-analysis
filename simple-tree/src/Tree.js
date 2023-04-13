
export const MAX_NODE_VALUE     = 1000;
export const INVALID_NODE_VALUE =   -1;

export const VALUE_NOT_FOUND_CODE = -5;


let currentLevel = 0;


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

    depth(currentDepth) {


        currentDepth++;
        let leftDepth = currentDepth;
        let rightDepth = currentDepth;
        
        if ( this.getLeftChild()  !== null) leftDepth = this.getLeftChild().depth(leftDepth);
        if ( this.getRightChild() !== null) leftDepth = this.getRightChild().depth(rightDepth);

        return Math.max(leftDepth, currentDepth, rightDepth)

    }

}


export const displayNodes = (node) => {

    if (node === null || typeof node === 'undefined')  return;


    currentLevel++;

    if ( node.getLeftChild() !==  null)  displayNodes( node.getLeftChild() );
    console.log("Level " + currentLevel + " --> "  +  node.getValue());
    if ( node.getRightChild() !==  null)  displayNodes( node.getRightChild() );

    currentLevel--;
}

export const renderNode = (context, position, size , node) => {


    console.log("Node Value is " + node.getValue());

    context.strokeStyle = "#FBED20";
    context.beginPath();
    context.arc(position.x, position.y, size, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();
    context.stroke();

    context.textAlign = "center";
    context.textBaseline = "middle"; 
    context.font = "30px Arial";
    const label = node.getValue().toString();

    context.fillStyle = "black";
    context.fillText(label, position.x+2, position.y+2);
    context.fillStyle = "gray";
    context.fillText(label, position.x+1, position.y+1);
    context.fillStyle = "#0046BE";
    context.fillText(label, position.x, position.y);
   
}

function testAll() {

    console.log("Testing...");
    init();
   
    console.log("Display Tree:");
    console.log( myCenterNode.getValues() );

    console.log("Locate inital values in the Tree...");
    let valueFoundCount = 0;
    allNodes.forEach( (element) => {  

        // const valueToFind = element.getValue();

        const result =  myCenterNode.find(element); 

        if (result === element) 
            valueFoundCount++
        else
           console.log(`value ${element} Not found in the Tree!`);
    });
    console.log(`${valueFoundCount} item(s) found in the tree, out of ${allNodes.length}`);
    
}

// init();
// render();




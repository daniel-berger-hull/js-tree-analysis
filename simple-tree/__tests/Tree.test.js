const { Node } = require('../src/Tree.js');



const INVALID_NODE_VALUE = -1;

let node1;
let node2;

beforeAll(() => {
    console.log("beforeAll called");

    nodeOk = new Node(5);
    nodeMinusValue = new Node(-1);
    nodeValueTooBig = new Node(1001);

  });



describe("Test Basic Instantiation of Tree Node", () => {
    test('Create Node, test the returned value assigned', () => {
        expect( nodeOk.getValue() ).toBe(5);
        expect( nodeMinusValue.getValue() ).toBe(INVALID_NODE_VALUE);
        expect( nodeValueTooBig.getValue() ).toBe(INVALID_NODE_VALUE);

        expect( nodeOk.getLeftChild() ).toBeNull();
        expect( nodeOk.getRightChild() ).toBeNull();
    });
});



describe("Test Node's Child validity Function", () => {

    let tmpNode = new Node(2); 
    
    test('Create Node, assign childrens', () => {

        expect( nodeOk.isValidNode() ).toBe(false);
        expect( nodeMinusValue.isValidNode(tmpNode) ).toBe(true);
    });
});


// This test a balanced scenario, as we have a center node, with a smaller and greater value at the left and right respectively 
//                      5
//                 3       7
//              1    4   6   9
describe("Test Node  left and right Child assignement - Scenario I Balanced nodes ", () => {

    let myCenterNode = new Node(5);
    let myLeftNode = new Node(3);
    let myRightNode = new Node(7);


    let myMidLeftNode = new Node(4);
    let myFarLeftNode = new Node(1);
    let myMidRightNode = new Node(6);
    let myFarRightNode = new Node(9);


    myCenterNode.insertChild(myLeftNode);
    myCenterNode.insertChild(myRightNode);
    myCenterNode.insertChild(myFarLeftNode);
    myCenterNode.insertChild(myFarRightNode);
    myCenterNode.insertChild(myMidLeftNode);
    myCenterNode.insertChild(myMidRightNode);

    
    test('Create Node, assign childrens', () => {

        expect( myCenterNode.getLeftChild() ).not.toBeNull();
        expect( myCenterNode.getLeftChild().getValue() ).toBe(3);

        expect( myCenterNode.getRightChild()).not.toBeNull();
        expect( myCenterNode.getRightChild().getValue() ).toBe(7);

        const leftChild = myCenterNode.getLeftChild();
        expect( leftChild.getLeftChild() ).not.toBeNull();
        expect( leftChild.getLeftChild().getValue() ).toBe(1);
        expect( leftChild.getRightChild() ).not.toBeNull();
        expect( leftChild.getRightChild().getValue() ).toBe(4);

        const rightChild = myCenterNode.getRightChild();
        expect( rightChild.getLeftChild() ).not.toBeNull();
        expect( rightChild.getLeftChild().getValue() ).toBe(6);
        expect( rightChild.getRightChild()).not.toBeNull();
        expect( rightChild.getRightChild().getValue() ).toBe(9);




        
        
        
    });
});





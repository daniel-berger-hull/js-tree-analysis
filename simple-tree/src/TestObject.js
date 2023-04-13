

let myObject = {};
console.log("Testing objects...");


console.log("Starting empty: " + Object.getOwnPropertyNames(myObject));

myObject['firstName'] = 'daniel';
console.log("Adding  firstName: " + Object.getOwnPropertyNames(myObject));

myObject['age'] = 52;
console.log("Adding  age: " + Object.getOwnPropertyNames(myObject));


myObject['display'] = function display()  {  console.log('display Called!') } ;
console.log("Adding  a function: " + Object.getOwnPropertyNames(myObject));
myObject.display();











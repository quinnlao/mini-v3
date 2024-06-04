const inputArray = [
    { order: '0' },
    { order: 'a' },
    { order: 'b' },
    { order: 'c' },
    { order: '1', inline: true },
    { order: '2', inline: true },
    { order: '3' },
    { order: '4' },
    { order: '5' },
    { order: '6' },
    { order: '7', inline: true }
];

const resultArray = [];
let subArray = [];

// for (let i = 0; i < inputArray.length; i++) {
//     if (inputArray[i].inline) {
//         if (subArray.length > 0) {
//             resultArray.push(subArray);
//             subArray = [];
//         }
//         resultArray.push([inputArray[i]]);
//     } else {
//         subArray.push(inputArray[i]);
//     }
// }
inputArray.forEach((item, i) => {
    if (item.inline) {
        if (subArray.length > 0){
            resultArray.push(subArray);
            subArray = [];
        }
        resultArray.push([item]);
    }
    else {
        subArray.push(item);
        if(subArray.length === 1) {
            resultArray.push(subArray);
            subArray = [];
        }
    }
})

if (subArray.length > 0) {
    resultArray.push(subArray);
}

console.log(resultArray);


优化1:

const resultArray = [];
let subArray = [];

inputArray.forEach(item => {
  if (item.inline) {
    if (subArray.length > 0) {
      resultArray.push(subArray);
      subArray = [];
    }
    resultArray.push([item]);
  } else {
    subArray.push(item);
    if (subArray.length === 2) {
      resultArray.push(subArray);
      subArray = [];
    }
  }
});

if (subArray.length > 0) {
  resultArray.push(subArray);
}

console.log(resultArray);

优化2:


const resultArray = [];
let subArray = [];

for (const item of inputArray) {
  if (item.inline) {
    if (subArray.length > 0) {
      resultArray.push(subArray);
    }
    subArray = [item];
    resultArray.push(subArray);
    subArray = [];
  } else {
    subArray.push(item);
    if (subArray.length === 2) {
      resultArray.push(subArray);
      subArray = [];
    }
  }
}

if (subArray.length > 0) {
  resultArray.push(subArray);
}

console.log(resultArray);

"use strict";
let array = [2, 4, 98, 67, -59, 6, 345, -9, 115];
array.reverse();
console.log(array);

let n=5;
let arr=[];
function randomInteger(min, max)
{
    let rand=min-0.5+Math.random()*(max-min+1);
    return Math.round(rand);
}
for(let i=0;i<n;i++) //автозаполнение массива
{
    arr[i]=randomInteger(1,100);
}
console.log("Массив: ",arr);
console.log("Массив в обратном порядке: ",arr.reverse());//реверс массива

//change the "shopping icon" if there is any item in sessionStorage
const basket = () => {
    if (sessionStorage.getItem('listToBuy')){
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart-fill"></i>';
    }else{
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart"></i>';
    }
}
basket();



//parse the string in SessionStorage
////
//  _id:number:_id:number
////
//return an objet with SUMMATION

const parseSessionStorage = (str) => {
    const obj={};
    const array=str.split(':');
    console.log("str",array);
    for (let i=0 ; i<array.length-1 ; i=i+2){
        !obj[array[i]] ? obj[array[i]]=parseInt(array[i+1]) : obj[array[i]]=obj[array[i]]+parseInt(array[i+1]);
    }
    return obj;

}

console.log("sessionStorageSTR",sessionStorage.getItem('listToBuy'));

const objProductsToBuy = parseSessionStorage(sessionStorage.getItem('listToBuy'));

const bigJSON=JSON.parse(sessionStorage.getItem('cameras')).concat(JSON.parse(sessionStorage.getItem('furniture'))).concat(JSON.parse(sessionStorage.getItem('teddies')));
console.log(bigJSON);

//create a product line in the div "panierContainer"
const createProductLine = (id,number) => {
    const lineInfos=bigJSON.filter(x=>x["_id"]==id);
    console.log("lineInfo",lineInfos);
    const ul = document.createElement('ul');
    ul.classList.add('list-group','list-group-horizontal-sm','panierList');
    const content=`<li class="list-group-item panierList__imgSlot"><img class="panierList__imgSlot__miniImage" src="${lineInfos[0].imageUrl}"></li>
    <li class="list-group-item panierList__name">${lineInfos[0].name}</li>
    <li class="list-group-item panierList__unitPrice">${lineInfos[0].price}</li>
    <li class="list-group-item panierList__qty">${number}</li>
    <li class="list-group-item panierList__totalPrice">${parseInt(lineInfos[0].price)*number}</li>`;
    ul.innerHTML=content;
    //add it to the DOM
    const divPanierContainer=document.getElementsByClassName('panierContainer')[0];
    divPanierContainer.appendChild(ul);
    return parseInt(lineInfos[0].price)*number;
}

const createTotalPriceLine = (price) => {
    const totalLine = document.createElement('ul');
    totalLine.classList.add('list-group','list-group-horizontal-sm','panierList','totalLine');
    const content=`<li class="list-group-item panierList__noBorder"></li>
    <li class="list-group-item panierList__noBorder"></li>
    <li class="list-group-item panierList__wholeTotalPrice">Total</li>
    <li class="list-group-item panierList__wholeTotalPrice">${price}</li>`;
    totalLine.innerHTML=content;
    document.getElementsByClassName('panierContainer')[0].appendChild(totalLine);
}

//big fonction
//take an objet - containing "id" and "quantity"
//create product lines to Buy

console.log(objProductsToBuy);

//console.log(Object.keys(objProductsToBuy));

const createProductLineS = (obj) => {
    let total=0;
    for (key of Object.keys(obj)){
        total+=createProductLine(key,parseInt(obj[key]));
    }
    createTotalPriceLine(total);

    console.log(total);
}   

createProductLineS(objProductsToBuy);



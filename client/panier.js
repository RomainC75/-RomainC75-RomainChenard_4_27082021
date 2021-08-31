
//change the "shopping icon" if there is any item in sessionStorage
const basket = () => {
    if (sessionStorage.getItem('listToBuy')){
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart-fill"></i>';
    }else{
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart"></i>';
    }
}
basket();


const teddiesObj=JSON.parse(sessionStorage.getItem("teddies"));
console.log("teddiesObj",teddiesObj);

//parse the string in SessionStorage
////
//  _id:number:_id:number
////
//return an objet "ItemId : quantity"

const parseSessionStorage = (str) => {
    if(str != null){
        const obj={};
        const array=str.split(':');
        console.log("str",array);
        for (let i=0 ; i<array.length-1 ; i=i+2){
            !obj[array[i]] ? obj[array[i]]=parseInt(array[i+1]) : obj[array[i]]=obj[array[i]]+parseInt(array[i+1]);
        }
        return obj;
    }else{
        return 0;
    }
}
console.log("sessionStorageSTR",sessionStorage.getItem('listToBuy'));

const objProductsToBuy = parseSessionStorage(sessionStorage.getItem('listToBuy'));

const isPeluche = () => {
    //console.log("object.keys returns ",Object.keys(objProductsToBuy));
    return Object.keys(objProductsToBuy).some( x => {
        //console.log("-------");
        return teddiesObj.some(y=> {
            //console.log("productToBuy,Teddies",x,y["_id"]);
            return x==y["_id"];
        });

    });
}

console.log("isPeluche",isPeluche());


//If there is no Teddy in the basket
//old peluche test : !objProductsToBuy["5be9c8541c9d440000665243"]
if (parseSessionStorage(sessionStorage.getItem('listToBuy')) &&  !isPeluche() || Object.keys(sessionStorage).length==1){
    console.log('NON TEDDY');
    document.querySelector('.panierContainer').style.display="none";
    document.querySelector('form').style.display="none";

    const warning=document.createElement('div');
    warning.classList.add('panierContainer');
    warning.innerHTML='<p class="warning">Veuillez mettre au moins une peluche dans le panier</p>';

    document.getElementsByTagName('body')[0].appendChild(warning);
    window.stop();
    //throw new Error("ERROR : no Teddie !")
}




const bigJSON=JSON.parse(sessionStorage.getItem('cameras')).concat(JSON.parse(sessionStorage.getItem('furniture'))).concat(JSON.parse(sessionStorage.getItem('teddies')));
console.log("bigJSON",bigJSON);

//create in the DOM a product line inside the div "panierContainer"
//arguments itemId and quantity
const createProductLine = (id,quantity) => {
    const lineInfos=bigJSON.filter(x=>x["_id"]==id);
    console.log("lineInfo",lineInfos);
    const ul = document.createElement('ul');
    ul.classList.add('list-group','list-group-horizontal-sm','panierList');
    const content=`<li class="list-group-item panierList__imgSlot"><img class="panierList__imgSlot__miniImage" src="${lineInfos[0].imageUrl}"></li>
    <li class="list-group-item panierList__name">${lineInfos[0].name}</li>
    <li class="list-group-item panierList__unitPrice">${lineInfos[0].price}</li>
    <li class="list-group-item panierList__qty">${quantity}</li>
    <li class="list-group-item panierList__totalPrice">${parseInt(lineInfos[0].price)*quantity}</li>`;
    ul.innerHTML=content;
    //add it to the DOM
    const divPanierContainer=document.getElementsByClassName('panierContainer')[0];
    divPanierContainer.appendChild(ul);
    return parseInt(lineInfos[0].price)*quantity;
}

//create in the DOM one line with the total price
//argument : just the total price to print
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



console.log("objProductsToBuy -> ",objProductsToBuy);

//create all the lines
//argument : objet passed through sessionStorage
//use functions : createProductLine & creatTotalPriceLine 
//create lines of what the customer ordered !
const createProductLineS = (obj) => {
    if (!obj && typeof(obj)!="object"){
        return 0;
    }else{
        let total=0;
        for (key of Object.keys(obj)){
            total+=createProductLine(key,parseInt(obj[key]));
        }
        createTotalPriceLine(total);
        console.log(total);
        return 1;
    }
}   
createProductLineS(objProductsToBuy);

console.log("test",createProductLineS(3));



orderObject={
    products:objProductsToBuy
}

//goal : create the "PRODUCTS" part of the object to send
//argument : obj (objProductsToBuy) containing the ids of the items to order 
//return : an array containing only the serials 
const productsPartCreator = (obj) => {
    const productsPartArray=[];
    for (let id of Object.keys(obj)){
        for (let n=0 ; n<obj[id] ; n++){
            productsPartArray.push(id);
        }
    }
    //ATTENTION : a filter is added to fit to the API properties
    const teddyFilteredArray =[];
    for (let product of productsPartArray){
        if(teddiesObj.some(teddy => teddy["_id"]==product)){
            teddyFilteredArray.push(product);
        }
    }
    return teddyFilteredArray;
}
console.log("productsPartsCreator",productsPartCreator(objProductsToBuy));
console.log("productsPartArrayFILTERED",productsPartCreator(objProductsToBuy));


//goal : create the "CONTACT" part of the object to send
//no argument, it take "form" of the DOM
//return : an object containing the "contact" information
const contactPartCreator = () => {
    let contactPartObject={};
    const ccForm = document.forms["ccform"];
    for (let i=0 ; i<5 ; i++){
        contactPartObject[ccForm[i].id]= ccForm[i].value;
    }
    return contactPartObject;
}


//////////////////////////////COLOR INDICATOR /////////////////////
const nameColorProtection = (element) => {
    element.addEventListener('input' , e => {
        if (e.target.value.match(/[^a-zA-Z\-\séèêâà]/)){
            console.log("chiffre");
            element.style.boxShadow='0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 34, 34, 0.6)';
            element.nextSibling.nextSibling.style.visibility="visible";
            return 0;
        }else{
            element.style.boxShadow='0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(34, 167, 255, 0.6)';
            element.nextSibling.nextSibling.style.visibility="hidden";
            return 1;
        }
    })
}


const mailColorProtection = (element) => {
    element.addEventListener('input' , e => {
        if (!e.target.value.match(/.+@.+\.[a-zA-Z]{2,4}/)){
            element.style.boxShadow='0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 34, 34, 0.6)';
            element.nextSibling.nextSibling.style.visibility="visible";
            return 0;
        }else{
            element.style.boxShadow='0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(34, 167, 255, 0.6)';
            element.nextSibling.nextSibling.style.visibility="hidden";
            return 1;
        }
    })
}

nameColorProtection(document.getElementById("firstName"));
nameColorProtection(document.getElementById("lastName"));
nameColorProtection(document.getElementById("city"));
mailColorProtection(document.getElementById('email'));


////////////////////////////Protection before sending message///////////
const onlyTextCheck = (text) => {
    return text.match(/[^a-zA-Z\-\séèêâà]/) ?  0 : 1;
}
const mailCheck = (email) => {
    return email.match(/.+@.+\.[a-zA-Z]{2,4}/) ? 1 : 0;
}



const formCheckingFonction= () => {
    const ccForm = document.forms["ccform"];
    console.log(ccForm[0].value);
    if (mailCheck(ccForm[0].value) && onlyTextCheck(ccForm[1].value)  && onlyTextCheck(ccForm[2].value) && onlyTextCheck(ccForm[4].value)) {
        console.log("OK");
        return 1;
    }
}


//------submit Function-----------------

document.querySelector('button[type="submit"]').addEventListener('click',e => {
    e.preventDefault();

    if (formCheckingFonction()){
            //create the object to Send
            
        const finalObject={
            contact:contactPartCreator(),
            products:productsPartCreator(objProductsToBuy)
        }
        
        //send the request with the object AND reset the order Memory
        fetch("http://127.0.0.1:3000/api/teddies/order", {
            method:"POST",
            headers:{
                'Accept': 'application/json', 
                'Content-Type':'application/json'
            },
            body:JSON.stringify(finalObject)
        })
        .then(rawJSON=>rawJSON.json())
        .then(json=> {
            console.log("RESPONSE",json);
            sessionStorage.setItem("response",JSON.stringify(json));
            window.location.href="./confirmation.html";

        }).catch(err=> console.log(err)); 
    }

   
});






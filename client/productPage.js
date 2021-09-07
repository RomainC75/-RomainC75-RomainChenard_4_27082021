
const ListObj=new ListToBuy(sessionStorage.getItem('listToBuy'));
sessionStorage.setItem('listToBuy',ListObj.stringify());
console.log("ListObj",ListObj);

//Create the deviseLinks
const deviseIconPlace=document.getElementsByClassName('deviseIcon')[0];
//initialisation
deviseIconPlace.innerHTML=`${deviseBTHtmlIconsObjet[sessionStorage.getItem('devise')]}`;



//get The Type of the item
const address=window.location.href;
const type=address.match(/#.*/)[0].replace("#","");

//get the JSON object
const ItemTypeSSArray=JSON.parse(sessionStorage.getItem(type));
console.log("ItemTypeSSArray",ItemTypeSSArray);

//title modification
const title=document.getElementsByTagName('title');
document.title=`Orinoco - ${type.charAt(0).toUpperCase()+type.slice(1)}`;

let optionNumber=0;

const refreshProduitPrice = (classs) => {
    console.log("refreshhhhh",classs);
    const categoriePricesArray=document.getElementsByClassName(classs);
    for (let categoriePrice of categoriePricesArray){
        const devise=sessionStorage.getItem('devise');  
        const elementBasePrice=getTheHiddenBasePrice(categoriePrice.parentNode);
        categoriePrice.textContent=deviseFormat(devise,parseInt(elementBasePrice));
    }
}

const createDeviseLinks = () => {
    const deviseLinksArray=document.getElementsByClassName('deviseToClic');
    for (deviseLink of deviseLinksArray){
        deviseLink.addEventListener('click', e => {
            const devise=e.target.textContent.toLowerCase();
            deviseIconPlace.innerHTML=`${deviseBTHtmlIconsObjet[devise]}`;
            sessionStorage.setItem('devise',devise);   
            refreshProduitPrice('keyPrice');
        });
    }
}

createDeviseLinks();

const addOrModifyBasePriceComment = (infos_priceElement, price,index) => {
    if(getTheHiddenBasePrice(infos_priceElement)){
        return infos_priceElement.innerHTML.replace(/basePrice=[0-9abcdef]+/,"basePrice="+price);
    }else {
        return infos_priceElement.innerHTML+`<!--basePrice=${ItemTypeSSArray[index].price}-->`;
    }
}

/////////////////////////////////////////////////////////////////////
/////////////// INSERT INFORMATION ON THE PAGE ///////////////////////

//Name,Description,Price,Image




const insertInformation = (index=0) =>{
    const array=['Name','Description','Price'];
    for (let key of array){
        const line=document.getElementsByClassName(`key${key}`)[0];
        line.innerText=ItemTypeSSArray[index][key.toLowerCase()];
    }

    //insert price infos (commentaires)
    const infos_price=document.getElementsByClassName('infos__price')[0];

    //infos_price.innerHTML=infos_price.innerHTML+`<!--basePrice=${ItemTypeSSArray[index].price}-->`;
    infos_price.innerHTML=addOrModifyBasePriceComment(infos_price,ItemTypeSSArray[index].price,index);


    refreshProduitPrice('keyPrice');
    document.getElementsByClassName('keyImageUrl')[0].src=ItemTypeSSArray[index].imageUrl;
}
insertInformation();




//Get the options for JSObject in "options" array
//OPTIONS
const convertion = {
    cameras:"lenses",
    furniture:"varnish",
    teddies:"colors"
}

let options=[];
for (let item of ItemTypeSSArray){
    options.push(item[convertion[type]]);
}
console.log("options Array",options);


//inject item's option from the "options" array
for (let option of options){
    const dropdownMenu=document.getElementsByClassName('dropdown-menu')[1];
    const li = document.createElement('li');
    const subList="-"+option.join(', ');
    li.innerText=subList;
    dropdownMenu.appendChild(li);
    
    //ajouts
    li.addEventListener('click', (e)=> {
        console.log(li, li.parentNode.children);
        for (let child of Object.keys(li.parentNode.children)){
            if(li.parentNode.children[child]==li){
                //print the options
                
                insertInformation(parseInt(child));
                optionNumber=child;
                
            }
        }
    });
}
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////



//get the quantity SPINNER

const quantityAlert=document.querySelector('.quantityAlert');
let quantityVariable=0;
//buttons
const quantityButtonMinus=document.getElementsByClassName('quantitySpinner__button')[0];
const quantityButtonPlus=document.getElementsByClassName('quantitySpinner__button')[1];
const quantityInput=document.getElementById('quantity');

quantityButtonMinus.addEventListener('click', e => {
    if(quantityVariable>0) {
        quantityVariable --;
        quantityInput.value=quantityVariable;
        quantityAlert.style.visibility="hidden";
    }else{
        quantityAlert.style.visibility="visible";
    }
    console.log(quantityVariable);
});

quantityButtonPlus.addEventListener('click', e => {
    if(quantityVariable<30) {
        quantityVariable ++;
        quantityInput.value=quantityVariable;
        quantityAlert.style.visibility="hidden";
    }else{
        quantityAlert.style.visibility="visible";
    }
    console.log(quantityVariable);
});

quantityInput.addEventListener('input', (e) => {
   if(e.target.value.match(/[^0-9]/)){
    quantityAlert.style.visibility="visible";
    quantityVariable=0;
   }else if(parseInt(quantityInput.value)<0){
       quantityAlert.style.visibility="visible";
        quantityVariable=0;
   }else if (parseInt(quantityInput.value)>30){
        quantityAlert.style.visibility="visible";
        quantityVariable=0;
   }else if(parseInt(e.target.value)>=0 && parseInt(e.target.value)<=30){
        quantityVariable=e.target.value;
        quantityAlert.style.visibility="hidden";
   }
   console.log(quantityVariable); 
});

//validate Button
document.getElementById('validate').addEventListener('click', (e) => {
    if(quantityVariable==0) {
        quantityAlert.style.visibility="visible";
    }
    if(quantityVariable>0 && quantityVariable<=30){
        console.log(sessionStorage.getItem('listToBuy'));
        if(sessionStorage.getItem('listToBuy')){
            sessionStorage.setItem('listToBuy',sessionStorage.getItem('listToBuy')+":"+ItemTypeSSArray[optionNumber]._id+":"+quantityVariable.toString());
            ListObj.update(sessionStorage.getItem('listToBuy'));
            sessionStorage.setItem('listToBuy',ListObj.stringify());
        }
        if(!sessionStorage.getItem('listToBuy')){
            sessionStorage.setItem('listToBuy',ItemTypeSSArray[optionNumber]._id+":"+quantityVariable.toString());
            ListObj.update(sessionStorage.getItem('listToBuy'));
            sessionStorage.setItem('listToBuy',ListObj.stringify());
        }
        quantityInput.value="";
    }
    console.log("sessionStorage",sessionStorage.getItem('listToBuy'));
    basket();
});

basket();

console.log(234,convert("euro",-234));
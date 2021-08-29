


const address=window.location.href;
console.log("href",address);
const type=address.match(/#.*/)[0].replace("#","");
const JSObjet=JSON.parse(sessionStorage.getItem(type));
console.log("JSObjet",JSObjet);
//modification du title
const title=document.getElementsByTagName('title');
console.log(title);
document.title=`Orinoco - ${type.charAt(0).toUpperCase()+type.slice(1)}`;
const quantityAlert=document.querySelector('.quantityAlert');
const array=['Name','Description','Price'];


//Insert Name,Description,Price on the page 
for (let key of array){
    const line=document.getElementsByClassName(`key${key}`)[0];
    line.childNodes[3].innerText=JSObjet[0][key.toLowerCase()];
    
}

//Insert Imge on Th Page
document.getElementsByClassName('keyImageUrl')[0].src=JSObjet[0].imageUrl;

//Get the options for JSObject in "options" array
const convertion = {
    cameras:"lenses",
    furniture:"varnish",
    teddies:"colors"
}
let options=[];
for (let item of JSObjet){
    options.push(item[convertion[type]]);
}
console.log("options Array",options);

//inject item's option from "options" array
for (let option of options){
    const dropdownMenu=document.getElementsByClassName('dropdown-menu')[0];
    const li = document.createElement('li');
    const subList="--"+option.join(', ');
    li.innerText=subList;
    dropdownMenu.appendChild(li);
}

//get the quantity
let quantitySelected=0;
const quantity=document.getElementById('quantity');
quantity.addEventListener('click', (e) => {
   quantitySelected=quantity.value;
   if(quantity.value>0){
       quantityAlert.style.visibility="hidden";
   }
});


//validate Button
document.getElementById('validate').addEventListener('click', (e) => {
    if(quantitySelected==0) {
        quantityAlert.style.visibility="visible";
    }
    if(quantitySelected>0){
        console.log(sessionStorage.getItem('listToBuy'));
        if(sessionStorage.getItem('listToBuy')){
            sessionStorage.setItem('listToBuy',sessionStorage.getItem('listToBuy')+":"+JSObjet[0]._id+":"+quantitySelected.toString());
        }
        if(!sessionStorage.getItem('listToBuy')){
            console.log("first time");
            sessionStorage.setItem('listToBuy',JSObjet[0]._id+":"+quantitySelected.toString());
        }
    }
    console.log(sessionStorage.getItem('listToBuy'));
    basket();
    
});

//change the "shopping icon" if there is any item in sessionStorage
const basket = () => {
    if (sessionStorage.getItem('listToBuy')){
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart-fill"></i>';
    }else{
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart"></i>';
    }
}

basket();

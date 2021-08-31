

//get The Type of the item
const address=window.location.href;
const type=address.match(/#.*/)[0].replace("#","");

//get the JSON object
const JSObjet=JSON.parse(sessionStorage.getItem(type));
console.log("JSObjet",JSObjet);

//title modification
const title=document.getElementsByTagName('title');
document.title=`Orinoco - ${type.charAt(0).toUpperCase()+type.slice(1)}`;

let optionNumber=0;
/////////////////////////////////////////////////////////////////////
/////////////// INSERT INFORMATION ON THE PAGE ///////////////////////

//Name,Description,Price,Image

const array=['Name','Description','Price'];

const insertInformation = (index=0) =>{
    for (let key of array){
        const line=document.getElementsByClassName(`key${key}`)[0];
        line.childNodes[3].innerText=JSObjet[index][key.toLowerCase()];
    }
    document.getElementsByClassName('keyImageUrl')[0].src=JSObjet[index].imageUrl;
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
for (let item of JSObjet){
    options.push(item[convertion[type]]);
}
console.log("options Array",options);

//inject item's option from the "options" array
for (let option of options){
    const dropdownMenu=document.getElementsByClassName('dropdown-menu')[0];
    const li = document.createElement('li');
    const subList="--"+option.join(', ');
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

//get the quantity
const quantityAlert=document.querySelector('.quantityAlert');
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
            sessionStorage.setItem('listToBuy',sessionStorage.getItem('listToBuy')+":"+JSObjet[optionNumber]._id+":"+quantitySelected.toString());
        }
        if(!sessionStorage.getItem('listToBuy')){
            console.log("first time");
            sessionStorage.setItem('listToBuy',JSObjet[optionNumber]._id+":"+quantitySelected.toString());
        }
    }
    console.log("sessionStorage",sessionStorage.getItem('listToBuy'));
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

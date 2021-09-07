//console.log("deviseFormat",deviseFormat('dollar',1100.36));
//init the devise variable
if(!sessionStorage.getItem('devise')){
    sessionStorage.setItem('devise','yen');
}


console.log("listToBuy",sessionStorage.getItem('listToBuy'));
console.log("test",deviseFormat('dollar',12213213234))
//
const ListObj=new ListToBuy(sessionStorage.getItem('listToBuy'));
ListObj.initDifferentTypesElementsAccueil();
console.log("LISTOBJ",ListObj);

/* for some tests
console.log("teddies",sessionStorage.getItem('cameras'));
console.log("listObj.list",ListObj);
console.log("test",ListObj["test"]);
console.log("get",ListObj.getAllItems());
console.log(ListObj.getTeddiesGroupPrice());

console.log("STRINGIFY",ListObj.stringify());
console.log("PRICE", ListObj.getPrice("5beaa8bf1c9d440000a57d94"));
console.log("TOSERVER",ListObj.itemsArrayToServer());
*/

// --------------------------------------------DEVISES----------------------------------
//Create the deviseLinks
const deviseIconPlace=document.getElementsByClassName('deviseIcon')[0];
//initialisation
deviseIconPlace.innerHTML=`${deviseBTHtmlIconsObjet[sessionStorage.getItem('devise')]}`;

const refreshPrices = (classs,hiddenInfoPlace) => {
    console.log("refreshhhhh",classs);
    const categoriePricesArray=document.getElementsByClassName(classs);
    
    for (let categoriePrice of categoriePricesArray){
        const devise=sessionStorage.getItem('devise');
        const elementBasePrice=getTheHiddenBasePrice(categoriePrice.parentNode.parentNode.parentNode.parentNode);
        categoriePrice.textContent=deviseFormat(devise,parseInt(elementBasePrice));
    }
}


refreshPrices('prices');

const createDeviseLinks = () => {
    const deviseLinksArray=document.getElementsByClassName('deviseToClic');
    for (deviseLink of deviseLinksArray){
        deviseLink.addEventListener('click', e => {
            const devise=e.target.textContent.toLowerCase();
            deviseIconPlace.innerHTML=`${deviseBTHtmlIconsObjet[devise]}`;
            sessionStorage.setItem('devise',devise);   
            refreshPrices('price');
        });
    }
}
createDeviseLinks();

//--------Create the page first page
const container=document.getElementsByClassName('container')[0];

const accueilAddLine = (elementArray,elementType) => {
    console.log("ACCUEILADDLINE",elementArray,elementType);
    let div = document.createElement('a');
    div.classList.add('cart-item','d-sm-flex', 'justify-content-between','accueilBlock'); 
    div.href=`produit.html#${elementType}`;
    const divContent=`<div class="card" style="width: 18rem;">
    <img class="card-img-top" src="${elementArray[0].imageUrl}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">Gamme</h5>
      <h4 class="card-subtitle">${elementType.charAt(0).toUpperCase()+elementType.slice(1)}</h4>
      <p class="card-text">Prix :<mark class="price">${elementArray[0].price}</mark></p>
      
      <div class="btn btn-primary">Cliquez sur la carte</div>
    </div>
  </div>   <!--id=${elementArray[0]._id} basePrice=${elementArray[0].price}-->`;
    div.innerHTML=divContent;
    console.log("test getTheHiddenId",getTheHiddenId(div));
    container.appendChild(div);
}

//----- Basket and Init Button Section--------
basket();

const initButton = document.querySelector('.initButton');
//modifiy the aspect of the initButton "Vider le panier"
const initEmptyButton = () => {
    if (sessionStorage.getItem('listToBuy')){
        initButton.style.backgroundColor="#bb2d3b";
        initButton.style.cursor="pointer";
    }else{
        initButton.style.backgroundColor="grey";
        initButton.style.cursor="default";
    }
}
initEmptyButton();

//action if someone click on the iniButton "vider le panier"
initButton.addEventListener('click', e => {
    if(sessionStorage.getItem('listToBuy')){
        sessionStorage.setItem('listToBuy','');
        basket();
        initEmptyButton();
    }
});


//console.log("sessionStorage",sessionStorage);

//console.log("getPrice",ListObj.getPrice("5be9c8541c9d440000665243"));
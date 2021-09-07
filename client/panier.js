//init the Object with the data in sessionStorage
const ListObj=new ListToBuy(sessionStorage.getItem('listToBuy'));

//change the "shopping icon" if there is any item in sessionStorage
basket();

console.log("sessionStorageSTR",sessionStorage.getItem('listToBuy'));
console.log("ListObj.getItemsList",ListObj.getItemsList);

//Create the deviseLinks
const deviseIconPlace=document.getElementsByClassName('deviseIcon')[0];
//initialisation
deviseIconPlace.innerHTML=`${deviseBTHtmlIconsObjet[sessionStorage.getItem('devise')]}`;


//If there is no Teddy in the basket
//old peluche test : !objProductsToBuy["5be9c8541c9d440000665243"]

if (ListObj.parseStrList(sessionStorage.getItem('listToBuy')) &&  !ListObj.isThereAnyTeddyInTheList()){
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

//concentrate 3 arrays ('teddies','furniure' and 'cameras') in one.
const bigJSON=JSON.parse(sessionStorage.getItem('cameras')).concat(JSON.parse(sessionStorage.getItem('furniture'))).concat(JSON.parse(sessionStorage.getItem('teddies')));
console.log("bigJSON",bigJSON);

//create in the DOM a product line inside the div "panierContainer"
//arguments itemId and quantity
const createProductLine = (id,quantity) => {
    const lineInfos=bigJSON.filter(x=>x["_id"]==id);
    console.log("lineInfo",lineInfos);
    const tr = document.createElement('tr');
    //ul.classList.add('list-group','list-group-horizontal-sm','panierList');
    const content=`<td>
            <div class="product-item">
                <a class="product-thumb" href="#"></a><img class="miniImage" src="${lineInfos[0].imageUrl}" alt="Product"></a>
                <div class="product-info">
                    <h4 class="product-title"><div class="product-title__name">${lineInfos[0].name}</div></h4>
                </div>
            </div>
        </td>
        <td class="text-center text-lg text-medium quantityLine">${quantity}</td>
        <td class="text-center text-lg text-medium unitPriceLine">${lineInfos[0].price}</td>
        <td class="text-center text-lg text-medium subTotalPriceLine">${parseInt(lineInfos[0].price)*quantity}</td>
        <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="fa fa-trash deleteItemTrash"></i></a></td>
        <!--id=${id} basePrice=${lineInfos[0].price} baseSumPrice=${parseInt(lineInfos[0].price)*quantity}-->`;
    tr.innerHTML=content;
    //add it to the DOM
    const divPanierContainer=document.getElementsByTagName('tbody')[0];
    divPanierContainer.appendChild(tr);
    return parseInt(lineInfos[0].price)*quantity;
}

//create in the DOM one line with the total price
//argument : just the total price to print
const createTotalPriceLine = (price) => {
    const totalLine = document.createElement('div');
    totalLine.classList.add("column", "text-lg", "totalPriceContainer");
    const content=`TOTAL: <span class="text-medium totalPrice">${price}</span><!--totalPrice=${price}-->`;
    totalLine.innerHTML=content;
    document.getElementsByClassName("shopping-cart-footer")[0].appendChild(totalLine);
}

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
createProductLineS(ListObj.getItemsList);

//console.log("test",createProductLineS(3));
//------------------------------------Devise-----

const refreshTotalPriceConvertion = () => {
    const totalPriceSelector=document.getElementsByClassName('totalPrice')[0];
    
    const totalPrice=getTheHiddenTotalPrice(totalPriceSelector.parentNode);
    totalPriceSelector.textContent=deviseFormat(sessionStorage.getItem('devise'),parseInt(totalPrice));
}

refreshTotalPriceConvertion();

const refreshProductPricesConvertion = () => {
    const unitPricesArray=document.getElementsByClassName('unitPriceLine');
    for (let unitPrice of unitPricesArray){
        const basePrice=getTheHiddenBasePrice(unitPrice.parentNode);
        unitPrice.textContent=deviseFormat(sessionStorage.getItem('devise'),parseInt(basePrice));
    }
    const sumPricesArray=document.getElementsByClassName('subTotalPriceLine');
    for (let sumPrice of sumPricesArray){
        const baseSumPrice=getTheHiddenBaseSumPrice(sumPrice.parentNode);
        sumPrice.textContent=deviseFormat(sessionStorage.getItem('devise'),parseInt(baseSumPrice));
    }
}

refreshProductPricesConvertion(sessionStorage.getItem('devise'));

const createDeviseLinks = () => {
    const deviseLinksArray=document.getElementsByClassName('deviseToClic');
    for (deviseLink of deviseLinksArray){
        deviseLink.addEventListener('click', e => {
            const devise=e.target.textContent.toLowerCase();
            deviseIconPlace.innerHTML=`${deviseBTHtmlIconsObjet[devise]}`;
            sessionStorage.setItem('devise',devise); 
            //refreshProduitPrice('keyPrice');
            refreshProductPricesConvertion(devise);
            refreshTotalPriceConvertion(devise);
        });
    }
}

createDeviseLinks();

orderObject={
    products:ListObj.getItemsList
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
    
    /*const teddyFilteredArray =[];
    for (let product of productsPartArray){
        if(JSON.parse(sessionStorage.getItem("teddies")).some(teddy => teddy["_id"]==product)){
            teddyFilteredArray.push(product);
        }
    }
    return teddyFilteredArray;
    */
    return ListObj.teddyFilter(productsPartArray);

}
console.log("productsPartsCreator",productsPartCreator(ListObj.getItemsList));
console.log("productsPartArrayFILTERED",productsPartCreator(ListObj.getItemsList));


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

//Clear Cart Button
const clearCartButton=document.getElementById('clearCart');

clearCartButton.addEventListener('click', e => {
    if(sessionStorage.getItem('listToBuy')){
        ListObj.clearAllItems();
        basket();
        document.location.reload();
    }
});

const deleteItemTrashArray=document.getElementsByClassName('deleteItemTrash');
for (let deleteItem of deleteItemTrashArray){
    deleteItem.addEventListener('click', e => {
        const idToDelete=deleteItem.parentNode.parentNode.parentNode.innerHTML.match(/id=([0-9abcdef]{24})/)[1];
        ListObj.deleteItem(idToDelete);

    })
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

const min5ColorProtection = (element) => {
    element.addEventListener('input' , e => {
        if (!e.target.value.match(/.{5,}/)){
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
min5ColorProtection(document.getElementById('address'));

////////////////////////////Protection before sending message///////////
const onlyTextCheck = (text) => {
    return text.match(/[^a-zA-Z\-\séèêâà]/) ?  0 : 1;
}
const mailCheck = (email) => {
    return email.match(/.+@.+\.[a-zA-Z]{2,4}/) ? 1 : 0;
}
const min5Letters = (text) => {
    return typeof(text)=="string" && text.match(/.{5,}/) ? 1 : 0;
}

const formCheckingFonction= () => {
    const ccForm = document.forms["ccform"];
    console.log(ccForm[0].value);
    if (mailCheck(ccForm[0].value) && onlyTextCheck(ccForm[1].value) && onlyTextCheck(ccForm[2].value) && min5Letters(ccForm[3].value) && onlyTextCheck(ccForm[4].value)) {
        console.log("OK");
        return 1;
    }else{
        return 0; 
    }
}

//------submit Function-----------------
document.querySelector('button[type="submit"]').addEventListener('click',e => {
    e.preventDefault();

    if (formCheckingFonction()){
            //create the object to Send
            
        const finalObject={
            contact:contactPartCreator(),
            products:productsPartCreator(ListObj.getItemsList)
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

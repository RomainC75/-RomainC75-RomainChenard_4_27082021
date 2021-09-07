/*separate de numbers by 3
argument : price (int)
return : converted string*/

const deviseObject={
    yen:"¥",
    dollar:"$",
    euro:"€"
}

const deviseBTHtmlIconsObjet={
    yen:'<i class="bi bi-currency-yen"></i>',
    euro:'<i class="bi bi-currency-euro"></i>',
    dollar:'<i class="bi bi-currency-dollar"></i>'
};

const format = (devise, price) => {
    array=price.toString().split('.');
    //put space between the int part numbers
    console.log("array after Split",array);
    let intPart=array[0].split('');
    console.log(intPart);
    const separetedintPart=intPart.reverse().map((x,i,array)=> {{
        if((i+1)%3==0){
            return " "+x;
        }else return x;
    }}).reverse().join('');
    //the decimal part
    if(array[1] && array[1].charAt(0)!="0") {
        array[1]=array[1].charAt(0);
        return separetedintPart+"."+array[1]+" "+deviseObject[devise];
    }else{
        return separetedintPart+" "+deviseObject[devise];
    }
    
}

//argument  : value (int)
//return the converted value
const convert = (devise,value) => {
    if(devise=="euro"){
        return value*0.0077;
    }else if(devise=="dollar"){
        return value*0.0091;
    }else if(devise=="yen"){
        return value
    }else{
        return false;
    }
}

/*argument : devise (int)
return converted devise (string) with separation
*/

const deviseFormat = (devise,price) => {
    if (typeof(devise)!="string" || typeof(price)!= "number") return false;
    price=convert(devise,price);
    console.log(price);
    return format(devise,price);
}


//change the "basket icon" according to the state of the value of 'listToBuy'
const basket = () => {
    if (sessionStorage.getItem('listToBuy')){
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart-fill"></i>';
        return 1;
    }else{
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart"></i>';
        return 0;
    }
}

const getTheHiddenId = (el) => {
    return el.innerHTML.match(/id=([0-9abcdef]+)/)[1];
}

const getTheHiddenBasePrice = (el) => {
    const result=el.innerHTML.match(/basePrice=([0-9]+)/);
    if(result){
        return result[1];
    }else{
        return false;
    }
}

const getTheHiddenBaseSumPrice = (el) => {
    const result=el.innerHTML.match(/baseSumPrice=([0-9]+)/);
    if(result){
        return result[1];
    }else{
        return false;
    }
}

const getTheHiddenTotalPrice = (el) => {
    console.log('arrivée EL' , el);
    const result=el.innerHTML.match(/totalPrice=([0-9]+)/);
    if(result){
        return result[1];
    }else{
        return false;
    }
}

const types=['cameras','furniture','teddies'];

const getPriceFromId = (id) => {
    for (let type of types){
        array=JSON.parse(sessionStorage.getItem(type));
        const isPresent=array.find(x=>x._id==id);
        console.log('type',type,isPresent);
    }
}
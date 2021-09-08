/*separate de numbers by 3
argument : price (int)
return : converted string*/

const deviseObject={
    yen:"¥",
    dollar:"$",
    euro:"€"
}

const rate={
    yen:1,
    dollar:0.0091,
    euro:0.0077,
    eDollar:undefined,
    eEuro:undefined,
    date:undefined
}

const AccueilPrintConversionRates = () => {
    const convertHeader=document.querySelector('.conversion__title');
    const textC=`Taux de conversion au <br>${rate.date}`;
    if(rate.date) convertHeader.innerHTML=textC;
    const htmlDollarMarker=document.getElementById('convertRateUSD');
    if (rate.eDollar) htmlDollarMarker.textContent=rate.eDollar;
    const htmlEuroMarker=document.getElementById('convertRateEUR');
    if (rate.eEuro) htmlEuroMarker.textContent=rate.eEuro;
}

const initRate = ()=> {
    url="https://v6.exchangerate-api.com/v6/ef988f1b1049957f460cf310/latest/JPY";
    fetch(url)
        .then(rawJson => rawJson.json())
        .then(json => {
            rate.eDollar=json.conversion_rates.USD;
            rate.eEuro=json.conversion_rates.EUR;
            rate.date=json.time_last_update_utc.match(/\d{2} \w{3} \d{4}/)[0];
            console.log("DATE",rate.date);
            AccueilPrintConversionRates();
        });
}



const deviseBTHtmlIconsObjet={
    yen:'<i class="bi bi-currency-yen"></i>',
    euro:'<i class="bi bi-currency-euro"></i>',
    dollar:'<i class="bi bi-currency-dollar"></i>'
};

const format = (devise, price) => {
    if(typeof(price)!="number")return false;
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
    //if(typeof(value)!="number" || value<=0) return false;
    if(devise=="euro"){
        //console.log("calcul", value*rate.eEuro , value*rate.euro);
        return rate.eEuro ? value*rate.eEuro : value*rate.euro;
        //return value*rate["euro"];
    }else if(devise=="dollar"){
        return rate.eDollar ? value*rate.eDollar : value*rate.dollar;
        //return value*rate["dollar"];
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
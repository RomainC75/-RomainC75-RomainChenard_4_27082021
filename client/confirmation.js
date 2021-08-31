const obj=JSON.parse(sessionStorage.getItem('response'));
console.log(obj);

const getTheTotalPrice = (orderedObj) => {
    return orderedObj.products.reduce((accu,currentV)=>{
        return accu+currentV.price;
    },0);
}

console.log(getTheTotalPrice(obj));



document.getElementById('eMail').innerText=obj.contact.email;
document.getElementById('totalPrice').innerText=getTheTotalPrice(obj)+" ¥";
document.getElementById('orderId').innerText=obj.orderId;

sessionStorage.clear();

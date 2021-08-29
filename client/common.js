//change the "shopping icon" if there is any item in sessionStorage
const basket = () => {
    if (sessionStorage.getItem('listToBuy')){
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart-fill"></i>';
    }else{
        document.querySelector('.basket').innerHTML='<i class="bi bi-cart"></i>';
    }
}

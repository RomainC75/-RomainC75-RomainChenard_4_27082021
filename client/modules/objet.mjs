class ListToBuy {
    constructor(strLst){
        this._itemsList=this.parseStrList(strLst);
        this._types=['teddies','cameras','furniture']
        this._devise=sessionStorage.getItem('devise');
        this._elementsObj={};
    }
    /*
    get itemsList() {
        if(this._itemsList) return this._itemsList;
        else return false;
    }*/
    get elementsObj(){
        if (this._elementsObj) return this._elementsObj;
        else return false;
    }
    //init the sessionStorage for the 3 itemTypes (teddies,furniture,cameras and biuld the container of the index.html page)
    initDifferentTypesElementsAccueil(){
        console.log("start iniDifferentTypesElements");
        const obj={};
        const wholeURLs= {
            teddies:"http://127.0.0.1:3000/api/teddies",
            furniture:"http://127.0.0.1:3000/api/furniture",
            caméra:"http://127.0.0.1:3000/api/cameras"
        }
        for (let url of Object.keys(wholeURLs)){
                const type=wholeURLs[url].match(/\/api\/.*$/)[0].replace("/api/","");
                fetch(wholeURLs[url])
                .then(rawJson => rawJson.json())
                .then(json => {
                    sessionStorage.setItem(type,JSON.stringify(json));
                    obj[type]=json;
                    this._elementsObj[type]=json;
                    accueilAddLine(json,type);
                    refreshPrices('price');
                });
        }
        return obj;
    }
    //parse a string - id:nb:id:nb - (for SessionStorage)
    ////
    //  _id:number:_id:number
    ////
    //return an objet "ItemId : quantity"
    parseStrList (strList){
        if(strList != null){
            const obj={};
            const array=strList.split(':');
            for (let i=0 ; i<array.length-1 ; i=i+2){
                !obj[array[i]] ? obj[array[i]]=parseInt(array[i+1]) : obj[array[i]]=obj[array[i]]+parseInt(array[i+1]);
            }
            
            return obj;
        }else{
            return {};
        }
    }
    // use the object "itemsList" and return the string version
    stringify(){
        const array=[];
        if(this._itemsList){
            for (let item of Object.keys(this._itemsList)){
                array.push(item+":"+this._itemsList[item]);
            };
            return array.join(':');
        }else{
            return false;
        }
    }
    //update the itemsList with the string variable in argument (from session SessionStorage)
    update(strLst){
        this._itemsList=this.parseStrList(strLst);
    }
    //add items to the object 'itemsList' : create a new key OR change the value if the key exists.
    addItem (id, number){
        if (typeof(number)!='number' || typeof(id)!='string' || id.length!=24){
            return false;
        }else{
            if(this._itemsList[id]){
                this._itemsList[id]+=number;
            }else{
                this._itemsList[id]=number;
            }
            sessionStorage.setItem('listToBuy',this.stringity());
        }
    }
    //
    getAllItems(){
        return this._itemsList ? this._itemsList : false;
    }
    /*
    getItems (id){
        if(id){
            return this._itemsList[id];
        }
        return 0;
    }*/
    get getItemsList(){
        return this._itemsList ?  this._itemsList:{};
    }
    deleteItem(id){
        const regex=new RegExp(id+":[0-9]+[:]?");
        const chaineToRemove=sessionStorage.getItem('listToBuy').match(regex);
        sessionStorage.setItem('listToBuy',sessionStorage.getItem('listToBuy').replace(chaineToRemove,""));
        delete this._itemsList[id];
        document.location.reload();
    }
    clearAllItems (){
        this._itemsList={};
        sessionStorage.removeItem('listToBuy');
    }
    /*getItemPrice(id){
        array=['cameras','furniture','teddies'];
        
        return false;
    }*/
    isThereAnyTeddyInTheList(){
        //console.log("object.keys returns ",Object.keys(objProductsToBuy));
        if (sessionStorage.getItem("teddies") && Object.keys(this._itemsList)){
            const teddiesObj=JSON.parse(sessionStorage.getItem("teddies"));
            return Object.keys(this._itemsList).some( x => {
                return teddiesObj.some(y=> {
                    //console.log("productToBuy,Teddies",x,y["_id"]);
                    return x==y["_id"];
                });
            });
        }
    }
    isTeddy(id){
        if(typeof(id)=="string" && id.length==24){
            if (JSON.parse(sessionStorage.getItem('teddies')).some(x=>x._id==id)){
                return true;
            }
            return false;
        }else{
            return false;
        }
    }
    getPrice(id){
        if(typeof(id)=="string" && id.length==24){
            let price=0;
            for (let type of this._types){
                const response=JSON.parse(sessionStorage.getItem(type)).find(x=>x._id==id);
                if(response) price=response.price;
            }
            return price!=0 ? price : false;
        }
        return false
    }
    getTeddiesGroupPrice(){
        let price=0;
        for (let id of Object.keys(this._itemsList)){
            if (this.isTeddy(id)) {
                price+=this.getPrice(id)*this._itemsList[id];
            }
        }
        return price;   
    }
    teddyFilter(productsPartArray){
        console.log('filterTeddy');
        const teddyFilteredArray =[];
    for (let product of productsPartArray){
        if(JSON.parse(sessionStorage.getItem("teddies")).some(teddy => teddy["_id"]==product)){
            teddyFilteredArray.push(product);
        }
    }
    return teddyFilteredArray;
    }

    /*
    itemsArrayToServer(){
        const array=[];
        for (let id of Object.keys(this._itemsList)){
            for (let i=0 ; i<this._itemsList[id] ; i++){
                array.push(id);
            }
        }
        return array;
    }
    */



}
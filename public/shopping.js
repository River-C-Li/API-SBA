if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready()
}

function ready(){
let removeCartItemButtons = document.getElementsByClassName('btn-danger')   ///ok
for(let i =0; i < removeCartItemButtons.length; i++) {
    let button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem)
}

let quantityInputs = document.getElementsByClassName('cart-quantity-input')  //ok
    for(let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

let addToCartButtons = document.getElementsByClassName('shop-item-button')  /////ok
        for (let  i = 0; i < addToCartButtons.length; i++) {
            let button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }
}

function removeCartItem(e){
    let buttonClicked = e.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(e){
 let input= e.target
 if (isNaN(input.value) || input.value <= 0){
    input.value = 1
 }
 updateCartTotal()
}

function addToCartClicked(e){
let button = e.target
let shopItem = button.parentElement.parentElement
let title = shopItem.getElementsByClassName('shop-item-title')[0].textContent    ////ok
let price =  shopItem.getElementsByClassName('shop-item-price')[0].textContent  ///ok
// let imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src      ///////
addItemToCart(title, price) //imageSrc
updateCartTotal()
}

function addItemToCart(title, price){   //imageSrc
    let cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    let cartItems = document.getElementsByClassName('cart-items')[0]  //ok from ejs empty div
    let cartItemNames= cartItems.getElementsByClassName('cart-item-title')  //////ok
    for (let i = 0; i < cartItemNames.length; i++ ){
        if (cartItemNames[i].textContent == title){
            alert ("You have added the item to the cart.")
            return
        }
    }
    // <img class="cart-item-image" src="${imageSrc} " width ="100" height ="100"> 
    let cartRowContents = `
    <div class="cart-item">                
  
    <span class="cart-item-title"> ${title} </span>
    </div>
     <span class="cart-price"> ${price} </span>
     <div class="cart-quantity">
    <input class="cart-quantity-input" type="number" value="1" >
    <button class="btn-danger" type ="button" > Remove</button>
    </div> `
    cartRow.innerHTML = cartRowContents /////innerHTML
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)  //ok
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged) //ok
}

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0]  //ok from ejs  empty div
    let cartRows = cartItemContainer.getElementsByClassName('cart-row') ///ok
    let total = 0
    for (let i= 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i]
        let priceElement = cartRow.getElementsByClassName('cart-price')[0]   ///ok
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]  //pk
        let price = parseFloat(priceElement.textContent.replace('$', ''))
        let quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].textContent ='$' + total       ////ok
}


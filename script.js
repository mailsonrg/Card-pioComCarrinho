const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

//array vazio do carrinho
let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

//Fechar o modal quando clicar no botão fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

//Função que capta o click do botão add ao carrimho
menu.addEventListener("click", function (event) {
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        //Adicionar no carrinho
        addToCart(name, price)
    }
})

//função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item já existe, aumenta apenas a quantidade
        existingItem.quantity += 1;

    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })

        Toastify({
            text: "ÍTEM ADICIONADO AO CARRINHO!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "rgb(34 197 94)",
            },
        }).showToast();

    }

    
    updateCartModal()

}

//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.id = "ESSE"
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <div class="cart-btn-container gap-2">
                    <button class="add-from-cart-btn" data-name="${item.name}">
                        Adicionar
                    </button>
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
        </div>
        `
        //Função que pega o valor do produto, multiplica pela quantidade e retorna o valor total dos itens no carrinho.
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
        
    })
    //Função para mostrar o valor total com a formatação para moeda brasileira
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    //FUNÇÃO PARA MOSTRAR A QUANTIDADE DE ITENS QUE TEM NO CARRINHO
    cartCounter.innerHTML = cart.length;
}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
    
        removeItemCart(name);
    }
})

cartItemsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("add-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        addToCart(name);
    }
})

//Complemento função para remover item do carrinho
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        //Se qtd for maior que 1, remove -1 da qtd
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        //Se qtd for 1, remove o item do carrinho com splice
        cart.splice(index, 1);
        updateCartModal();
    }
}

//Pega o que for digitado em endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    //A partir do momento em que começar a digitar no input endereço, remove borda vermelha e o aviso
    if(inputValue != ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

//CHECKOUT!
checkoutBtn.addEventListener("click", function(){
    //Função que impede que o pedido seja enviado caso o restaurante esteja fechado
    const isOpen = checkRestaurantOpen();
        if(!isOpen){
        
            Toastify({
                text: "Ops o restaurante está fechado!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#EF4444",
                },
        
    }).showToast();

    return;
}
    
    //se o input endereço estiver vazio, mostra um alerta e formata as bordas para vermelho
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5584999801279"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    addressInput.value = ''
    updateCartModal();

})

//Verificar a hora e manipular o card horário de funcionamento
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

document.getElementById('purchaseForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const cartId = form.cartId.value;

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cartId })
        });

        if (!response.ok) {
            throw new Error('Error al procesar la compra');
        }

        const result = await response.json();
        let mensaje = " "
            if(!result.products){
                mensaje = "El carrito esta vacio, favor agregar productos"
            }else{
                const products = result.products
                mensaje = products.join('<br>') 
                mensaje+= "<br> sin Stock suficiente."
            }

        if (result.success) {
            // Mostrar una alerta de éxito
            sweetAlert("top-end","success",`Compra procesada exitosamente.<br>${mensaje}`,`/api/carts/${cartId}`)
          
        } else {
            sweetAlert("top-end","error",`Error al procesar la compra.<br>${mensaje}`,`/api/carts/${cartId}`)
        }
    } catch (error) {
        console.log(error)

    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            handleDeletion(`/api/carts/${cid}/products/${productId}`, 'Producto eliminado correctamente', `/api/carts/${cid}`);
        });
    });

    document.querySelector('.delete-cart').addEventListener('click', (event) => {
        const cartId = event.target.dataset.id;
        handleDeletion(`/api/carts/${cartId}`, 'Carrito vaciado correctamente', `/api/carts/${cid}`);
    });
});
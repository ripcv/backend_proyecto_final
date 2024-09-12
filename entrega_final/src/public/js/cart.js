document.getElementById('purchaseForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const { value: formValues } = await Swal.fire({
        title: 'Infomación de envio',
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Dirección de envío">
            <input id="swal-input2" class="swal2-input" placeholder="Ciudad">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const shippingAddress = document.getElementById('swal-input1').value;
            const city = document.getElementById('swal-input2').value;

            if (!shippingAddress || !city) {
                Swal.showValidationMessage('Por favor, complete todos los campos');
                return false;
            }

            return [shippingAddress, city];
        }
    })

    if (formValues) {
        const form = event.target;
        const cartId = form.cartId.value;
        const shippingAddress = formValues[0];  
        const city = formValues[1];  

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    cartId,
                    shippingAddress,
                    city
                })
            });

            if (!response.ok) {
                throw new Error('Error al procesar la compra');
            }

            const result = await response.json();
            let mensaje = " "
            if (!result.products) {
                mensaje = "El carrito está vacío, favor agregar productos";
            } else {
                const products = result.products;
                mensaje = products.join('<br>') 
                if (products.length > 0) {
                    mensaje += "<br> sin stock suficiente.";
                }
            }

            if (result.success) {
                // Mostrar una alerta de éxito
                sweetAlert("top-end","success",`Compra procesada exitosamente.<br>${mensaje}`,`/carts/${cartId}`);
            } else {
                sweetAlert("top-end","error",`Error al procesar la compra.<br>${mensaje}`,`/carts/${cartId}`);
            }
        } catch (error) {
            console.error(error);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.id;
            handleDeletion(`/api/carts/${cid}/products/${productId}`, 'Producto eliminado correctamente', `/carts/${cid}`);
        });
    });

    document.querySelector('.delete-cart').addEventListener('click', (event) => {
        const cartId = event.target.dataset.id;
        handleDeletion(`/api/carts/${cartId}`, 'Carrito vaciado correctamente', `/carts/${cid}`);
    });
});
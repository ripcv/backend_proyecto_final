

document.querySelectorAll('.add-to-cart').forEach(button => {
    const ownerId = button.dataset.owner;
    const productId = button.dataset.id;
    
    if(ownerId === userId){
       button.addEventListener('click', (event)=>{
        sweetAlert("top-end","error","No puede agregar productos propios")
       })
    }else{
    
    button.addEventListener('click', async (event) => {
        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });

            if (!response.ok) {
                throw new Error('Error al agregar producto al carrito');
            }

            const result = await response.json();

            if (result.success) {
                // Mostrar una alerta de éxito
                sweetAlert("top-end","success",result.message,'/products')
            } else {
                // Mostrar una alerta de error
                sweetAlert("top-end","error",result.message,'/products')
            } 
        } catch (error) {
            console.error('Error:', error);
            // Mostrar una alerta de error genérico
            sweetAlert("top-end","error","Error al agregar el producto",'/products')
        }
    });
}
});


    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                handleDeletion(`/api/products/${productId}`, 'Producto eliminado correctamente', `/products`);
            });
        });
    });



    document.getElementById('productForm').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const url = productId ? `/api/products/${productId}` : '/api/products';
        const method = productId ? 'PUT' : 'POST';

        try {
          const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
    
          if (!response.ok) {
            throw new Error('Error en la solicitud');
          }
    
         const result = await response.json();
          sweetAlert("top-end",result.status,result.message,result.status==='error'?'':`/products`)
    
        } catch (error) {
            console.error('Error:', error);
          alert('Error al realizar la operación');
        }
      });
    
  
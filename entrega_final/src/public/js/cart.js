// Modal y cierre del modal
const modal = document.getElementById("paymentModal");
const closeModal = document.querySelector(".close");

// Controlar el envío del formulario de compra
document
  .getElementById("purchaseForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const { value: formValues } = await Swal.fire({
      title: "Información de envío",
      html: `
          <input id="swal-input1" class="swal2-input" placeholder="Dirección de envío">
          <input id="swal-input2" class="swal2-input" placeholder="Ciudad">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const shippingAddress = document.getElementById("swal-input1").value;
        const city = document.getElementById("swal-input2").value;

        if (!shippingAddress || !city) {
          Swal.showValidationMessage("Por favor, complete todos los campos");
          return false;
        }

        return [shippingAddress, city];
      },
    });

    if (formValues) {
      const form = event.target;
      const cartId = form.cartId.value;
      const shippingAddress = formValues[0];
      const city = formValues[1];

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartId,
            shippingAddress,
            city,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al procesar la compra");
        }

        const { sessionId, clientSecret } = await response.json();

        if (sessionId && clientSecret) {
          setLoading(false);
          // Inicializar Stripe con la clave pública
          const stripe = Stripe(stripePK);

          const appearance = {
            theme: "stripe",
          };
          elements = stripe.elements({ appearance, clientSecret });
          const paymentElement = elements.create("payment");
          paymentElement.mount("#payment-element");

          modal.style.display = "block";

          const paymentForm = document.getElementById("payment-form");
          paymentForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Confirmar el pago con el `clientSecret`
            const { error, paymentIntent } = await stripe.confirmPayment({
              elements,
              confirmParams: {
                return_url: `${process.env.BASE_URL}/products`,
                payment_method_data: {
                  billing_details: {
                    name: userName,
                  },
                },
              },
              redirect: "if_required",
            });

            setLoading(true);

            if (error) {
              showMessage(error.message);
            } else if (paymentIntent.status === "succeeded") {
              showMessage("Pago procesado correctamente");
              try {

                const response = await fetch(`/api/payment/success/${cid}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });

               
                if (response.ok) {
                  const result = await response.json();
                  sweetAlert("top-end",result.status,result.message,`/products`)
                } 
              } catch (err) {
                // Manejar errores en la solicitud fetch
                console.error("Error al llamar al endpoint de éxito:", err);
                showMessage(
                  "Hubo un problema al procesar el pago. Por favor, intenta de nuevo."
                );
              }
             
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

// Cerrar el modal de pago
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Manejo de eliminar productos y carrito
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-product").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.dataset.id;
      handleDeletion(
        `/api/carts/${cid}/products/${productId}`,
        "Producto eliminado correctamente",
        `/carts/${cid}`
      );
    });
  });

  document.querySelector(".delete-cart").addEventListener("click", (event) => {
    const cartId = event.target.dataset.id;
    handleDeletion(
      `/api/carts/${cartId}`,
      "Carrito vaciado correctamente",
      `/carts/${cid}`
    );
  });
});

/*** Funciones Helpers Striper */

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

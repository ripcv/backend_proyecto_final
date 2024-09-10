async function handleDeletion(url, successMessage, redirectUrl) {
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Error al eliminar');
        }

       sweetAlert("top-end","success",successMessage,redirectUrl)

    } catch (error) {
        console.error('Error:', error);
    }
}

function sweetAlert(position,icon,successMessage,redirectUrl){
    Swal.fire({
        position: position,
        icon: icon,
        html: successMessage,
        showConfirmButton: false,
        timer: 2500
    }).then(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    });
}
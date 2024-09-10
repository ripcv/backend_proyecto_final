document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".delete-user").forEach((button) => {
    button.addEventListener("click", (event) => {
      const userId = event.target.dataset.id;
      handleDeletion(
        `/api/users/${userId}`,
        "Usuario eliminado correctamente",
        `/user`
      );
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.getElementById("userForm");

  if (userForm) {
    userForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const form = event.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      const url =
        data.role === "premium"
          ? `/api/users/premium/${userId}`
          : `/api/users/${userId}`;
      const method = "PUT";

      try {
        const response = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          sweetAlert("top-end", "error", result.message);
        } else {
          sweetAlert(
            "top-end",
            "success",
            "Usuario Actualizado Correctamente",
            "/users"
          );
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al realizar la operación");
      }
    });
  }
});

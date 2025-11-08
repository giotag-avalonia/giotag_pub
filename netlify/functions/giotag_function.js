
document.getElementById("scanBtn").addEventListener("click", async () => {
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = "Escaneando...";

    try {
        const response = await fetch("/.netlify/functions/trigger-workflow", {
            method: "POST"
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (data.success) {
            statusDiv.textContent = "Workflow activado correctamente!";
        } else {
            statusDiv.textContent = "Error al activar workflow.";
        }
    } catch (error) {
        console.error(error);
        statusDiv.textContent = "Error al conectar con el servidor.";
    }
});


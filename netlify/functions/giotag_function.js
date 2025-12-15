export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Método no permitido" };
    }

    const token = process.env.PRIV_TOKEN;
    if (!token) {
      return { statusCode: 500, body: "Falta la variable PRIV_TOKEN en Netlify." };
    }

    const { job, mes, anio } = JSON.parse(event.body);

    const workflowUrl = "https://api.github.com/repos/giotag-avalonia/giotag_priv/actions/workflows/giotag.yml/dispatches";

    // Prepara payload con inputs condicionales
    const inputs = { job };
    if (job === "4" || job === "5") {
      if (!mes || !anio) {
        return { statusCode: 400, body: JSON.stringify({ success: false, message: "Mes y año son requeridos para este job." }) };
      }
      inputs.mes = mes;
      inputs.anio = anio;
    }

    const payload = {
      ref: "main", // rama donde está tu workflow
      inputs
    };

    const wfRes = await fetch(workflowUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!wfRes.ok) {
      const text = await wfRes.text();
      throw new Error("Error al activar workflow: " + text);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Workflow activado correctamente." })
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ success: false, message: err.message }) };
  }
};

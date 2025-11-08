export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Método no permitido" };
    }

    const token = process.env.PRIV_TOKEN;
    if (!token) {
      return { statusCode: 500, body: "Falta la variable PRIV_TOKEN en Netlify." };
    }

    const workflowUrl = "https://api.github.com/repos/giotag-avalonia/giotag_priv/actions/workflows/giotag.yml/dispatches";

    const payload = {
      ref: "main" // rama del repo privado donde está tu workflow
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

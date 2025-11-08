const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    const response = await fetch(
      "https://api.github.com/repos/giotag-avalonia/giotag_priv/actions/workflows/giotag.yml/dispatches",
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": `token ${process.env.PRIV_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ref: "main" }) // rama del repo privado
      }
    );

    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};

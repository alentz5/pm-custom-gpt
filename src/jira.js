const axios = require("axios");

const jiraClient = axios.create({
  baseURL: `${process.env.ATLASSIAN_BASE_URL}/rest/api/3`,
  auth: {
    username: process.env.ATLASSIAN_EMAIL,
    password: process.env.ATLASSIAN_API_TOKEN
  },
  headers: {
    Accept: "application/json"
  }
});

async function getStyle(styleCode) {
  const jql = `project = SD AND customfield_11104 ~ "${styleCode}"`;

  const response = await jiraClient.get("/search", {
    params: {
      jql,
      maxResults: 5,
      fields: [
        "summary",
        "customfield_11104",
        "customfield_11105"
      ].join(",")
    }
  });

  return response.data.issues.map(issue => ({
    key: issue.key,
    style_code: issue.fields.customfield_11104,
    style_name: issue.fields.customfield_11105,
    summary: issue.fields.summary
  }));
}

module.exports = { getStyle };

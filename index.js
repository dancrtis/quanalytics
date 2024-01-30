/**
 * Middleware logger for NextJS analytics to quanalytics server
 *
 * @param {Object} config - object containing request, project, apiKey, config
 * @param {Request} config.request - page request
 * @param {string} config.project - quanalytics project name
 * @param {string} config.projectKey - quanalytics project key
 * @param {string} config.ignorePages - string of regex to ignore pages, default is 'api|_next'
 *
 * @returns {Promise<null>} - fires and forgets returning null
 */
async function quanalytics({
  request,
  project,
  projectKey = process.env.QUANALYTICS_KEY,
  ignorePages = 'api|_next',
}) {
  const page = request.url;
  const headers = Object.fromEntries(request.headers.entries());

  const ignorePrefetch = headers['next-router-prefetch'] || headers.purpose === 'prefetch';
  if (ignorePrefetch) {
    return;
  }

  const ignorePagesRegex = new RegExp(ignorePages);
  if (page.match(ignorePagesRegex)) {
    return;
  }

  await fetch('https://api.quanalytics.co/v1/analytics/perf', {
    method: 'POST',
    headers: {
      'x-api-key': projectKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project,
      headers,
      page,
    }),
  }).catch(() => {
    console.log('Error sending analytics');
  });
}

module.exports = { quanalytics };

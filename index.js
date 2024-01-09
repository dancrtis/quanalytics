/**
 * Middleware logger for NextJS analytics to quanalytics server
 *
 * @param {Object} config - object containing request, project, and apiKey
 * @param {Request} config.request - page request
 * @param {string} config.project - quanalytics project name
 * @param {string} config.apiKey - quanalytics api key
 *
 * @returns {Promise<null>} - fires and forgets returning null
 */
async function quanalytics({ request, project, apiKey }) {
  const page = request.url;
  const headers = Object.fromEntries(request.headers.entries());

  if (page.includes('/_next')) {
    return NextResponse.next();
  }

  await fetch('https://api.quanalytics.co/v1/analytics/perf', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
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

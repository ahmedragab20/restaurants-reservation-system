function getQueryParams(url) {
  if (!url) return {};

  const body = {};

  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    body[key] = value;
  });

  return body;
}

module.exports = {
  getQueryParams,
};

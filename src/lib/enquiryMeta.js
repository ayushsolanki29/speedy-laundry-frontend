export function parseEnquiryMessage(message) {
  const raw = typeof message === 'string' ? message : '';

  const extractLineValue = (key) => {
    const re = new RegExp(`(?:^|\\n)${key}:\\s*([^\\n\\r]+)`, 'i');
    const match = raw.match(re);
    return match ? match[1].trim() : '';
  };

  const address = extractLineValue('ADDRESS');
  const business = extractLineValue('BUSINESS');
  const industry = extractLineValue('INDUSTRY');

  let cleanedMessage = raw
    .replace(/(?:^|\n)(BUSINESS|ADDRESS|INDUSTRY):\s*[^\n\r]*/gi, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { address, business, industry, cleanedMessage };
}


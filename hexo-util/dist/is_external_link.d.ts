export = isExternalLink;
/**
 * Check whether the link is external
 * @param {String} input The url to check
 * @param {String} input The hostname / url of website
 * @param {Array} input Exclude hostnames. Specific subdomain is required when applicable, including www.
 * @returns {Boolean} True if the link doesn't have protocol or link has same host with config.url
 */
declare function isExternalLink(input: string, sitehost: any, exclude: any): boolean;
//# sourceMappingURL=is_external_link.d.ts.map
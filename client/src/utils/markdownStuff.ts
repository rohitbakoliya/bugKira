export const MENTION_REGEX = /(?:^|[^a-zA-Z0-9_!@#$%&*])(?:(?:@)(?!\/))([a-zA-Z0-9/_.]{1,40})(?:\b(?!@)|$)/gm;
export const REFERENCE_REGEX = /\B#(\d{1,10})(?:\b)/gm;

/**
 * @description get mentions and refs from markdown and make them links
 */
export const parseRefsAndMentions = (markdown: string): string => {
  return markdown
    ?.replace(MENTION_REGEX, ` [@$1](/profiles/$1) `)
    .replace(REFERENCE_REGEX, ` [#$1](/dashboard/bugs/$1) `);
};

/**
 * @description safe decode entities
 */
export const htmlDecode = (input: string): string => {
  if (typeof input !== 'string') return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;
  return textarea.value;
};

/**
 * decode html entities | parse refs & mentions
 * @param markdown string
 */
export const renderMarkdown = (markdown: string): string =>
  htmlDecode(parseRefsAndMentions(markdown));

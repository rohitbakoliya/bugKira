export * from './markdownStuff';

export const formatDate = (date: string): string =>
  new Date(date).toDateString().slice(4, 10).toLowerCase();

// https://github.com/withspectrum/spectrum/blob/alpha/admin/src/helpers/utils.js
export const timeAgo = (time: any): string | number => {
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * 1000;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  const MS_PER_YEAR = MS_PER_DAY * 365;

  let current: any = new Date();
  let previous: any = new Date(time);
  let elapsed = current - previous;

  if (elapsed < MS_PER_MINUTE) {
    return Math.round(elapsed / MS_PER_SECOND) + 's ago';
  } else if (elapsed < MS_PER_HOUR) {
    return Math.round(elapsed / MS_PER_MINUTE) + 'm ago';
  } else if (elapsed < MS_PER_DAY) {
    return Math.round(elapsed / MS_PER_HOUR) + 'h ago';
  } else if (elapsed < MS_PER_YEAR) {
    return Math.round(elapsed / MS_PER_DAY) + 'd ago';
  } else {
    return Math.round(elapsed / MS_PER_YEAR) + 'y ago';
  }
};

export const copyToClipboard = (str: string) => {
  let el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const deepClone = (data: any) => JSON.parse(JSON.stringify(data));

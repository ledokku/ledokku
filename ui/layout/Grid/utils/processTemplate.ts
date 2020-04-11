import { GridTemplate } from '../components/Grid';

/**
 * Transforms grid template array to CSS template property string
 *
 * Example:
 *
 * Input: [1, '240px', 2, 'auto']
 * Output: "1fr 240px 2fr auto"
 */
export const processTemplate = (template: GridTemplate) => {
  if (typeof template === 'string') {
    return template;
  } else {
    return template
      .map((item) => (typeof item === 'number' ? `${item}fr` : item))
      .join(' ');
  }
};

import { ResponsiveProperty } from '../../../utils/responsive';
import { GridTemplate } from '../components/Grid';
import { processTemplate } from './processTemplate';

export const processResponsiveTemplate = (
  template?: ResponsiveProperty<GridTemplate>
): ResponsiveProperty<string> | undefined => {
  if (!template) {
    return undefined;
  } else if (Array.isArray(template)) {
    return processTemplate(template);
  } else {
    if (typeof template === 'string') {
      return template;
    } else {
      const keys = Object.keys(template);
      const generatedTemplate: ResponsiveProperty<string> = {};

      keys.forEach((key) => {
        generatedTemplate[key] = processTemplate(template[key] as GridTemplate);
      });

      return generatedTemplate;
    }
  }
};

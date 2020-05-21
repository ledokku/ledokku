import * as yup from 'yup';

// Digital ocean token format = exactly 64 chars, lowercase letters & numbers
export const digitalOceanAccessTokenRegExp = /^[a-z0-9]{64}/;

// Validate the name to make sure there are no security risks by adding it to the ssh exec command.
// Only letters and "-" allowed
// TODO unit test this schema
export const appNameSchema = yup.object({
  name: yup
    .string()
    .required()
    .matches(/^[a-z0-9-]+$/),
});

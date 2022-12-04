import type * as Yup from "yup";
const getSubmitFnFromYupSchema = <Schema extends Yup.ObjectSchema<Record<string, any>>>(_: Schema, callback: (values: Yup.InferType<Schema>) => void) => {
  return (values: Record<string, any>) => {
    return callback(values);
  };
};

export default getSubmitFnFromYupSchema;

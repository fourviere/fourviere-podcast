import { FieldProps } from "formik";
import ErrorAlert from "../../alerts/error";

const Boolean: React.ComponentType<
  FieldProps & { label: string; touched: boolean }
> = ({ field, form: { errors }, label, touched, ...props }) => (
  <>
    <label className="inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        {...field}
        {...props}
        className="peer sr-only"
        checked={!!field.value}
      />
      <div className="peer relative h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rtl:peer-checked:after:-translate-x-full "></div>
      <span className="mb-1 ml-2 grow text-xs font-semibold capitalize">
        {label}
      </span>
    </label>

    {errors?.[field.name] && touched && (
      <ErrorAlert message={[errors[field.name]].join(". ")}></ErrorAlert>
    )}
  </>
);
export default Boolean;

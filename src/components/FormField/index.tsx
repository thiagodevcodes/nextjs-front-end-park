import { Controller } from "react-hook-form";
import { Input } from "../ui/input";

const FormField: React.FC<{ name: string; control: any; placeholder: string; type?: string, value?: string }> = ({ name, control, placeholder, type = "text", value }) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            defaultValue={value}
          />
        </>
      )}
    />
);

export default FormField;
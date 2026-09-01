const TextField = ({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className,
  min,
  value,
  placeholder,
}) => {
  const hasError = errors[id]?.message;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={id}
        className={`${className ? className : ""} text-sm font-medium text-textMain`}
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 border bg-white text-textMain rounded-lg transition-colors duration-200 placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-offset-1 ${
          hasError 
            ? "border-error focus:ring-error/20 focus:border-error" 
            : "border-borderColor focus:ring-accent/20 focus:border-accent hover:border-slate-300"
        } ${className ? className : ""}`}
        {...register(id, {
          required: { value: required, message },
          minLength: min
            ? { value: min, message: "Minimum 6 characters required" }
            : null,
          pattern:
            type === "email"
              ? {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email",
                }
              : type === "url"
              ? {
                  value:
                    /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                  message: "Please enter a valid URL",
                }
              : null,
        })}
      />

      {hasError && (
        <p className="text-sm font-medium text-error mt-1 flex items-center gap-1">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default TextField;

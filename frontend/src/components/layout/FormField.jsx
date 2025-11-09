import React, { useState, useRef, useEffect } from "react";
import { useController, useWatch } from "react-hook-form";
import { X, Eye, EyeOff } from "lucide-react";

export const FormField = ({
  name,
  control,
  type = "input",
  placeholder,
  options = [],
  className = "",
  disabled = false,
  iconLeft: IconLeft,
  iconRight: IconRight,
  error: errorProp,
}) => {
  const {
    field,
    fieldState: { error, isDirty, isTouched },
  } = useController({ name, control });

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);

  const isTextArea = type === "textarea";
  const isSelect = type === "select";
  const isSearchable = type === "searchable-select";
  const isPassword = type === "password";

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  let hasError = !!(error || errorProp);
  let errorMessage = errorProp?.message || error?.message || "";

  if (
    name === "confirmPassword" &&
    confirmPassword &&
    password !== confirmPassword
  ) {
    hasError = true;
    errorMessage = "As senhas não conferem";
  }
  const showSuccess = !hasError && (isDirty || isTouched) && field.value;
  const baseClass = isTextArea
    ? "textarea textarea-bordered w-full"
    : isSelect || isSearchable
    ? "select select-bordered w-full"
    : "input input-bordered w-full";

  const stateClass = isTextArea
    ? hasError
      ? "textarea-error"
      : showSuccess
      ? "textarea-success"
      : ""
    : isSelect || isSearchable
    ? hasError
      ? "select-error"
      : showSuccess
      ? "select-success"
      : ""
    : hasError
    ? "input-error"
    : showSuccess
    ? "input-success"
    : "";

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (field.value) {
      const selected = options.find((o) => o.value === field.value);
      setSearchText(selected?.label || "");
    } else {
      setSearchText("");
    }
  }, [field.value, options]);

  const leftPadding = IconLeft ? "pl-10" : "";
  const rightPadding = IconRight || isPassword || isSearchable ? "pr-10" : "";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Ícone à esquerda */}
      {IconLeft && (
        <div className="absolute left-3 top-3 z-10 pointer-events-none">
          <IconLeft className="h-5 w-5 text-base-content/60" />
        </div>
      )}

      {/* --- TEXTAREA --- */}
      {isTextArea ? (
        <textarea
          placeholder={placeholder}
          className={`${baseClass} ${stateClass} ${IconLeft ? "pl-10" : ""} ${
            IconRight || isPassword || isSearchable ? "pr-10" : ""
          }`}
          {...field}
          disabled={disabled}
        />
      ) : /* --- SEARCHABLE SELECT --- */
      isSearchable ? (
        <div className="relative w-full">
          <input
            type="text"
            placeholder={placeholder}
            className={`${baseClass} ${stateClass} ${leftPadding} ${rightPadding}`}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setIsOpen(true);
            }}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          />

          {!disabled && isOpen && (
            <ul className="absolute left-0 mt-1 z-50 w-full max-h-60 overflow-auto border border-base-300 rounded-md bg-base-100 shadow-lg scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100">
              {options.filter((opt) =>
                opt.label.toLowerCase().includes(searchText.toLowerCase())
              ).length > 0 ? (
                options
                  .filter((opt) =>
                    opt.label.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((opt) => (
                    <li
                      key={opt.value}
                      className="p-2 cursor-pointer hover:bg-base-200 transition-colors flex justify-between items-center"
                      onClick={() => {
                        field.onChange(opt.value);
                        setSearchText(opt.label);
                        setIsOpen(false);
                      }}
                    >
                      <span className="flex-1">{opt.label}</span>
                      {field.value === opt.value && (
                        <button
                          type="button"
                          className="ml-2 btn btn-sm btn-ghost btn-square"
                          onClick={(e) => {
                            e.stopPropagation();
                            field.onChange("");
                            setSearchText("");
                            setIsOpen(true);
                          }}
                          aria-label="Deselecionar opção"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </li>
                  ))
              ) : (
                <li className="p-2 text-gray-500 italic">Nenhuma opção</li>
              )}
            </ul>
          )}
        </div>
      ) : /* --- SELECT --- */
      isSelect ? (
        <select
          className={`${baseClass} ${stateClass} ${leftPadding} ${rightPadding}`}
          {...field}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : /* --- PASSWORD --- */
      isPassword ? (
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={`${baseClass} ${stateClass} ${
              IconLeft ? "pl-10" : ""
            } pr-10`}
            {...field}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-3 text-base-content/70 hover:text-base-content z-10 cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      ) : (
        /* --- INPUT PADRÃO --- */
        <input
          type={type}
          placeholder={placeholder}
          className={`${baseClass} ${stateClass} ${IconLeft ? "pl-10" : ""} ${
            IconRight ? "pr-10" : ""
          }`}
          {...field}
          disabled={disabled}
        />
      )}

      {/* Ícone à direita (se não for senha) */}
      {IconRight && !isPassword && (
        <div className="absolute right-3 top-3 z-10 pointer-events-none">
          <IconRight className="h-5 w-5 text-base-content/60" />
        </div>
      )}

      {/* Mensagem de erro */}
      {hasError && <p className="text-error text-xs mt-1">{errorMessage}</p>}
    </div>
  );
};

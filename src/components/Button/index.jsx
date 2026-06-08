import "./button.style.css";

export function Button({ children, className = "", ...rest }) {
  return (
    <button className={`button ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}

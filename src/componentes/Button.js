import { Button as BootstrapButton } from "react-bootstrap";

function Button({ disabled, onClick, children, className = "" }) {
  return (
    <BootstrapButton
      className={`btn-custom ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </BootstrapButton>
  );
}

export default Button;
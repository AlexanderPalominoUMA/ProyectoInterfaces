import { Button } from "react-bootstrap";

function CustomButton({ disabled, href, onClick, children, className = "" }) {
  return (
    <Button
      className={`btn-custom ${className}`}
      href={href}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default CustomButton;

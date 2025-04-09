function Button({ disabled, onClick, children, className = "" }) {
  return (
    <button className={`btn btn-custom ${className}`} onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
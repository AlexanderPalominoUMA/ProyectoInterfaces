function Button({ onClick, children }) {
    return (
      <button className="btn btn-custom" onClick={onClick}>
        {children}
      </button>
    );
  }
  
  export default Button;
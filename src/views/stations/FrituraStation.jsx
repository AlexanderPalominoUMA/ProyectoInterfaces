function FrituraStation() {
  return (
    <div
      style={{
        backgroundImage: "url('/images/estacion.png')", // Ruta de la imagen de fondo
        backgroundSize: "cover", // Ajusta la imagen para que quepa completamente sin zoom
        backgroundPosition: "center", // Centra la imagen
        backgroundRepeat: "no-repeat", // Evita la repetición y el reflejo de la imagen
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1, // Fondo debajo de todo el contenido
      }}
    ></div>
    );
}

export default FrituraStation;

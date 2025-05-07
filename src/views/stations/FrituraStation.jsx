import "../../styles/FrituraStyle.css";

const fases = ["idle","aceite","usando","listo"];
const cajas = [1,2];


function FrituraStation() {
  const renderCroquetas = () =>{
    
  }
  const renderCajas = () =>
    cajas.map((fase, index) => (
      <div
        key={fase}
        className="caja-wrapper"
        style={{ left: `${index * 25}%`}}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          /*const id = parseInt(e.dataTransfer.getData("id"));
          const croqueta = croquetas.find((c) => c.id === id);
          if (croqueta && croqueta.fase === index) {
            avanzarFase(id);
          }*/
        }}
      >
        <img
          src="/images/freidoraIdle.png"
          alt="caja fritura"
          className="caja-fritura-imagen"
        />
        
      </div>
    ));
  return (
    <div className="fritura-station">
      <div className="croquetas">{renderCroquetas()}</div>
      <div className="freidoras">
        {renderCajas()}
      </div>
    </div>
    );
}

export default FrituraStation;

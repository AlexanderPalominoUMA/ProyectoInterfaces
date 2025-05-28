import { Form, Modal } from 'react-bootstrap';
import { useSound } from '../../providers/SoundProvider';

function SettingsModal({ show, close }) {
  const { music, setMusic, effects, setEffects, playEffectByName } = useSound();

  return (
    <Modal centered show={show} onHide={() => { close(); playEffectByName("click"); }}>
      <Modal.Header closeButton>
        <Modal.Title>Ajustes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Volumen de efectos: {effects}%</Form.Label>
          <Form.Range
            min="0"
            max="100"
            value={effects}
            onChange={(e) => setEffects(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Volumen de música: {music}%</Form.Label>
          <Form.Range
            min="0"
            max="100"
            value={music}
            onChange={(e) => setMusic(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
    </Modal>
  )
}

export default SettingsModal

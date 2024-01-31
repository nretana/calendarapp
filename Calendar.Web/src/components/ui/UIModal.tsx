
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

interface ModalProps {
    isShow: boolean
}

const UIModal = () =>{
    return(
        <Modal>
            <Modal.Header>
                <Modal.Title></Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary'>Cancel</Button>
                <Button variant='primary'>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UIModal;
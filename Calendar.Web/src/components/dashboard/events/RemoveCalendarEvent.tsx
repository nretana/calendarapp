import React, { useState } from 'react';

import { useAppDispatch } from '@store/storeHooks';
import { weeklyCalendarBoardActions } from '@store/slices/weeklyCalendarBoardSlice';
import { useRemoveEventMutation } from '@store/services/events/eventApi';

import { Button, Modal } from 'react-bootstrap';

interface RemoveEventProps  {
    eventId: string,
    isShow: boolean,
    onClose: (value: boolean) => void
}

const RemoveCalendarEvent: React.FC<RemoveEventProps> = ({ eventId, isShow, onClose }) => {

    const dispatch = useAppDispatch();
    const [removeEvent, removeEventResult] = useRemoveEventMutation();
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const onRemoveEventHandler = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);
        await removeEvent(eventId).unwrap().then(() => {
                                                dispatch(weeklyCalendarBoardActions.removeEvent(eventId));
                                           })
                                           .catch(error => { 
                                                throw error; 
                                            })
                                           .finally(() => setIsLoading(false));
    }

    const onCancelEventHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onClose(false);
    }

    const onClickBackdropHandler = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
    } 

    return(
        <div className='modal-wrapper' onClick={onClickBackdropHandler}>
            <Modal show={isShow} backdrop="static">
                <Modal.Header className='border-0'>
                    <h3>Delete Event</h3>
                    <hr></hr>
                </Modal.Header>
                <Modal.Body className='py-0'>
                    Are you sure you want to delete this event? All content will be permanently destroyed.
                </Modal.Body>
                <Modal.Footer className='border-0'>
                    <Button variant='link' onClick={onCancelEventHandler}>Cancel</Button>
                    <Button variant='danger' onClick={onRemoveEventHandler} disabled={isLoading}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default RemoveCalendarEvent;
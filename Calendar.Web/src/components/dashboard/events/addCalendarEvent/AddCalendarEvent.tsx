import React, { useState } from 'react';
import { Time } from '@internationalized/date';
import { format, parse, setDate } from 'date-fns';

import { FieldError, Input, Label, TextArea, TextField } from 'react-aria-components';
import { Alert, Button, Form } from 'react-bootstrap';
import ColorPicker from '@components/ui/ColorPicker';
import TimeField from '@components/core/TimeField';

import { useAppDispatch, useAppSelector } from '@store/storeHooks';
import { weeklyCalendarBoardActions } from '@store/slices/weeklyCalendarBoardSlice';
import { eventApi, useAddEventMutation, useUpdateEventMutation } from '@store/services/events/eventApi';

import { dateConfig } from '@config/date-config';
import { CurrentDateTime, Event, EventCommand, EventPosition } from '@custom-types/calendar-types';
import { colorList } from '@custom-types/constants';
import { getTimeObject, isAvailableTime, isValidTimeRange } from '@utils/calendar-utils';

import calendarIcon from '@assets/imgs/calendar-week.svg';

import './AddCalendarEvent.scss';

type AddEventProps = {
    currentDateTime: CurrentDateTime,
    currentEventPosition: EventPosition,
    currentEvent: Event | null | undefined,
    onClose: (value : boolean) => void
}

const AddCalendarEvent: React.FC<AddEventProps> = ({ currentDateTime, currentEventPosition, currentEvent, onClose }) => {

    const isUpdateEvent = currentEvent !== undefined && currentEvent !== null;
    const titleProps = isUpdateEvent ? currentEvent.title : '';
    const startTime = getTimeObject(currentEvent?.startTime, currentDateTime.hour, currentDateTime.minute);
    const endTime = getTimeObject(currentEvent?.endTime, currentDateTime.hour + 1, 0);
    const notesProps = isUpdateEvent ? (currentEvent?.notes ?? '') : '';
    const colorProps = isUpdateEvent ? currentEvent.color : colorList[0];

    const dispatch = useAppDispatch();
    const selectedDate = useAppSelector(state => state?.calendarPicker?.selectedDate);
    const currentDate = setDate(parse(selectedDate, dateConfig.isoDateFormat, new Date()), currentDateTime.day);
    const currentDateFormatted = format(currentDate, dateConfig.longDateFormat);
    const weeklyEventList = useAppSelector(state => state.weeklyCalendarBoard.eventList);

    const [addEvent, addEventResult] = useAddEventMutation();
    const [updateEvent, updateEventResult] = useUpdateEventMutation();

    const [title, setTitle] = useState<string>(titleProps);
    const [notes, setNote] = useState<string>(notesProps);
    const [fromTime, setFromTime] = useState<Time>(startTime);
    const [toTime, setToTime] = useState<Time>(endTime);
    const [color, setColor] = useState<string>(colorProps);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [validatedForm, setIsValidatedForm] = useState<boolean>(false);

    const isInvalidIntervalFromTime = (fromTime?.minute % 15 !== 0);
    const isInvalidIntervalToTime = (toTime?.minute % 15 !== 0);

    const isValidTime = isValidTimeRange(fromTime, toTime);
    const isValidTimeInCalendar = (fromTime.toString() !== startTime.toString()
                                   && toTime.toString() !== endTime.toString()
                                   && isValidTime) ? isAvailableTime(currentDate, fromTime, toTime, weeklyEventList) : true;
    const isInvalidForm = (isInvalidIntervalFromTime || isInvalidIntervalToTime || !isValidTime || !isValidTimeInCalendar);


    const SubmitAddEventFn = () => {

        dispatch(weeklyCalendarBoardActions.loadingStateBoard(true));
        const newEvent: EventCommand = { 
                           title,
                           notes,
                           color,
                           startTime: fromTime.toString(),
                           endTime: toTime.toString(), 
                           eventDate: currentDate.toUTCString()
        }

        addEvent(newEvent).unwrap().then(event => {
                                        dispatch(weeklyCalendarBoardActions.addEvent({ eventPosition: currentEventPosition, event }));
                                        setErrorMessage('');
                                        onClose(false);
                                    }).catch(error => {
                                        setErrorMessage(error.errorMessage);
                                        //throw error;
                                    }).finally(() => {
                                        dispatch(weeklyCalendarBoardActions.loadingStateBoard(false));
                                    });
    }

    const SubmitUpdateEventFn = () => {
        const currentEventId = currentEvent?.eventId;
        if (typeof currentEventId !== 'string') {
            throw new Error('Invalid event id');
        }

        const updatevent: EventCommand = {
                            title,
                            startTime: fromTime.toString(),
                            endTime: toTime.toString(),
                            notes,
                            color,
                            eventDate: currentDate.toUTCString()
        }

        dispatch(weeklyCalendarBoardActions.loadingStateBoard(true));
        updateEvent({ eventId: currentEventId, body: updatevent }).unwrap()
                                                            .then(async() => {
                                                                const event = await dispatch(eventApi.endpoints.getEvent.initiate(currentEventId, { forceRefetch: true })).unwrap();
                                                                dispatch(weeklyCalendarBoardActions.updateEvent({ eventPosition: currentEventPosition, event }));
                                                                setErrorMessage('');
                                                                onClose(false);
                                                            })
                                                            .catch((error) => {
                                                                setErrorMessage(error.errorMessage);
                                                                //throw error;
                                                            }).finally(() => {
                                                                dispatch(weeklyCalendarBoardActions.loadingStateBoard(false));
                                                            });
    }

    const onChangeFromTimeHandler = (value: Time) => value === null? setFromTime(new Time(0, 0))  : setFromTime(value);

    const onChangeToTimeHandler = (value: Time) => value === null? setToTime(new Time(0, 0))  : setToTime(value);

    const onSubmitFormHandler: React.FormEventHandler = (e: React.FormEvent<HTMLFormElement>) : void => {
        e.preventDefault();

        const form = e.currentTarget;
        if(!form.checkValidity() || isInvalidForm){
            e.stopPropagation();
            setIsValidatedForm(true);
            return;
        }

        isUpdateEvent ? SubmitUpdateEventFn() : SubmitAddEventFn();
    }

    return(<div className='form-content'>
                <h2>{isUpdateEvent ? 'Edit Event' : 'Create Event'}</h2>
                <div className='mt-3 d-flex align-items-center'>
                    <img className='img-fluid' src={calendarIcon} alt='' width={25} height={25} />
                    <span className='fs-5 ms-2'>{currentDateFormatted}</span>
                </div>
                {(addEventResult.error || updateEventResult.error) && 
                    <Alert variant='danger' className='mt-3'>
                        <p className='mb-0'>{errorMessage}</p>
                    </Alert>}
                <Form className='pt-2' noValidate validated={validatedForm} onSubmit={onSubmitFormHandler}>
                    <Form.Group className='mb-3'>
                        <TextField name='title' type='text' 
                                                value={title} 
                                                onChange={setTitle} 
                                                isRequired autoFocus>
                            <Label className='form-label'>Title</Label>
                            <Input className='form-control' />
                            <FieldError className='invalid-feedback d-block'>Enter a valid title</FieldError>
                        </TextField>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <fieldset>
                            <legend className='form-label' aria-hidden='true'>Time</legend>
                            <div className='row'>
                                <div className='col pe-0'>
                                    <TimeField hourCycle={24} 
                                            value={fromTime} 
                                            onChange={(value) => onChangeFromTimeHandler(value)}
                                            aria-label='select start time'
                                            aria-describedby='InvalidTimeRange InvalidIntervalTime'
                                            isRequired 
                                            isInvalid={!isValidTime || isInvalidIntervalFromTime || !isValidTimeInCalendar}
                                            validationBehavior='native'/>
                                </div>
                                <div className='col'>
                                    <TimeField hourCycle={24} 
                                            value={toTime} 
                                            onChange={(value) => onChangeToTimeHandler(value)} 
                                            aria-label='select end time'
                                            aria-describedby='InvalidIntervalTime'
                                            isRequired
                                            isInvalid={isInvalidIntervalToTime || !isValidTimeInCalendar}
                                            validationBehavior='native' />
                                </div>
                            </div>
                            { (isInvalidIntervalFromTime || 
                               isInvalidIntervalToTime) && <span className='invalid-feedback' id='InvalidIntervalTime' style={{ display: 'block' }}>
                                                             Event time should be every 15 minutes.
                                                           </span> }
                            { !isValidTime && <span className='invalid-feedback' id='InvalidTimeRange' style={{ display: 'block' }}>
                                                Time range is not correct
                                              </span> }
                           { !isValidTimeInCalendar && <span className='invalid-feedback' id='InvalidTimeOverlap' style={{ display: 'block' }}>
                                                Time range is not available in the calendar
                                              </span> }
                        </fieldset>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <fieldset>
                            <legend className='form-label' aria-hidden='true'>Color</legend>
                            <ColorPicker colors={colorList}
                                        color={color}
                                        id='EventColor'
                                        setColor={setColor} />
                        </fieldset>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Label htmlFor='EventDescription' className='form-label'>Additional Notes</Label>
                        <TextArea id='EventDescription' className='form-control' style={{ resize: 'none' }}
                                                           rows={3}
                                                           value={notes} 
                                                           onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)} />
                    </Form.Group>
                    <div className='float-end'>
                        <Button variant='link' className='me-1' onClick={() => onClose(false)}>Cancel</Button>
                        <Button type="submit" variant='dark'>Save</Button>
                    </div>
                </Form>
            </div>)
}

export default AddCalendarEvent;
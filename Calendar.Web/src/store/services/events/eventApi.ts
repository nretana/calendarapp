import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Event, EventCommand } from '@custom-types/calendar-types';
//import { ApiResponse } from '../api-types';
import { getPatchDocument } from '@utils/api-utils';

/*interface EventRequest {
    title: string,
    notes: string,
    color: string,
    eventDate: string,
    createdDate: string,
    modifiedDate: string
}

interface EventResponse {
    eventId: string,
    title: string,
    notes: string,
    color: string,
    eventDate: string,
    createdDate: string,
    modifiedDate: string
}*/

//<ApiResponse<EventResponse>, {selectedDate: (string | undefined)}>
//{ data: Array<EventResponse>}

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_CALENDAR_API_URL}`,
                                prepareHeaders: (headers, {getState}) => {
                                    headers.set('Content-Type', 'application/json');
                                    headers.set('Accept', 'application/json');
                                    return headers;  
                                }
                             }),
    endpoints: (builder) => ({
        getEvents: builder.query<Event[], { selectedDate?: string, startDate?: string, endDate?: string }>({
            query: (params) => {

                /*const queryParams  = {
                    ...((selectedDate !== null || selectedDate.length.trim()) && { selectedDate } ),
                    ...((startDate !== null || startDate.length.trim()) && { startDate } ),
                    ...((endDate !== null || endDate.length.trim()) && { endDate }),
                }*/

                return ({ url: '/events',
                          method: 'GET',
                          params
                          //...(queryParams.length > 0 && { params: queryParams })
                        })
            },
            transformResponse: (response: Event[], meta, args) => {
                if (!Array.isArray(response)) {
                    throw new Error('Invalid response format');
                }
                return response;
            },
            transformErrorResponse: (response, meta, args) => {
                //console.log('ERROR', response);
                return response;
            }
        }),
        getEvent: builder.query<Event, string>({
            query: (eventId) => {
                return ({ url: `/events/${eventId}`,
                          method: 'GET'
                        })
            },
            transformResponse: (response: Event, meta, args) => {
                return response;
            }
        }),
        addEvent: builder.mutation<Event, EventCommand>({
            query: (body) => ({
                url: '/events',
                method: 'POST',
                body: JSON.stringify(body)
            })
        }),
        updateEvent: builder.mutation<unknown, { eventId: string, body: EventCommand }>({
            query: ({ eventId, body}) => {
                return ({
                url: `/events/${eventId}`,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json-patch+json'
                },
                body: getPatchDocument(body, 'replace') })
            }
        }),
        removeEvent: builder.mutation<unknown, string>({
            query: (eventId) => ({
                url: `/events/${eventId}`,
                method: 'DELETE',
            })
        })
    })
})

export const { useGetEventsQuery,
               useGetEventQuery, 
               useAddEventMutation, 
               useUpdateEventMutation, 
               useRemoveEventMutation } = eventApi;
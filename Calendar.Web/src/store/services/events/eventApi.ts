import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Event, EventCommand } from '@custom-types/calendar-types';
import { getPatchDocument, statusCodeErrorMessage } from '@utils/api-utils';

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

                return ({ url: '/events',
                          method: 'GET',
                          params
                        })
            },
            transformResponse: (response: Event[], meta, args) => {
                if (!Array.isArray(response)) {
                    throw new Error('Invalid response format');
                }
                return response;
            }
        }),
        getEvent: builder.query<Event, string>({
            query: (eventId) => {
                return ({ url: `/events/${eventId}`,
                          method: 'GET'
                        })
            },
            transformResponse: (response: Event, meta, args) => response
        }),
        addEvent: builder.mutation<Event, EventCommand>({
            query: (body) => ({
                url: '/events',
                method: 'POST',
                body: JSON.stringify(body)
            }),
            transformErrorResponse: response => {
                const errorMessage = statusCodeErrorMessage(response.status);
                return { errorMessage }
            }
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
            },
            transformErrorResponse: response => {
                const errorMessage = statusCodeErrorMessage(response.status);
                return { errorMessage }
            }
        }),
        removeEvent: builder.mutation<unknown, string>({
            query: (eventId) => ({
                url: `/events/${eventId}`,
                method: 'DELETE',
            }),
            transformErrorResponse: response => {
                const errorMessage = statusCodeErrorMessage(response.status);
                return { errorMessage }
            }
        })
    })
})

export const { useGetEventsQuery,
               useGetEventQuery, 
               useAddEventMutation, 
               useUpdateEventMutation, 
               useRemoveEventMutation } = eventApi;
import { DateConfig } from '@custom-types/ui-types'

export const dateConfig : DateConfig = {
    isoDateFormat: 'yyyy-MM-dd',
    longDateFormat: 'EEEE, LLLL dd',
    dateTimeOffSetFormat: "yyyy-MM-dd\'T\'HH:mm:ssXXX",
    locale: 'en-us',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
}
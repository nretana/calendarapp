import React from 'react';
import { WeekDay } from '@custom-types/calendar-types';
import { format, parse, setDate } from 'date-fns';
import { dateConfig } from '@config/date-config';

type WebAccessibilityElementType = {
  HtmlElementSelected: HTMLLIElement | null;
  HtmlElementToSelect: HTMLLIElement | null;
};

export const getDateTimeLabel = (rowIndex: number, colIndex: number, selectedWeekList: WeekDay[]): string => {

    const currentHour = Math.floor((rowIndex) / 4);
    const currentMinutes = ((rowIndex % 4) * 15);
    const current = selectedWeekList[colIndex];

    const currentDate = setDate(parse(current.date, dateConfig.isoDateFormat, new Date()), current.day);
    var currentDateTime = currentDate.setHours(currentHour, currentMinutes);
    const currentDateTimeFormatted = format(currentDateTime, dateConfig.longDateTimeFormat);

    return currentDateTimeFormatted;
}

export const setKeyboardAccessibility = (webAccessibilityElement: WebAccessibilityElementType) => {
    if (webAccessibilityElement.HtmlElementSelected !== null) {
        webAccessibilityElement.HtmlElementSelected.tabIndex = -1;
        webAccessibilityElement.HtmlElementSelected.removeAttribute('aria-selected');

        var newItem = webAccessibilityElement.HtmlElementToSelect;
        if (newItem !== null) {
            newItem.tabIndex = 0;
            newItem.setAttribute('aria-selected', 'true');
            newItem.focus();
        }
    }
};

export const findClosestHtmlElement = (htmlCollection: HTMLCollection, 
                                       currentElem: HTMLLIElement, 
                                       currentIndex: number) : HTMLLIElement => {
    var element = currentElem;
    var ci = currentIndex;
    while(element.classList.contains('hide')){ 
        element = htmlCollection[ci] as HTMLLIElement;
        ci = ci - 7;
    }

    return element;
}

export const eventBoardAccessibility = (eventKey: string,
                                        currentTarget: HTMLLIElement,
                                        refEventGrid: React.MutableRefObject<HTMLOListElement | null>) => {
  
    const dataRow = currentTarget.getAttribute('data-row');
    const dataCol = currentTarget.getAttribute('data-col');
    const dataEvent = currentTarget.getAttribute('data-has-event');
    const row = dataRow !== null ? parseInt(dataRow) : 0;
    const col = dataCol !== null ? parseInt(dataCol) : 0;
    const hasEvent = (dataEvent !== null && dataEvent === 'true') ?? false;
    const eventGrid = refEventGrid.current;

    if (eventGrid === null) {
        throw new Error('Null reference for event grid');
    }

    const currentItemSelected = eventGrid.children[row * 7 + col] as HTMLLIElement;
    const maxLength = eventGrid.children.length;

    switch (eventKey) {
        case 'ArrowUp':
            var newRow = row > 0 ? (row - 1) * 7 : row;
            var gridRowEnd = Number(currentItemSelected.style.gridRowEnd);
            var gridRowStart = Number(currentItemSelected.style.gridRowStart);
            const nextElementPosition = newRow + col;
            const nextElement = eventGrid.children[nextElementPosition] as HTMLLIElement;
            var ElemToSelect = findClosestHtmlElement(eventGrid.children, nextElement, nextElementPosition);

            const moveToUpElement: WebAccessibilityElementType = {
                HtmlElementSelected: currentItemSelected,
                HtmlElementToSelect: ElemToSelect
            };
            setKeyboardAccessibility(moveToUpElement);
        break;
        case 'ArrowDown':
            var newRow = row < maxLength - 1 ? (row + 1) * 7 : row;
            var gridRowEnd = Number(currentItemSelected.style.gridRowEnd);
            var gridRowStart = Number(currentItemSelected.style.gridRowStart);
            var sumEventRows = hasEvent ? (((gridRowEnd - gridRowStart) - 1) * 7) : 0;

            newRow = newRow + sumEventRows;
            const moveToDownElement: WebAccessibilityElementType = {
                HtmlElementSelected: currentItemSelected,
                HtmlElementToSelect: eventGrid.children[newRow + col] as HTMLLIElement,
            };
            setKeyboardAccessibility(moveToDownElement);
        break;
        case 'ArrowLeft':
            var newCol = row > 0 || col > 0 ? col - 1 : col;
            const moveToLeftElement: WebAccessibilityElementType = {
                HtmlElementSelected: currentItemSelected,
                HtmlElementToSelect: eventGrid.children[row * 7 + newCol] as HTMLLIElement,
            };
            setKeyboardAccessibility(moveToLeftElement);
        break;
        case 'ArrowRight':
            var newCol = col + 1 < maxLength - 1 ? col + 1 : col;
            const moveToRightElement: WebAccessibilityElementType = {
                HtmlElementSelected: currentItemSelected,
                HtmlElementToSelect: eventGrid.children[row * 7 + newCol] as HTMLLIElement,
            };
            setKeyboardAccessibility(moveToRightElement);
        break;
        case 'Enter':
            if (currentItemSelected !== null) {
                currentItemSelected.click();
            }
        break;
    }
};

export const resetBoardAccessibility = (refEventGrid: React.MutableRefObject<HTMLOListElement | null>) => {
  
    if (refEventGrid.current === null) {
        throw new Error('Null reference for event board list');
    }

    var htmlCollection = Array.from(refEventGrid.current.children);
    htmlCollection.forEach((htmlItem) => {
        var currentHtmlElement = htmlItem as HTMLLIElement;
        if (currentHtmlElement !== null) {
            currentHtmlElement.removeAttribute('aria-selected');
            currentHtmlElement.tabIndex = -1;
        }
    });
};

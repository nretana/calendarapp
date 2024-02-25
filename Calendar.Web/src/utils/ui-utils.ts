import React from 'react';
import { WeekDay } from '@custom-types/calendar-types';
import { allowedKeyboardKeys } from '@custom-types/constants';
import { format, parse, setDate } from 'date-fns';
import { dateConfig } from '@config/date-config';


type WebAccessibilityElementType = {
  HtmlElementSelected: HTMLDivElement | null;
  HtmlElementToSelect: HTMLDivElement | null;
};

type ArrowType = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';

//calculate the operation to perform based on arrow key
const calculateIndex = (direction: ArrowType, currentIndex: number): number => {

    switch(direction){
        case 'ArrowUp':
            return currentIndex - 7;
        case 'ArrowLeft':
            return currentIndex - 1;
        case 'ArrowRight':
            return currentIndex + 1;
        default:
            throw new Error('Invalid operation');    
    }
}

//get time label to be used in aria-label attribute of a grid cell
export const getDateTimeLabel = (rowIndex: number, colIndex: number, selectedWeekList: WeekDay[]): string => {

    const currentHour = Math.floor((rowIndex) / 4);
    const currentMinutes = ((rowIndex % 4) * 15);
    const current = selectedWeekList[colIndex];

    const currentDate = setDate(parse(current.date, dateConfig.isoDateFormat, new Date()), current.day);
    const currentDateTime = currentDate.setHours(currentHour, currentMinutes);
    const currentDateTimeFormatted = format(currentDateTime, dateConfig.longDateTimeFormat);

    return currentDateTimeFormatted;
}

//mark a grid cell as 'selected'
export const selectHtmlElementInBoard = (webAccessibilityElement: WebAccessibilityElementType) => {

    if (webAccessibilityElement.HtmlElementSelected !== null) {
        webAccessibilityElement.HtmlElementSelected.tabIndex = -1;
        webAccessibilityElement.HtmlElementSelected.removeAttribute('aria-selected');

        const newItem = webAccessibilityElement.HtmlElementToSelect;
        if (newItem !== null) {
            newItem.tabIndex = 0;
            newItem.setAttribute('aria-selected', 'true');
            newItem.focus();
        }
    }
};

//find the closest grid-cell that is available for being marked as 'selected'
export const findClosestHtmlElement = (htmlCollection: HTMLCollection, 
                                       currentElem: HTMLDivElement, 
                                       currentIndex: number,
                                       direction: ArrowType) : HTMLDivElement => {
    let element = currentElem;
    let newIndex = currentIndex;
    let maxLength = htmlCollection.length;

    while (element.classList.contains('hide')){ 
        if(newIndex <= 0 || newIndex >= maxLength){
            break;
        }

        element = htmlCollection[newIndex] as HTMLDivElement;
        newIndex = calculateIndex(direction, newIndex);
    }

    return element;
}

export const eventBoardAccessibility = (eventKey: string,
                                        currentTarget: HTMLDivElement,
                                        refEventGrid: React.MutableRefObject<HTMLDivElement | null>) => {
  
    const dataRow = currentTarget.getAttribute('data-row');
    const dataCol = currentTarget.getAttribute('data-col');
    const dataEvent = currentTarget.getAttribute('data-has-event');
    const currentRow = dataRow !== null ? parseInt(dataRow) : 0;
    const currentCol = dataCol !== null ? parseInt(dataCol) : 0;
    const hasEvent = (dataEvent !== null && dataEvent === 'true') ?? false;
    const eventGrid = refEventGrid.current;

    if (eventGrid === null) {
        throw new Error('Null reference for event grid');
    }

    //total rows: 96 rows in grid
    //total columns: 7 columns in grid
    //IMPORTANT: in html the grid is represented as a ol/li with 
    //data attributes: data-row and data-col to represent the current position.
    //cell in grid = Index of the list (the sum of current row + col)
    const currentItemSelected = eventGrid.children[(currentRow * 7) + currentCol] as HTMLDivElement;
    const maxLength = eventGrid.children.length;

    switch (eventKey) {
        case 'ArrowUp': {
            const currentIndex = currentRow > 0 ? (currentRow - 1) * 7 : currentRow;
            const moveToIndex = currentIndex + currentCol;

            if(moveToIndex < 0){
                return;
            }

            const nextElement = eventGrid.children[moveToIndex] as HTMLDivElement;
            const elemToSelectInBoard = findClosestHtmlElement(eventGrid.children, nextElement, moveToIndex, 'ArrowUp');

            const moveUpToElement: WebAccessibilityElementType = {
                HtmlElementSelected: currentItemSelected,
                HtmlElementToSelect: elemToSelectInBoard
            };

            selectHtmlElementInBoard(moveUpToElement);
            break;
        }
        case 'ArrowDown': {
            const currentIndex = currentRow < maxLength - 1 ? (currentRow + 1) * 7 : currentRow;
            const gridRowEnd = Number(currentItemSelected.style.gridRowEnd);
            const gridRowStart = Number(currentItemSelected.style.gridRowStart);
            const sumEventRows = hasEvent ? (((gridRowEnd - gridRowStart) - 1) * 7) : 0;

            let moveToIndex = (currentIndex + sumEventRows) + currentCol;
            if(moveToIndex >= maxLength){
                return;
            }

            const moveDownToElement: WebAccessibilityElementType = {
                HtmlElementSelected: currentItemSelected,
                HtmlElementToSelect: eventGrid.children[moveToIndex] as HTMLDivElement,
            };

            selectHtmlElementInBoard(moveDownToElement);
            break;
        }
        case 'ArrowLeft': {
            const newCol = currentRow > 0 || currentCol > 0 ? currentCol - 1 : currentCol;
            const moveToIndex = currentRow * 7 + newCol;

            if(moveToIndex < 0 ){
                return;
            }
            
            const nextElement = eventGrid.children[moveToIndex] as HTMLDivElement;
            const elemToSelectInBoard = findClosestHtmlElement(eventGrid.children, nextElement, moveToIndex, 'ArrowLeft');

            const moveLeftToElement: WebAccessibilityElementType = {
                HtmlElementSelected: currentItemSelected,
                HtmlElementToSelect: elemToSelectInBoard
            };

            selectHtmlElementInBoard(moveLeftToElement);
            break;
        }
        case 'ArrowRight': {
            const newCol = currentCol + 1 < maxLength - 1 ? currentCol + 1 : currentCol;
            const moveToIndex = currentRow * 7 + newCol;

            if(moveToIndex >= maxLength){
                return;
            }

            const nextElement = eventGrid.children[moveToIndex] as HTMLDivElement;
            const elemeToSelectInBoard = findClosestHtmlElement(eventGrid.children, nextElement, moveToIndex, 'ArrowRight');
            const moveToRightElement: WebAccessibilityElementType = {
                HtmlElementSelected: currentItemSelected,
                HtmlElementToSelect: elemeToSelectInBoard,
            };

            selectHtmlElementInBoard(moveToRightElement);
            break;
        }
        case 'Enter': {
            if (currentItemSelected !== null) {
                currentItemSelected.click();
            }
            break;
        }
        case 'Tab':
            if (currentItemSelected !== null) {
                var btnClose = currentItemSelected.querySelector('.btn-close') as HTMLButtonElement;
                if(btnClose !== null){
                    btnClose.tabIndex = 0;
                    btnClose.focus();
                }
            }
            break;
    }
};

export const resetBoardAccessibility = (refEventGrid: React.MutableRefObject<HTMLOListElement | null>) => {
  
    if (refEventGrid.current === null) {
        throw new Error('Null reference for event board list');
    }

    const htmlCollection = Array.from(refEventGrid.current.children);
    htmlCollection.forEach((htmlItem) => {
        const currentHtmlElement = htmlItem as HTMLLIElement;
        if (currentHtmlElement !== null) {
            currentHtmlElement.removeAttribute('aria-selected');
            currentHtmlElement.tabIndex = -1;
        }
    });
};


export const isValidKeyboardNavigation = (target: EventTarget, currentTarget: EventTarget, eventKey: string, isShiftKey: boolean) => {

    if(isShiftKey){
        return false;
    }

    const currentTargetElement = currentTarget as HTMLDivElement;
    const targetElement = target as HTMLDivElement;
    const currentTargetRole = currentTargetElement.getAttribute('role') ?? '';
    const targetRole = targetElement.getAttribute('role') ?? '';

    if(currentTargetRole !== 'grid' || targetRole !== 'gridcell'){
        return false;
    }
    
    if(!allowedKeyboardKeys.includes(eventKey)){
        return false;
    }
    return true;
}
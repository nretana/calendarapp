
export const eventBoardAccessibility = (eventKey: string, refCurrentEventBoardList: React.MutableRefObject<(HTMLLIElement | null)[]>,
                                        row: number, col: number) =>{

    const currentItemSelected = refCurrentEventBoardList.current[(row*7) + col];
    const maxLength = refCurrentEventBoardList.current.length;

    switch(eventKey){
        case 'ArrowUp':
            if(currentItemSelected !== null){
                currentItemSelected.tabIndex = -1;
                currentItemSelected.removeAttribute('aria-selected');

                var newRow = (row > 0) ? ((row - 1)*7) : row;
                var newItem = refCurrentEventBoardList.current[newRow + col];
                if(newItem !== null){
                    newItem.tabIndex = 0;
                    newItem.setAttribute('aria-selected', 'true');
                    newItem.focus();
                }
            }
            
            break;
        case 'ArrowDown':
            if(currentItemSelected !== null){
                currentItemSelected.tabIndex = -1;
                currentItemSelected.removeAttribute('aria-selected');
                var newRow = (row < maxLength -1) ? ((row + 1)*7) : row;
                var newItem = refCurrentEventBoardList.current[newRow + col];
                if(newItem !== null){
                    newItem.tabIndex = 0;
                    newItem.setAttribute('aria-selected', 'true');
                    newItem.focus();
                }
            }
        break;
        case 'ArrowLeft':
            if(currentItemSelected !== null){
                currentItemSelected.tabIndex = -1;
                currentItemSelected.removeAttribute('aria-selected');
                var newCol = (row > 0 || col > 0) ? (col - 1) : col;
                var newItem = refCurrentEventBoardList.current[(row*7) + newCol];
                if(newItem !== null){
                    newItem.tabIndex = 0;
                    newItem.setAttribute('aria-selected', 'true');
                    newItem.focus();
                }
            }
            break;
        case 'ArrowRight':
            if(currentItemSelected !== null){
                currentItemSelected.tabIndex = -1;
                currentItemSelected.removeAttribute('aria-selected');
                var newCol = col + 1 < maxLength - 1 ? (col + 1) : col;
                var newItem = refCurrentEventBoardList.current[(row*7) + newCol];
                if(newItem !== null){
                    newItem.tabIndex = 0;
                    newItem.setAttribute('aria-selected', 'true');
                    newItem.focus();
                }
            }
            break;
        case 'Enter':
            if(currentItemSelected !== null){
                currentItemSelected.click();
            }
            break;
    }

}
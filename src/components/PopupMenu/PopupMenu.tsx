import { useEffect, useState } from 'react';
import { MdMenu } from 'react-icons/md'

import StyledPopupMenu from './PopupMenu.style';

import { useClickOutside, useResizeListener } from '../../utils/customHooks';

import type { ReactNode, ReactElement } from 'react';
import type { IconType } from 'react-icons';

type PopupMenuProps = {
    children: ReactNode | ReactNode[];
    width?: string;
    icon?: ReactElement<IconType>;
    iconSize?: string;
}

const PopupMenu = ({ children, width='130px', iconSize='1.5em', icon=<MdMenu/> }: PopupMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useClickOutside(() => {setOpen(false)}, open);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [menuAdjust, setMenuAdjust] = useState(0);
    
    //when resizing, set the screen width, which will update menu adjust if needed
    useResizeListener(() => {
        setScreenWidth(window.innerWidth);
    }, 300);

    //check if any popup menus will overlap the edge of the screen and adjust
    useEffect(() => {
        if (ref && ref.current) {
            let boundingRect = ref.current.getBoundingClientRect();

            //width of menu div
            let widthVal = parseInt(width);
            if (widthVal > screenWidth - 10) widthVal = screenWidth - 10;

            //mid point of icon div
            let midPoint = boundingRect.x + (boundingRect.width/2);

            //overlap (-5 to add a 5px margin)
            let overlap = screenWidth - midPoint - (widthVal/2) - 5;
            if (overlap < 0) {
                setMenuAdjust(overlap);
            } else {
                setMenuAdjust(0);
            }
        }
    }, [screenWidth, ref, width]);

    const onClickMenu = () => {
        setOpen(open => !open);
    }

    return (
        <StyledPopupMenu open={open} ref={ref} width={width} iconSize={iconSize} menuAdjust={menuAdjust}>
            <div id='icon' onClick={onClickMenu}>{icon}</div>
            <div id='menu'>
                { children }
            </div>
        </StyledPopupMenu>
    );
}

export default PopupMenu;
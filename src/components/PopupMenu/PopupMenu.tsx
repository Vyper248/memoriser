import { useState } from 'react';
import { MdMenu } from 'react-icons/md'

import StyledPopupMenu from './PopupMenu.style';

import { useClickOutside } from '../../utils/customHooks';

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

    const onClickMenu = () => {
        setOpen(open => !open);
    }

    return (
        <StyledPopupMenu open={open} ref={ref} width={width} iconSize={iconSize}>
            <div id='icon' onClick={onClickMenu}>{icon}</div>
            <div id='menu'>
                { children }
            </div>
        </StyledPopupMenu>
    );
}

export default PopupMenu;
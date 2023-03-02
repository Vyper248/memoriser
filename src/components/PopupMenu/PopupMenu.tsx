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
}

const PopupMenu = ({ children, width='130px', icon=<MdMenu/> }: PopupMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useClickOutside(() => {setOpen(false)}, open);

    const onClickMenu = () => {
        setOpen(open => !open);
    }

    return (
        <StyledPopupMenu open={open} ref={ref} width={width}>
            <div id='icon' onClick={onClickMenu}>{icon}</div>
            <div id='menu'>
                { children }
            </div>
        </StyledPopupMenu>
    );
}

export default PopupMenu;
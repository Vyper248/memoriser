import React, { useState } from 'react';
import { MdMenu } from 'react-icons/md'

import StyledDropdownMenu from './DropdownMenu.style';

import { useClickOutside } from '../../utils/customHooks';

import type { ReactNode } from 'react';

type DropdownMenuProps = {
    children: ReactNode | ReactNode[];
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useClickOutside(() => {setOpen(false)}, open);

    const onClickMenu = () => {
        setOpen(open => !open);
    }

    return (
        <StyledDropdownMenu open={open} ref={ref}>
            <div id='icon' onClick={onClickMenu}><MdMenu/></div>
            <div id='menu'>
                { children }
            </div>
        </StyledDropdownMenu>
    );
}

export default DropdownMenu;
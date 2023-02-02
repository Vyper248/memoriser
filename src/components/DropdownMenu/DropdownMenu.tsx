import React, { useState } from 'react';
import { MdMenu } from 'react-icons/md'

import StyledDropdownMenu from './DropdownMenu.style';

import { useClickOutside } from '../../utils/customHooks';

import type { ReactNode, ReactElement } from 'react';
import type { IconType } from 'react-icons';

type DropdownMenuProps = {
    children: ReactNode | ReactNode[];
    width?: string;
    icon?: ReactElement<IconType>;
}

const DropdownMenu = ({ children, width='130px', icon=<MdMenu/> }: DropdownMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useClickOutside(() => {setOpen(false)}, open);

    const onClickMenu = () => {
        setOpen(open => !open);
    }

    return (
        <StyledDropdownMenu open={open} ref={ref} width={width}>
            <div id='icon' onClick={onClickMenu}>{icon}</div>
            <div id='menu'>
                { children }
            </div>
        </StyledDropdownMenu>
    );
}

export default DropdownMenu;
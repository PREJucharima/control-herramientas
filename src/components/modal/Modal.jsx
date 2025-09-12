import MuiModal from '@mui/material/Modal'; // STYLED COMPONENT

import { StyledScrollbar, Wrapper } from './styles'; // ===========================================================================

// ===========================================================================
export default function Modal({
  children,
  open,
  sx,
  handleClose
}) {
  return <MuiModal open={open} onClose={handleClose}>
      <Wrapper sx={sx}>
        <StyledScrollbar>{children}</StyledScrollbar>
      </Wrapper>
    </MuiModal>;
}
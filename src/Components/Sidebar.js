// components

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledSidebar = styled.div`
  height: calc(100vh - 5rem);
  background-image: linear-gradient(#251829, #0f0f1b);

  display: flex;
  flex-direction: column;
`;

export function Sidebar() {
  return (
    <StyledSidebar>
      Sidebar
    </StyledSidebar>
  );
}

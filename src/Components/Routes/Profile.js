import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppProvider.js';
import { useFetch } from '../Hooks/useFetch.js';
const { v1: uuidv1 } = require('uuid');

const StyledProfile = styled.div`
	display: grid;
	grid-template-columns: 28rem 1fr 28rem;

	#profile-center-column {
		margin: 0 1rem 0 1rem;
	}
`;

export function Profile() {
  return ('Profile');
}

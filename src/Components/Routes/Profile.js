import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppProvider.js';
import { useFetch } from '../Hooks/useFetch.js';
const { v1: uuidv1 } = require('uuid');

const StyledProfile = styled.div`
	display: grid;
	grid-template-columns: 18rem 1fr 18rem;

	#profile-center-column {
		margin: 0 1rem 0 1rem;
	}
`;

import { CreatePost } from '../CreatePost.js';

export function Profile() {
	const { user } = useContext(AppContext)
	const [{ fetching, response, error }, doFetch ]  = useFetch();

	const handlePostSubmit = async(payload)  => {
		payload['authorObjId'] = user.user._id;

		//Could create serverside but whatever...
		let aid = uuidv1(); //make sure is unique in db later on...
		payload['aid'] = aid;
		payload['createdAt'] = new Date().toISOString();
		payload['tags'] = payload.tags.split(',');
		payload['slug'] = '/articles/'+aid;

		let options = {
			method: 'post',
			data: {
				payload,
			}
		}
		await doFetch('http://localhost:4000/articles/post/new', options);
	}

	return(
		<StyledProfile className="master-content-page profile">
			<div id="profile-left-column">
			</div>
			<div id="profile-center-column">
				<CreatePost handlePostSubmit={handlePostSubmit}/>
			</div>
			<div id="profile-right-column">
			</div>
		</StyledProfile>
	);
}

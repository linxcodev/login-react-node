
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppProvider.js';
import { Link, NavLink } from 'react-router-dom';
import uniqid from 'uniqid';

import { useFetch } from '../Hooks/useFetch.js';

const StyledFeed = styled.div`
#feed-articles-wrapper {
		font-size: 1.5rem;

		#feed-articles-title-bar {
			height: 5rem;
			border: 1px solid #2d2c3c;
			padding: 1rem 2rem 1rem 2rem;
			display: flex;
			flex-direction: row;

			color: #5d858d;
			align-items: center;

			#feed-articles-showing {
				margin-right: .5rem;
			}
			
			#feed-articles-prev,
			#feed-articles-next {
				width: 3rem;
				height: 3rem;
				border: 1px solid #2d3c41;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				svg {
					width: 1rem;
				}

				&:hover {
					cursor: pointer;
				}
			}
    }
}
`;

export function Feed() {
	const { user, authors, setAuthors } = useContext(AppContext);
  const [{ fetching, response, error }, doFetch ] = useFetch();

	const [ skip, setSkip ] = useState(0);
	const [ count, setCount ] = useState(0);
	const [ articles, setArticles ] = useState([]);
	const [ tags, setTags ] = useState([]);

  useEffect(() => {
		(async function anon() {
			let options = {
				method: 'post',
				data: {
					payload:  {
						col: 'articles',
						limit: 10,
						skip: 0,
						sort: { createdAt: -1 }
					}
				}
			}
			await doFetch('http://localhost:4000/articles', options)
		})();
	},[]);

  useEffect(() => {
		if(fetching === false && response !== null &&  ("Code" in response)) {
			console.log(response);
			let itemsProcessed = 0;
			switch (response['Code']) {
				case 703:
					setCount(response['articles']['count']);
					setArticles(response['articles']['articles']);

					let currentArticles = response['articles']['articles'];
					let currentAuthors = Object.keys(authors);

					let newAuthors = [];
					let newTags = [];

					currentArticles.forEach(async (a, index) => {
						if (!currentAuthors.includes(a['authorObjId']) && !newAuthors.includes(a['authorObjId'])) { newAuthors.push(a['authorObjId']) }
					});

					break;
				default:
					break;
			}
    }
  },[ fetching, response, error ]);

  return (
    <StyledFeed className="master-content-page articles">
			<div className="master-content-page-title">Articles</div>
			<div id="feed-articles-wrapper">
				<div id="feed-articles-title-bar">
					Serch stuff etc....
					<div className="flex-row-filler"></div>
					<div id="feed-articles-showing">Showing { skip + 1 } - { skip + 10 } Of { count }</div>
					<div id="feed-articles-prev">
						<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className="svg-inline--fa fa-chevron-left fa-w-8 fa-2x"><path fill="currentColor" d="M231.293 473.899l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L70.393 256 251.092 74.87c4.686-4.686 4.686-12.284 0-16.971L231.293 38.1c-4.686-4.686-12.284-4.686-16.971 0L4.908 247.515c-4.686 4.686-4.686 12.284 0 16.971L214.322 473.9c4.687 4.686 12.285 4.686 16.971-.001z"></path></svg>
					</div>
					<div id="feed-articles-next">
						<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className="svg-inline--fa fa-chevron-right fa-w-8 fa-2x"><path fill="currentColor" d="M24.707 38.101L4.908 57.899c-4.686 4.686-4.686 12.284 0 16.971L185.607 256 4.908 437.13c-4.686 4.686-4.686 12.284 0 16.971L24.707 473.9c4.686 4.686 12.284 4.686 16.971 0l209.414-209.414c4.686-4.686 4.686-12.284 0-16.971L41.678 38.101c-4.687-4.687-12.285-4.687-16.971 0z"></path></svg>
					</div>
				</div>
				<div id="feed-articles-content">
					<div id="feed-articles-left">
					</div>
					<div id="feed-articles-right">

					</div>
				</div>
			</div>
		</StyledFeed>
  );
}

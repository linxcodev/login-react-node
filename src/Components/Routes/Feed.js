
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppProvider.js';
import { Link, NavLink } from 'react-router-dom';
import uniqid from 'uniqid';

import { useFetch } from '../Hooks/useFetch.js';

const StyledFeed = styled.div`
#feed-articles-wrapper {
	font-size: 1.4rem;

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

#feed-articles-content {
	display: grid;
	grid-template-columns: 32rem 1fr;
	height: calc(100vh - 20rem);

	#feed-articles-left {
		border-right: 1px solid #2d2c3c;

		#feed-articles-left-tags {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
			grid-gap: .2rem;
			justify-content: space-between;

			span {
				display: block;
				border: 1px solid #2d3c41;
				padding: .2rem;
				width: auto;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				color: #3891a0;
				text-transform: uppercase;
			}
		}
	}

	#feed-articles-right {
		border-right: 1px solid #2d2c3c;
		overflow-y: scroll;

		::-webkit-scrollbar {
			width: 0px;  /* Remove scrollbar space */
			background: transparent;  /* Optional: just make scrollbar invisible */
		}
		/* Optional: show position indicator in red */
		::-webkit-scrollbar-thumb {
			background: #FF0000;
		}

		.feed-article-title {
			height: 10rem;
			padding: 2rem;
			border-bottom: 1px solid #2d2d3c;
			color: #f0f0f1;
			font-size: 2rem;
			text-transform: uppercase;
			display: flex;
			flex-direction: row;
			align-items: center;
			text-decation: none;
		}

		.feed-article-info-bar {
			height: 4rem;
			display: flex;
			flex-direction: row;
			border-bottom: 1px solid #2d2c3c;
			align-items: center;
			padding: 0 2rem 0 2rem;
			color: #4d6a74;

			a {
				display: flex;
				flex-direction: row;
				align-items: center;
				color: #56baca;
				text-decoration: none;
				text-transform: uppercase;

				.feed-article-author-image {
					width: 3rem;
					height: 3rem;
					margin-right: .5rem;
					border: 1px solid #322339;
				}

			}

			.feed-article-created-at {
				margin-left: 1rem;
				margin-right: 1rem;
			}

			& svg {
				width: 2rem;

				&:hover { cursor:pointer; }
			}
		}

		.feed-article-description {
			color: #5d858d;
			padding: 2rem;
			border-bottom: 1px solid #2d2c3c;
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

						a.tags.forEach(async (tag) => {
							!newTags.includes(tag) ? newTags.push(tag) : '';
						});

						//Collect new authors information after tags have been updated
						itemsProcessed++;
						if(itemsProcessed === currentArticles.length) {
							let options = {
								method: 'post',
								data: {
									payload: {
										newAuthors
									}
								}
							}
							await doFetch('http://localhost:4000/authors', options);
						}
					});

					setTags(newTags);
					break;
				case 704:
					let newAuthorsObj = {}
					response['authors'].forEach((a) => {
						newAuthorsObj[a['_id']] = a;

						itemsProcessed++;
						if(itemsProcessed === response['authors'].length) {
							console.log('Done proccessing new authors.');
							setAuthors({ ...authors, ...newAuthorsObj });
						}
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
						<div id="feed-articles-left-tags">
							{ tags.length > 0 && tags.map((tag,i) => (
								<Link to={ `/tag/${tag}`} key={i}>
									<span>{ tag }</span>
								</Link>
							))}
						</div>
					</div>
					<div id="feed-articles-right">
						{ articles.length > 0 && articles.map((a) => (
							<div className="feed-article" key={uniqid()}>
								<Link to={a.slug} className="feed-article-title">{ a.title }</Link>
									<div className="feed-article-info-bar">
										{ authors[a['authorObjId']] &&
											<Link to={`/profiles/${authors[a['authorObjId']]['alias']}`}>
												<img className="feed-article-author-image" src={ authors[a['authorObjId']]['profile']['url']} />
												<div className="feed-article-author-fullname">{ authors[a['authorObjId']]['fullname'] }</div>
											</Link>
										}
										<div className="feed-article-created-at"> { a.createdAt } </div>
										<>
											<svg onClick={(e) => LikeArticle(a._id)} aria-hidden="true" focusable="false" data-prefix="fal" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-heart fa-w-16 fa-2x"><path fill="currentColor" d="M462.3 62.7c-54.5-46.4-136-38.7-186.6 13.5L256 96.6l-19.7-20.3C195.5 34.1 113.2 8.7 49.7 62.7c-62.8 53.6-66.1 149.8-9.9 207.8l193.5 199.8c6.2 6.4 14.4 9.7 22.6 9.7 8.2 0 16.4-3.2 22.6-9.7L472 270.5c56.4-58 53.1-154.2-9.7-207.8zm-13.1 185.6L256.4 448.1 62.8 248.3c-38.4-39.6-46.4-115.1 7.7-161.2 54.8-46.8 119.2-12.9 142.8 11.5l42.7 44.1 42.7-44.1c23.2-24 88.2-58 142.8-11.5 54 46 46.1 121.5 7.7 161.2z"></path></svg>
											<svg onClick={(e) => UnLikeArticle(a._id)} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-heart fa-w-16 fa-2x"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>
										</>
									</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</StyledFeed>
  );
}

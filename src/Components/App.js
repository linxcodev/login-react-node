// body

// package
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';

// brain
import AppProvider from './AppProvider.js';
import { AppContext } from './AppProvider.js';
import { UserProvider } from './UserProvider.js';

// components
import { State } from './State.js';
import { Nav } from './Nav.js';
import { Sidebar } from './Sidebar.js';
import Routes from './Routes.js';

const StyledApp = styled.div`
  #app-master-grid {
    display: grid;
    grid-template-columns: 32rem 1fr;

    .master-content-page {
			position: relative;
			height: calc(100vh - 5rem);
			background: #21202e;
			background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAEElEQVQImWNgoAMwNLD9DwADNgGeHzb6QAAAAABJRU5ErkJggg==);

			padding: 2rem;
		}

    .master-content-page-title {
			height: 5rem;
			font-size: 3rem;
			color: #f0f0f1;
			text-transform: uppercase;
		}
  }
`;

function App() {
  return (
    <Router>
        <UserProvider>
            <AppProvider>
                <AppContext.Consumer>
                  {({ }) => (
                    <StyledApp>
                        <Nav />
                        <div id="app-master-grid">
                            <Sidebar />
                            <Routes />
                        </div>
                        <State />
                    </StyledApp>
                  )}
                </AppContext.Consumer>
            </AppProvider>
        </UserProvider>
    </Router>
  );
}

if (document.getElementById('react_root')) {
  ReactDOM.render(<App />, document.getElementById('react_root'));
}

import { h } from 'preact';
import { Router } from 'preact-router';

import Home from '../routes/home';

const App = () => (
	<div id="app">
		<main>
			<Router>
				<Home path="/" />
			</Router>
		</main>
	</div>
);

export default App;

import axios from 'axios';
import React from 'react';
import buildClient from '../api/build-client';
const LandingPage = ({ currentUser }) => {
	// const fetch = async () => {
	// 	const response = await axios.get(`${BASEURL}/api/users/currentuser`);
	// };
	console.log(currentUser);
	return (
		<>
			{currentUser ? (
				<div>You are logged in </div>
			) : (
				<div>You are not logged in </div>
			)}
		</>
	);
};
const BASEURL = 'https://ticketing.dev';
const SERVICE =
	'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
LandingPage.getInitialProps = async (context) => {

	const client = buildClient(context);
	const { data } = await client.get('/api/users/currentuser');
	return data;
};

export default LandingPage;

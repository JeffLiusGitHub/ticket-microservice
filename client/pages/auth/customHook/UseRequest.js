import { useState } from 'react';
import axios from 'axios';
import React from 'react';

const UseRequest = ({ url, method, body, onSuccess }) => {
	const [error, setError] = useState(null);
	const BASEURL = 'https://ticketing.dev';
	const doRequest = async () => {
		try {
			setError(null);
			const response = await axios[method](`${BASEURL}${url}`, {
				...body,
			});
			if (onSuccess) {
				onSuccess(response.data);
			}
			return response.data;
		} catch (err) {
			setError(
				<>
					{err?.response?.data?.errors?.length > 0 && (
						<div className="alert alert-danger">
							<h4>Ooops...</h4>
							<ul className="my-0">
								{err?.response?.data?.errors?.map((err) => (
									<li key={err.message}>{err.message}</li>
								))}
							</ul>
						</div>
					)}
				</>
			);
		}
	};
	return { doRequest, error };
};

export default UseRequest;

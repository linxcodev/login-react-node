import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetch = () => {
  const [ fetching, setFetching ] = useState(false);
  const [ response, setResponse ] = useState(null);
  const [ error, setError ] = useState(null);

  const doFetch = async(url, options = {}) => {
    setFetching(true);
    setResponse(null);
    setError(null);

    axios(url, options).then((res) => {
      setFetching(false);
      setResponse(res.data);
    }).catch((err) => {
      setFetching(false);
      setError(err);
    });
  }

  return [{ fetching, response, error }, doFetch];
}

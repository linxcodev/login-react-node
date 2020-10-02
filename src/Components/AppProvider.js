// AppProvider for brain

import React, { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';

export const AppContext = createContext();
import { UserContext } from './UserProvider.js';
import useLocalStorage from './Hooks/useLocalStorage.js';

export default function(props) {
  const [ user, dispatch ] = useContext(UserContext);

  const [ jwt, setJwt ] = useLocalStorage('access_token', '^vAr^');

  const [display, setDisplay] = useState({
    state: false
  });

  const setState = (what, k, v) => {
    let tempObj = null;

    switch (what) {
      case "display":
        tempObj = display;
        tempObj[k] = v;
        setDisplay({ ...tempObj });
        break;
      default:
        break;
    }
  }

  const toggleState = (what, k) => {
    let tempObj = null;

    switch (what) {
      case "display":
        tempObj = display;
        tempObj[k] = !tempObj[k];
        setDisplay({ ...tempObj });
        break;
      default:
        break;
    }
  }

  const handleKeyEvent = (event) => {
    if (event.type == "keyup") {
      switch (event.key) {
        case "Escape":
          toggleState('display', 'state');
          break;
        default:
          break;
      }
    }

    if (event.type == "keydown") {
      switch (event.key) {
        default:
          break;
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", handleKeyEvent);
    window.addEventListener("keydown", handleKeyEvent);

    return () => {
      window.addEventListener("keyup", handleKeyEvent);
      window.addEventListener("keydown", handleKeyEvent);
    }
  }, [handleKeyEvent]); // handleKeyEvent

  return (
    <AppContext.Provider value={{
      display, setDisplay, user, dispatch, setJwt,
    }}> {props.children}
    </AppContext.Provider>
  );
}

import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';

import { AppContext } from '../AppProvider.js';

const StyledAuthentication = styled.div`
  #auth-login-form,
  #auth-registration-form {
    position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
  }

  #auth-login-form {
		position: relative;
		width: 32rem;
		display: flex;
		flex-direction: column;


		#auth-login-form-logo-header {
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 1rem;
			justify-content: center;

			#auth-login-form-logo-header-logo {
				width: 4rem;
				height: 4rem;
				background: url('/images/logo.png');
				background-position: center center;
				background-size: 4rem 4rem;
			}
			#auth-login-form-logo-header-title {
				color: #56baca;
				font-size: 4rem;
				margin-left: 1rem;
        text-transform: uppercase;
			}
		}
		#auth-login-form-content {
			width: 100%;
			height: 100%;
			border: 1px solid #2d2c3c;

			#auth-login-form-content-header {
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1px solid #2d2c3c;
				padding: 1rem;

				#auth-login-form-content-header-text {
					font-size: 2.7rem;
					color: #e1e1e3;
				}

				#auth-login-form-content-header-registration-link {
					font-size: 1.7rem;
					color: #52b0c0;
					&:hover {
						cursor: pointer;
					}
				}
			}
			#auth-login-open-id	{
				padding: 1rem;
			}
			#auth-login-form-form {
				padding: 1rem;
			}
		}
	}

  #auth-registration-form {
		width: 64rem;
		border: 1px solid #2d2c3c;

		display: grid;
		grid-template-columns: 32rem 32rem;

		#auth-registration-form-left {
			background: url('/images/registration-left-image.png');
			background-repeat: no-repeat;
			background-size: auto 100%;
		}
		#auth-registration-form-right {
			#auth-registration-form-right-header {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 1.5rem;

				height: 5rem;
				padding: 1rem;

				.auth-registration-form-right-header.left {
					color: #e1e1e3;
					font-size: 2rem;
				}
				.auth-registration-form-right-header.right {
					color: #557880;

					span {
						color:#4891a0;
					}
				}

				border-bottom: 1px solid #2d2c3c;
			}
			#auth-registration-form-right-form {
				display: flex;
				flex-direction: column;
				padding: .5rem 0 0 1.5rem;
			}
		}
	}
`;

import { Button } from '../Button.js';
import { FormTextField } from '../FormTextField.js';
import { useInputChange } from '../Hooks/useInputChange.js';
import { useFetch } from '../Hooks/useFetch.js';

export function Authentication({ location }) {
  const { dispatch, setJwt } = useContext(AppContext);

  const [loginData, handleLoginInputChange] = useInputChange();
  const [registrationData, handleRegisterInputChange] = useInputChange();
  const [{ fetching, response, error }, doFetch] = useFetch();

  const handleLogin = async () => {
    let payload = { ...loginData };

    payload['user'] = btoa(payload['user']);
    payload['password'] = btoa(payload['password']);

    const options = {
      method: 'post',
      data: {
        payload,
      }
    }

    await doFetch('http://localhost:4000/login', options);
  }

  useEffect(() => {
    if (fetching === false && response !== null && ('access_token' in response) && ('user' in response)) {
      dispatch({ type: 'SET_AUTHORIZED', payload: response.user });
      setJwt(response.access_token);
    }

    if (fetching === false && error !== null) {
      console.log('Fetch Error: ', error);
      console.log('Server Error Response: ', error.response.data['Error']);
    }
  }, [fetching, error, response]);

  const handleRegistration = () => {
    console.log(registrationData);
  }

  return (
    <StyledAuthentication className="master-content-page">
      { location.pathname == "/login" &&
        <div id="auth-login-form">
          <div id="auth-login-form-logo-header">
            <div id="auth-login-form-logo-header-logo"></div>
            <div id="auth-login-form-logo-header-title">nodemy</div>
          </div>
          <div id="auth-login-form-content">
            <div id="auth-login-form-content-header">
							<div id="auth-login-form-content-header-text">LOGIN</div>
							<div className="flex-row-filler"></div>
							<div id="auth-login-form-content-header-registration-link">REGISTRATION</div>
						</div>
            <div id="auth-login-open-id">
							<Button btype="open-id-facebook" text="LOGIN WITH FACEBOOK" onClick={(e) => alert('facebook')} margin=".5rem 0 .5rem 0" imgUrl="/images/facebook.png"/>
							<Button btype="open-id-twitter" text="LOGIN WITH TWITTER"  onClick={(e) => alert('twitter')} margin=".5rem 0 .5rem 0" imgUrl="/images/twitter.png"/>
						</div>
            <div id="auth-login-form-form">
              <FormTextField label="Email or Alias" placeholder="" role="text" name="user" onChange={handleLoginInputChange}/>
							<FormTextField label="Password" placeholder="" role="password" name="password" onChange={handleLoginInputChange}/>
							<Button btype="generic" text="LOGIN" onClick={(e) => handleLogin()} margin=".5rem 0 .5rem 0"/>
						</div>
          </div>
        </div>
      }

      { location.pathname == "/register" &&
        <div id="auth-registration-form">
          <div id="auth-registration-form-left"></div>
					<div id="auth-registration-form-right">
						<div id="auth-registration-form-right-header">
							<div className="auth-registration-form-right-header left">REGISTRATION</div>
							<div className="flex-row-filler"></div>
							<div className="auth-registration-form-right-header right">Back to <span>LOGIN</span></div>
						</div>
						<div id="auth-registration-form-right-form">
							<FormTextField label="Full Name" placeholder="" role="text" name="name" onChange={handleRegisterInputChange}/>
							<FormTextField label="Alias" placeholder="" role="text" name="alias" onChange={handleRegisterInputChange}/>
							<FormTextField label="Email" placeholder="" role="email" name="email" onChange={handleRegisterInputChange}/>
							<FormTextField label="Password" placeholder="" role="password" name="password" onChange={handleRegisterInputChange}/>
							<FormTextField label="Retype Password" placeholder="" role="password" name="RTPassword" onChange={handleRegisterInputChange}/>
							<Button btype="generic" text="register" onClick={(e) => handleRegistration()} margin=".5rem 0 .5rem 0"onChange={handleRegisterInputChange}/>
						</div>
					</div>
        </div>
      }
    </StyledAuthentication>
  );
}

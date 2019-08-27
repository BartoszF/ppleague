import React from 'react';
import {Redirect, Route} from "react-router-dom";


const PrivateRoute = ({component: Component, userStore, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            userStore.isAuthenticated ? (
                <Component {...rest} {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: {from: props.location}
                    }}
                />
            )
        }
    />
);

export default PrivateRoute
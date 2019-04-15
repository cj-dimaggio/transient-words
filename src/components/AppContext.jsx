import React from 'react';

export const AppContext = React.createContext({
  won: false,
  lost: false,
  danger: false,
  limit: 5,
  progres: 0,
  type: "timed",
  hardcore: false
});

export function withAppContext(Component, data = {}) {
   return class extends React.Component {
      render() {
         return (
            <AppContext.Consumer>
               {context => (
                  <Component {...context} {...data} />
               )}
            </AppContext.Consumer>
         )
      }
   }
}

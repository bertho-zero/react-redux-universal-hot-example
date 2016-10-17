export loadInfo from './loadInfo';<% if(auth) { %>
export * as auth from './auth';<% } %><% if(examples.indexOf('forms') !== -1) { %>
export * as widget from './widget';
export * as survey from './survey';<% } %>

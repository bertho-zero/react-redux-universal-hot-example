<% if(auth) { %>import users from './users';
<% } %><% if(examples.indexOf('chatFeathers') !== -1) { %>import messages from './messages';
<% } %><% if(!auth && examples.indexOf('chatFeathers') === -1) { %>/* import yourService form './yourService'; */
<% } %>
export default function services() {
  <% if(!auth && examples.indexOf('chatFeathers') === -1) { %>/* <% } %>const app = this;

<% if(auth) { %>  app.configure(users);
<% } %><% if(examples.indexOf('chatFeathers') !== -1) { %>  app.configure(messages);
<% } %><% if(!auth && examples.indexOf('chatFeathers') === -1) { %>  app.configure(yourService); */
<% } %>}

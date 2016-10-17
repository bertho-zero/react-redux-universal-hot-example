<% if(examples.indexOf('about') !== -1) { %>export About from './About/About';
<% } %>export App from './App/App';<% if(examples.indexOf('chat') !== -1) { %>
export Chat from './Chat/Chat';<% } %><% if(examples.indexOf('chatFeathers') !== -1) { %>
export ChatFeathers from './ChatFeathers/ChatFeathers';<% } %>
export Home from './Home/Home';<% if(auth) { %>
export Login from './Login/Login';
export LoginSuccess from './LoginSuccess/LoginSuccess';<% } %>
export NotFound from './NotFound/NotFound';<% if(auth) { %>
export Register from './Register/Register';<% } %><% if(examples.indexOf('forms') !== -1) { %>
export Survey from './Survey/Survey';
export Widgets from './Widgets/Widgets';<% } %>

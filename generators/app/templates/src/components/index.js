/**
 *  Point of contact for component modules
 *
 *  ie: import { CounterButton, InfoBar } from 'components';
 *
 */

export CounterButton from './CounterButton/CounterButton';<% if(auth && oauth.indexOf('Facebook') !== -1) { %>
export FacebookLogin from './FacebookLogin/FacebookLogin';<% } %>
export GithubButton from './GithubButton/GithubButton';
export InfoBar from './InfoBar/InfoBar';<% if(auth) { %>
export LoginForm from './LoginForm/LoginForm';<% } %><% if(examples.indexOf('about') !== -1) { %>
export MiniInfoBar from './MiniInfoBar/MiniInfoBar';<% } %>
export Notifs from './Notifs/Notifs';<% if(auth) { %>
export RegisterForm from './RegisterForm/RegisterForm';<% } %><% if(examples.indexOf('forms') !== -1) { %>
export SurveyForm from './SurveyForm/SurveyForm';
export WidgetForm from './WidgetForm/WidgetForm';<% } %>

'use strict';

var yeoman = require('yeoman-generator');
var path = require('path');
var objectAssign = require('object-assign');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  initializing: function () {
    var done = this.async();
    this.props = {
      name: process.cwd().split(path.sep).pop()
    };
    done();
  },

  prompting: function () {
    this.log(yosay(
      'Welcome to the\n' + chalk.red('react-redux-universal ') + 'generator!'
    ));

    return this.prompt([{
      name: 'name',
      message: 'Project name',
      default: this.props.name
    }, {
      name: 'description',
      message: 'Description',
    }, {
      type: 'confirm',
      name: 'auth',
      message: 'Would you like an authentication? (uses passport)',
      default: true
    }])
      .then(function (props) {
        if (!props.auth) return objectAssign(this.props, props);

        return this.prompt([{
          type: 'checkbox',
          name: 'oauth',
          message: 'Would you like oauth strategies?',
          choices: ['Facebook'],
          default: ['Facebook']
        }])
          .then(function (oauthProps) {
            return objectAssign(this.props, props, oauthProps);
          }.bind(this));
      }.bind(this))
      .then(function (/* props */) {
        return this.prompt([{
          type: 'list',
          name: 'database',
          message: 'Would you like a database? (optional)',
          choices: ['mySQL', 'mongoose', 'none (nedb if auth needed)']
        }, {
          type: 'confirm',
          name: 'realtime',
          message: 'Would you like a realtime? (useful for events, uses socket.io)',
          default: true
        }, {
          type: 'confirm',
          name: 'offline',
          message: 'Would you like your application to be accessed offline?',
          default: true
        }])
          .then(function (otherProps) {
            return objectAssign(this.props, otherProps);
          }.bind(this));
      }.bind(this))
      .then(function (props) {
        return this.prompt([{
          type: 'checkbox',
          name: 'examples',
          message: 'Would you like examples?',
          choices: ['Redux-form (widgets, survey)']
            .concat(props.realtime ? 'Simple chat socket' : [])
            .concat(props.realtime && props.auth > 0 && props.offline ? 'Secure and persistent chat, even in socket' : [])
            .concat(props.realtime && props.auth > 0 && !props.offline ? 'Secure chat, even in socket' : [])
            .concat('Sample page (about us)'),
          default: []
        }])
          .then(function (examplesProps) {
            var examplesMap = {
              'Redux-form (widgets, survey)': 'forms',
              'Simple chat socket': 'chat',
              'Secure and persistent chat, even in socket': 'chatFeathers',
              'Secure chat, even in socket': 'chatFeathers',
              'Sample page (about us)': 'about'
            };

            var examplesMapped = Object.keys(examplesMap).filter(function (ex) {
              return examplesProps.examples.indexOf(ex) !== -1;
            }).map(function (ex) {
              return examplesMap[ex];
            });

            return objectAssign(this.props, { examples: examplesMapped });
          }.bind(this))
      }.bind(this))
      .then(function (props) {
        this.props = props;
        console.log(props);
      }.bind(this));
  },

  writing: {
    base: function () {
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );

      [
        'static/favicon.ico',
        'static/favicon.png',
        'static/logo.jpg'
      ]
        .forEach(function (file) {
          this.fs.copy(
            this.templatePath(file),
            this.destinationPath(file)
          );
        }.bind(this));

      [
        '.babelrc',
        '.editorconfig',
        '.eslintignore',
        '.eslintrc',
        '.travis.yml',
        'app.json',
        'CONTRIBUTING.md',
        'karma.conf.js',
        'LICENSE',
        'package.json',
        'README.md',
        'server.babel.js',
        'tests.webpack.js',
        'static/manifest.json'
      ]
        .forEach(function (file) {
          this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props
          );
        }.bind(this));

      this.fs.copyTpl(
        this.templatePath('webpack/**/*'),
        this.destinationPath('webpack'),
        this.props
      );

      this.fs.copyTpl(
        this.templatePath('bin/*'),
        this.destinationPath('bin'),
        this.props
      );
    },

    api: function () {
      [
        'api/__tests__/api-test.js',
        'api/actions/__tests__/loadInfo-test.js',
        'api/actions/index.js',
        'api/actions/loadInfo.js',
        'api/hooks/index.js',
        'api/hooks/validateHook.js',
        'api/middleware/index.js',
        'api/middleware/logger.js',
        'api/middleware/notFound.js',
        'api/services/index.js',
        'api/utils/url.js',
        'api/utils/validation.js',
        'api/api.js',
        'api/config.js'
      ].concat(this.props.auth ? [
        'api/actions/auth/index.js',
        'api/actions/auth/load.js',
        'api/hooks/restrictToOwner.js',
        'api/services/authentication/index.js',
        'api/services/users/hooks.js',
        'api/services/users/index.js'
      ] : []).concat(this.props.auth && this.props.realtime ? [
        'api/services/authentication/socketAuth.js'
      ] : []).concat(this.props.examples.indexOf('forms') !== -1 ? [
        'api/actions/__tests__/widget-load-test.js',
        'api/actions/__tests__/widget-update-test.js',
        'api/actions/survey/index.js',
        'api/actions/survey/isValid.js',
        'api/actions/widget/index.js',
        'api/actions/widget/load.js',
        'api/actions/widget/update.js'
      ] : []).concat(this.props.examples.indexOf('chatFeathers') !== -1 ? [
        'api/services/messages/hooks.js',
        'api/services/messages/index.js'
      ] : [])
        .forEach(function (file) {
          this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props
          );
        }.bind(this));
    },

    src: function () {
      [
        'src/containers/Home/logo.png'
      ].concat(this.props.examples.indexOf('about') !== -1 ? [
        'src/containers/About/kitten.jpg'
      ] : [])
        .forEach(function (file) {
          this.fs.copy(
            this.templatePath(file),
            this.destinationPath(file)
          );
        }.bind(this));

      [
        'src/components/__tests__/InfoBar-test.js',
        'src/components/CounterButton/CounterButton.js',
        'src/components/GithubButton/GithubButton.js',
        'src/components/InfoBar/InfoBar.js',
        'src/components/InfoBar/InfoBar.scss',
        'src/components/Notifs/Notifs.js',
        'src/components/index.js',
        'src/containers/App/App.js',
        'src/containers/App/App.scss',
        'src/containers/DevTools/DevTools.js',
        'src/containers/Home/Home.js',
        'src/containers/Home/Home.scss',
        'src/containers/NotFound/NotFound.js',
        'src/containers/index.js',
        'src/helpers/ApiClient.js',
        'src/helpers/Html.js',
        'src/redux/middleware/clientMiddleware.js',
        'src/redux/modules/counter.js',
        'src/redux/modules/info.js',
        'src/redux/modules/notifs.js',
        'src/redux/create.js',
        'src/redux/reducer.js',
        'src/theme/bootstrap.config.js',
        'src/theme/bootstrap.config.prod.js',
        'src/theme/bootstrap.overrides.scss',
        'src/theme/font-awesome.config.js',
        'src/theme/font-awesome.config.less',
        'src/theme/font-awesome.config.prod.js',
        'src/theme/variables.scss',
        'src/utils/validation.js',
        'src/app.js',
        'src/client.js',
        'src/config.js',
        'src/routes.js',
        'src/server.js'
      ].concat(this.props.auth ? [
        'src/components/LoginForm/LoginForm.js',
        'src/components/LoginForm/loginValidation.js',
        'src/components/RegisterForm/RegisterForm.js',
        'src/components/RegisterForm/registerValidation.js',
        'src/containers/Login/Login.js',
        'src/containers/LoginSuccess/LoginSuccess.js',
        'src/containers/Register/Register.js',
        'src/redux/modules/auth.js'
      ] : []).concat(this.props.offline ? [
        'src/utils/checkNet.js',
        'src/progressive.js'
      ] : [])
        .concat(this.props.auth && this.props.oauth.indexOf('Facebook') !== -1 ? [
          'src/components/FacebookLogin/FacebookLogin.js'
        ] : [])
        .concat(this.props.examples.indexOf('forms') !== -1 ? [
          'src/components/SurveyForm/SurveyForm.js',
          'src/components/SurveyForm/SurveyForm.scss',
          'src/components/SurveyForm/surveyValidation.js',
          'src/components/WidgetForm/WidgetForm.js',
          'src/components/WidgetForm/widgetValidation.js',
          'src/containers/Survey/Survey.js',
          'src/containers/Widgets/Widgets.js',
          'src/containers/Widgets/Widgets.scss',
          'src/redux/modules/survey.js',
          'src/redux/modules/widgets.js'
        ] : [])
        .concat(this.props.examples.indexOf('about') !== -1 ? [
          'src/components/MiniInfoBar/MiniInfoBar.js',
          'src/containers/About/About.js'
        ] : [])
        .concat(this.props.examples.indexOf('chat') !== -1 ? [
          'src/containers/Chat/Chat.js',
          'src/containers/Chat/Chat.scss'
        ] : [])
        .concat(this.props.examples.indexOf('chatFeathers') !== -1 ? [
          'src/containers/ChatFeathers/ChatFeathers.js',
          'src/redux/modules/chat.js'
        ] : [])
        .forEach(function (file) {
          this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props
          );
        }.bind(this));
    }
  },

  install: function () {
    var dependencies = [
      'babel-core@^6.14.0',
      'babel-plugin-add-module-exports@^0.2.1',
      'babel-plugin-transform-decorators-legacy@^1.3.4',
      'babel-plugin-transform-react-display-name@^6.8.0',
      'babel-plugin-transform-runtime@^6.15.0',
      'babel-polyfill@^6.13.0',
      'babel-preset-es2015@^6.14.0',
      'babel-preset-react@^6.11.1',
      'babel-preset-stage-0@^6.5.0',
      'babel-register@^6.14.0',
      'babel-runtime@^6.11.6',
      'body-parser@^1.15.2',
      'compression@^1.6.2',
      'cookie-parser@^1.4.3',
      'express@4.14.0',
      'express-session@^1.14.1',
      'feathers@^2.0.1',
      'feathers-errors@^2.4.0',
      'feathers-hooks@^1.5.7',
      'feathers-rest@^1.5.0',
      'http-proxy@^1.14.0',
      'is-promise@^2.1.0',
      'morgan@^1.7.0',
      'multireducer@^3.0.0',
      'pretty-error@^2.0.0',
      'pretty-error@^2.0.0',
      'react@^15.3.1',
      'react-bootstrap@^0.30.3',
      'react-dom@^15.3.1',
      'react-helmet@^3.1.0',
      'react-redux@^4.4.5',
      'react-router@^2.8.0',
      'react-router-bootstrap@^0.23.1',
      'react-router-redux@^4.0.5',
      'redux@^3.6.0',
      'redux-connect@^3.0.0',
      'scroll-behavior@^0.8.1',
      'serialize-javascript@^1.3.0',
      'serve-favicon@^2.3.0',
      'superagent@^2.2.0'
    ].concat(this.props.auth ? [
      'async@^2.1.2',
      'git+https://github.com/bertho-zero/feathers-authentication.git',
      'feathers-nedb@^2.5.0', // TODO other database
      'js-cookie@^2.1.3',
      'localstorage-memory@^1.0.2',
      'lodash.isplainobject@^4.0.6',
      'nedb@^1.8.0' // TODO other database
    ] : []).concat(this.props.realtime ? [
      'feathers-socketio@^1.4.1',
      'socket.io@^1.4.8',
      'socket.io-client@^1.4.8'
    ] : []).concat(this.props.offline ? [
      'localforage@^1.4.2',
      'redux-persist@^4.0.0-alpha5'
    ] : []).concat(this.props.auth && this.props.realtime ? [
      'async@^2.0.1'
    ] : []).concat(this.props.auth && this.props.oauth.indexOf('Facebook') !== -1 ? [
      'passport-facebook@^2.1.1',
      'passport-facebook-token@^3.3.0'
    ] : []).concat(this.props.auth || this.props.examples.indexOf('forms') !== -1 ? [
      'lru-memoize@^1.0.1',
      'redux-form@^6.0.2'
    ] : []);

    var devDependencies = [
      'autoprefixer-loader@^3.2.0',
      'babel-eslint@^7.0.0',
      'babel-loader@^6.2.5',
      'babel-plugin-typecheck@^3.9.0',
      'better-npm-run@^0.0.11',
      'bootstrap-sass@^3.3.7',
      'bootstrap-sass-loader@^1.0.10',
      'chai@^3.5.0',
      'clean-webpack-plugin@^0.1.10',
      'concurrently@^3.1.0',
      'css-loader@^0.25.0',
      'eslint@^3.5.0',
      'eslint-config-airbnb@^12.0.0',
      'eslint-loader@^1.5.0',
      'eslint-plugin-import@^2.0.1',
      'eslint-plugin-jsx-a11y@^2.2.2',
      'eslint-plugin-react@^6.2.0',
      'extract-text-webpack-plugin@^1.0.1',
      'file-loader@^0.9.0',
      'font-awesome@^4.6.3',
      'font-awesome-webpack@^0.0.4',
      'happypack@^2.2.1',
      'html-webpack-plugin@^2.22.0',
      'json-loader@^0.5.4',
      'karma@^1.3.0',
      'karma-cli@^1.0.1',
      'karma-mocha@^1.1.1',
      'karma-mocha-reporter@^2.1.0',
      'karma-phantomjs-launcher@^1.0.2',
      'karma-sourcemap-loader@^0.3.7',
      'karma-webpack@^1.8.0',
      'less@^2.7.1',
      'less-loader@^2.2.3',
      'mocha@^3.0.2',
      'node-sass@^3.9.3',
      'phantomjs-polyfill@^0.0.2',
      'phantomjs-prebuilt@^2.1.12',
      'piping@^1.0.0-rc.3',
      'react-a11y@^0.3.3',
      'react-addons-test-utils@^15.3.1',
      'react-hot-loader@^3.0.0-beta.3',
      'react-to-html-webpack-plugin@^2.2.0',
      'redux-devtools@^3.3.1',
      'redux-devtools-dock-monitor@^1.1.1',
      'redux-devtools-log-monitor@^1.0.11',
      'sass-loader@^4.0.2',
      'strip-loader@^0.1.2',
      'style-loader@^0.13.1',
      'sw-precache-webpack-plugin@^0.5.1',
      'timekeeper@^0.1.1',
      'url-loader@^0.5.7',
      'webpack@^1.13.2',
      'webpack-dev-middleware@^1.7.0',
      'webpack-hot-middleware@^2.12.2',
      'webpack-isomorphic-tools@^2.5.8'
    ].concat(this.props.examples.indexOf('forms') !== -1 ? [
      'sinon@^1.17.5'
    ] : []);

    dependencies.concat(devDependencies).forEach(function (dependency) {
      var separatorIndex = dependency.indexOf('@');
      var dependencyName = separatorIndex !== -1 ? dependency.substring(0, separatorIndex) : dependency;

      // Throw an error if the project name is the same as one of the dependencies
      if (dependencyName === this.props.name) {
        this.log.error('Your project can not be named ' + this.props.name + ' because the ' +
          dependency + ' package will be installed as dependency.');
        process.exit(1);
      }
    }.bind(this));

    this.npmInstall(dependencies, { save: true });
    this.npmInstall(devDependencies, { saveDev: true });
  }
});

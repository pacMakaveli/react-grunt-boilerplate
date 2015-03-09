/**
 * @jsx React.DOM
 */

var React   = require('react');
var Profile = require('./components/profile.jsx');

React.renderComponent(
  <Profile username="Mr. Kittten" bio="this is a test for jsx" avatar="https://placekitten.com/g/200/300" />,
  document.getElementById("react-app")
);

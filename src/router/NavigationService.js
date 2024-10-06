let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.navigate(routeName, params);
}
function goBack() {
  _navigator.goBack();
}

export default {
  navigate,
  goBack,
  setTopLevelNavigator,
};

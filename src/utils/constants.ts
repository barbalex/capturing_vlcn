// TODO: most of these constants are not used yet
const constants = {
  appBarHeight: 64,
  titleRowHeight: 52,
  singleRowHeight: 48,
  getAppUri: () =>
    window?.location?.hostname === 'localhost'
      ? `http://${window.location.hostname}:5172`
      : 'https://erfassen.app',
  tree: {
    minimalWidth: 331,
    minimalWindowWidth: 1000,
  },
  sidebar: {
    width: 420,
    minimalWindowWidth: 1000,
  },
  resizerWidth: 5,
}

export default constants

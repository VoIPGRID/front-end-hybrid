/**
 * this script makes the properties which should be exported by the ecmascript versions of react and react-dom configurable
 */
module.exports = {
  reactExports: [
    'Component',
    'PureComponent',
    'unstable_AsyncComponent',
    'Fragment',
    'createElement',
    'cloneElement',
    'createFactory',
    'isValidElement',
    'version'
  ],
  reactDomExports: [
    'createPortal',
    'findDOMNode',
    'hydrate',
    'render',
    'unstable_renderSubtreeIntoContainer',
    'unmountComponentAtNode',
    'unstable_createPortal',
    'unstable_batchedUpdates',
    'unstable_deferredUpdates',
    'flushSync'
  ]
};

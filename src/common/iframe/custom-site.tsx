// eslint-disable-next-line react/prop-types
export const CustomIframe = ({ src, title }, ref) => {
  const onLoadHandler = (event) => {
    try {
      const params = event.target.contentWindow.location.search;
      if (params) {
        window.postMessage(params, 'http://localhost:3000');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return <iframe src={src} title={title} onLoad={onLoadHandler} />;
};

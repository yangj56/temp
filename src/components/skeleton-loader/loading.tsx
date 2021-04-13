import ContentLoader from 'react-content-loader';

export const Loading = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <circle cx="273" cy="77" r="70" />
  </ContentLoader>
);

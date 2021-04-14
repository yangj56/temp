import ClipLoader from 'react-spinners/ClipLoader';

type Props = {
  loading: boolean;
};

export const LoadingClip = ({ loading }: Props) => {
  return (
    <div className="fixed top-1/2 left-1/2">
      <ClipLoader color="green" loading={loading} size={50} />
    </div>
  );
};

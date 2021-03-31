/* eslint-disable react/button-has-type */
export const MainPage = () => {
  return (
    <div>
      <h1>MyInfo Main Page</h1>
      {/* <button onClick={confirmAuth}>Okay</button> */}
      <button
        onClick={() => {
          window.location.href =
            'http://localhost:3000/return?privateKey=abcde&code=12345';
        }}
      >
        Return
      </button>
    </div>
  );
};

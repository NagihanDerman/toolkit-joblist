const Error = ({ msg, retry }) => {
  return (
    <div className="error">
      <p>Sorry, there was a problem accessing the data</p>
      <p className="text">{msg}</p>

      <button onClick={retry} className="btn">
        <span> Please try again </span>
      </button>
    </div>
  );
};

export default Error;

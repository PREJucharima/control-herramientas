import PropTypes from "prop-types";

export const RootLayout = ({ children }) => {
  return (
    <div>
        {children}
    </div>
  )
}

RootLayout.propTypes = {
  children: PropTypes.node,
};

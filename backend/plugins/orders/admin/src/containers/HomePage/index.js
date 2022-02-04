import React, { memo } from "react";
import styled from "styled-components";
import Orders from "../../components/Orders";

const HomePage = ({ className }) => {
  return (
    <div className={className}>
      NA
      {/* <Orders /> */}
    </div>
  );
};

const HomePageWrapper = styled(HomePage)`
  padding: 1rem;
  background: white;
`;

export default memo(HomePageWrapper);

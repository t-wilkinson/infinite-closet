import React, { memo } from "react";
import styled from "styled-components";
import Orders from "../../components/Orders";
import usePlugin from "../../utils/usePlugin";

const HomePage = ({ className }) => {
  const plugin = usePlugin();

  return (
    <div className={className}>
      <Orders plugin={plugin} />
    </div>
  );
};

const HomePageWrapper = styled(HomePage)`
  padding: 1rem;
  background: white;
`;

export default memo(HomePageWrapper);

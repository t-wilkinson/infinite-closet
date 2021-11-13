import styled from "styled-components";

import { sizes } from "strapi-helper-plugin";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 30rem 1fr;
  min-height: calc(100vh - ${sizes.header.height});
  .centered {
    position: fixed;
    top: calc(50% - 13px);
    right: calc(50% - 13px);
  }
`;

export default Wrapper;

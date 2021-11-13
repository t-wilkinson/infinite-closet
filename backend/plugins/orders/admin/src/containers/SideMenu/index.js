import React from "react";
import Wrapper from "./Wrapper";
import { LeftMenuList } from "strapi-helper-plugin";
import pluginId from "../../pluginId";

const SideMenu = () => {
  const data = [
    {
      title: "Orders",
      name: "orders",
      links: [
        { name: "orders", title: "orders", to: `/plugins/${pluginId}/orders` },
      ],
    },
    {
      title: "Emails",
      name: "emails",
      links: [
        {
          name: "rental-ending",
          title: "Rental Ending",
          to: `/plugins/${pluginId}/emails/rental-ending`,
        },
      ],
    },
  ];

  return (
    <Wrapper>
      {data.map((list) => (
        <LeftMenuList key={list.title} {...list} />
      ))}
    </Wrapper>
  );
};

export default SideMenu;

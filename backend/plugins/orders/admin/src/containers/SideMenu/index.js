import React from "react";
import Wrapper from "./Wrapper";
import { LeftMenuList } from "strapi-helper-plugin";
import pluginId from "../../pluginId";

const SideMenu = () => {
  const emailLink = ({ slug, title }) => ({
    name: slug,
    title,
    to: `/plugins/${pluginId}/emails/${slug}`,
  });

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
        { title: "Rental ending", slug: "rental-ending" },
        { title: "Send to cleaners", slug: "send-cleaners" },
      ].map(emailLink),
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

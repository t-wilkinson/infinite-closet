import React from "react";
import Wrapper from "./Wrapper";
import { LeftMenuList } from "strapi-helper-plugin";
import pluginId from "../../pluginId";
import { emails } from '../../config';

const SideMenu = () => {
  const emailLink = ({ slug, title }) => ({
    name: slug,
    title: `${title} (${slug})`,
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
      links: emails.map(emailLink),
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

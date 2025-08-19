import React, { ReactNode } from "react";

type Props = { children: ReactNode };

const WrapperPostsList = ({ children }: Props) => {
  return <section style={{ padding: "1rem" }}>{children}</section>;
};

export default WrapperPostsList;

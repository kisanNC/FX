import React from "react";
//want import this Helmet
import { Helmet } from "react-helmet-async";
function HelmetData({ title }) {
  return (
    <Helmet>
      <title>{` ${title}-FX`}</title>
    </Helmet>
  );
}

export default HelmetData;

import PostDetails from "@/components/PostDetails";
import React from "react";

const Details = ({ params }) => {
//   console.log(params.id);
  return (
    <div className="p-12">
      <PostDetails id={params.id}/>
    </div>
  );
};

export default Details;

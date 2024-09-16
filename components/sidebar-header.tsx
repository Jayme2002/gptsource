import React from "react";

const SidebarHeader = ({ title }: { title: string }) => {
    return <h3 className="text-indigo-300/80 font-light my-1 pl-2">{title}</h3>;
};

export default SidebarHeader;

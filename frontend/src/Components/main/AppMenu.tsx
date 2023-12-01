// import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const genarateMenu = (name: string) => {
  return (
    <NavLink
      className={({ isActive }) => {
        return `menu_button ${isActive && ` bg-green-500 `}`;
      }}
      to={`/${name == "Home" ? "" : `${name}/e`}`}
    >
      {name}
    </NavLink>
  );
};

const apps = ["Exomiser", "Phenotips", "Phenolyzer"];

export const AppMenu = () => {
  return (
    <div className="fixed flex flex-col h-screen w-screen top-[50px]">
      <div className=" flex h-[50px] flex-row justify-around ">
        {genarateMenu("Home")}
        {apps.map((app) => genarateMenu(app))}
      </div>
      <Outlet />
    </div>
  );
};

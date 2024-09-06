// src/routes.tsx

import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

const BASIC: Record<string, { [key: string]: any }> = import.meta.glob(
  "/src/pages/(_app|404).tsx",
  { eager: true }
);
const COMPONENTS: Record<string, { [key: string]: any }> = import.meta.glob(
  "/src/pages/**/[a-z[]*.tsx",
  { eager: true }
);

const basics = Object.keys(BASIC).reduce((basic, file) => {
  const key = file.replace(/\/src\/pages\/|\.tsx$/g, "");
  return { ...basic, [key]: BASIC[file].default };
}, {});

const components = Object.keys(COMPONENTS).map((component) => {
  const path = component
    .replace(/\/src\/pages|index|\.tsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1");

  return { path, component: COMPONENTS[component].default };
});

const DRoutes = () => {
  const NotFound = (basics as Record<string, any>)["404"];
  return (
    <Routes>
      {components.map(({ path, component: Component = Fragment }) => (
        <Route key={path} path={path} Component={Component} />
      ))}
      <Route path="*" Component={NotFound} />
    </Routes>
  );
};

export default DRoutes;

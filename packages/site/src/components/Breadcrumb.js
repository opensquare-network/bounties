import { Breadcrumb as OsnBreadcrumb } from "@osn/common-ui";
import { Link } from "react-router-dom";

export default function Breadcrumb({ value = "" }) {
  return (
    <OsnBreadcrumb backButtonRender={(button) => <Link to="/">{button}</Link>}>
      <OsnBreadcrumb.Item>
        <Link to="/">Explorer</Link>
      </OsnBreadcrumb.Item>
      <OsnBreadcrumb.Item>{value}</OsnBreadcrumb.Item>
    </OsnBreadcrumb>
  );
}

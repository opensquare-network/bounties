import { Breadcrumb as OsnBreadcrumb, OnlyDesktop } from "@osn/common-ui";
import { Link } from "react-router-dom";

export default function Breadcrumb({ path = [], value = "" }) {
  return (
    <OsnBreadcrumb backButtonRender={(button) => <Link to="/">{button}</Link>}>
      <OnlyDesktop>
        <OsnBreadcrumb.Item>
          <Link to="/">Explorer</Link>
        </OsnBreadcrumb.Item>
        {path.map(({ title, href }) => (
          <OsnBreadcrumb.Item key={href}>
            <Link to={href}>{title}</Link>
          </OsnBreadcrumb.Item>
        ))}
      </OnlyDesktop>

      <OsnBreadcrumb.Item>{value}</OsnBreadcrumb.Item>
    </OsnBreadcrumb>
  );
}

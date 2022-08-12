import MoreMenu from "components/MoreMenu";
import { ReactComponent as EditSVG } from "./edit.svg";

export default function More({ onEdit }) {
  return (
    <MoreMenu
      menus={[
        {
          text: "Edit",
          icon: <EditSVG />,
          onClick: onEdit,
        },
      ]}
    />
  );
}

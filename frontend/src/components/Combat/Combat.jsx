import style from "./Combat.module.css";
import { CAMERA_HEIGHT, CAMERA_WIDTH, UNIT_SIZE } from "../../utils/constants";

const Combat = () => {
  return (
    <div
      className={style.container}
      style={{
        "--viewport-width": `${CAMERA_WIDTH * UNIT_SIZE}px`,
        "--viewport-height": `${CAMERA_HEIGHT * UNIT_SIZE}px`,
      }}
    ></div>
  );
};

export default Combat;

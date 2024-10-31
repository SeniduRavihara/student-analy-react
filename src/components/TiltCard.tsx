import { Tilt } from "react-tilt";

const defaultOptions = {
  reverse: false, // reverse the tilt direction
  max: 35, // max tilt rotation (degrees)
  perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
  scale: 1.01, // 2 = 200%, 1.5 = 150%, etc..
  speed: 10000, // Speed of the enter/exit transition
  transition: true, // Set a transition on enter/exit.
  axis: null, // What axis should be disabled. Can be X or Y.
  reset: true, // If the tilt effect has to be reset on exit.
  easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
};

const TiltCard = () => {
  return (
    <Tilt
      options={defaultOptions}
      style={{
        height: 250,
        width: 250,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        background: "#E2F1E7",
        borderRadius: "10px",
      }}
    >
      <div></div>
    </Tilt>
  );
};
export default TiltCard;
